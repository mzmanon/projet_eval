"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Wine,
  Thermometer,
  ArrowRight,
  Check,
} from "lucide-react";

export default function ProductSelectionDrawer() {
  const {
    selectedChampagne,
    isProductDrawerOpen,
    closeProductDrawer,
    addItem,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Reset quantity whenever a new champagne is opened
  useEffect(() => {
    if (selectedChampagne) {
      setQuantity(1);
      setIsAdding(false);
    }
  }, [selectedChampagne]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isProductDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isProductDrawerOpen]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isProductDrawerOpen) {
        closeProductDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProductDrawerOpen, closeProductDrawer]);

  if (!isProductDrawerOpen || !selectedChampagne) return null;

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(selectedChampagne, quantity, false);

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
        className="fixed inset-0 bg-[#14150F]/50 backdrop-blur-sm transition-opacity duration-500"
        onClick={closeProductDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel Sliding in from Right */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-drawer-title"
        className="relative z-10 flex h-full w-full max-w-lg lg:max-w-xl flex-col bg-white border-l border-[#2E4636]/14 text-[#14150F] shadow-2xl transition-transform duration-500 animate-in slide-in-from-right"
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between border-b border-[#2E4636]/12 px-6 sm:px-8 py-5 bg-[#F4F7EE]">
          <div>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#755A22] font-normal block">
              Consultation Sommelier
            </span>
            <span className="text-xs text-[#565C4E] font-light">
              Fiche de sélection &bull; Allocation privée
            </span>
          </div>

          <button
            onClick={closeProductDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2E4636]/15 text-[#565C4E] hover:border-[#B08F4C] hover:text-[#755A22] transition-colors focus:outline-none cursor-pointer"
            aria-label="Fermer la fenêtre de sélection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {/* Authentic Packshot Display with Champagne Backlight */}
          <div className="relative h-64 sm:h-72 w-full bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] border border-[#2E4636]/10 p-4 flex items-center justify-center overflow-hidden">
            {selectedChampagne.isRare && (
              <span className="absolute top-3 left-3 z-10 border border-[#B08F4C]/55 bg-[#FBFAF6]/80 backdrop-blur-sm text-[#755A22] text-[9px] uppercase tracking-[0.22em] font-normal px-2.5 py-0.5">
                Cuvée Rare
              </span>
            )}
            {selectedChampagne.score && (
              <span className="absolute top-3 right-3 z-10 border border-[#2E4636]/15 bg-[#FBFAF6]/80 backdrop-blur-sm text-[#333A2F] text-[10px] font-mono px-2 py-0.5">
                {selectedChampagne.score}/100
              </span>
            )}

            <div className="relative h-full w-full">
              <Image
                src={selectedChampagne.imageUrl}
                alt={`${selectedChampagne.house} ${selectedChampagne.name}`}
                fill
                sizes="(max-width: 600px) 100vw, 480px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Titles & Pricing */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-normal">
                {selectedChampagne.house}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#565C4E] font-light">
                {selectedChampagne.format}
              </span>
            </div>

            <h2
              id="product-drawer-title"
              className="font-serif text-2xl sm:text-3xl font-light text-[#14150F] mt-1.5"
            >
              {selectedChampagne.name}
            </h2>

            {/* Badges / Terroir & Vintage */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-[#333A2F] font-light">
              <span className="bg-[#2E4636]/[0.06] border border-[#2E4636]/15 px-2.5 py-0.5 font-mono text-[11px]">
                {selectedChampagne.vintage}
              </span>
              <span className="bg-[#2E4636]/[0.06] border border-[#2E4636]/15 px-2.5 py-0.5 text-[11px]">
                {selectedChampagne.dosage}
              </span>
              <span className="text-[#565C4E] text-xs">
                {selectedChampagne.terroir}
              </span>
            </div>

            {/* Unit Price */}
            <div className="mt-4 flex items-baseline justify-between border-y border-[#2E4636]/12 py-3.5">
              <span className="text-xs uppercase tracking-wider text-[#565C4E] font-light">
                Prix unitaire domaine
              </span>
              <span className="font-serif text-2xl font-light text-[#14150F]">
                {selectedChampagne.price} €{" "}
                <span className="text-xs text-[#565C4E] font-sans font-light">TTC</span>
              </span>
            </div>
          </div>

          {/* Champagne Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-[0.22em] text-[#755A22] font-normal flex items-center gap-2">
              <Wine className="h-3.5 w-3.5 stroke-1" />
              <span>Description de la cuvée</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#333A2F]/90 leading-relaxed font-light">
              {selectedChampagne.description}
            </p>
          </div>

          {/* Tasting Notes & Oenology */}
          {selectedChampagne.tastingNotes && (
            <div className="bg-[#F4F7EE] border border-[#2E4636]/10 p-5 space-y-3 font-light">
              <h4 className="text-[10px] uppercase tracking-[0.22em] text-[#333A2F] font-normal">
                Profil &amp; Dégustation
              </h4>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {selectedChampagne.tastingNotes.nez && (
                  <div>
                    <span className="text-[#755A22]">Nez : </span>
                    <span className="text-[#333A2F]">
                      {selectedChampagne.tastingNotes.nez}
                    </span>
                  </div>
                )}
                {selectedChampagne.tastingNotes.bouche && (
                  <div>
                    <span className="text-[#755A22]">Bouche : </span>
                    <span className="text-[#333A2F]">
                      {selectedChampagne.tastingNotes.bouche}
                    </span>
                  </div>
                )}
                {selectedChampagne.tastingNotes.service && (
                  <div className="flex items-center gap-1.5 text-[#565C4E] pt-2 border-t border-[#2E4636]/10 text-[11px]">
                    <Thermometer className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
                    <span>Service conseillé : {selectedChampagne.tastingNotes.service}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity Selection Section */}
          <div className="border border-[#2E4636]/14 bg-[#F4F7EE] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#14150F] font-light block">
                  Nombre de flacons
                </span>
                <span className="text-[11px] text-[#565C4E] font-light">
                  Choisissez la quantité souhaitée
                </span>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center border border-[#2E4636]/20 bg-[#FBFAF6]">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center text-[#333A2F] hover:text-[#2E4636] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Diminuer la quantité de 1"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <span className="w-10 text-center font-mono text-sm font-normal text-[#14150F]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="flex h-9 w-9 items-center justify-center text-[#333A2F] hover:text-[#2E4636] transition-colors"
                  aria-label="Augmenter la quantité de 1"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Quick shortcuts for collectors */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#2E4636]/10">
              <span className="text-[10px] uppercase tracking-wider text-[#565C4E] mr-1 font-light">
                Formats :
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
                  className={`text-[10px] uppercase tracking-wider py-1 px-3 border transition-colors cursor-pointer ${
                    quantity === count
                      ? "border-[#B08F4C] bg-[#E3C47D]/35 text-[#755A22]"
                      : "border-[#2E4636]/15 text-[#565C4E] hover:border-[#2E4636]/25 hover:text-[#22271F]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Subtotal summary */}
            <div className="flex items-center justify-between text-xs pt-2 text-[#333A2F]">
              <span className="font-light">Sous-total sélectionné ({quantity} {quantity > 1 ? "flacons" : "flacon"})</span>
              <span className="font-serif text-lg font-light text-[#755A22]">
                {totalPrice.toFixed(0)} €
              </span>
            </div>
          </div>

          {/* Link to full dedicated sommelier page */}
          <div className="text-center pt-1 pb-2">
            <Link
              href={`/champagnes/${selectedChampagne.slug}`}
              onClick={closeProductDrawer}
              className="inline-flex items-center gap-1.5 text-xs text-[#565C4E] hover:text-[#755A22] transition-colors uppercase tracking-[0.2em] font-light"
            >
              <span>Consulter le dossier sommelier complet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Sticky Bottom Action Bar with "Ajouter au panier" */}
        <div className="border-t border-[#2E4636]/14 bg-[#F4F7EE] p-5 sm:p-6 space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex w-full items-center justify-center gap-3 bg-[#E3C47D] text-[#14150F] py-3.5 px-6 text-xs font-normal uppercase tracking-[0.22em] hover:bg-[#EFD9A2] active:scale-[0.99] transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
            aria-label={`Ajouter ${quantity} flacon(s) au panier`}
          >
            {isAdding ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Ajout en cours...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>
                  Ajouter au panier • {totalPrice.toFixed(0)} €
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-[#565C4E] uppercase tracking-widest text-center font-light">
            <ShieldCheck className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
            <span>Flacons scellés d&apos;origine • Expédition sécurisée sous 24h</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
