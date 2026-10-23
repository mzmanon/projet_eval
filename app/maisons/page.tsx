import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Les Maisons de Prestige | LA CAVE — Haute Champagne",
  description:
    "Découvrez les maisons historiques de la Champagne : Dom Pérignon, Maison Krug, Louis Roederer, Ruinart, Taittinger, Bollinger, Salon, Billecart-Salmon.",
};

const HOUSES = [
  {
    name: "Dom Pérignon",
    foundation: "1668",
    city: "Épernay / Hautvillers",
    style: "Tension, minéralité calcaire, complexité toastée et longévité absolue.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Dom_P%C3%A9rignon_Champagne_2012.jpg/800px-Dom_P%C3%A9rignon_Champagne_2012.jpg",
    slug: "dom-perignon",
    badge: "Abbaye d'Hautvillers",
  },
  {
    name: "Maison Krug",
    foundation: "1843",
    city: "Reims",
    style: "Générosité opulente, vinification sous bois, assemblage de centaines de vins de réserve.",
    image:
      "https://images.unsplash.com/photo-1594488518063-8a304856019b?auto=format&fit=crop&w=800&q=80",
    slug: "krug",
    badge: "Orfèvrerie de l'Assemblage",
  },
  {
    name: "Louis Roederer",
    foundation: "1776",
    city: "Reims",
    style: "Pureté cristalline, viticulture en biodynamie, cuvée mythique Cristal.",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    slug: "louis-roederer",
    badge: "Maison Indépendante",
  },
  {
    name: "Maison Ruinart",
    foundation: "1729",
    city: "Reims",
    style: "La plus ancienne maison de Champagne. Célébration éclatante du Chardonnay.",
    image:
      "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80",
    slug: "ruinart",
    badge: "Première Maison Fondée",
  },
  {
    name: "Champagne Salon",
    foundation: "1905",
    city: "Le Mesnil-sur-Oger",
    style: "Un seul cépage, un seul cru d'exception, un seul millésime remarquable. Le mythe ultime.",
    image:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=800&q=80",
    slug: "salon",
    badge: "Rareté Absolue",
  },
  {
    name: "Champagne Bollinger",
    foundation: "1829",
    city: "Aÿ",
    style: "Puissance et vinosité du Pinot Noir d'Aÿ, vieillissement sous liège en petits fûts de chêne.",
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80",
    slug: "bollinger",
    badge: "Tradition Artisanale",
  },
];

export default function MaisonsPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
            Patrimoine &amp; Maisons Fondatrices
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#FCFBF9] mt-3">
            Les Grandes Signatures de la Champagne
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mt-6" />
          <p className="mt-6 text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
            Découvrez l&apos;histoire singulière, la vision stylistique et la
            philosophie d&apos;élaboration des plus prestigieuses maisons
            sélectionnées par LA CAVE.
          </p>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOUSES.map((house) => (
            <article
              key={house.name}
              className="bg-[#121212] border border-white/5 hover:border-[#C5A059]/30 transition-all duration-500 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                    Fondée en {house.foundation}
                  </span>
                  <span>{house.city}</span>
                </div>

                <div className="relative h-64 w-full bg-[#161616] mb-6 p-4 border border-white/5">
                  <Image
                    src={house.image}
                    alt={house.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <h2 className="font-serif text-2xl font-light text-[#FCFBF9]">
                  {house.name}
                </h2>
                <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-neutral-400 bg-white/5 px-2 py-0.5">
                  {house.badge}
                </span>

                <p className="text-xs text-neutral-300 mt-4 leading-relaxed font-light">
                  {house.style}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <Link
                  href={`/champagnes?house=${encodeURIComponent(house.name)}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#DFC282] transition-colors"
                >
                  <span>Explorer les cuvées de la Maison</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
