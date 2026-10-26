import type { OrderStatus, PaymentStatus } from "@/types/champagne";

export interface CheckoutItemInput {
  champagneId: string;
  quantity: number;
}

export interface CheckoutCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  specialInstructions?: string;
}

export interface CheckoutRequestPayload {
  items: CheckoutItemInput[];
  customer: CheckoutCustomerInput;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  champagne_id: string | null;
  champagne_slug: string | null;
  name: string | null;
  house: string | null;
  vintage: string | null;
  unit_price: number | string;
  quantity: number;
  image_url: string | null;
}

export interface OrderRow {
  id: string;
  order_number: string | null;
  user_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  special_instructions: string | null;
  subtotal_amount: number | string;
  shipping_amount: number | string;
  total_amount: number | string;
  currency: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface OrderWithItemsRow extends OrderRow {
  order_items: OrderItemRow[] | null;
}

export interface CheckoutSessionResponse {
  order: {
    id: string;
    orderNumber: string | null;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    customerName: string;
    customerEmail: string;
    shippingAddress: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    } | null;
    items: {
      name: string;
      house: string;
      vintage: string;
      quantity: number;
      unitPrice: number;
      imageUrl: string;
    }[];
    subtotalAmount: number;
    shippingAmount: number;
    totalAmount: number;
    currency: string;
    createdAt: string;
  };
}
