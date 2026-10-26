"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  FREE_SHIPPING_THRESHOLD,
  getFreeShippingProgress,
  getMissingAmountForFreeShipping,
  getShippingCost,
} from "@/lib/checkout/pricing";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    catalog,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalCount,
    addItem,
  } = useCart();

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const missingForFreeShipping = getMissingAmountForFreeShipping(totalPrice);
  const progressRatio = getFreeShippingProgress(totalPrice);
  const shippingCost = getShippingCost(totalPrice);
  const grandTotal = totalPrice + shippingCost;

  // Suggestions de cuvées lorsque le panier est vide ou pour compléter
  const suggestions = catalog.filter(
    (c) => !items.some((item) => item.champagne.id === c.id)
  ).slice(0, 3);

  return (
    <div className="luxury-page min-h-screen py-10 sm:py-16 text-[#FCFBF9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Fil d'Ariane & En-tête */}
        <div className="border-b border-white/10 pb-8 mb-10">
          <nav
            aria-label="Fil d'Ariane"
            className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-4"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>{" "}
            /{" "}
            <Link
              href="/champagnes"
              className="hover:text-white transition-colors"
            >
              La Collection
            </Link>{" "}
            / <span className="text-[#C5A059]">Mon Panier</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
                Maison de Sommellerie &bull; Épernay
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FCFBF9] mt-2">
                Votre Sélection de Champagnes
              </h1>
            </div>
            {items.length > 0 && (
              <p className="text-xs text-neutral-400 font-mono tracking-wider">
                {totalCount} {totalCount > 1 ? "flacons retenus" : "flacon retenu"}
              </p>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* PANIER VIDE */
          <div className="py-16 sm:py-24">
            <div className="max-w-xl mx-auto text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C5A059]/30 bg-[#121212]">
                <ShoppingBag className="h-8 w-8 text-[#C5A059]" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">
                  Cave Privée
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-200 font-light">
                  Votre panier est actuellement vide
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mx-auto">
                  Aucun article n&apos;a encore été sélectionné. Explorez notre
                  collection de grands crus, cuvées rares et millésimes de
                  prestige pour composer votre cave personnelle.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/champagnes"
                  className="inline-flex items-center gap-3 bg-[#C5A059] text-[#0A0A0A] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#DFC282] transition-colors"
                >
                  <span>Explorer le catalogue des champagnes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Suggestions de découverte */}
            {suggestions.length > 0 && (
              <div className="mt-20 pt-12 border-t border-white/10">
                <div className="text-center mb-8">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">
                    Sélection du Sommelier
                  </span>
                  <h3 className="font-serif text-2xl font-light text-neutral-200 mt-1">
                    Cuvées Recommandées
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {suggestions.map((champagne) => (
                    <div
                      key={champagne.id}
                      className="bg-[#121212] border border-white/5 p-5 flex flex-col justify-between hover:border-[#C5A059]/30 transition-colors"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="relative h-24 w-16 bg-[#181818] flex-shrink-0 p-1">
                          <Image
                            src={champagne.imageUrl}
                            alt={champagne.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-medium block">
                            {champagne.house}
                          </span>
                          <Link
                            href={`/champagnes/${champagne.slug}`}
                            className="font-serif text-sm text-neutral-100 hover:text-[#C5A059] transition-colors line-clamp-1"
                          >
                            {champagne.name}
                          </Link>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {champagne.vintage} &bull; {champagne.dosage}
                          </p>
                          <p className="text-sm font-semibold text-[#FCFBF9] mt-1">
                            {champagne.price} €
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <Link
                          href={`/champagnes/${champagne.slug}`}
                          className="text-[11px] text-neutral-400 hover:text-white uppercase tracking-wider"
                        >
                          Détails
                        </Link>
                        <button
                          onClick={() => addItem(champagne, 1)}
                          className="inline-flex items-center gap-1.5 bg-[#C5A059] text-[#0A0A0A] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider hover:bg-[#DFC282] transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Ajouter au panier</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PANIER AVEC ARTICLES SÉLECTIONNÉS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Colonne Principale : Liste détaillée des articles */}
            <div className="lg:col-span-8 space-y-6">
              {/* Jauge de livraison offerte */}
              <div className="bg-[#121212] border border-[#C5A059]/20 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-300 gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#C5A059]" />
                    {isFreeShipping ? (
                      <span className="text-[#C5A059] font-medium">
                        Félicitations ! Vous bénéficiez de la livraison offerte et
                        du coffret sécurisé.
                      </span>
                    ) : (
                      <span>
                        Ajoutez encore{" "}
                        <strong className="text-[#C5A059] font-semibold">
                          {missingForFreeShipping.toFixed(0)} €
                        </strong>{" "}
                        de cuvées pour bénéficier de la{" "}
                        <span className="text-[#C5A059]">livraison offerte</span>.
                      </span>
                    )}
                  </div>
                  <span className="text-neutral-400 font-mono self-end sm:self-auto">
                    {progressRatio.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8E733E] via-[#C5A059] to-[#DFC282] transition-all duration-500"
                    style={{ width: `${progressRatio}%` }}
                  />
                </div>
              </div>

              {/* Tableau / Carte des articles */}
              <div className="bg-[#121212] border border-white/5 divide-y divide-white/5">
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400 border-b border-white/5">
                  <span className="col-span-6">Article &amp; Millésime</span>
                  <span className="col-span-2 text-right">Prix Unitaire</span>
                  <span className="col-span-2 text-center">Quantité</span>
                  <span className="col-span-2 text-right">Total Article</span>
                </div>

                {items.map(({ champagne, quantity }) => {
                  const lineTotal = champagne.price * quantity;
                  return (
                    <article
                      key={champagne.id}
                      className="p-5 sm:px-6 sm:py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                    >
                      {/* Image & Détails du Champagne */}
                      <div className="col-span-6 w-full flex items-center gap-4">
                        <Link
                          href={`/champagnes/${champagne.slug}`}
                          className="relative h-28 w-20 flex-shrink-0 bg-[#181818] border border-white/5 p-2 rounded-xs group overflow-hidden"
                        >
                          <Image
                            src={champagne.imageUrl}
                            alt={`${champagne.house} ${champagne.name}`}
                            fill
                            sizes="80px"
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                            {champagne.house}
                          </span>
                          <Link
                            href={`/champagnes/${champagne.slug}`}
                            className="font-serif text-base sm:text-lg font-light text-neutral-100 hover:text-[#C5A059] transition-colors block truncate"
                          >
                            {champagne.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-neutral-400 mt-1">
                            <span>{champagne.vintage}</span>
                            <span>&bull;</span>
                            <span>{champagne.dosage}</span>
                            <span>&bull;</span>
                            <span>{champagne.format}</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                            {champagne.terroir}
                          </p>

                          {/* Bouton supprimer sur mobile */}
                          <button
                            onClick={() => removeItem(champagne.id)}
                            className="inline-flex sm:hidden items-center gap-1.5 text-xs text-neutral-400 hover:text-red-400 transition-colors mt-2"
                            aria-label={`Supprimer ${champagne.name} du panier`}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>

                      {/* Prix Unitaire */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex sm:block justify-between items-center sm:text-right border-t sm:border-0 border-white/5 pt-2 sm:pt-0">
                        <span className="text-xs text-neutral-400 sm:hidden">
                          Prix unitaire :
                        </span>
                        <div>
                          <span className="font-serif text-sm sm:text-base text-neutral-200">
                            {champagne.price} €
                          </span>
                          <span className="text-[10px] text-neutral-400 block sm:hidden">
                            / unité
                          </span>
                        </div>
                      </div>

                      {/* Sélecteur de Quantité */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex sm:justify-center justify-between items-center">
                        <span className="text-xs text-neutral-400 sm:hidden">
                          Quantité :
                        </span>
                        <div className="flex items-center border border-white/10 rounded-xs bg-[#161616]">
                          <button
                            onClick={() =>
                              updateQuantity(champagne.id, quantity - 1)
                            }
                            className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                            aria-label={`Diminuer la quantité de ${champagne.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-9 text-center font-mono text-xs font-medium text-neutral-100">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(champagne.id, quantity + 1)
                            }
                            className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                            aria-label={`Augmenter la quantité de ${champagne.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Total Article & Suppression Desktop */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex sm:flex-col justify-between items-end sm:text-right border-t sm:border-0 border-white/5 pt-2 sm:pt-0">
                        <span className="text-xs text-neutral-400 sm:hidden">
                          Total article :
                        </span>
                        <div>
                          <span className="font-serif text-base sm:text-lg font-medium text-[#C5A059]">
                            {lineTotal.toFixed(0)} €
                          </span>
                          <button
                            onClick={() => removeItem(champagne.id)}
                            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-red-400 transition-colors mt-1"
                            title="Supprimer cet article"
                            aria-label={`Supprimer ${champagne.name}`}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Retirer</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Actions en bas de liste */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <Link
                  href="/champagnes"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-[#C5A059] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Poursuivre la sélection de cuvées</span>
                </Link>

                <button
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-red-400 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Vider l&apos;intégralité du panier</span>
                </button>
              </div>
            </div>

            {/* Colonne Latérale : Récapitulatif & Total de la commande */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-[#121212] border border-[#C5A059]/30 p-6 sm:p-7 sticky top-28 space-y-6 shadow-xl">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
                    Récapitulatif
                  </span>
                  <h2 className="font-serif text-2xl font-light text-neutral-100 mt-1">
                    Total de la Commande
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs text-neutral-300 border-t border-b border-white/10 py-5">
                  {/* Nombre d'articles */}
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Articles sélectionnés</span>
                    <span className="font-mono text-neutral-200">
                      {totalCount} {totalCount > 1 ? "bouteilles" : "bouteille"}
                    </span>
                  </div>

                  {/* Sous-total des articles */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-300 font-medium">
                      Prix des articles (Sous-total)
                    </span>
                    <span className="font-serif font-medium text-neutral-100 text-base">
                      {totalPrice.toFixed(0)} €
                    </span>
                  </div>

                  {/* Frais de port */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-[#C5A059]" />
                      <span className="text-neutral-400">
                        Livraison sécurisée &amp; isotherme
                      </span>
                    </div>
                    <span>
                      {isFreeShipping ? (
                        <span className="text-[#C5A059] font-medium">Offerte</span>
                      ) : (
                        <span className="font-mono text-neutral-200">25 €</span>
                      )}
                    </span>
                  </div>

                  {/* Taxes */}
                  <div className="flex justify-between items-center text-[11px] text-neutral-400">
                    <span>TVA française (20%) &amp; accises</span>
                    <span>Incluses</span>
                  </div>

                  {/* Ligne TOTAL GÉNÉRAL */}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-neutral-300 block">
                        Prix Total à régler
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Flacons d&apos;origine garantis
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl sm:text-3xl font-medium text-[#C5A059]">
                        {grandTotal.toFixed(0)} €
                      </span>
                      <span className="text-[10px] text-neutral-400 block">
                        TTC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bouton de Passage à la caisse */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2.5 bg-[#C5A059] text-[#0A0A0A] py-4 px-6 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#DFC282] transition-all duration-300 shadow-lg text-center"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Procéder au paiement sécurisé</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <p className="text-[10px] text-center text-neutral-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>Transaction chiffrée SSL 256 bits &bull; Expédition discrète</span>
                  </p>
                </div>

                {/* Engagements de la Maison */}
                <div className="pt-4 border-t border-white/5 space-y-2.5 text-[11px] text-neutral-400">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                    <span>
                      Direct domaine ou négociant historique avec certificat d&apos;origine.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="h-3.5 w-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                    <span>
                      Emballage renforcé anti-chocs et anti-variations thermiques.
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
