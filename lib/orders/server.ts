import type Stripe from "stripe";
import type { CheckoutCustomerInput } from "@/types/order";
import type { OrderWithItemsRow } from "@/types/order";
import type { Champagne } from "@/types/champagne";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapOrderRow } from "@/lib/orders/map";

export interface PendingOrderItem {
  champagne: Champagne;
  quantity: number;
}

export interface CreatePendingOrderInput {
  userId: string | null;
  customer: CheckoutCustomerInput;
  items: PendingOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `LC-${year}-${suffix}`;
}

export async function createPendingOrder({
  userId,
  customer,
  items,
  subtotal,
  shipping,
  total,
}: CreatePendingOrderInput): Promise<string> {
  const admin = createAdminClient();
  // `orders.id` est un uuid dans le schéma Supabase : on génère l'identifiant
  // technique ici et une référence lisible séparément (`order_number`).
  const orderId = crypto.randomUUID();

  const { error: orderError } = await admin.from("orders").insert({
    id: orderId,
    order_number: generateOrderNumber(),
    user_id: userId,
    customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
    customer_email: customer.email,
    customer_phone: customer.phone || null,
    shipping_address: {
      street: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      country: customer.country,
    },
    special_instructions: customer.specialInstructions?.trim() || null,
    subtotal_amount: subtotal,
    shipping_amount: shipping,
    total_amount: total,
    currency: "eur",
    status: "pending",
    payment_status: "unpaid",
  });

  if (orderError) {
    throw new Error(`Impossible d'enregistrer la commande : ${orderError.message}`);
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    items.map(({ champagne, quantity }) => ({
      order_id: orderId,
      champagne_id: null,
      champagne_slug: champagne.slug,
      name: champagne.name,
      house: champagne.house,
      vintage: champagne.vintage,
      unit_price: champagne.price,
      quantity,
      image_url: champagne.imageUrl,
    }))
  );

  if (itemsError) {
    await admin.from("orders").delete().eq("id", orderId);
    throw new Error(
      `Impossible d'enregistrer les lignes de commande : ${itemsError.message}`
    );
  }

  return orderId;
}

export async function attachStripeSessionToOrder(
  orderId: string,
  sessionId: string
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ stripe_session_id: sessionId, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    throw new Error(`Impossible de lier la session Stripe : ${error.message}`);
  }
}

export async function cancelUnpaidOrder(orderId: string): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("status", "pending")
    .eq("payment_status", "unpaid");
}

function getOrderIdFromSession(session: Stripe.Checkout.Session): string | null {
  return session.metadata?.order_id ?? session.client_reference_id ?? null;
}

function getPaymentIntentId(session: Stripe.Checkout.Session): string | null {
  if (!session.payment_intent) return null;
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
}

export async function markCheckoutSessionPaid(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderId = getOrderIdFromSession(session);
  if (!orderId) return;

  const admin = createAdminClient();
  const { data: current, error: readError } = await admin
    .from("orders")
    .select("status, paid_at")
    .eq("id", orderId)
    .maybeSingle();

  if (readError) {
    throw new Error(`Impossible de relire la commande : ${readError.message}`);
  }
  if (!current) return;

  const finalStatus = ["shipped", "delivered", "cancelled"].includes(
    current.status
  )
    ? current.status
    : "confirmed";

  const patch: Record<string, unknown> = {
    status: finalStatus,
    payment_status: "paid",
    paid_at: current.paid_at ?? new Date().toISOString(),
    stripe_payment_intent_id: getPaymentIntentId(session),
    updated_at: new Date().toISOString(),
  };

  if (session.amount_total != null && session.amount_total > 0) {
    patch.total_amount = session.amount_total / 100;
  }

  const { error } = await admin.from("orders").update(patch).eq("id", orderId);
  if (error) {
    throw new Error(`Impossible de valider la commande : ${error.message}`);
  }
}

export async function markCheckoutSessionProcessing(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderId = getOrderIdFromSession(session);
  if (!orderId) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      payment_status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("payment_status", "unpaid");

  if (error) {
    throw new Error(`Impossible de mettre à jour la commande : ${error.message}`);
  }
}

export async function markCheckoutSessionFailed(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderId = getOrderIdFromSession(session);
  if (!orderId) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      payment_status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("payment_status", "unpaid");

  if (error) {
    throw new Error(`Impossible de mettre à jour la commande : ${error.message}`);
  }
}

export async function markCheckoutSessionExpired(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderId = getOrderIdFromSession(session);
  if (!orderId) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("status", "pending")
    .eq("payment_status", "unpaid");

  if (error) {
    throw new Error(`Impossible d'annuler la commande : ${error.message}`);
  }
}

export async function getOrderBySessionId(
  sessionId: string
): Promise<OrderWithItemsRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossible de charger la commande : ${error.message}`);
  }

  return (data as OrderWithItemsRow | null) ?? null;
}

export async function getOrderById(
  orderId: string
): Promise<OrderWithItemsRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossible de charger la commande : ${error.message}`);
  }

  return (data as OrderWithItemsRow | null) ?? null;
}

export { mapOrderRow };
