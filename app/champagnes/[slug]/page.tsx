import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CHAMPAGNES, getChampagneBySlug } from "@/lib/data/champagnes";
import AddToCartButton from "@/components/product/AddToCartButton";
import ChampagneCard from "@/components/product/ChampagneCard";
import ProductImage from "@/components/product/ProductImage";
import {
  ShieldCheck,
  Award,
  Thermometer,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export function generateStaticParams() {
  return CHAMPAGNES.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const champagne = getChampagneBySlug(slug);

  if (!champagne) {
    return {
      title: "Cuvée Introuvable | LA CAVE",
    };
  }

  return {
    title: `${champagne.name} — ${champagne.house} | LA CAVE`,
    description: champagne.description,
  };
}

export default async function ChampagneDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const champagne = getChampagneBySlug(slug);

  if (!champagne) {
    notFound();
  }

  // Related cuvées
  const relatedChampagnes = CHAMPAGNES.filter(
    (c) => c.id !== champagne.id
  ).slice(0, 3);

  return (
    <div className="luxury-page min-h-screen py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-400">
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour au catalogue</span>
          </Link>
          <span>/</span>
          <span className="text-neutral-500">{champagne.house}</span>
          <span>/</span>
          <span className="text-[#C5A059] truncate">{champagne.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Authentic Packshot Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[480px] sm:h-[620px] w-full bg-[#121212] border border-white/5 p-8 sm:p-12 flex items-center justify-center overflow-hidden">
              {champagne.score && (
                <div className="absolute top-6 right-6 z-10 bg-[#1A1A1A] border border-[#C5A059]/40 px-3 py-1.5 text-center">
                  <span className="block text-[9px] uppercase tracking-widest text-[#C5A059] font-medium">
                    Note Critique
                  </span>
                  <span className="font-mono text-base font-bold text-neutral-100">
                    {champagne.score}
                    <span className="text-xs text-neutral-500">/100</span>
                  </span>
                </div>
              )}

              {/* Packshot Image - Strictly Preserved Natural Appearance */}
              <div className="relative h-full w-full">
                <ProductImage
                  src={champagne.imageUrl}
                  alt={`${champagne.name} — Bouteille authentique`}
                  house={champagne.house}
                  name={champagne.name}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain filter-none"
                />
              </div>

              {/* Discreet Authenticity Tag */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-400 bg-black/60 backdrop-blur-sm px-2.5 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#C5A059]" />
                <span>Visuel produit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Oenological Details & Acquisition */}
          <div className="lg:col-span-6 space-y-8">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                  {champagne.house}
                </span>
                {champagne.isRare && (
                  <span className="bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-0.5">
                    Allocation Rare
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#FCFBF9] mt-2 leading-tight">
                {champagne.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                <span className="text-neutral-400 font-medium">Millésime :</span>
                <span className="text-[#C5A059]">{champagne.vintage}</span>
                <span>•</span>
                <span>{champagne.dosage}</span>
                <span>•</span>
                <span>{champagne.format}</span>
                <span>•</span>
                <span>{champagne.alcoholByVolume}</span>
              </div>
            </div>

            {/* Price & Acquisition Area */}
            <div className="p-6 bg-[#121212] border border-white/10 space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                    Prix Domaine TTC
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl text-[#FCFBF9]">
                    {champagne.price} €
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5">
                    Stock garanti : {champagne.stock} flacons
                  </span>
                </div>
              </div>

              {/* Add to Cart Component */}
              <AddToCartButton champagne={champagne} />

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                  Expédition sécurisée sous 24/48h
                </span>
                <span>Conservation en cave climatisée</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                La Parole du Chef de Cave
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                {champagne.description}
              </p>
            </div>

            {/* Tasting Notes */}
            <div className="p-6 bg-[#111111] border border-white/5 space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Notes de Dégustation
              </h2>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <strong className="text-neutral-200">Robe &amp; Effervescence : </strong>
                  <span className="text-neutral-400">{champagne.tastingNotes.robe}</span>
                </div>
                <div>
                  <strong className="text-neutral-200">Bouquet / Nez : </strong>
                  <span className="text-neutral-400">{champagne.tastingNotes.nez}</span>
                </div>
                <div>
                  <strong className="text-neutral-200">Bouche &amp; Finale : </strong>
                  <span className="text-neutral-400">{champagne.tastingNotes.bouche}</span>
                </div>
              </div>

              {/* Accords mets-vins */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block mb-2 font-medium">
                  Accords Gastronomiques Recommandés :
                </span>
                <div className="flex flex-wrap gap-2">
                  {champagne.tastingNotes.accords.map((accord, idx) => (
                    <span
                      key={idx}
                      className="bg-[#181818] border border-white/10 text-neutral-300 text-[11px] px-3 py-1"
                    >
                      {accord}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service */}
              <div className="pt-2 text-[11px] text-neutral-400 italic">
                {champagne.tastingNotes.service}
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="border border-white/5 bg-[#101010] p-6 space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                Fiche OEnologique Officielle
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-neutral-500 block text-[10px] uppercase">Terroir &amp; Cru</span>
                  <span className="text-neutral-200 font-medium">{champagne.terroir}</span>
                </div>
                <div className="border-b border-white/5 pb-2">
                  <span className="text-neutral-500 block text-[10px] uppercase">Cépages / Assemblage</span>
                  <span className="text-neutral-200 font-medium">{champagne.grapes}</span>
                </div>
                <div className="border-b border-white/5 pb-2">
                  <span className="text-neutral-500 block text-[10px] uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#C5A059]" />
                    Maturation sur lies
                  </span>
                  <span className="text-neutral-200 font-medium">{champagne.cellarAging}</span>
                </div>
                <div className="border-b border-white/5 pb-2">
                  <span className="text-neutral-500 block text-[10px] uppercase flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-[#C5A059]" />
                    Température de service
                  </span>
                  <span className="text-neutral-200 font-medium">10°C - 12°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Cuvées Section */}
        <div className="mt-24 pt-16 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
              Pour Poursuivre la Découverte
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#FCFBF9] mt-2">
              Autres Flacons Remarquables
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {relatedChampagnes.map((c) => (
              <ChampagneCard key={c.id} champagne={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
