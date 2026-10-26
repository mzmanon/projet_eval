import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CHAMPAGNES, getChampagneBySlug } from "@/lib/data/champagnes";
import AddToCartButton from "@/components/product/AddToCartButton";
import ChampagneCard from "@/components/product/ChampagneCard";
import ProductImage from "@/components/product/ProductImage";
import ProductReviews from "@/components/reviews/ProductReviews";
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

  const relatedChampagnes = CHAMPAGNES.filter(
    (c) => c.id !== champagne.id
  ).slice(0, 3);

  return (
    <div className="luxury-page min-h-screen py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#565C4E] font-light">
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-1.5 hover:text-[#2E4636] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Retour au catalogue</span>
          </Link>
          <span>/</span>
          <span className="text-[#585F50]">{champagne.house}</span>
          <span>/</span>
          <span className="text-[#755A22] truncate">{champagne.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Authentic Packshot Photography on Champagne Pedestal */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[480px] sm:h-[620px] w-full bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] border border-[#2E4636]/12 p-8 sm:p-12 flex items-center justify-center overflow-hidden">
              {champagne.score && (
                <div className="absolute top-6 right-6 z-10 bg-[#FBFAF6]/80 backdrop-blur-sm border border-[#2E4636]/15 px-3.5 py-1.5 text-center">
                  <span className="block text-[8px] uppercase tracking-widest text-[#755A22] font-normal">
                    Note Critique
                  </span>
                  <span className="font-mono text-base font-normal text-[#1B1F18]">
                    {champagne.score}
                    <span className="text-xs text-[#585F50]">/100</span>
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
                <span>Packshot &amp; Flacon Certifiés d&apos;Origine</span>
              </div>
            </div>
          </div>

          {/* Right Column: Oenological Details & Acquisition */}
          <div className="lg:col-span-6 space-y-8">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-normal">
                  {champagne.house}
                </span>
                {champagne.isRare && (
                  <span className="border border-[#B08F4C]/45 bg-[#E3C47D]/30 text-[#755A22] text-[9px] uppercase tracking-[0.2em] font-normal px-2.5 py-0.5">
                    Allocation Rare
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#14150F] mt-2 leading-tight">
                {champagne.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#333A2F] font-light">
                <span className="text-[#565C4E]">Millésime :</span>
                <span className="text-[#755A22] font-mono">{champagne.vintage}</span>
                <span>•</span>
                <span>{champagne.dosage}</span>
                <span>•</span>
                <span>{champagne.format}</span>
                <span>•</span>
                <span>{champagne.alcoholByVolume}</span>
              </div>
            </div>

            {/* Price & Acquisition Area */}
            <div className="p-6 bg-white border border-[#2E4636]/14 space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#565C4E] block font-light">
                    Prix Domaine TTC
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-light text-[#14150F]">
                    {champagne.price} €
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] text-[#2F6B45]/90 border border-[#2F6B45]/30/40 bg-[#EAF2EA]/20 px-2.5 py-0.5 font-light">
                    Stock garanti : {champagne.stock} flacons
                  </span>
                </div>
              </div>

              {/* Add to Cart Component */}
              <AddToCartButton champagne={champagne} />

              <div className="pt-2 border-t border-[#2E4636]/10 flex items-center justify-between text-[11px] text-[#565C4E] font-light">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
                  Expédition sécurisée sous 24/48h
                </span>
                <span>Conservation en cave climatisée</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-normal">
                La Parole du Chef de Cave
              </h2>
              <p className="text-xs sm:text-sm text-[#333A2F] leading-relaxed font-light">
                {champagne.description}
              </p>
            </div>

            {/* Tasting Notes */}
            <div className="p-6 bg-white border border-[#2E4636]/12 space-y-4">
              <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-normal flex items-center gap-2">
                <Award className="h-3.5 w-3.5 stroke-1" />
                Notes de Dégustation
              </h2>

              <div className="space-y-3 text-xs leading-relaxed font-light">
                <div>
                  <strong className="text-[#22271F] font-normal">Robe &amp; Effervescence : </strong>
                  <span className="text-[#565C4E]">{champagne.tastingNotes.robe}</span>
                </div>
                <div>
                  <strong className="text-[#22271F] font-normal">Bouquet / Nez : </strong>
                  <span className="text-[#565C4E]">{champagne.tastingNotes.nez}</span>
                </div>
                <div>
                  <strong className="text-[#22271F] font-normal">Bouche &amp; Finale : </strong>
                  <span className="text-[#565C4E]">{champagne.tastingNotes.bouche}</span>
                </div>
              </div>

              {/* Accords mets-vins */}
              <div className="pt-3 border-t border-[#2E4636]/10">
                <span className="text-[9px] uppercase tracking-wider text-[#755A22] block mb-2 font-light">
                  Accords Gastronomiques Recommandés :
                </span>
                <div className="flex flex-wrap gap-2">
                  {champagne.tastingNotes.accords.map((accord, idx) => (
                    <span
                      key={idx}
                      className="border border-[#2E4636]/15 bg-[#2E4636]/[0.05] text-[#333A2F] text-[11px] px-3 py-1 font-light"
                    >
                      {accord}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service */}
              <div className="pt-2 text-[11px] text-[#565C4E] italic font-light">
                {champagne.tastingNotes.service}
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="border border-[#2E4636]/12 bg-[#EFF3E8] p-6 space-y-4">
              <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#755A22] font-normal">
                Fiche OEnologique Officielle
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                <div className="border-b border-[#2E4636]/10 pb-2">
                  <span className="text-[#585F50] block text-[9px] uppercase tracking-wider">Terroir &amp; Cru</span>
                  <span className="text-[#22271F]">{champagne.terroir}</span>
                </div>
                <div className="border-b border-[#2E4636]/10 pb-2">
                  <span className="text-[#585F50] block text-[9px] uppercase tracking-wider">Cépages / Assemblage</span>
                  <span className="text-[#22271F]">{champagne.grapes}</span>
                </div>
                <div className="border-b border-[#2E4636]/10 pb-2">
                  <span className="text-[#585F50] block text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#755A22] stroke-1" />
                    Maturation sur lies
                  </span>
                  <span className="text-[#22271F]">{champagne.cellarAging}</span>
                </div>
                <div className="border-b border-[#2E4636]/10 pb-2">
                  <span className="text-[#585F50] block text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-[#755A22] stroke-1" />
                    Température de service
                  </span>
                  <span className="text-[#22271F]">10°C - 12°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Reviews & Discussion */}
        <div className="mt-16 sm:mt-20">
          <ProductReviews champagneId={champagne.id} variant="full" />
        </div>

        {/* Related Cuvées Section */}
        <div className="mt-24 pt-16 border-t border-[#2E4636]/12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
              Pour Poursuivre la Découverte
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#14150F] mt-2">
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
