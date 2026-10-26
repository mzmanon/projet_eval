import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";

export const metadata = {
  title: "Les Grands Terroirs de Champagne | LA CAVE — Haute Champagne",
  description:
    "Comprendre la géologie de la Champagne : Côte des Blancs, Montagne de Reims, Vallée de la Marne et Côte des Bar.",
};

const TERROIRS = [
  {
    name: "La Côte des Blancs",
    grape: "100% Chardonnay",
    geology: "Craie du Campanien affleurante à plus de 90%",
    villages: "Le Mesnil-sur-Oger, Cramant, Avize, Oger, Chouilly (Grands Crus)",
    description:
      "Royaume absolu du Chardonnay. Orientée plein est, cette falaise calcaire immaculée donne naissance aux champagnes les plus minéraux, tendus et purs de la planète. C'est ici que naissent les légendes de Salon et Taittinger Comtes de Champagne.",
    image:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "La Montagne de Reims",
    grape: "Pinot Noir dominant",
    geology: "Craie profonde recouverte de sables et d'argiles fertiles",
    villages: "Ambonnay, Bouzy, Verzenay, Mailly-Champagne",
    description:
      "Un vaste plateau forestier bordé de coteaux abrupts. Les raisins de Pinot Noir y puisent une puissance musculaire, une vinosité noble et une complexité épicée inimitable, indispensables à l'architecture de Dom Pérignon et Krug.",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "La Vallée de la Marne",
    grape: "Pinot Meunier & Pinot Noir",
    geology: "Argiles, marnes et bancs de calcaire tendre",
    villages: "Aÿ, Hautvillers, Mareuil-sur-Aÿ",
    description:
      "Bercée par les méandres de la Marne, cette région historique offre une rondeur fruitée, une gourmandise soyeuse et une générosité florale éclatante. Berceau historique de la Maison Bollinger et de Dom Pierre Pérignon.",
    image:
      "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function TerroirsPage() {
  return (
    <div className="bg-[#FBFAF6] min-h-screen py-12 sm:py-20 text-[#14150F]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
            Géologie &amp; Climatologie
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#14150F] mt-3">
            L&apos;Âme des Terroirs Champenois
          </h1>
          <div className="w-12 h-[1px] bg-[#E3C47D]/55 mx-auto mt-6" />
          <p className="mt-6 text-xs sm:text-sm text-[#565C4E] leading-relaxed font-light">
            La grandeur du champagne commence sous la terre. Une mosaïque de
            micro-climats et de bancs de craie sédimentaire qui confèrent aux vins
            leur effervescence soyeuse et leur salinité minérale.
          </p>
        </div>

        {/* Terroirs Sections */}
        <div className="space-y-16">
          {TERROIRS.map((terroir, idx) => (
            <article
              key={terroir.name}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white border border-[#2E4636]/10 p-6 sm:p-10 ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:col-span-6 relative h-72 sm:h-96 w-full bg-[#FBF7EC] border border-[#2E4636]/14 overflow-hidden">
                <Image
                  src={terroir.image}
                  alt={terroir.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-[#755A22] font-normal">
                  <Compass className="h-3.5 w-3.5 stroke-1" />
                  <span>Cépage de prédilection : {terroir.grape}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#14150F]">
                  {terroir.name}
                </h2>

                <div className="p-4 bg-[#FBFAF6] border border-[#2E4636]/10 text-xs text-[#333A2F] space-y-1.5 font-light">
                  <div>
                    <strong className="text-[#565C4E] text-[9px] uppercase tracking-wider block font-normal">
                      Sous-sol géologique :
                    </strong>
                    <span>{terroir.geology}</span>
                  </div>
                  <div className="pt-1 border-t border-[#2E4636]/8">
                    <strong className="text-[#565C4E] text-[9px] uppercase tracking-wider block font-normal">
                      Crus historiques majeurs :
                    </strong>
                    <span>{terroir.villages}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#565C4E] leading-relaxed font-light">
                  {terroir.description}
                </p>

                <div className="pt-2">
                  <Link
                    href="/champagnes"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#755A22] hover:text-[#14150F] transition-colors font-light"
                  >
                    <span>Déguster les cuvées de ce terroir</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
