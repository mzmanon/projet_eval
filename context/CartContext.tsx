"use client";

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Champagne, CartItem } from "@/types/champagne";
import { createClient } from "@/lib/supabase/client";
import { mapProductRows } from "@/lib/data/productsMapper";

interface CartContextType {
  items: CartItem[];
  catalog: Champagne[];
  addItem: (champagne: Champagne, quantity?: number, openCartDrawer?: boolean) => void;
  removeItem: (champagneId: string) => void;
  updateQuantity: (champagneId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // Product Selection Drawer ("fenêtre à droite")
  selectedChampagne: Champagne | null;
  isProductDrawerOpen: boolean;
  openProductDrawer: (champagne: Champagne) => void;
  closeProductDrawer: () => void;
  // Feedback badge animation in navbar
  isBadgeAnimating: boolean;
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
  const [catalog, setCatalog] = useState<Champagne[]>([]);
  const [isCatalogLoaded, setIsCatalogLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedChampagne, setSelectedChampagne] = useState<Champagne | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isBadgeAnimating, setIsBadgeAnimating] = useState(false);

  const badgeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    let active = true;
    async function loadCatalog() {
      const { data, error } = await createClient()
        .from("products")
        .select("id,name,description,price,image_url,stock,category,is_active")
        .eq("is_active", true)
        .order("name", { ascending: true });
      if (!active) return;
      if (error) {
        console.error("Impossible de charger le catalogue du panier :", error.message);
        return;
      }
      setCatalog(mapProductRows(data ?? []));
      setIsCatalogLoaded(true);
    }
    void loadCatalog().catch((error: unknown) => {
      if (active) console.error("Impossible de joindre le catalogue Supabase :", error);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isCatalogLoaded) return;
    const catalogById = new Map(catalog.map((champagne) => [champagne.id, champagne]));
    const synchronizedItems = items.flatMap((item) => {
      const currentProduct = catalogById.get(item.champagne.id);
      return currentProduct ? [{ ...item, champagne: currentProduct }] : [];
    });
    if (JSON.stringify(synchronizedItems) !== JSON.stringify(items)) {
      cartStore.save(synchronizedItems);
    }
  }, [catalog, isCatalogLoaded, items]);

  const openProductDrawer = useCallback((champagne: Champagne) => {
    setSelectedChampagne(champagne);
    setIsProductDrawerOpen(true);
  }, []);

  const closeProductDrawer = useCallback(() => {
    setIsProductDrawerOpen(false);
    // Give time for transition before clearing champagne
    setTimeout(() => {
      setSelectedChampagne(null);
    }, 300);
  }, []);

  const addItem = useCallback(
    (champagne: Champagne, quantity = 1, openCartDrawer = false) => {
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

      // Trigger badge animation in Navbar
      setIsBadgeAnimating(true);
      if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
      badgeTimeoutRef.current = setTimeout(() => {
        setIsBadgeAnimating(false);
      }, 1000);

      if (openCartDrawer) {
        setIsCartOpen(true);
      }
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
        catalog,
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
        selectedChampagne,
        isProductDrawerOpen,
        openProductDrawer,
        closeProductDrawer,
        isBadgeAnimating,
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
