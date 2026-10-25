"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Champagne } from "@/types/champagne";
import { useCart } from "@/context/CartContext";
import { Plus, Eye } from "lucide-react";

interface ChampagneCardProps {
  champagne: Champagne;
}

export default function ChampagneCard({ champagne }: ChampagneCardProps) {
  const { openProductDrawer } = useCart();

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    openProductDrawer(champagne);
  };

  return (
    <article className="group relative flex flex-col bg-[#0F0F0F] border border-white/5 hover:border-[#C5A059]/40 transition-all duration-500 overflow-hidden shadow-lg">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
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

      {/* Bottle Image Container - Opens Right Selection Drawer on Click */}
      <button
        type="button"
        onClick={handleSelect}
        className="relative block h-80 sm:h-96 w-full p-8 bg-[#141414] overflow-hidden text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
        aria-label={`Sélectionner ${champagne.house} ${champagne.name} et ouvrir la fiche détaillée`}
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

        {/* Hover overlay hint */}
        <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium bg-[#111111]/90 border border-[#C5A059]/30 px-3 py-1">
            <Eye className="h-3.5 w-3.5" />
            <span>Sélectionner &amp; Découvrir</span>
          </span>
        </div>
      </button>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7 justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
            {champagne.house}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-light text-[#FCFBF9] mt-1 group-hover:text-[#DFC282] transition-colors">
            <button
              type="button"
              onClick={handleSelect}
              className="text-left hover:underline focus:outline-none"
            >
              {champagne.name}
            </button>
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
            {/* Bouton de sélection ouvrant le volet à droite */}
            <button
              type="button"
              onClick={handleSelect}
              className="px-3.5 py-2 text-[11px] uppercase tracking-wider text-neutral-200 hover:text-white bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 hover:border-[#C5A059]/40 transition-colors cursor-pointer"
            >
              Sélectionner
            </button>

            {/* Bouton Plus ouvrant le tiroir pour choisir la quantité */}
            <button
              type="button"
              onClick={handleSelect}
              className="flex h-9 w-9 items-center justify-center bg-[#C5A059] text-[#0A0A0A] hover:bg-[#DFC282] transition-colors cursor-pointer"
              aria-label={`Choisir la quantité pour ${champagne.name}`}
              title="Choisir le nombre de flacons"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
