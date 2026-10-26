import type { Order } from "@/types/champagne";
import type { OrderItemRow, OrderWithItemsRow } from "@/types/order";

function toNumber(value: number | string | null | undefined): number {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value;
  return Number.isFinite(parsed) ? (parsed as number) : 0;
}

export function mapOrderItemRow(item: OrderItemRow) {
  return {
    champagneId: item.champagne_slug ?? item.champagne_id ?? item.id,
    name: item.name ?? "Cuvée",
    house: item.house ?? "",
    vintage: item.vintage ?? "",
    price: toNumber(item.unit_price),
    quantity: item.quantity,
    imageUrl: item.image_url ?? "",
  };
}

export function mapOrderRow(row: OrderWithItemsRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number ?? undefined,
    userId: row.user_id ?? undefined,
    customerName: row.customer_name ?? "",
    customerEmail: row.customer_email ?? "",
    customerPhone: row.customer_phone ?? undefined,
    shippingAddress: {
      street: row.shipping_address?.street ?? "",
      city: row.shipping_address?.city ?? "",
      postalCode: row.shipping_address?.postalCode ?? "",
      country: row.shipping_address?.country ?? "France",
      specialInstructions: row.special_instructions ?? undefined,
    },
    items: (row.order_items ?? []).map(mapOrderItemRow),
    subtotalAmount: toNumber(row.subtotal_amount),
    shippingAmount: toNumber(row.shipping_amount),
    totalAmount: toNumber(row.total_amount),
    currency: row.currency,
    status: row.status,
    paymentStatus: row.payment_status,
    stripeSessionId: row.stripe_session_id ?? undefined,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  };
}
