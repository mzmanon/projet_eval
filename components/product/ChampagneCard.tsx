"use client";

import React from "react";
import Image from "next/image";
import { Champagne } from "@/types/champagne";
import { useCart } from "@/context/CartContext";
import { Eye } from "lucide-react";
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
  const { openProductDrawer } = useCart();

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    openProductDrawer(champagne);
  };

  return (
    <article className="group relative flex flex-col bg-white border border-[#2E4636]/10 hover:border-[#B08F4C]/35 transition-all duration-500 overflow-hidden">
      {/* Badges discrets et aériens */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {champagne.isRare && (
          <span className="border border-[#B08F4C]/55 bg-[#FBFAF6]/85 backdrop-blur-sm text-[#755A22] text-[9px] uppercase tracking-[0.22em] font-normal px-2.5 py-0.5">
            Cuvée Rare
          </span>
        )}
        {champagne.score && (
          <span className="border border-[#2E4636]/15 bg-[#FBFAF6]/85 backdrop-blur-sm text-[#333A2F] text-[10px] font-mono px-2 py-0.5">
            {champagne.score}/100
          </span>
        )}
      </div>

      {/* Bottle Image Pedestal - Fond lumineux champagne feutré */}
      <button
        type="button"
        onClick={handleSelect}
        className="relative block h-80 sm:h-96 w-full p-8 bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] overflow-hidden text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#B08F4C]/40"
        aria-label={`Sélectionner ${champagne.house} ${champagne.name} et ouvrir la fiche détaillée`}
      >
        <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <Image
            src={champagne.imageUrl}
            alt={`${champagne.house} ${champagne.name} - Photographie authentique`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-[#FBFAF6] via-[#FBFAF6]/85 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] text-[#755A22] font-normal bg-[#FBFAF6]/92 border border-[#B08F4C]/45 px-3.5 py-1 backdrop-blur-sm">
            <Eye className="h-3 w-3" />
            <span>Consulter ce flacon</span>
          </span>
        </div>
      </button>

      {/* Card Content — Typographie éditoriale haute horlogerie */}
      <div className="flex flex-1 flex-col p-6 sm:p-7 justify-between bg-white">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#755A22] font-normal block">
            {champagne.house}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-light text-[#14150F] mt-1.5 group-hover:text-[#755A22] transition-colors">
            <button
              type="button"
              onClick={handleSelect}
              className="text-left hover:underline focus:outline-none cursor-pointer"
            >
              {champagne.name}
            </button>
          </h3>
          <p className="text-xs text-[#565C4E]/90 mt-1.5 flex items-center gap-2 font-light">
            <span>{champagne.vintage}</span>
            <span>•</span>
            <span>{champagne.dosage}</span>
            <span>•</span>
            <span className="truncate">{champagne.terroir.split(",")[0]}</span>
          </p>
          <p className="text-xs text-[#565C4E] mt-3 line-clamp-2 leading-relaxed font-light">
            {champagne.description}
          </p>
        </div>

        <div className="pt-5 mt-5 border-t border-[#2E4636]/10 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#565C4E] block font-light">
              Prix unitaire
            </span>
            <span className="font-serif text-xl font-light text-[#14150F]">
              {champagne.price} €
            </span>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSelect}
              className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-light text-[#14150F] border border-[#2E4636]/20 hover:border-[#B08F4C] hover:text-[#755A22] bg-[#2E4636]/[0.05] hover:bg-[#E3C47D]/10 transition-all duration-300 cursor-pointer"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>

      {showReviews && <ProductReviews champagneId={champagne.id} />}
    </article>
  );
}
