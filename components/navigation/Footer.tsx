"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function Footer() {
  const currentYear = 2026;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="border-t border-[#2E4636]/12 bg-[#D9E4CC] text-[#14150F] pt-20 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Section: Newsletter / Le Cercle */}
        <div className="pb-16 border-b border-[#2E4636]/12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
              La Lettre Confidentielle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#14150F]">
              Rejoindre le Cercle des Initiés
            </h3>
            <p className="text-xs text-[#565C4E] max-w-lg leading-relaxed font-light">
              Recevez en avant-première nos allocations rarissimes, invitations
              aux dégustations privées en Champagne et millésimes de collection.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre adresse email personnelle"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-[#2E4636]/15 px-5 py-3 text-xs text-[#22271F] placeholder-[#585F50] focus:outline-none focus:border-[#B08F4C] transition-colors font-light"
                aria-label="Adresse email pour la newsletter"
              />
              <button
                type="submit"
                className="border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-7 py-3 text-xs uppercase tracking-[0.2em] font-normal hover:bg-[#EFD9A2] transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Inscrit au Cercle</span>
                  </>
                ) : (
                  <span>Souscrire</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-xs font-light">
          {/* Col 1: Maison */}
          <div className="space-y-4">
            <span className="font-serif text-lg tracking-[0.2em] text-[#14150F] block font-light">
              LA CAVE
            </span>
            <p className="text-[#565C4E] leading-relaxed">
              Maison de sommellerie privée et conservatoire des plus grands
              millésimes de Champagne. Chaque bouteille est stockée dans des
              conditions d&apos;obscurité et d&apos;hygrométrie parfaites.
            </p>
            <div className="pt-2 text-[11px] text-[#755A22]">
              12, Avenue de Champagne • 51200 Épernay
            </div>
          </div>

          {/* Col 2: Grands Millésimes */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#755A22] font-normal block">
              Cuvées de Légende
            </span>
            <ul className="space-y-2.5 text-[#565C4E]">
              <li>
                <Link
                  href="/champagnes/dom-perignon-vintage-2013"
                  className="hover:text-[#2E4636] transition-colors"
                >
                  Dom Pérignon Vintage 2013
                </Link>
              </li>
              <li>
                <Link
                  href="/champagnes/krug-grande-cuvee-171eme-edition"
                  className="hover:text-[#2E4636] transition-colors"
                >
                  Krug Grande Cuvée 171ème
                </Link>
              </li>
              <li>
                <Link
                  href="/champagnes/louis-roederer-cristal-2015"
                  className="hover:text-[#2E4636] transition-colors"
                >
                  Louis Roederer Cristal 2015
                </Link>
              </li>
              <li>
                <Link
                  href="/champagnes/salon-cuvee-s-le-mesnil-blanc-de-blancs-2012"
                  className="hover:text-[#2E4636] transition-colors"
                >
                  Salon Cuvée &apos;S&apos; Le Mesnil 2012
                </Link>
              </li>
              <li>
                <Link
                  href="/champagnes"
                  className="text-[#755A22] hover:underline pt-1 block"
                >
                  Voir tout le catalogue →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Terroirs & Savoir-faire */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#755A22] font-normal block">
              Terroirs &amp; Crus
            </span>
            <ul className="space-y-2.5 text-[#565C4E]">
              <li>
                <Link href="/terroirs" className="hover:text-[#2E4636] transition-colors">
                  Côte des Blancs (Grands Crus)
                </Link>
              </li>
              <li>
                <Link href="/terroirs" className="hover:text-[#2E4636] transition-colors">
                  Montagne de Reims (Pinot Noir)
                </Link>
              </li>
              <li>
                <Link href="/terroirs" className="hover:text-[#2E4636] transition-colors">
                  Vallée de la Marne (Meunier d&apos;exception)
                </Link>
              </li>
              <li>
                <Link href="/terroirs" className="hover:text-[#2E4636] transition-colors">
                  Le Mesnil-sur-Oger &amp; Aÿ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Conciergerie */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#755A22] font-normal block">
              Conciergerie Privée
            </span>
            <ul className="space-y-2.5 text-[#565C4E]">
              <li>Conseil sommellerie personnalisée</li>
              <li>Expédition isotherme haute sécurité</li>
              <li>Coffrets de dégustation gravés</li>
              <li>Événements et caves privées</li>
              <li className="pt-2 text-[11px] text-[#333A2F]">
                contact@lacave-champagne.fr
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Alcohol Notice */}
        <div className="pt-10 border-t border-[#2E4636]/8 text-center font-light">
          <p className="text-[9px] uppercase tracking-[0.22em] text-[#565C4E] font-normal max-w-3xl mx-auto leading-relaxed">
            L&apos;ABUS D&apos;ALCOOL EST DANGEREUX POUR LA SANTÉ, À CONSOMMER AVEC
            MODÉRATION. LA VENTE D&apos;ALCOOL EST STRICTEMENT INTERDITE AUX MINEURS DE
            MOINS DE 18 ANS.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#565C4E] gap-4">
            <p>© {currentYear} LA CAVE. Tous droits réservés.</p>
            <div className="flex space-x-6">
              <span className="hover:text-[#333A2F] transition-colors cursor-pointer">
                Mentions Légales
              </span>
              <span className="hover:text-[#333A2F] transition-colors cursor-pointer">
                Données Personnelles
              </span>
              <span className="hover:text-[#333A2F] transition-colors cursor-pointer">
                Conditions Générales
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
