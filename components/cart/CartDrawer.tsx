"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Wine,
  RotateCcw,
} from "lucide-react";

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

  const FREE_SHIPPING_THRESHOLD = 250;
  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const missingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - totalPrice
  );
  const progressRatio = Math.min(
    100,
    (totalPrice / FREE_SHIPPING_THRESHOLD) * 100
  );

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

  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 25;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Votre Panier Privilège"
      className="fixed inset-0 z-50 w-full h-full bg-[#FBFAF6] text-[#14150F] flex flex-col overflow-hidden animate-in fade-in duration-300"
    >
      {/* Top Luxury Header across full width */}
      <header className="border-b border-[#2E4636]/12 bg-[#EFF3E8] px-6 sm:px-12 py-5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B08F4C]/45 bg-[#F4F7EE]">
            <span className="font-serif text-base text-[#755A22]">LC</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
              Maison de Sommellerie Privée &bull; Épernay
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#14150F]">
              Votre Sélection de Flacons ({totalCount} {totalCount > 1 ? "flacons" : "flacon"})
            </h1>
          </div>
        </div>

        {/* Bouton de fermeture plein écran */}
        <button
          onClick={closeCart}
          className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#2E4636]/15 hover:border-[#B08F4C] text-xs uppercase tracking-[0.2em] text-[#333A2F] hover:text-[#2E4636] transition-colors cursor-pointer font-light"
          aria-label="Fermer la fenêtre du panier"
        >
          <span className="hidden sm:inline">Poursuivre la sélection</span>
          <X className="h-4 w-4 text-[#755A22]" />
        </button>
      </header>

      {/* Jauge fine de livraison offerte */}
      <div className="bg-[#F1F5EA] border-b border-[#2E4636]/8 px-6 sm:px-12 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-light">
            <ShieldCheck className="h-4 w-4 text-[#755A22] stroke-1" />
            {isFreeShipping ? (
              <span className="text-[#755A22] font-normal">
                Privilège atteint : Expédition sécurisée sous température dirigée offerte
              </span>
            ) : (
              <span className="text-[#333A2F]">
                Plus que{" "}
                <strong className="text-[#755A22] font-mono font-normal">
                  {missingForFreeShipping.toFixed(0)} €
                </strong>{" "}
                pour bénéficier de l&apos;expédition sécurisée offerte
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1 w-36 sm:w-48 bg-[#DDE5D3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E3C47D] transition-all duration-500"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
            <span className="text-[#565C4E] font-mono text-[11px]">
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
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#2E4636]/15 bg-[#F4F7EE]">
                <Wine className="h-8 w-8 text-[#755A22] stroke-1" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-light">
                  Cave Actuellement Inoccupée
                </span>
                <h2 className="font-serif text-3xl font-light text-[#14150F]">
                  Votre sélection est vide
                </h2>
                <p className="text-xs sm:text-sm text-[#565C4E] leading-relaxed max-w-md mx-auto font-light pt-1">
                  Nos crayères abritent les plus prestigieux millésimes et cuvées
                  d&apos;auteurs. Parcourez la collection pour initier votre sélection.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/champagnes"
                  onClick={closeCart}
                  className="inline-flex items-center gap-3 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-8 py-3.5 text-xs font-normal uppercase tracking-[0.22em] hover:bg-[#EFD9A2] transition-all duration-300"
                >
                  <span>Explorer le Catalogue des Champagnes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* Panier garni prenant tout l'espace */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              {/* Left Column: Full-width list of selected champagnes (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="border border-[#2E4636]/10 bg-[#EFF3E8] divide-y divide-[#2E4636]/10">
                  {items.map(({ champagne, quantity }) => (
                    <article
                      key={champagne.id}
                      className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-colors hover:bg-[#2E4636]/[0.04]"
                    >
                      {/* Authentic Packshot Display with Champagne Backlight */}
                      <Link
                        href={`/champagnes/${champagne.slug}`}
                        onClick={closeCart}
                        className="relative h-28 w-20 sm:h-32 sm:w-24 flex-shrink-0 bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] border border-[#2E4636]/12 p-2 overflow-hidden group"
                        title={`Découvrir ${champagne.name}`}
                      >
                        <Image
                          src={champagne.imageUrl}
                          alt={champagne.name}
                          fill
                          sizes="96px"
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Details & Specs */}
                      <div className="flex-1 min-w-0 space-y-1.5 font-light">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-[0.25em] text-[#755A22] font-normal block">
                            {champagne.house}
                          </span>
                          {champagne.isRare && (
                            <span className="border border-[#B08F4C]/45 bg-[#E3C47D]/30 text-[#755A22] text-[9px] uppercase tracking-wider px-2 py-0.5">
                              Cuvée Rare
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/champagnes/${champagne.slug}`}
                          onClick={closeCart}
                          className="font-serif text-lg sm:text-xl font-light text-[#14150F] hover:text-[#755A22] transition-colors block line-clamp-1"
                        >
                          {champagne.name}
                        </Link>

                        <p className="text-xs text-[#565C4E] flex flex-wrap items-center gap-2">
                          <span>{champagne.vintage}</span>
                          <span>&bull;</span>
                          <span>{champagne.dosage}</span>
                          <span>&bull;</span>
                          <span>{champagne.format}</span>
                          <span>&bull;</span>
                          <span className="truncate max-w-xs">{champagne.terroir}</span>
                        </p>

                        <div className="text-xs text-[#333A2F] pt-1">
                          <span>Prix unitaire : </span>
                          <span className="font-mono text-[#14150F]">
                            {champagne.price} € TTC
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Price */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-3 flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#2E4636]/10">
                        <div className="flex items-center border border-[#2E4636]/15 bg-[#FBFAF6]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(champagne.id, quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#333A2F] hover:text-[#2E4636] transition-colors"
                            aria-label={`Diminuer la quantité de ${champagne.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-9 text-center font-mono text-xs font-normal text-[#14150F]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(champagne.id, quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#333A2F] hover:text-[#2E4636] transition-colors"
                            aria-label={`Augmenter la quantité de ${champagne.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] text-[#565C4E] uppercase tracking-wider block font-light">
                            Sous-total
                          </span>
                          <span className="font-serif text-xl font-light text-[#755A22]">
                            {(champagne.price * quantity).toFixed(0)} €
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(champagne.id)}
                          className="text-[#585F50] hover:text-[#A3352B] transition-colors p-1 text-xs inline-flex items-center gap-1.5"
                          title="Retirer ce champagne de la sélection"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden sm:inline text-[11px] font-light">Retirer</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Bouton secondaire continuer mes achats */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-[#565C4E] hover:text-[#755A22] transition-colors cursor-pointer font-light"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Continuer à explorer les cuvées</span>
                  </button>

                  <span className="text-[#585F50] font-light hidden sm:inline">
                    Conservation certifiée en crayères d&apos;Épernay
                  </span>
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout CTA (4 cols) */}
              <div className="lg:col-span-4">
                <div className="sticky top-6 border border-[#2E4636]/14 bg-[#EFF3E8] p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#755A22] font-normal block">
                      Validation Immédiate
                    </span>
                    <h2 className="font-serif text-2xl font-light text-[#14150F] mt-1">
                      Récapitulatif de Commande
                    </h2>
                  </div>

                  <div className="space-y-3.5 border-t border-[#2E4636]/12 pt-5 text-xs text-[#333A2F] font-light">
                    <div className="flex justify-between">
                      <span>Sous-total flacons ({totalCount})</span>
                      <span className="font-mono text-[#14150F]">
                        {totalPrice.toFixed(0)} €
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Expédition sécurisée</span>
                      <span className="font-mono">
                        {isFreeShipping ? (
                          <span className="text-[#755A22]">Offerte</span>
                        ) : (
                          <span>25 €</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-[#565C4E]">
                      <span>Taxes &amp; Droits d&apos;accises</span>
                      <span>Inclus (TVA France)</span>
                    </div>

                    <div className="pt-4 border-t border-[#2E4636]/12 flex justify-between items-baseline">
                      <span className="font-serif text-lg text-[#22271F]">
                        Total à régler
                      </span>
                      <span className="font-serif text-3xl font-light text-[#755A22]">
                        {grandTotal.toFixed(0)} €
                      </span>
                    </div>
                  </div>

                  {/* Bouton principal : Valider ma commande */}
                  <div className="space-y-3 pt-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-3 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] py-3.5 px-6 text-xs font-normal uppercase tracking-[0.22em] hover:bg-[#EFD9A2] active:scale-[0.99] transition-all duration-300 shadow-md cursor-pointer text-center"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Valider ma commande &bull; {grandTotal.toFixed(0)} €</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <p className="text-[10px] text-center text-[#565C4E] flex items-center justify-center gap-1.5 font-light">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
                      <span>Paiement chiffré SSL 256 bits &bull; Expédition confidentielle 24h</span>
                    </p>
                  </div>

                  {/* Reassurances & Maison Guarantees */}
                  <div className="border-t border-[#2E4636]/12 pt-5 space-y-2 text-xs text-[#565C4E] font-light">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#755A22] flex-shrink-0 mt-0.5 stroke-1" />
                      <span>Conservation en crayère sous hygrométrie et température maîtrisées.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#755A22] flex-shrink-0 mt-0.5 stroke-1" />
                      <span>Origine garantie et flacons scellés avec certificat de provenance.</span>
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
