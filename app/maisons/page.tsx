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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dom_P%C3%A9rignon_Champagne_2012.jpg?width=800",
    slug: "dom-perignon",
    badge: "Abbaye d'Hautvillers",
  },
  {
    name: "Maison Krug",
    foundation: "1843",
    city: "Reims",
    style: "Générosité opulente, vinification sous bois, assemblage de centaines de vins de réserve.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Champagne_Krug%2C_Penfolds_and_Bimbadgen_wines_%28Krug%29.jpg?width=800",
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
    <div className="bg-[#FBFAF6] min-h-screen py-12 sm:py-20 text-[#14150F]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
            Patrimoine &amp; Maisons Fondatrices
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#14150F] mt-3">
            Les Grandes Signatures de la Champagne
          </h1>
          <div className="w-12 h-[1px] bg-[#E3C47D]/55 mx-auto mt-6" />
          <p className="mt-6 text-xs sm:text-sm text-[#565C4E] leading-relaxed font-light">
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
              className="bg-white border border-[#2E4636]/10 hover:border-[#B08F4C]/45 transition-all duration-500 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#565C4E] mb-4 font-light">
                  <span className="text-[9px] uppercase tracking-widest text-[#755A22]">
                    Fondée en {house.foundation}
                  </span>
                  <span>{house.city}</span>
                </div>

                <div className="relative h-64 w-full bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] mb-6 p-4 border border-[#2E4636]/10">
                  <Image
                    src={house.image}
                    alt={house.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <h2 className="font-serif text-2xl font-light text-[#14150F]">
                  {house.name}
                </h2>
                <span className="inline-block mt-1 text-[9px] uppercase tracking-wider text-[#565C4E] border border-[#2E4636]/15 px-2 py-0.5 font-light">
                  {house.badge}
                </span>

                <p className="text-xs text-[#333A2F]/80 mt-4 leading-relaxed font-light">
                  {house.style}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#2E4636]/10">
                <Link
                  href={`/champagnes?house=${encodeURIComponent(house.name)}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#755A22] hover:text-[#14150F] transition-colors font-light"
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
