"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShieldCheck, ArrowRight } from "lucide-react";

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

  // Empêcher le défilement du corps quand le panier est ouvert
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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre Panier"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#111111] border-l border-[#C5A059]/20 text-[#FCFBF9] shadow-2xl transition-transform duration-500 animate-in slide-in-from-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              Maison de Sommellerie
            </span>
            <h2 className="font-serif text-2xl font-light tracking-wide text-[#FCFBF9]">
              Votre Sélection ({totalCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping gauge */}
        <div className="bg-[#161616] px-6 py-3 border-b border-white/5">
          <div className="flex justify-between text-xs text-neutral-300 mb-1.5">
            {isFreeShipping ? (
              <span className="text-[#C5A059] font-medium flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Livraison sécurisée & coffret offerts
              </span>
            ) : (
              <span>
                Plus que{" "}
                <strong className="text-[#C5A059]">
                  {missingForFreeShipping.toFixed(0)} €
                </strong>{" "}
                pour la livraison offerte
              </span>
            )}
            <span className="text-neutral-400">{progressRatio.toFixed(0)}%</span>
          </div>
          <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8E733E] to-[#C5A059] transition-all duration-500"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#C5A059]/20 bg-[#161616]">
                <span className="font-serif text-2xl text-[#C5A059]">LC</span>
              </div>
              <p className="font-serif text-xl text-neutral-200">
                Votre cave est vide
              </p>
              <p className="mt-2 text-xs text-neutral-400 max-w-xs leading-relaxed">
                Explorez nos cuvées de vignerons et les grands millésimes de
                prestige pour constituer votre collection.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 inline-flex items-center gap-2 border border-[#C5A059] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-all duration-300"
              >
                Découvrir la collection
              </button>
            </div>
          ) : (
            items.map(({ champagne, quantity }) => (
              <div key={champagne.id} className="flex gap-4 py-4 items-center">
                {/* Bottle authentic packshot */}
                <div className="relative h-24 w-16 flex-shrink-0 bg-[#171717] rounded-sm p-1 border border-white/5 overflow-hidden">
                  <Image
                    src={champagne.imageUrl}
                    alt={champagne.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block truncate">
                    {champagne.house}
                  </span>
                  <Link
                    href={`/champagnes/${champagne.slug}`}
                    onClick={closeCart}
                    className="font-serif text-sm font-normal text-neutral-100 hover:text-[#C5A059] transition-colors line-clamp-1"
                  >
                    {champagne.name}
                  </Link>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {champagne.vintage} • {champagne.dosage}
                  </p>
                  <p className="text-xs font-semibold text-neutral-200 mt-1">
                    {champagne.price} €{" "}
                    <span className="text-[10px] text-neutral-400 font-normal">
                      l&apos;unité
                    </span>
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center border border-white/10 rounded-xs bg-[#161616]">
                      <button
                        onClick={() =>
                          updateQuantity(champagne.id, quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-neutral-100">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(champagne.id, quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(champagne.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                      aria-label={`Supprimer ${champagne.name} du panier`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="text-right flex-shrink-0 self-start">
                  <span className="text-sm font-medium text-[#C5A059]">
                    {(champagne.price * quantity).toFixed(0)} €
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-[#141414] px-6 py-6 space-y-4">
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="text-neutral-100 font-medium">
                  {totalPrice.toFixed(0)} €
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Livraison sécurisée</span>
                <span>{isFreeShipping ? "Offerte" : "25 €"}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-[11px]">
                <span>TVA et accises incluses</span>
                <span>Régime fiscal français</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-base font-serif">
                <span className="text-neutral-200">Total estimé</span>
                <span className="text-[#C5A059] font-medium text-lg">
                  {(totalPrice + (isFreeShipping ? 0 : 25)).toFixed(0)} €
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 bg-[#C5A059] py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] hover:bg-[#DFC282] transition-colors"
            >
              <span>Accéder au paiement sécurisé</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-[11px] text-center text-neutral-500">
              Flacons garantis d&apos;origine • Température contrôlée
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
