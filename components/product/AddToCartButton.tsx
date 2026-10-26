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
        <div className="flex items-center justify-between border border-[#2E4636]/20 bg-[#FBFAF6] px-3 py-2 w-full sm:w-36">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-1 text-[#565C4E] hover:text-[#2E4636] transition-colors"
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-mono text-sm text-[#1B1F18] font-normal">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-1 text-[#565C4E] hover:text-[#2E4636] transition-colors"
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAdd}
          className="flex-1 flex items-center justify-center gap-3 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] py-3.5 px-6 text-xs font-normal uppercase tracking-[0.22em] hover:bg-[#EFD9A2] transition-all duration-300 shadow-sm cursor-pointer"
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
