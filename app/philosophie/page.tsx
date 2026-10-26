import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Wine, ArrowRight } from "lucide-react";

export const metadata = {
  title: "La Maison & Philosophie | LA CAVE — Haute Champagne",
  description:
    "Le manifeste de LA CAVE : temps de maturation, respect absolu du flacon et sommellerie de précision.",
};

export default function PhilosophiePage() {
  return (
    <div className="luxury-page min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
            Manifeste &amp; Art de Vivre
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#FCFBF9] leading-tight">
            Le Temps, Le Silence et la Vérité du Flacon
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mt-6" />
        </div>

        {/* Lead Quote */}
        <div className="p-8 sm:p-12 bg-[#121212] border border-[#C5A059]/30 text-center">
          <p className="font-serif text-lg sm:text-2xl text-neutral-200 italic font-light leading-relaxed">
            « Le champagne ne se fabrique pas. Il s&apos;attend, il se respecte,
            il s&apos;écoute murmurer au fond des crayères avant d&apos;illuminer
            les grands moments de l&apos;existence. »
          </p>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] block mt-4 font-medium">
            — Conservatoire de LA CAVE, Épernay
          </span>
        </div>

        {/* Narrative Section 1 */}
        <div className="space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
          <h2 className="font-serif text-2xl text-neutral-100 font-normal">
            Une Exigence Sans Concession
          </h2>
          <p>
            Fondée pour les amateurs d&apos;émotions œnologiques rares, LA CAVE
            refuse la banalisation industrielle du champagne. Chaque bouteille
            présente dans nos collections est le fruit d&apos;une relation
            privilégiée avec les chefs de cave les plus exigeants de France.
          </p>
          <p>
            Nous garantissons une traçabilité intégrale : de la sortie du chai
            climatisé du domaine jusqu&apos;à votre table, le vin ne subit aucun
            choc thermique, aucune exposition prolongée à la lumière artificielle,
            et aucune vibration néfaste.
          </p>
        </div>

        {/* Image Break */}
        <div className="relative h-72 sm:h-96 w-full bg-[#181818] border border-white/10 overflow-hidden">
          <Image
            src="/cave-crayere.jpg"
            alt="Crayère de Champagne"
            fill
            className="object-cover"
          />
        </div>

        {/* Narrative Section 2: L'Art de la Dégustation */}
        <div className="space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
          <h2 className="font-serif text-2xl text-neutral-100 font-normal flex items-center gap-2">
            <Wine className="h-5 w-5 text-[#C5A059]" />
            L&apos;Art de Déguster selon la Haute Maison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#121212] p-5 border border-white/5 space-y-2">
              <strong className="text-neutral-100 text-xs uppercase tracking-wider block text-[#C5A059]">
                Le Choix du Verre
              </strong>
              <p className="text-neutral-400 text-xs">
                Bannissez les coupes évasées qui dispersent le bouquet et les flûtes
                étroites qui compriment les arômes. Privilégiez un verre tulipe
                ou un verre à vin blanc de dégustation à paraison généreuse.
              </p>
            </div>

            <div className="bg-[#121212] p-5 border border-white/5 space-y-2">
              <strong className="text-neutral-100 text-xs uppercase tracking-wider block text-[#C5A059]">
                La Juste Température
              </strong>
              <p className="text-neutral-400 text-xs">
                Ne servez jamais un grand millésime glacé. Entre 10°C et 12°C pour
                les cuvées de prestige millésimées, afin de libérer l&apos;entière
                palette de noisette, de brioche et de minéralité saline.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-8 border-t border-white/10">
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-3 bg-[#C5A059] text-[#0A0A0A] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#DFC282] transition-colors"
          >
            <span>Accéder à la Sélection Confidentielle</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
