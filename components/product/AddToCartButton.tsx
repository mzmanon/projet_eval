"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Champagne } from "@/types/champagne";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ champagne }: { champagne: Champagne }) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();
  const handleAdd = () => {
    addItem(champagne, quantity, true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex h-12 items-center justify-between border border-[#C8C1B4] bg-[#FCFBF8] px-2 sm:w-36">
        <button onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="flex h-9 w-9 items-center justify-center text-[#827D75] hover:text-[#171715]" aria-label="Diminuer la quantité"><Minus className="h-4 w-4" /></button>
        <span className="font-mono text-sm text-[#171715]">{quantity}</span>
        <button onClick={() => setQuantity((current) => current + 1)} className="flex h-9 w-9 items-center justify-center text-[#827D75] hover:text-[#171715]" aria-label="Augmenter la quantité"><Plus className="h-4 w-4" /></button>
      </div>
      <button onClick={handleAdd} className="flex min-h-12 flex-1 items-center justify-center gap-3 border border-[#171715] bg-[#171715] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#FCFBF8] transition-colors hover:border-[#A58C62] hover:bg-[#A58C62]">
        {justAdded ? <><Check className="h-4 w-4" />Flacon ajouté</> : <><ShoppingBag className="h-4 w-4" />Acquérir · {(champagne.price * quantity).toFixed(0)} €</>}
      </button>
    </div>
  );
}
