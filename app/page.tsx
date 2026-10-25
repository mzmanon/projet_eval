import React from "react";
import Link from "next/link";
import { CHAMPAGNES } from "@/lib/data/champagnes";
import ChampagneCard from "@/components/product/ChampagneCard";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  ShoppingBag,
  Wine,
} from "lucide-react";

export default function HomePage() {
  const featuredChampagnes = CHAMPAGNES.filter((c) => c.isFeatured || c.isRare).slice(0, 4);

  return (
    <div className="bg-[#0A0A0A] text-[#FCFBF9] selection:bg-[#C5A059] selection:text-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 sm:px-12 py-24 border-b border-white/5 overflow-hidden">
        {/* Subtle Luxury Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,160,89,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 border border-[#C5A059]/30 bg-[#121212]/80 backdrop-blur-md px-4 py-1.5 rounded-full">
            <Sparkles className="h-3 w-3 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              Conservatoire des Grands Millésimes
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#FCFBF9] leading-[1.15]">
            L&apos;Art du Champagne, <br />
            <span className="italic font-normal text-[#C5A059]">
              en sa plus noble expression.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Une sélection confidentielle de cuvées de vignerons d&apos;auteur et de
            flacons historiques de prestige, conservés dans la fraîcheur absolue
            de nos crayères d&apos;Épernay.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/champagnes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#C5A059] text-[#0A0A0A] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#DFC282] transition-colors"
            >
              <span>Découvrir la Collection</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/panier"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-white/20 bg-transparent text-[#FCFBF9] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Consulter Mon Panier</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cuvées Showcase */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
              Sélection d&apos;Exception
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#FCFBF9] mt-2">
              Cuvées Remarquables &amp; Raretés
            </h2>
          </div>
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] hover:underline"
          >
            <span>Voir toute la cave ({CHAMPAGNES.length} cuvées)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredChampagnes.map((champagne) => (
            <ChampagneCard key={champagne.id} champagne={champagne} />
          ))}
        </div>
      </section>

      {/* Reassurance & Pillars */}
      <section className="border-t border-b border-white/10 bg-[#0E0E0E] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#161616] border border-[#C5A059]/30 text-[#C5A059]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg text-neutral-100">
                Provenance &amp; Traçabilité Absolue
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Allocations directes auprès des domaines et maisons de Champagne.
                Flacons scellés avec certificat d&apos;authenticité d&apos;origine.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#161616] border border-[#C5A059]/30 text-[#C5A059]">
                <Wine className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg text-neutral-100">
                Conservation en Crayères Séculaires
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Obscurité totale, hygrométrie stabilisée à 85% et température
                naturelle constante de 11°C pour une garde idéale.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#161616] border border-[#C5A059]/30 text-[#C5A059]">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg text-neutral-100">
                Expédition Isotherme &amp; Sécurisée
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Coffrets anti-chocs sur mesure avec livraison thermo-régulée
                offerte dès 250 € d&apos;achat en France et en Europe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terroir & Philosophy Banner */}
      <section className="py-24 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="relative bg-[#141414] border border-[#C5A059]/20 p-8 sm:p-14 lg:p-16 overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
              Héritage Champenois
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FCFBF9] font-light">
              La quête inlassable de l&apos;équilibre et de la pureté minérale.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              De la craie campanienne de la Côte des Blancs aux coteaux solaires
              de la Montagne de Reims, découvrez les signatures stylistiques qui
              façonnent le patrimoine vinique français.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/terroirs"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#DFC282] transition-colors"
              >
                <span>Explorer les Terroirs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-neutral-600">&bull;</span>
              <Link
                href="/maisons"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors"
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
