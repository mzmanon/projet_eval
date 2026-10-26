"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  FREE_SHIPPING_THRESHOLD,
  getFreeShippingProgress,
  getMissingAmountForFreeShipping,
  getShippingCost,
} from "@/lib/checkout/pricing";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Wine,
  RotateCcw,
} from "lucide-react";
import ProductImage from "@/components/product/ProductImage";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
    totalCount,
  } = useCart();

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const missingForFreeShipping = getMissingAmountForFreeShipping(totalPrice);
  const progressRatio = getFreeShippingProgress(totalPrice);

  // Verrouiller le défilement du body quand la fenêtre plein écran est ouverte
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Raccourci Échap pour fermer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const shippingCost = getShippingCost(totalPrice);
  const grandTotal = totalPrice + shippingCost;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Votre Panier Privilège"
      className="cart-panel fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-[#0A0A0A] text-[#FCFBF9] animate-in fade-in duration-300"
    >
      {/* Top Luxury Header across full width */}
      <header className="border-b border-white/10 bg-[#0E0E0E] px-6 sm:px-12 py-5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#161616]">
            <span className="font-serif text-lg text-[#C5A059]">LC</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
              Maison de Sommellerie Privée &bull; Épernay
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#FCFBF9]">
              Votre Sélection de Flacons ({totalCount} {totalCount > 1 ? "flacons" : "flacon"})
            </h1>
          </div>
        </div>

        {/* Bouton de fermeture plein écran */}
        <button
          onClick={closeCart}
          className="inline-flex items-center gap-2.5 px-4 py-2 border border-white/15 hover:border-[#C5A059] text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Fermer la fenêtre du panier"
        >
          <span className="hidden sm:inline">Continuer mes sélections</span>
          <X className="h-4 w-4 text-[#C5A059]" />
        </button>
      </header>

      {/* Jauge de livraison offerte */}
      <div className="bg-[#121212] border-b border-white/5 px-6 sm:px-12 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
            {isFreeShipping ? (
              <span className="text-[#C5A059] font-medium">
                Privilège atteint : Livraison sécurisée sous température dirigée offerte
              </span>
            ) : (
              <span className="text-neutral-300">
                Plus que{" "}
                <strong className="text-[#C5A059] font-mono font-bold">
                  {missingForFreeShipping.toFixed(0)} €
                </strong>{" "}
                pour bénéficier de la livraison sécurisée offerte
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-36 sm:w-48 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8E733E] to-[#C5A059] transition-all duration-500"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
            <span className="text-neutral-400 font-mono text-[11px]">
              {progressRatio.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Full-Space Body Grid */}
      <main className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {items.length === 0 ? (
            /* Panier vide */
            <div className="py-20 text-center max-w-xl mx-auto space-y-6">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#C5A059]/30 bg-[#141414]">
                <Wine className="h-10 w-10 text-[#C5A059]" />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059]">
                  Cave Actuellement Inoccupée
                </span>
                <h2 className="font-serif text-3xl font-light text-[#FCFBF9]">
                  Votre sélection est vide
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed max-w-md mx-auto pt-2">
                  Nos crayères abritent les plus prestigieux millésimes et cuvées
                  d&apos;auteurs. Parcourez la collection pour initier votre sélection.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/champagnes"
                  onClick={closeCart}
                  className="inline-flex items-center gap-3 bg-[#C5A059] text-[#0A0A0A] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#DFC282] transition-colors"
                >
                  <span>Explorer le Catalogue des Champagnes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Panier garni prenant tout l'espace */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              {/* Left Column: Full-width list of selected champagnes (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="border border-white/5 bg-[#121212] divide-y divide-white/5 rounded-xs">
                  {items.map(({ champagne, quantity }) => (
                    <article
                      key={champagne.id}
                      className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-colors hover:bg-[#161616]/70"
                    >
                      {/* Authentic Packshot Display */}
                      <Link
                        href={`/champagnes/${champagne.slug}`}
                        onClick={closeCart}
                        className="relative h-32 w-20 sm:h-36 sm:w-24 flex-shrink-0 bg-[#171717] border border-white/10 rounded-xs p-2 overflow-hidden group"
                        title={`Découvrir ${champagne.name}`}
                      >
                        <ProductImage
                          src={champagne.imageUrl}
                          alt={champagne.name}
                          house={champagne.house}
                          name={champagne.name}
                          sizes="96px"
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Details & Specs */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
                            {champagne.house}
                          </span>
                          {champagne.isRare && (
                            <span className="bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-[9px] uppercase tracking-wider px-2 py-0.5">
                              Cuvée Rare
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/champagnes/${champagne.slug}`}
                          onClick={closeCart}
                          className="font-serif text-lg sm:text-xl font-normal text-white hover:text-[#C5A059] transition-colors block line-clamp-1"
                        >
                          {champagne.name}
                        </Link>

                        <p className="text-xs text-neutral-400 flex flex-wrap items-center gap-2">
                          <span>{champagne.vintage}</span>
                          <span>&bull;</span>
                          <span>{champagne.dosage}</span>
                          <span>&bull;</span>
                          <span>{champagne.format}</span>
                          <span>&bull;</span>
                          <span className="truncate max-w-xs">{champagne.terroir}</span>
                        </p>

                        <div className="text-xs text-neutral-300 pt-1">
                          <span>Prix unitaire : </span>
                          <span className="font-mono font-medium text-white">
                            {champagne.price} € TTC
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Price */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-3 flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="flex items-center border border-white/15 bg-[#0F0F0F]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(champagne.id, quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center text-neutral-300 hover:text-white transition-colors"
                            aria-label={`Diminuer la quantité de ${champagne.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-10 text-center font-mono text-sm font-semibold text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(champagne.id, quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-neutral-300 hover:text-white transition-colors"
                            aria-label={`Augmenter la quantité de ${champagne.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                            Sous-total
                          </span>
                          <span className="font-serif text-xl font-medium text-[#C5A059]">
                            {(champagne.price * quantity).toFixed(0)} €
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(champagne.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1 text-xs inline-flex items-center gap-1.5"
                          title="Retirer ce champagne de la sélection"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline text-[11px]">Supprimer</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Bouton secondaire continuer mes achats */}
                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Continuer à explorer les cuvées</span>
                  </button>

                  <span className="text-xs text-neutral-500">
                    Conservation certifiée en crayères d&apos;Épernay
                  </span>
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout CTA (4 cols) */}
              <div className="lg:col-span-4">
                <div className="sticky top-6 border border-[#C5A059]/30 bg-[#121212] p-6 sm:p-8 space-y-6 rounded-xs shadow-2xl">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
                      Validation Immédiate
                    </span>
                    <h2 className="font-serif text-2xl font-light text-[#FCFBF9] mt-1">
                      Récapitulatif de Commande
                    </h2>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-5 text-sm text-neutral-300">
                    <div className="flex justify-between">
                      <span>Sous-total flacons ({totalCount})</span>
                      <span className="font-mono text-white font-medium">
                        {totalPrice.toFixed(0)} €
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Livraison sécurisée</span>
                      <span className="font-mono">
                        {isFreeShipping ? (
                          <span className="text-[#C5A059] font-medium">Offerte</span>
                        ) : (
                          <span>25 €</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Taxes &amp; Droits d&apos;accises</span>
                      <span>Inclus (TVA France)</span>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                      <span className="font-serif text-lg text-neutral-200">
                        Total à régler
                      </span>
                      <span className="font-serif text-3xl font-light text-[#C5A059]">
                        {grandTotal.toFixed(0)} €
                      </span>
                    </div>
                  </div>

                  {/* Bouton principal : Valider ma commande */}
                  <div className="space-y-3 pt-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-3 bg-[#C5A059] text-[#0A0A0A] py-4 px-6 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#DFC282] active:scale-[0.99] transition-all duration-300 shadow-xl cursor-pointer text-center"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Valider ma commande &bull; {grandTotal.toFixed(0)} €</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <p className="text-[10px] text-center text-neutral-400 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                      <span>Paiement chiffré SSL 256 bits &bull; Expédition confidentielle 24h</span>
                    </p>
                  </div>

                  {/* Reassurances & Maison Guarantees */}
                  <div className="border-t border-white/10 pt-5 space-y-2.5 text-xs text-neutral-400">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                      <span>Flacons conservés en crayère sous hygrométrie et température maîtrisées.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                      <span>Origine garantie et scellée avec certificat de provenance.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
