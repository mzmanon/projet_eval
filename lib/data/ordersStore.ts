import { Order } from "@/types/champagne";

const ORDERS_KEY = "la_cave_orders";

const INITIAL_SAMPLE_ORDER: Order = {
  id: "LC-2026-849201",
  createdAt: "2026-10-18T14:30:00.000Z",
  customerName: "Jean de Montmirail",
  customerEmail: "amateur.eclat@haute-champagne.fr",
  shippingAddress: {
    street: "24, Rue du Faubourg Saint-Honoré",
    city: "Paris",
    postalCode: "75008",
    country: "France",
  },
  items: [
    {
      champagneId: "dom-perignon-2013",
      name: "Dom Pérignon Vintage 2013",
      house: "Dom Pérignon",
      vintage: "2013",
      price: 245,
      quantity: 2,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Dom_P%C3%A9rignon_Champagne_2012.jpg/800px-Dom_P%C3%A9rignon_Champagne_2012.jpg",
    },
    {
      champagneId: "ruinart-blanc-de-blancs",
      name: "Ruinart Blanc de Blancs",
      house: "Maison Ruinart",
      vintage: "Non Millésimé",
      price: 98,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80",
    },
  ],
  totalAmount: 588,
  status: "confirmed",
};

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const ordersStore = {
  getSnapshot(): string {
    if (typeof window === "undefined") {
      return JSON.stringify([INITIAL_SAMPLE_ORDER]);
    }
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (!stored) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify([INITIAL_SAMPLE_ORDER]));
        return JSON.stringify([INITIAL_SAMPLE_ORDER]);
      }
      return stored;
    } catch {
      return JSON.stringify([INITIAL_SAMPLE_ORDER]);
    }
  },
  getServerSnapshot(): string {
    return JSON.stringify([INITIAL_SAMPLE_ORDER]);
  },
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  save(orders: Order[]) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      } catch {
        // ignore
      }
      emitChange();
    }
  },
};
