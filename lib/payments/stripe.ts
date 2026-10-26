import Stripe from "stripe";
import { getStripeConfig } from "@/lib/supabase/config";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const { secretKey, configured } = getStripeConfig();

  if (!configured) {
    throw new Error(
      "Stripe n'est pas configuré. Renseignez STRIPE_SECRET_KEY dans votre fichier .env.local."
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}
