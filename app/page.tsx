import React from "react";
import Link from "next/link";
import { CHAMPAGNES } from "@/lib/data/champagnes";
import ChampagneCard from "@/components/product/ChampagneCard";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  ShoppingBag,
  Wine,
} from "lucide-react";

export default function HomePage() {
  const featuredChampagnes = CHAMPAGNES.filter((c) => c.isFeatured || c.isRare).slice(0, 4);

  return (
    <div className="bg-[#FBFAF6] text-[#14150F] selection:bg-[#E3C47D]/45 selection:text-[#14150F]">
      {/* Hero Section — Respiration, lumière de cave et typographie pure */}
      <section className="relative min-h-[82vh] flex items-center justify-center px-6 sm:px-12 py-20 sm:py-28 border-b border-[#B08F4C]/35 bg-[#E6EFDD] overflow-hidden">
        {/* Subtle Champagne Backlight Halo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(227,196,125,0.34)_0%,transparent_65%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#14150F] leading-[1.12]">
            L&apos;Art du Champagne, <br />
            <span className="italic font-light text-[#755A22]">
              en sa plus noble expression.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#333A2F]/80 max-w-2xl mx-auto leading-relaxed font-light">
            Une sélection confidentielle de cuvées de vignerons d&apos;auteur et de
            flacons historiques de prestige, préservés dans la pénombre et la fraîcheur
            séculaire de nos crayères d&apos;Épernay.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/champagnes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-8 py-3.5 text-xs font-normal uppercase tracking-[0.22em] hover:bg-[#EFD9A2] hover:border-[#EFD9A2] transition-all duration-500 shadow-sm"
            >
              <span>Découvrir la Collection</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/panier"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-[#2E4636]/20 bg-transparent text-[#14150F] px-8 py-3.5 text-xs font-normal uppercase tracking-[0.22em] hover:border-[#B08F4C]/50 hover:text-[#755A22] transition-all duration-500"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#755A22]" />
              <span>Consulter Mon Panier</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cuvées Showcase — Galerie aérée sans conteneurs lourds */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-[#2E4636]/12 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
              Sélection d&apos;Exception
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#14150F] mt-2">
              Cuvées Remarquables &amp; Raretés
            </h2>
          </div>
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#755A22] hover:text-[#14150F] transition-colors"
          >
            <span>Voir toute la cave ({CHAMPAGNES.length} cuvées)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredChampagnes.map((champagne) => (
            <ChampagneCard key={champagne.id} champagne={champagne} />
          ))}
        </div>
      </section>

      {/* Reassurance & Pillars — Structure éditoriale tripartite aérée, sans cartes répétitives */}
      <section className="border-t border-b border-[#2E4636]/10 bg-[#EFF3E8] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2E4636]/12">
            {/* Pilier 1 */}
            <div className="py-8 md:py-0 md:px-8 first:md:pl-0 space-y-4">
              <div className="flex items-center gap-3 text-[#755A22]">
                <ShieldCheck className="h-5 w-5 stroke-1" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-medium">
                  Traçabilité
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#14150F] font-light">
                Provenance &amp; Scellé d&apos;Origine
              </h3>
              <p className="text-xs text-[#565C4E] leading-relaxed font-light">
                Allocations directes auprès des domaines et des chefs de cave.
                Chaque flacon est contrôlé optiquement et accompagné de son
                certificat de provenance certifié.
              </p>
            </div>

            {/* Pilier 2 */}
            <div className="py-8 md:py-0 md:px-8 space-y-4">
              <div className="flex items-center gap-3 text-[#755A22]">
                <Wine className="h-5 w-5 stroke-1" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-medium">
                  Préservation
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#14150F] font-light">
                Crayères Séculaires d&apos;Épernay
              </h3>
              <p className="text-xs text-[#565C4E] leading-relaxed font-light">
                Obscurité absolue, hygrométrie stabilisée à 85% et température
                naturelle constante de 11°C. Le vin s&apos;épanouit sans aucune
                vibration ni variation thermique.
              </p>
            </div>

            {/* Pilier 3 */}
            <div className="py-8 md:py-0 md:px-8 last:md:pr-0 space-y-4">
              <div className="flex items-center gap-3 text-[#755A22]">
                <Award className="h-5 w-5 stroke-1" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-medium">
                  Sécurité
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#14150F] font-light">
                Expédition Isotherme Haute Sécurité
              </h3>
              <p className="text-xs text-[#565C4E] leading-relaxed font-light">
                Coffrets thermorégulés anti-chocs confectionnés sur mesure.
                Livraison discrète en mains propres avec signature requise, offerte
                dès 250 € d&apos;achat en France et en Europe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terroir & Philosophy Banner — Respiration panoramique */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="relative border border-[#B08F4C]/35 bg-gradient-to-r from-[#F7F2E6] via-[#FBF7EC] to-[#F7F2E6] p-8 sm:p-14 lg:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(227,196,125,0.22),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
              Héritage Champenois
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#14150F] font-light leading-snug">
              La quête inlassable de l&apos;équilibre et de la pureté minérale.
            </h2>
            <p className="text-xs sm:text-sm text-[#333A2F]/80 leading-relaxed font-light">
              De la craie campanienne de la Côte des Blancs aux coteaux solaires
              de la Montagne de Reims, découvrez les signatures stylistiques qui
              façonnent le patrimoine vinique français.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/terroirs"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#755A22] hover:text-[#14150F] transition-colors"
              >
                <span>Explorer les Terroirs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[#585F50]">&bull;</span>
              <Link
                href="/maisons"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#333A2F] hover:text-[#2E4636] transition-colors"
              >
                <span>Découvrir les Maisons</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
