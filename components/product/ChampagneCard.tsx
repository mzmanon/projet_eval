"use client";

import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import type { Champagne } from "@/types/champagne";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/product/ProductImage";
import ProductReviews from "@/components/reviews/ProductReviews";

interface ChampagneCardProps {
  champagne: Champagne;
  /** Affiche l'espace commentaires et avis clients sous la carte. */
  showReviews?: boolean;
}

export default function ChampagneCard({
  champagne,
  showReviews = false,
}: ChampagneCardProps) {
  const { addItem, openProductDrawer } = useCart();

  return (
    <article className="product-card group flex flex-col border-t border-[#C8C1B4] bg-transparent pt-4">
      <Link
        href={`/champagnes/${champagne.slug}`}
        className="product-card-media relative block h-80 overflow-hidden bg-[#ECE8DF] p-7 sm:h-96"
        aria-label={`Découvrir ${champagne.name}`}
      >
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1">
          {champagne.isRare && (
            <span className="border border-[#A58C62] bg-[#FCFBF8]/90 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#171715]">
              Allocation rare
            </span>
          )}
          {champagne.score && (
            <span className="w-fit bg-[#171715]/90 px-2 py-1 font-mono text-[9px] text-[#FCFBF8]">
              {champagne.score}/100
            </span>
          )}
        </div>
        <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-[1.025]">
          <ProductImage
            src={champagne.imageUrl}
            alt={`${champagne.house} ${champagne.name}`}
            house={champagne.house}
            name={champagne.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A58C62]">
          {champagne.house}
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-none text-[#171715]">
          <Link href={`/champagnes/${champagne.slug}`}>{champagne.name}</Link>
        </h3>
        <p className="mt-3 text-xs text-[#827D75]">
          {champagne.vintage} · {champagne.dosage} · {champagne.format}
        </p>
        <div className="mt-6 flex items-end justify-between border-t border-[#DCD7CD] pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#827D75]">
              Le flacon
            </p>
            <p className="mt-1 font-serif text-2xl text-[#171715]">
              {champagne.price} €
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/champagnes/${champagne.slug}`}
              className="border-b border-[#171715] pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#171715]"
            >
              Détails
            </Link>
            <button
              onClick={() => openProductDrawer(champagne)}
              className="flex h-11 w-11 items-center justify-center border border-[#C8C1B4] text-[#171715] transition-colors hover:border-[#171715]"
              aria-label={`Sélectionner ${champagne.name}`}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => addItem(champagne, 1)}
              className="flex h-11 w-11 items-center justify-center border border-[#171715] text-[#171715] transition-colors hover:bg-[#171715] hover:text-[#FCFBF8]"
              aria-label={`Ajouter ${champagne.name} au panier`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showReviews && <ProductReviews champagneId={champagne.id} />}
    </article>
  );
}
