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
  isAuthenticated: boolean;
  isAuthReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "la_cave_cart_items";
const STORAGE_PREFIX = `${STORAGE_KEY}:`;

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

const cartStore = {
  getSnapshot(scope: string): string {
    if (typeof window === "undefined") return "[]";
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}${scope}`) || "[]";
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
  save(items: CartItem[], scope: string) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${scope}`, JSON.stringify(items));
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
  const [cartScope, setCartScope] = useState("guest");
  const [authReady, setAuthReady] = useState(false);
  const isAuthenticated = cartScope.startsWith("user:");

  const badgeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state cleanly with external store without set-state-in-effect
  const getSnapshot = useCallback(() => cartStore.getSnapshot(cartScope), [cartScope]);
  const rawItems = useSyncExternalStore(
    cartStore.subscribe,
    getSnapshot,
    cartStore.getServerSnapshot
  );

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let authEventReceived = false;
    let activeScope: string | null = null;

    const activateScope = (userId: string | null) => {
      if (!active) return;
      const nextScope = userId ? `user:${userId}` : "guest";
      if (activeScope === nextScope) {
        setAuthReady(true);
        return;
      }
      try {
        const targetKey = `${STORAGE_PREFIX}${nextScope}`;
        const shouldMergeGuestCart = userId && (activeScope === null || activeScope === "guest");
        const sourceKeys = [
          ...(shouldMergeGuestCart ? [`${STORAGE_PREFIX}guest`] : []),
          STORAGE_KEY,
        ];
        const cartsToMerge = [
          JSON.parse(localStorage.getItem(targetKey) || "[]") as CartItem[],
          ...sourceKeys
            .map((key) => localStorage.getItem(key))
            .filter((value): value is string => Boolean(value))
            .map((value) => JSON.parse(value) as CartItem[]),
        ];
        if (cartsToMerge.length > 1) {
          const merged = new Map<string, CartItem>();
          for (const cart of cartsToMerge) for (const item of cart) {
            if (!item?.champagne?.id || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
            const current = merged.get(item.champagne.id);
            merged.set(item.champagne.id, {
              ...item,
              quantity: (current?.quantity ?? 0) + item.quantity,
            });
          }
          const mergedItems = [...merged.values()];
          localStorage.setItem(targetKey, JSON.stringify(mergedItems));
          for (const key of sourceKeys) localStorage.removeItem(key);
        }
      } catch {
        // Keep the current account usable if legacy browser storage is malformed.
      }
      activeScope = nextScope;
      setCartScope(nextScope);
      setAuthReady(true);
      emitChange();
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;
      activateScope(session?.user.id ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!authEventReceived) activateScope(data.session?.user.id ?? null);
    }).catch(() => {
      if (!authEventReceived) activateScope(null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

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
    if (!isCatalogLoaded || !authReady) return;
    const catalogById = new Map(catalog.map((champagne) => [champagne.id, champagne]));
    const synchronizedItems = items.map((item) => {
      const currentProduct = catalogById.get(item.champagne.id);
      return currentProduct ? { ...item, champagne: currentProduct } : item;
    });
    if (JSON.stringify(synchronizedItems) !== JSON.stringify(items)) {
      cartStore.save(synchronizedItems, cartScope);
    }
  }, [catalog, isCatalogLoaded, authReady, cartScope, items]);

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
      cartStore.save(updated, cartScope);

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
    [items, cartScope]
  );

  const removeItem = useCallback(
    (champagneId: string) => {
      const updated = items.filter((i) => i.champagne.id !== champagneId);
      cartStore.save(updated, cartScope);
    },
    [items, cartScope]
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
      cartStore.save(updated, cartScope);
    },
    [items, removeItem, cartScope]
  );

  const clearCart = useCallback(() => {
    cartStore.save([], cartScope);
  }, [cartScope]);

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
        isAuthenticated,
        isAuthReady: authReady,
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
