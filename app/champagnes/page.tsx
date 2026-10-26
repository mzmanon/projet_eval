"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CHAMPAGNES } from "@/lib/data/champagnes";
import ChampagneCard from "@/components/product/ChampagneCard";
import { Filter, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function ChampagnesCatalogPage() {
  const [selectedHouse, setSelectedHouse] = useState<string>("all");
  const [selectedDosage, setSelectedDosage] = useState<string>("all");
  const [rareOnly, setRareOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Liste unique des maisons
  const houses = useMemo(() => {
    return Array.from(new Set(CHAMPAGNES.map((c) => c.house)));
  }, []);

  // Filtrage et tri
  const filteredChampagnes = useMemo(() => {
    return CHAMPAGNES.filter((champagne) => {
      if (selectedHouse !== "all" && champagne.house !== selectedHouse) {
        return false;
      }
      if (selectedDosage !== "all" && champagne.dosage !== selectedDosage) {
        return false;
      }
      if (rareOnly && !champagne.isRare) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      return 0;
    });
  }, [selectedHouse, selectedDosage, rareOnly, sortBy]);

  const resetFilters = () => {
    setSelectedHouse("all");
    setSelectedDosage("all");
    setRareOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="luxury-page min-h-screen py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb & Header */}
        <div className="border-b border-white/10 pb-10">
          <nav className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>{" "}
            / <span className="text-[#C5A059]">La Collection</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
                Cave &amp; Allocations
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#FCFBF9] mt-2">
                Le Catalogue des Grands Champagnes
              </h1>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Flacons conservés dans des conditions de fraîcheur et
              d&apos;hygrométrie de crayère. Provenance vérifiée et scellée.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="my-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 bg-[#111111] border border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 mr-2">
              <Filter className="h-3.5 w-3.5 text-[#C5A059]" />
              <span>Filtres :</span>
            </div>

            {/* House filter */}
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="bg-[#181818] border border-white/10 text-neutral-200 text-xs py-2 px-3 focus:outline-none focus:border-[#C5A059] transition-colors"
              aria-label="Filtrer par Maison"
            >
              <option value="all">Toutes les Maisons</option>
              {houses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>

            {/* Dosage filter */}
            <select
              value={selectedDosage}
              onChange={(e) => setSelectedDosage(e.target.value)}
              className="bg-[#181818] border border-white/10 text-neutral-200 text-xs py-2 px-3 focus:outline-none focus:border-[#C5A059] transition-colors"
              aria-label="Filtrer par Dosage"
            >
              <option value="all">Tous les Dosages</option>
              <option value="Brut">Brut</option>
              <option value="Extra-Brut">Extra-Brut</option>
            </select>

            {/* Rare toggle */}
            <button
              onClick={() => setRareOnly((prev) => !prev)}
              className={`text-xs px-3 py-2 border transition-colors ${
                rareOnly
                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                  : "border-white/10 text-neutral-400 hover:text-white"
              }`}
            >
              Cuvées Rares Uniquement
            </button>

            {(selectedHouse !== "all" || selectedDosage !== "all" || rareOnly) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#C5A059] transition-colors ml-2"
                title="Réinitialiser les filtres"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Effacer</span>
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3 w-3 text-[#C5A059]" />
              Trier par :
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181818] border border-white/10 text-neutral-200 text-xs py-2 px-3 focus:outline-none focus:border-[#C5A059] transition-colors"
              aria-label="Trier le catalogue"
            >
              <option value="featured">Sélection de la Maison</option>
              <option value="price-asc">Prix : croissant</option>
              <option value="price-desc">Prix : décroissant</option>
              <option value="score">Note dégustation (Score)</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8 text-xs text-neutral-400">
          <span>
            Affichage de{" "}
            <strong className="text-neutral-200 font-medium">
              {filteredChampagnes.length}
            </strong>{" "}
            cuvée{filteredChampagnes.length > 1 ? "s" : ""} d&apos;exception
          </span>
        </div>

        {/* Catalog Grid */}
        {filteredChampagnes.length === 0 ? (
          <div className="bg-[#111111] border border-white/5 py-24 text-center p-8">
            <h3 className="font-serif text-2xl text-neutral-200 font-light">
              Aucune cuvée ne correspond à vos critères
            </h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto">
              Veuillez ajuster ou réinitialiser vos filtres pour découvrir notre
              collection.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 border border-[#C5A059] px-6 py-2.5 text-xs uppercase tracking-widest text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredChampagnes.map((champagne) => (
              <ChampagneCard key={champagne.id} champagne={champagne} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
