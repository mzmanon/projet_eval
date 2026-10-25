"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Check, ShoppingBag, X, ArrowRight } from "lucide-react";

export default function AddToCartToast() {
  const { lastAddedToast, dismissToast, openCart, totalCount } = useCart();

  if (!lastAddedToast) return null;

  const { champagne, quantity } = lastAddedToast;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#141414] border border-[#C5A059]/40 p-4 shadow-2xl rounded-sm animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        {/* Packshot miniature */}
        <div className="relative h-14 w-10 flex-shrink-0 bg-[#1B1B1B] border border-white/10 rounded-xs p-1">
          <Image
            src={champagne.imageUrl}
            alt={champagne.name}
            fill
            sizes="40px"
            className="object-contain"
          />
        </div>

        {/* Content details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[#C5A059] text-[10px] font-semibold uppercase tracking-wider">
            <Check className="h-3.5 w-3.5" />
            <span>Ajouté au panier</span>
          </div>

          <p className="text-xs font-serif font-medium text-white truncate mt-0.5">
            {quantity} × {champagne.house} {champagne.name}
          </p>

          <p className="text-[11px] text-neutral-400 mt-0.5">
            Panier mis à jour ({totalCount} {totalCount > 1 ? "articles" : "article"})
          </p>

          {/* Quick validation trigger */}
          <button
            onClick={() => {
              dismissToast();
              openCart();
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C5A059] hover:text-[#DFC282] font-semibold transition-colors"
          >
            <span>Valider ma commande</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={dismissToast}
          className="text-neutral-400 hover:text-white p-1 transition-colors"
          aria-label="Fermer la notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
