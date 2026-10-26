"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Champagne } from "@/types/champagne";
import ProductImage from "@/components/product/ProductImage";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Wine,
  Sparkles,
  Thermometer,
  ArrowRight,
  Check,
} from "lucide-react";

export default function ProductSelectionDrawer() {
  const { selectedChampagne, isProductDrawerOpen } = useCart();

  if (!isProductDrawerOpen || !selectedChampagne) return null;

  // Remount when the selected cuvée changes so quantity/isAdding reset naturally.
  return (
    <ProductSelectionDrawerContent
      key={selectedChampagne.id}
      selectedChampagne={selectedChampagne}
    />
  );
}

function ProductSelectionDrawerContent({
  selectedChampagne,
}: {
  selectedChampagne: Champagne;
}) {
  const { addItem, closeProductDrawer } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeProductDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeProductDrawer]);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(selectedChampagne, quantity, false);

    // Brief confirmation feel before closing drawer so user is returned to their page
    setTimeout(() => {
      setIsAdding(false);
      closeProductDrawer();
    }, 250);
  };

  const totalPrice = selectedChampagne.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeProductDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel Sliding in from Right */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-drawer-title"
        className="cart-panel relative z-10 flex h-full w-full max-w-lg lg:max-w-xl flex-col bg-[#0F0F0F] border-l border-[#C5A059]/25 text-[#FCFBF9] shadow-2xl transition-transform duration-500 animate-in slide-in-from-right"
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-[#141414]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              Sélection de la Cuvée
            </span>
          </div>

          <button
            onClick={closeProductDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            aria-label="Fermer la fenêtre de sélection"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Authentic Packshot Display */}
          <div className="relative h-64 sm:h-72 w-full bg-[#161616] border border-white/5 p-4 rounded-sm flex items-center justify-center overflow-hidden">
            {selectedChampagne.isRare && (
              <span className="absolute top-3 left-3 z-10 bg-[#C5A059] text-[#0A0A0A] text-[9px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5">
                Cuvée Rare
              </span>
            )}
            {selectedChampagne.score && (
              <span className="absolute top-3 right-3 z-10 bg-[#1D1D1D]/90 backdrop-blur-sm border border-[#C5A059]/30 text-neutral-200 text-[11px] font-mono px-2 py-1">
                Note : {selectedChampagne.score}/100
              </span>
            )}

            <div className="relative h-full w-full">
              <ProductImage
                src={selectedChampagne.imageUrl}
                alt={`${selectedChampagne.house} ${selectedChampagne.name}`}
                house={selectedChampagne.house}
                name={selectedChampagne.name}
                sizes="(max-width: 600px) 100vw, 480px"
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                priority
              />
            </div>
          </div>

          {/* Titles & Pricing */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                {selectedChampagne.house}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                {selectedChampagne.format}
              </span>
            </div>

            <h2
              id="product-drawer-title"
              className="font-serif text-2xl sm:text-3xl font-light text-[#FCFBF9] mt-1.5"
            >
              {selectedChampagne.name}
            </h2>

            {/* Badges / Terroir & Vintage */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-neutral-300">
              <span className="bg-[#1A1A1A] border border-white/10 px-2.5 py-0.5 font-mono">
                {selectedChampagne.vintage}
              </span>
              <span className="bg-[#1A1A1A] border border-white/10 px-2.5 py-0.5">
                {selectedChampagne.dosage}
              </span>
              <span className="text-neutral-400 text-xs">
                {selectedChampagne.terroir}
              </span>
            </div>

            {/* Unit Price */}
            <div className="mt-4 flex items-baseline justify-between border-y border-white/10 py-3">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                Prix unitaire
              </span>
              <span className="font-serif text-2xl font-light text-[#FCFBF9]">
                {selectedChampagne.price} €{" "}
                <span className="text-xs text-neutral-400 font-sans">TTC</span>
              </span>
            </div>
          </div>

          {/* Champagne Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium flex items-center gap-2">
              <Wine className="h-3.5 w-3.5" />
              <span>Description de la cuvée</span>
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              {selectedChampagne.description}
            </p>
          </div>

          {/* Tasting Notes & Oenology */}
          {selectedChampagne.tastingNotes && (
            <div className="bg-[#141414] border border-white/5 p-4 rounded-sm space-y-3">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-neutral-200 font-medium">
                Profil &amp; Dégustation
              </h4>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {selectedChampagne.tastingNotes.nez && (
                  <div>
                    <span className="text-[#C5A059] font-medium">Nez : </span>
                    <span className="text-neutral-300">
                      {selectedChampagne.tastingNotes.nez}
                    </span>
                  </div>
                )}
                {selectedChampagne.tastingNotes.bouche && (
                  <div>
                    <span className="text-[#C5A059] font-medium">Bouche : </span>
                    <span className="text-neutral-300">
                      {selectedChampagne.tastingNotes.bouche}
                    </span>
                  </div>
                )}
                {selectedChampagne.tastingNotes.service && (
                  <div className="flex items-center gap-1.5 text-neutral-400 pt-1 border-t border-white/5 text-[11px]">
                    <Thermometer className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Service conseillé : {selectedChampagne.tastingNotes.service}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity Selection Section ("choisir le nombre de champagne qu'il souhaite prendre") */}
          <div className="border border-[#C5A059]/30 bg-[#161616] p-5 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#FCFBF9] font-medium block">
                  Nombre de flacons
                </span>
                <span className="text-[11px] text-neutral-400">
                  Choisissez la quantité souhaitée
                </span>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center border border-white/20 bg-[#0E0E0E]">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Diminuer la quantité de 1"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-12 text-center font-mono text-base font-semibold text-[#FCFBF9]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="flex h-10 w-10 items-center justify-center text-neutral-300 hover:text-white transition-colors"
                  aria-label="Augmenter la quantité de 1"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick shortcuts for collectors */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 mr-1">
                Lots :
              </span>
              {[
                { count: 1, label: "1 flacon" },
                { count: 3, label: "3 (Coffret)" },
                { count: 6, label: "6 (Caisse)" },
              ].map(({ count, label }) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuantity(count)}
                  className={`text-[11px] py-1 px-2.5 rounded-xs transition-colors ${
                    quantity === count
                      ? "bg-[#C5A059] text-[#0A0A0A] font-semibold"
                      : "bg-[#222222] text-neutral-300 hover:bg-[#2A2A2A]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Subtotal summary */}
            <div className="flex items-center justify-between text-xs pt-2 text-neutral-300">
              <span>Sous-total sélectionné ({quantity} {quantity > 1 ? "flacons" : "flacon"})</span>
              <span className="font-serif text-lg font-medium text-[#C5A059]">
                {totalPrice.toFixed(0)} €
              </span>
            </div>
          </div>

          {/* Link to full dedicated sommelier page */}
          <div className="text-center pt-1 pb-2">
            <Link
              href={`/champagnes/${selectedChampagne.slug}`}
              onClick={closeProductDrawer}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#C5A059] transition-colors uppercase tracking-wider"
            >
              <span>Consulter le dossier sommelier complet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Sticky Bottom Action Bar with "Ajouter au panier" */}
        <div className="border-t border-white/10 bg-[#121212] p-5 sm:p-6 space-y-3 shadow-2xl">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex w-full items-center justify-center gap-3 bg-[#C5A059] text-[#0A0A0A] py-4 px-6 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#DFC282] active:scale-[0.99] transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50"
            aria-label={`Ajouter ${quantity} flacon(s) au panier`}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4" />
                <span>Ajout en cours...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>
                  Ajouter au panier • {totalPrice.toFixed(0)} €
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest text-center">
            <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>Flacons scellés d&apos;origine • Expédition sécurisée sous 24h</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
