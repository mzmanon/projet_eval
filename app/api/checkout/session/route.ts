import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import {
  getStripeConfig,
  getSupabaseAdminConfig,
} from "@/lib/supabase/config";
import {
  getOrderById,
  getOrderBySessionId,
  markCheckoutSessionPaid,
  markCheckoutSessionProcessing,
} from "@/lib/orders/server";
import { mapOrderRow } from "@/lib/orders/map";
import type { CheckoutSessionResponse } from "@/types/order";
import type { PaymentStatus } from "@/types/champagne";

export async function GET(request: NextRequest) {
  if (!getStripeConfig().configured) {
    return NextResponse.json(
      { error: "Le paiement Stripe n'est pas configuré." },
      { status: 503 }
    );
  }

  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim() ?? "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { error: "Session de paiement invalide." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (getSupabaseAdminConfig().adminConfigured) {
      try {
        if (session.payment_status === "paid") {
          await markCheckoutSessionPaid(session);
        } else if (session.status === "complete") {
          await markCheckoutSessionProcessing(session);
        }
      } catch (err) {
        console.warn("[checkout/session] maj paiement Supabase ignorée", err);
      }
    }

    const orderId =
      session.metadata?.order_id ?? session.client_reference_id ?? null;

    let row = null;
    if (getSupabaseAdminConfig().adminConfigured) {
      try {
        row = await getOrderBySessionId(session.id);
        if (!row && orderId) {
          row = await getOrderById(orderId);
        }
      } catch (err) {
        console.warn("[checkout/session] recherche commande Supabase", err);
      }
    }

    if (!row) {
      const sessionExpanded = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "customer_details"],
      });
      const customerDetails = sessionExpanded.customer_details;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shippingAddress = (sessionExpanded as any).shipping_details?.address ?? customerDetails?.address;

      const normalizedPaymentStatus: PaymentStatus =
        session.payment_status === "paid"
          ? "paid"
          : session.payment_status === "unpaid"
          ? "unpaid"
          : "processing";

      const payload: CheckoutSessionResponse = {
        order: {
          id: orderId ?? session.id,
          orderNumber: orderId ?? session.id.slice(-8).toUpperCase(),
          status: session.payment_status === "paid" ? "confirmed" : "pending",
          paymentStatus: normalizedPaymentStatus,
          customerName: customerDetails?.name ?? "Client",
          customerEmail: customerDetails?.email ?? session.customer_email ?? "",
          shippingAddress: {
            street: shippingAddress?.line1 ?? "",
            city: shippingAddress?.city ?? "",
            postalCode: shippingAddress?.postal_code ?? "",
            country: shippingAddress?.country ?? "France",
          },
          items: (sessionExpanded.line_items?.data ?? []).map((item) => ({
            name: item.description ?? "Cuvée de Champagne",
            house: "Maison de Champagne",
            vintage: "",
            quantity: item.quantity ?? 1,
            unitPrice: (item.price?.unit_amount ?? 0) / 100,
            imageUrl: "",
          })),
          subtotalAmount: (session.amount_subtotal ?? session.amount_total ?? 0) / 100,
          shippingAmount: (session.total_details?.amount_shipping ?? 0) / 100,
          totalAmount: (session.amount_total ?? 0) / 100,
          currency: session.currency ?? "eur",
          createdAt: new Date().toISOString(),
        },
      };

      return NextResponse.json(payload);
    }

    const order = mapOrderRow(row);
    const payload: CheckoutSessionResponse = {
      order: {
        id: order.id,
        orderNumber: order.orderNumber ?? null,
        status: order.status,
        paymentStatus: order.paymentStatus ?? "unpaid",
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          name: item.name,
          house: item.house,
          vintage: item.vintage,
          quantity: item.quantity,
          unitPrice: item.price,
          imageUrl: item.imageUrl,
        })),
        subtotalAmount: order.subtotalAmount ?? order.totalAmount,
        shippingAmount: order.shippingAmount ?? 0,
        totalAmount: order.totalAmount,
        currency: order.currency ?? "eur",
        createdAt: order.createdAt,
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[checkout/session] lecture de la session impossible", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le détail du paiement." },
      { status: 500 }
    );
  }
}
