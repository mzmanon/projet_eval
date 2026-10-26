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
    <div className="bg-[#FBFAF6] min-h-screen py-12 sm:py-20 text-[#14150F]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
            Manifeste &amp; Art de Vivre
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#14150F] leading-tight">
            Le Temps, Le Silence et la Vérité du Flacon
          </h1>
          <div className="w-12 h-[1px] bg-[#E3C47D]/55 mx-auto mt-6" />
        </div>

        {/* Lead Quote */}
        <div className="p-8 sm:p-12 bg-white border border-[#B08F4C]/40 text-center">
          <p className="font-serif text-lg sm:text-2xl text-[#22271F] italic font-light leading-relaxed">
            « Le champagne ne se fabrique pas. Il s&apos;attend, il se respecte,
            il s&apos;écoute murmurer au fond des crayères avant d&apos;illuminer
            les grands moments de l&apos;existence. »
          </p>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#755A22] block mt-4 font-normal">
            — Conservatoire de LA CAVE, Épernay
          </span>
        </div>

        {/* Narrative Section 1 */}
        <div className="space-y-6 text-xs sm:text-sm text-[#333A2F]/90 leading-relaxed font-light">
          <h2 className="font-serif text-2xl text-[#1B1F18] font-light">
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
        <div className="relative h-72 sm:h-96 w-full bg-[#FBF7EC] border border-[#2E4636]/14 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
            alt="Dégustation confidentielle de grands crus"
            fill
            className="object-cover"
          />
        </div>

        {/* Narrative Section 2: L'Art de la Dégustation */}
        <div className="space-y-6 text-xs sm:text-sm text-[#333A2F]/90 leading-relaxed font-light">
          <h2 className="font-serif text-2xl text-[#1B1F18] font-light flex items-center gap-2">
            <Wine className="h-5 w-5 text-[#755A22] stroke-1" />
            L&apos;Art de Déguster selon la Haute Maison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="bg-white p-6 border border-[#2E4636]/10 space-y-2">
              <strong className="text-xs uppercase tracking-wider block text-[#755A22] font-normal">
                Le Choix du Verre
              </strong>
              <p className="text-[#565C4E] text-xs leading-relaxed font-light">
                Bannissez les coupes évasées qui dispersent le bouquet et les flûtes
                étroites qui compriment les arômes. Privilégiez un verre tulipe
                ou un verre à vin blanc de dégustation à paraison généreuse.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#2E4636]/10 space-y-2">
              <strong className="text-xs uppercase tracking-wider block text-[#755A22] font-normal">
                La Juste Température
              </strong>
              <p className="text-[#565C4E] text-xs leading-relaxed font-light">
                Ne servez jamais un grand millésime glacé. Entre 10°C et 12°C pour
                les cuvées de prestige millésimées, afin de libérer l&apos;entière
                palette de noisette, de brioche et de minéralité saline.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-8 border-t border-[#2E4636]/12">
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-3 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-normal hover:bg-[#EFD9A2] transition-colors"
          >
            <span>Accéder à la Sélection Confidentielle</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
