import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getProductsFromDatabase } from "@/lib/data/productsRepository";
import type { CheckoutRequestPayload } from "@/types/order";
import type { Champagne } from "@/types/champagne";
import {
  CURRENCY,
  getOrderTotal,
  getShippingCost,
  toStripeAmount,
} from "@/lib/checkout/pricing";
import { getStripe } from "@/lib/payments/stripe";
import {
  getSiteUrl,
  getStripeConfig,
  getSupabaseAdminConfig,
  getSupabasePublicConfig,
} from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  attachStripeSessionToOrder,
  cancelUnpaidOrder,
  createPendingOrder,
  generateOrderNumber,
} from "@/lib/orders/server";

interface ResolvedItem {
  champagne: Champagne;
  quantity: number;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function cleanText(value: unknown, maxLength = 200): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function resolveItems(
  payload: CheckoutRequestPayload
): Promise<ResolvedItem[] | string> {
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return "Votre panier est vide.";
  }

  const catalogProducts = await getProductsFromDatabase();
  if (catalogProducts.length === 0) {
    return "Le catalogue est momentanément indisponible.";
  }
  const catalog = new Map(catalogProducts.map((champagne) => [champagne.id, champagne]));
  const quantities = new Map<string, number>();

  for (const rawItem of payload.items) {
    if (!rawItem || typeof rawItem !== "object") {
      return "Une ligne du panier est invalide.";
    }

    const champagneId = cleanText(rawItem.champagneId, 120);
    const quantity = Number(rawItem.quantity);

    if (!champagneId || !Number.isInteger(quantity) || quantity < 1) {
      return "Les quantités du panier sont invalides.";
    }

    const champagne = catalog.get(champagneId);
    if (!champagne) {
      return "Une cuvée de votre panier n'est plus disponible.";
    }

    const nextQuantity = (quantities.get(champagneId) ?? 0) + quantity;
    if (nextQuantity > champagne.stock) {
      return `La cuvée ${champagne.name} n'est disponible qu'en ${champagne.stock} exemplaire(s).`;
    }

    quantities.set(champagneId, nextQuantity);
  }

  if (quantities.size > 20) {
    return "Le panier contient trop de références différentes.";
  }

  return Array.from(quantities.entries()).map(([champagneId, quantity]) => ({
    champagne: catalog.get(champagneId) as Champagne,
    quantity,
  }));
}

export async function POST(request: NextRequest) {
  const stripeConfig = getStripeConfig();
  const supabaseConfig = getSupabaseAdminConfig();

  if (!stripeConfig.configured) {
    return jsonError(
      "Le paiement Stripe n'est pas configuré. Ajoutez STRIPE_SECRET_KEY dans .env.local.",
      503
    );
  }



  let payload: CheckoutRequestPayload;
  try {
    payload = (await request.json()) as CheckoutRequestPayload;
  } catch {
    return jsonError("Le contenu de la requête est invalide.");
  }

  const items = await resolveItems(payload);
  if (typeof items === "string") {
    return jsonError(items);
  }

  const customer = payload.customer;
  if (!customer || typeof customer !== "object") {
    return jsonError("Les coordonnées du client sont manquantes.");
  }

  const firstName = cleanText(customer.firstName, 80);
  const lastName = cleanText(customer.lastName, 80);
  const email = cleanText(customer.email, 254).toLowerCase();
  const phone = cleanText(customer.phone, 40);
  const address = cleanText(customer.address, 200);
  const city = cleanText(customer.city, 120);
  const postalCode = cleanText(customer.postalCode, 20);
  const country = cleanText(customer.country, 80) || "France";
  const specialInstructions = cleanText(customer.specialInstructions, 500);

  if (!firstName || !lastName) {
    return jsonError("Le prénom et le nom sont obligatoires.");
  }
  if (!isValidEmail(email)) {
    return jsonError("L'adresse email est invalide.");
  }
  if (!phone || !address || !city || !postalCode) {
    return jsonError("L'adresse de livraison est incomplète.");
  }

  const subtotal = items.reduce(
    (total, item) => total + item.champagne.price * item.quantity,
    0
  );
  const shipping = getShippingCost(subtotal);
  const total = getOrderTotal(subtotal);

  let userId: string | null = null;
  if (getSupabasePublicConfig().configured) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch {
      userId = null;
    }
  }

  let orderId: string;
  if (supabaseConfig.adminConfigured) {
    try {
      orderId = await createPendingOrder({
        userId,
        customer: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          postalCode,
          country,
          specialInstructions,
        },
        items,
        subtotal,
        shipping,
        total,
      });
    } catch (error) {
      console.warn(
        "[checkout] enregistrement Supabase impossible, bascule en mode Stripe autonome",
        error
      );
      orderId = generateOrderNumber();
    }
  } else {
    orderId = generateOrderNumber();
  }

  try {
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      customer_email: email,
      client_reference_id: orderId,
      metadata: {
        order_id: orderId,
        user_id: userId ?? "",
        customer_email: email,
      },
      payment_intent_data: {
        metadata: {
          order_id: orderId,
          user_id: userId ?? "",
        },
      },
      line_items: items.map(({ champagne, quantity }) => ({
        quantity,
        price_data: {
          currency: CURRENCY,
          unit_amount: toStripeAmount(champagne.price),
          product_data: {
            name: `${champagne.house} — ${champagne.name}`,
            description: `${champagne.vintage} · ${champagne.dosage} · ${champagne.format}`,
            images: [champagne.imageUrl],
            metadata: {
              champagne_id: champagne.id,
              champagne_slug: champagne.slug,
            },
          },
        },
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: toStripeAmount(shipping),
              currency: CURRENCY,
            },
            display_name:
              shipping === 0
                ? "Transport isotherme sécurisé — offert"
                : "Transport isotherme sécurisé",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 4 },
            },
          },
        },
      ],
      success_url: `${siteUrl}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?annule=1`,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
    });

    if (!session.url) {
      throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
    }

    if (supabaseConfig.adminConfigured) {
      try {
        await attachStripeSessionToOrder(orderId, session.id);
      } catch (error) {
        console.error("[checkout] liaison session Stripe impossible", error);
      }
    }

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    console.error("[checkout] création de la session Stripe impossible", error);
    if (supabaseConfig.adminConfigured) {
      await cancelUnpaidOrder(orderId).catch(() => undefined);
    }
    return jsonError(
      "Le paiement n'a pas pu être initialisé. Veuillez réessayer dans un instant.",
      502
    );
  }
}
