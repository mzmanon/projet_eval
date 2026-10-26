import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { getStripeConfig } from "@/lib/supabase/config";
import {
  markCheckoutSessionExpired,
  markCheckoutSessionFailed,
  markCheckoutSessionPaid,
  markCheckoutSessionProcessing,
} from "@/lib/orders/server";

export async function POST(request: Request) {
  const { webhookSecret, configured } = getStripeConfig();

  if (!configured || !webhookSecret) {
    return new Response(
      "Configuration Stripe incomplète (STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET).",
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("En-tête Stripe-Signature manquant.", { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("[stripe/webhook] signature invalide", error);
    return new Response("Signature Stripe invalide.", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await markCheckoutSessionPaid(session);
        } else {
          await markCheckoutSessionProcessing(session);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markCheckoutSessionPaid(session);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markCheckoutSessionFailed(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markCheckoutSessionExpired(session);
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error(`[stripe/webhook] traitement de ${event.type} impossible`, error);
    return new Response("Erreur de traitement du webhook.", { status: 500 });
  }

  return Response.json({ received: true });
}
