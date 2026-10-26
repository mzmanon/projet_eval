import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EditorialImage from "@/components/media/EditorialImage";

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
    slug: "dom-perignon",
    badge: "Abbaye d'Hautvillers",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Marne_Hautvillers_Forets_et_Vignes_22062016_-_panoramio_%282%29.jpg",
    imageAlt: "Forêts et vignes autour de Hautvillers en Champagne",
    imageCaption: "Hautvillers, paysage viticole",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Marne_Hautvillers_Forets_et_Vignes_22062016_-_panoramio_(2).jpg",
    credit: "rene boulay, CC BY-SA 3.0",
    imagePosition: "object-[center_45%]",
  },
  {
    name: "Maison Krug",
    foundation: "1843",
    city: "Reims",
    style: "Générosité opulente, vinification sous bois, assemblage de centaines de vins de réserve.",
    slug: "krug",
    badge: "Orfèvrerie de l'Assemblage",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Clos_du_Mesnil_20111029.jpg",
    imageAlt: "Vignoble du Clos du Mesnil en Champagne",
    imageCaption: "Le Mesnil-sur-Oger, paysage viticole",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Clos_du_Mesnil_20111029.jpg",
    credit: "Tomas e, CC BY-SA 3.0",
    imagePosition: "object-center",
  },
  {
    name: "Louis Roederer",
    foundation: "1776",
    city: "Reims",
    style: "Pureté cristalline, viticulture en biodynamie, cuvée mythique Cristal.",
    slug: "louis-roederer",
    badge: "Maison Indépendante",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Vignobles de Champagne, photographie éditoriale",
    imageCaption: "Vue éditoriale de Champagne",
    creditUrl: "https://help.unsplash.com/en/articles/2612315-can-i-use-unsplash-images-for-personal-or-commercial-projects",
    credit: "Source Unsplash",
    imagePosition: "object-center",
  },
  {
    name: "Maison Ruinart",
    foundation: "1729",
    city: "Reims",
    style: "La plus ancienne maison de Champagne. Célébration éclatante du Chardonnay.",
    slug: "ruinart",
    badge: "Première Maison Fondée",
    image: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Vignobles de Champagne, photographie éditoriale",
    imageCaption: "Vue éditoriale de Champagne",
    creditUrl: "https://help.unsplash.com/en/articles/2612315-can-i-use-unsplash-images-for-personal-or-commercial-projects",
    credit: "Source Unsplash",
    imagePosition: "object-center",
  },
  {
    name: "Champagne Salon",
    foundation: "1905",
    city: "Le Mesnil-sur-Oger",
    style: "Un seul cépage, un seul cru d'exception, un seul millésime remarquable. Le mythe ultime.",
    slug: "salon",
    badge: "Rareté Absolue",
    image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Coteaux de Champagne, photographie éditoriale",
    imageCaption: "Vue éditoriale de Champagne",
    creditUrl: "https://help.unsplash.com/en/articles/2612315-can-i-use-unsplash-images-for-personal-or-commercial-projects",
    credit: "Source Unsplash",
    imagePosition: "object-center",
  },
  {
    name: "Champagne Bollinger",
    foundation: "1829",
    city: "Aÿ",
    style: "Puissance et vinosité du Pinot Noir d'Aÿ, vieillissement sous liège en petits fûts de chêne.",
    slug: "bollinger",
    badge: "Tradition Artisanale",
    image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Vignobles de Champagne, photographie éditoriale",
    imageCaption: "Vue éditoriale de Champagne",
    creditUrl: "https://help.unsplash.com/en/articles/2612315-can-i-use-unsplash-images-for-personal-or-commercial-projects",
    credit: "Source Unsplash",
    imagePosition: "object-center",
  },
];

export default function MaisonsPage() {
  return (
    <div className="luxury-page min-h-screen py-16 sm:py-24">
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
              className="group bg-[#121212] border border-white/5 hover:border-[#C5A059]/30 transition-colors duration-500 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                    Fondée en {house.foundation}
                  </span>
                  <span>{house.city}</span>
                </div>

                <figure className="mb-6">
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#F1EEE7]">
                    <EditorialImage
                      src={house.image}
                      alt={house.imageAlt}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-transform duration-700 group-hover:scale-[1.02] ${house.imagePosition}`}
                    />
                  </div>
                  <figcaption className="mt-2 flex items-start justify-between gap-3 text-[8px] leading-3 text-[#827D75]">
                    <span>{house.imageCaption}</span>
                    <a href={house.creditUrl} target="_blank" rel="noreferrer" className="shrink-0 underline decoration-[#C8C1B4] underline-offset-2 hover:text-[#171715]">
                      {house.credit}
                    </a>
                  </figcaption>
                </figure>

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
