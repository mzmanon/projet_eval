"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Champagne } from "@/types/champagne";
import { useCart } from "@/context/CartContext";
import { Plus } from "lucide-react";

interface ChampagneCardProps {
  champagne: Champagne;
}

export default function ChampagneCard({ champagne }: ChampagneCardProps) {
  const { addItem } = useCart();

  return (
    <article className="group relative flex flex-col bg-[#0F0F0F] border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {champagne.isRare && (
          <span className="bg-[#C5A059] text-[#0A0A0A] text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1">
            Cuvée Rare
          </span>
        )}
        {champagne.score && (
          <span className="bg-[#181818]/90 backdrop-blur-sm border border-white/10 text-neutral-300 text-[10px] font-mono px-2 py-0.5">
            {champagne.score}/100
          </span>
        )}
      </div>

      {/* Bottle Image Container - Strict Respect of Bottle Integrity */}
      <Link
        href={`/champagnes/${champagne.slug}`}
        className="relative block h-80 sm:h-96 w-full p-8 bg-[#141414] overflow-hidden"
      >
        <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
          <Image
            src={champagne.imageUrl}
            alt={`${champagne.house} ${champagne.name} - Photographie authentique`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7 justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
            {champagne.house}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-light text-[#FCFBF9] mt-1 group-hover:text-[#DFC282] transition-colors">
            <Link href={`/champagnes/${champagne.slug}`}>
              {champagne.name}
            </Link>
          </h3>
          <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-2">
            <span>{champagne.vintage}</span>
            <span>•</span>
            <span>{champagne.dosage}</span>
            <span>•</span>
            <span className="truncate">{champagne.terroir.split(",")[0]}</span>
          </p>
          <p className="text-xs text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
            {champagne.description}
          </p>
        </div>

        <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
              Prix unitaire
            </span>
            <span className="font-serif text-xl font-normal text-[#FCFBF9]">
              {champagne.price} €
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/champagnes/${champagne.slug}`}
              className="px-3.5 py-2 text-[11px] uppercase tracking-wider text-neutral-300 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
            >
              Découvrir
            </Link>
            <button
              onClick={() => addItem(champagne)}
              className="flex h-9 w-9 items-center justify-center bg-[#C5A059] text-[#0A0A0A] hover:bg-[#DFC282] transition-colors"
              aria-label={`Ajouter ${champagne.name} au panier`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
