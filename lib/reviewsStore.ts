import type { ProductReview } from "@/types/champagne";

const STORAGE_PREFIX = "la_cave_product_reviews_v1:";

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Petit store externe (même approche que le panier) pour garder les avis
 * synchronisés entre les cartes et la page produit, sans conflit d'hydratation.
 */
export const reviewsStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((current) => current !== listener);
    };
  },

  getSnapshot(champagneId: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(STORAGE_PREFIX + champagneId);
    } catch {
      return null;
    }
  },

  getServerSnapshot(): string | null {
    return null;
  },

  save(champagneId: string, reviews: ProductReview[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_PREFIX + champagneId,
        JSON.stringify(reviews)
      );
    } catch {
      // Stockage indisponible : la discussion reste fonctionnelle en mémoire.
    }
    emitChange();
  },
};
