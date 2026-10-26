"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { CHAMPAGNES } from "@/lib/data/champagnes";
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
  Lock,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalCount,
    addItem,
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
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 25;
  const grandTotal = totalPrice + shippingCost;

  const suggestions = CHAMPAGNES.filter(
    (c) => !items.some((item) => item.champagne.id === c.id)
  ).slice(0, 3);

  return (
    <div className="bg-[#FBFAF6] min-h-screen py-10 sm:py-16 text-[#14150F]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Fil d'Ariane & En-tête */}
        <div className="border-b border-[#2E4636]/12 pb-8 mb-10">
          <nav
            aria-label="Fil d'Ariane"
            className="text-[10px] uppercase tracking-[0.22em] text-[#565C4E] mb-4 font-light"
          >
            <Link href="/" className="hover:text-[#2E4636] transition-colors">
              Accueil
            </Link>{" "}
            /{" "}
            <Link
              href="/champagnes"
              className="hover:text-[#2E4636] transition-colors"
            >
              La Collection
            </Link>{" "}
            / <span className="text-[#755A22]">Mon Panier</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
                Maison de Sommellerie &bull; Épernay
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#14150F] mt-2">
                Votre Sélection de Champagnes
              </h1>
            </div>
            {items.length > 0 && (
              <p className="text-xs text-[#565C4E] font-mono tracking-wider font-light">
                {totalCount} {totalCount > 1 ? "flacons retenus" : "flacon retenu"}
              </p>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* PANIER VIDE */
          <div className="py-16 sm:py-24">
            <div className="max-w-xl mx-auto text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#2E4636]/15 bg-[#F4F7EE]">
                <ShoppingBag className="h-8 w-8 text-[#755A22] stroke-1" />
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#755A22] font-light">
                  Cave Privée
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#22271F] font-light">
                  Votre panier est actuellement vide
                </h2>
                <p className="text-xs sm:text-sm text-[#565C4E] leading-relaxed max-w-md mx-auto font-light">
                  Aucun article n&apos;a encore été sélectionné. Explorez notre
                  collection de grands crus, cuvées rares et millésimes de
                  prestige pour composer votre cave personnelle.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/champagnes"
                  className="inline-flex items-center gap-3 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-normal hover:bg-[#EFD9A2] transition-colors"
                >
                  <span>Explorer le catalogue des champagnes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Suggestions de découverte */}
            {suggestions.length > 0 && (
              <div className="mt-20 pt-12 border-t border-[#2E4636]/12">
                <div className="text-center mb-8">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#755A22] font-light">
                    Sélection du Sommelier
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#22271F] mt-1">
                    Cuvées Recommandées
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {suggestions.map((champagne) => (
                    <div
                      key={champagne.id}
                      className="bg-white border border-[#2E4636]/10 p-5 flex flex-col justify-between hover:border-[#B08F4C]/45 transition-colors"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="relative h-24 w-16 bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] flex-shrink-0 p-1">
                          <Image
                            src={champagne.imageUrl}
                            alt={champagne.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#755A22] font-normal block">
                            {champagne.house}
                          </span>
                          <Link
                            href={`/champagnes/${champagne.slug}`}
                            className="font-serif text-sm text-[#1B1F18] hover:text-[#755A22] transition-colors line-clamp-1 font-light"
                          >
                            {champagne.name}
                          </Link>
                          <p className="text-xs text-[#565C4E] mt-0.5 font-light">
                            {champagne.vintage} &bull; {champagne.dosage}
                          </p>
                          <p className="text-sm font-light text-[#14150F] mt-1 font-serif">
                            {champagne.price} €
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#2E4636]/10 flex items-center justify-between text-xs">
                        <Link
                          href={`/champagnes/${champagne.slug}`}
                          className="text-[10px] text-[#565C4E] hover:text-[#2E4636] uppercase tracking-wider font-light"
                        >
                          Détails
                        </Link>
                        <button
                          onClick={() => addItem(champagne, 1)}
                          className="inline-flex items-center gap-1.5 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-3 py-1.5 text-[10px] font-normal uppercase tracking-wider hover:bg-[#EFD9A2] transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Ajouter</span>
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
              {/* Jauge fine de livraison offerte */}
              <div className="bg-white border border-[#2E4636]/12 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#333A2F] gap-2 mb-2 font-light">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#755A22] stroke-1" />
                    {isFreeShipping ? (
                      <span className="text-[#755A22]">
                        Félicitations ! Vous bénéficiez de l&apos;expédition offerte et du coffret sécurisé.
                      </span>
                    ) : (
                      <span>
                        Ajoutez encore{" "}
                        <strong className="text-[#755A22] font-normal font-mono">
                          {missingForFreeShipping.toFixed(0)} €
                        </strong>{" "}
                        de cuvées pour bénéficier de la{" "}
                        <span className="text-[#755A22]">livraison offerte</span>.
                      </span>
                    )}
                  </div>
                  <span className="text-[#565C4E] font-mono self-end sm:self-auto text-[11px]">
                    {progressRatio.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 w-full bg-[#DDE5D3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E3C47D] transition-all duration-500"
                    style={{ width: `${progressRatio}%` }}
                  />
                </div>
              </div>

              {/* Tableau / Carte des articles */}
              <div className="bg-white border border-[#2E4636]/10 divide-y divide-[#2E4636]/10">
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 text-[9px] uppercase tracking-[0.22em] text-[#565C4E] border-b border-[#2E4636]/10 font-light">
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
                          className="relative h-28 w-20 flex-shrink-0 bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] border border-[#2E4636]/12 p-2 group overflow-hidden"
                        >
                          <Image
                            src={champagne.imageUrl}
                            alt={`${champagne.house} ${champagne.name}`}
                            fill
                            sizes="80px"
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        <div className="flex-1 min-w-0 font-light">
                          <span className="text-[9px] uppercase tracking-widest text-[#755A22] font-normal block">
                            {champagne.house}
                          </span>
                          <Link
                            href={`/champagnes/${champagne.slug}`}
                            className="font-serif text-base sm:text-lg font-light text-[#1B1F18] hover:text-[#755A22] transition-colors block truncate"
                          >
                            {champagne.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#565C4E] mt-1">
                            <span>{champagne.vintage}</span>
                            <span>&bull;</span>
                            <span>{champagne.dosage}</span>
                            <span>&bull;</span>
                            <span>{champagne.format}</span>
                          </div>
                          <p className="text-[11px] text-[#585F50] mt-0.5 truncate">
                            {champagne.terroir}
                          </p>

                          {/* Bouton supprimer sur mobile */}
                          <button
                            onClick={() => removeItem(champagne.id)}
                            className="inline-flex sm:hidden items-center gap-1.5 text-xs text-[#565C4E] hover:text-[#A3352B] transition-colors mt-2"
                            aria-label={`Supprimer ${champagne.name} du panier`}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>

                      {/* Prix Unitaire */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex sm:block justify-between items-center sm:text-right border-t sm:border-0 border-[#2E4636]/10 pt-2 sm:pt-0 font-light">
                        <span className="text-xs text-[#565C4E] sm:hidden">
                          Prix unitaire :
                        </span>
                        <div>
                          <span className="font-serif text-sm sm:text-base text-[#22271F]">
                            {champagne.price} €
                          </span>
                        </div>
                      </div>

                      {/* Sélecteur de Quantité */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex sm:justify-center justify-between items-center">
                        <span className="text-xs text-[#565C4E] sm:hidden font-light">
                          Quantité :
                        </span>
                        <div className="flex items-center border border-[#2E4636]/15 bg-[#FBFAF6]">
                          <button
                            onClick={() =>
                              updateQuantity(champagne.id, quantity - 1)
                            }
                            className="h-8 w-8 flex items-center justify-center text-[#565C4E] hover:text-[#2E4636] transition-colors"
                            aria-label={`Diminuer la quantité de ${champagne.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-normal text-[#1B1F18]">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(champagne.id, quantity + 1)
                            }
                            className="h-8 w-8 flex items-center justify-center text-[#565C4E] hover:text-[#2E4636] transition-colors"
                            aria-label={`Augmenter la quantité de ${champagne.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total Article & Suppression Desktop */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex sm:flex-col justify-between items-end sm:text-right border-t sm:border-0 border-[#2E4636]/10 pt-2 sm:pt-0">
                        <span className="text-xs text-[#565C4E] sm:hidden font-light">
                          Total article :
                        </span>
                        <div>
                          <span className="font-serif text-base sm:text-lg font-light text-[#755A22]">
                            {lineTotal.toFixed(0)} €
                          </span>
                          <button
                            onClick={() => removeItem(champagne.id)}
                            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#585F50] hover:text-[#A3352B] transition-colors mt-1 font-light"
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 font-light">
                <Link
                  href="/champagnes"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#333A2F] hover:text-[#755A22] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Poursuivre la sélection de cuvées</span>
                </Link>

                <button
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 text-xs text-[#565C4E] hover:text-[#A3352B] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Vider le panier</span>
                </button>
              </div>
            </div>

            {/* Colonne Latérale : Récapitulatif & Total de la commande */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#2E4636]/14 p-6 sm:p-7 sticky top-28 space-y-6">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#755A22] font-normal block">
                    Récapitulatif
                  </span>
                  <h2 className="font-serif text-2xl font-light text-[#1B1F18] mt-1">
                    Total de la Commande
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs text-[#333A2F] border-t border-b border-[#2E4636]/12 py-5 font-light">
                  <div className="flex justify-between items-center">
                    <span className="text-[#565C4E]">Articles sélectionnés</span>
                    <span className="font-mono text-[#22271F]">
                      {totalCount} {totalCount > 1 ? "bouteilles" : "bouteille"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#333A2F]">
                      Sous-total
                    </span>
                    <span className="font-serif font-light text-[#1B1F18] text-base">
                      {totalPrice.toFixed(0)} €
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
                      <span className="text-[#565C4E]">
                        Expédition isotherme
                      </span>
                    </div>
                    <span>
                      {isFreeShipping ? (
                        <span className="text-[#755A22]">Offerte</span>
                      ) : (
                        <span className="font-mono text-[#22271F]">25 €</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-[#565C4E]">
                    <span>TVA française (20%) &amp; accises</span>
                    <span>Incluses</span>
                  </div>

                  <div className="pt-4 border-t border-[#2E4636]/12 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#333A2F] block">
                        Prix Total à régler
                      </span>
                      <span className="text-[10px] text-[#565C4E]">
                        Flacons d&apos;origine garantis
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl sm:text-3xl font-light text-[#755A22]">
                        {grandTotal.toFixed(0)} €
                      </span>
                      <span className="text-[10px] text-[#565C4E] block">
                        TTC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bouton de Passage à la caisse */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2.5 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] py-3.5 px-6 text-xs font-normal uppercase tracking-[0.22em] hover:bg-[#EFD9A2] transition-all duration-300 shadow-md text-center"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Procéder au paiement sécurisé</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <p className="text-[10px] text-center text-[#565C4E] flex items-center justify-center gap-1.5 font-light">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
                    <span>Transaction chiffrée SSL 256 bits &bull; Expédition discrète</span>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
