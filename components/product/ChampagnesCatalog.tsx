"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ChampagneCard from "@/components/product/ChampagneCard";
import type { Champagne } from "@/types/champagne";
import { Filter, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function ChampagnesCatalog({ champagnes }: { champagnes: Champagne[] }) {
  const [selectedHouse, setSelectedHouse] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Liste unique des maisons
  const houses = useMemo(() => {
    return Array.from(new Set(champagnes.map((c) => c.house)));
  }, [champagnes]);

  // Filtrage et tri
  const filteredChampagnes = useMemo(() => {
    return champagnes.filter((champagne) => {
      if (selectedHouse !== "all" && champagne.house !== selectedHouse) {
        return false;
      }
      if (selectedCategory !== "all" && champagne.category !== selectedCategory) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name, "fr");
    });
  }, [champagnes, selectedHouse, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSelectedHouse("all");
    setSelectedCategory("all");
    setSortBy("name");
  };

  return (
    <div className="luxury-page min-h-screen py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb & Header */}
        <div className="border-b border-[#2E4636]/12 pb-10">
          <nav className="text-[10px] uppercase tracking-[0.22em] text-[#565C4E] mb-4 font-light">
            <Link href="/" className="hover:text-[#2E4636] transition-colors">
              Accueil
            </Link>{" "}
            / <span className="text-[#755A22]">La Collection</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
                Cave &amp; Allocations
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#14150F] mt-2">
                Le Catalogue des Grands Champagnes
              </h1>
            </div>
            <p className="text-xs text-[#565C4E] max-w-md leading-relaxed font-light">
              Flacons conservés dans la fraîcheur et l&apos;hygrométrie naturelle des
              crayères séculaires d&apos;Épernay. Provenance vérifiée et scellée.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar — Allégée et fluide */}
        <div className="my-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 sm:p-4 bg-white border border-[#2E4636]/10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#565C4E] mr-2 font-light">
              <Filter className="h-3 w-3 text-[#755A22]" />
              <span>Filtres :</span>
            </div>

            {/* House filter */}
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="bg-[#FBFAF6] border border-[#2E4636]/15 text-[#22271F] text-xs py-2 px-3 focus:outline-none focus:border-[#B08F4C] transition-colors font-light"
              aria-label="Filtrer par Maison"
            >
              <option value="all">Toutes les Maisons</option>
              {houses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>

            {/* Product category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FBFAF6] border border-[#2E4636]/15 text-[#22271F] text-xs py-2 px-3 focus:outline-none focus:border-[#B08F4C] transition-colors font-light"
              aria-label="Filtrer par catégorie"
            >
              <option value="all">Toutes les catégories</option>
              {Array.from(new Set(champagnes.map((champagne) => champagne.category).filter((category): category is string => Boolean(category)))).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {(selectedHouse !== "all" || selectedCategory !== "all") && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-[#565C4E] hover:text-[#755A22] transition-colors ml-2 font-light"
                title="Réinitialiser les filtres"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Effacer</span>
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[#565C4E] flex items-center gap-1.5 font-light">
              <SlidersHorizontal className="h-3 w-3 text-[#755A22]" />
              Trier par :
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FBFAF6] border border-[#2E4636]/15 text-[#22271F] text-xs py-2 px-3 focus:outline-none focus:border-[#B08F4C] transition-colors font-light"
              aria-label="Trier le catalogue"
            >
              <option value="name">Nom</option>
              <option value="price-asc">Prix : croissant</option>
              <option value="price-desc">Prix : décroissant</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#565C4E] font-light">
          <span>
            Affichage de{" "}
            <strong className="text-[#22271F] font-medium">
              {filteredChampagnes.length}
            </strong>{" "}
            cuvée{filteredChampagnes.length > 1 ? "s" : ""} d&apos;exception
          </span>
        </div>

        {/* Catalog Grid */}
        {filteredChampagnes.length === 0 ? (
          <div className="bg-white border border-[#2E4636]/10 py-24 text-center p-8">
            <h3 className="font-serif text-2xl text-[#22271F] font-light">
              Aucune cuvée ne correspond à vos critères
            </h3>
            <p className="text-xs text-[#565C4E] mt-2 max-w-sm mx-auto font-light">
              Veuillez ajuster ou réinitialiser vos filtres pour découvrir notre
              collection.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 border border-[#B08F4C] px-6 py-2.5 text-xs uppercase tracking-widest text-[#755A22] hover:bg-[#E3C47D] hover:text-[#14150F] transition-colors font-light"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredChampagnes.map((champagne) => (
              <ChampagneCard
                key={champagne.id}
                champagne={champagne}
                showReviews
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
