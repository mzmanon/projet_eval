"use client";

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useMemo,
  useCallback,
} from "react";
import { Champagne, CartItem } from "@/types/champagne";

interface CartContextType {
  items: CartItem[];
  addItem: (champagne: Champagne, quantity?: number) => void;
  removeItem: (champagneId: string) => void;
  updateQuantity: (champagneId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "la_cave_cart_items";

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

const cartStore = {
  getSnapshot(): string {
    if (typeof window === "undefined") return "[]";
    try {
      return localStorage.getItem(STORAGE_KEY) || "[]";
    } catch {
      return "[]";
    }
  },
  getServerSnapshot(): string {
    return "[]";
  },
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  save(items: CartItem[]) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
      emitChange();
    }
  },
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync state cleanly with external store without set-state-in-effect
  const rawItems = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );

  const items: CartItem[] = useMemo(() => {
    try {
      return JSON.parse(rawItems);
    } catch {
      return [];
    }
  }, [rawItems]);

  const addItem = useCallback(
    (champagne: Champagne, quantity = 1) => {
      const current = items;
      const existing = current.find((i) => i.champagne.id === champagne.id);
      let updated: CartItem[];
      if (existing) {
        updated = current.map((i) =>
          i.champagne.id === champagne.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        updated = [...current, { champagne, quantity }];
      }
      cartStore.save(updated);
      setIsCartOpen(true);
    },
    [items]
  );

  const removeItem = useCallback(
    (champagneId: string) => {
      const updated = items.filter((i) => i.champagne.id !== champagneId);
      cartStore.save(updated);
    },
    [items]
  );

  const updateQuantity = useCallback(
    (champagneId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(champagneId);
        return;
      }
      const updated = items.map((i) =>
        i.champagne.id === champagneId ? { ...i, quantity } : i
      );
      cartStore.save(updated);
    },
    [items, removeItem]
  );

  const clearCart = useCallback(() => {
    cartStore.save([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((acc, curr) => acc + curr.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (acc, curr) => acc + curr.champagne.price * curr.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
