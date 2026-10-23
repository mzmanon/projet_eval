"use client";

import React, { useState } from "react";
import { Champagne } from "@/types/champagne";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";

export default function AddToCartButton({ champagne }: { champagne: Champagne }) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(champagne, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity control */}
        <div className="flex items-center justify-between border border-white/15 bg-[#141414] px-3 py-2 w-full sm:w-36">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-mono text-sm text-neutral-100 font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAdd}
          className="flex-1 flex items-center justify-center gap-3 bg-[#C5A059] text-[#0A0A0A] py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#DFC282] transition-all duration-300 shadow-lg"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Flacon ajouté au panier</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>Acquérir cette cuvée • {(champagne.price * quantity).toFixed(0)} €</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
