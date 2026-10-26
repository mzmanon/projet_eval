export const FREE_SHIPPING_THRESHOLD = 250;
export const STANDARD_SHIPPING_COST = 25;
export const CURRENCY = "eur";

/**
 * Frais de transport isotherme. Offerts à partir du seuil de commande.
 */
export function getShippingCost(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}

export function getOrderTotal(subtotal: number): number {
  return subtotal + getShippingCost(subtotal);
}

export function getMissingAmountForFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function getFreeShippingProgress(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
}

/** Stripe attend des montants en centimes. */
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
