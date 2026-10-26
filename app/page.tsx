import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Wine } from "lucide-react";
import { getFeaturedChampagnes } from "@/lib/data/champagnes";
import ChampagneCard from "@/components/product/ChampagneCard";

export default function Home() {
  const featured = getFeaturedChampagnes().slice(0, 3);

  return (
    <main className="page-shell overflow-hidden">
      <section className="mx-auto grid min-h-[640px] max-w-[1600px] grid-cols-1 border-b border-[#DCD7CD] lg:grid-cols-12">
        <div className="flex flex-col justify-between px-6 py-14 sm:px-10 lg:col-span-5 lg:px-16 lg:py-20 xl:px-24">
          <div>
            <p className="page-label">Sélection de Champagne</p>
            <h1 className="page-title mt-7 max-w-xl">Le temps donne au vin sa voix.</h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-[#59554e] sm:text-base">
              Une cave privée dédiée aux cuvées dont l&apos;origine, le temps et la garde méritent une attention entière.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <Link href="/champagnes" className="button-ink text-[11px] font-medium uppercase tracking-[0.18em]">
              Découvrir la collection
            </Link>
            <Link href="/philosophie" className="editorial-link text-[11px] font-medium uppercase tracking-[0.16em]">
              Notre philosophie <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[430px] overflow-hidden bg-[#e9e5dc] lg:col-span-7">
          <Image src="/hero-bottle.jpg" alt="Flacon de champagne dans la cave LA CAVE" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/40 bg-[#171715]/85 px-6 py-4 text-[#FCFBF8] backdrop-blur-sm sm:px-8">
            <span className="text-[10px] uppercase tracking-[0.2em]">Conservation en crayère</span>
            <span className="font-serif text-lg italic">Épernay</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28 xl:px-24">
        <div className="grid gap-10 border-b border-[#DCD7CD] pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="page-label">La sélection du moment</p>
            <h2 className="mt-5 font-serif text-4xl font-normal leading-none tracking-tight text-[#171715] sm:text-5xl">Quelques flacons, choisis sans hâte.</h2>
          </div>
          <p className="text-sm leading-7 text-[#827D75] lg:col-span-4 lg:col-start-9">Une sélection courte de maisons et de vignerons, conservée à température et hygrométrie contrôlées.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((champagne) => <ChampagneCard key={champagne.id} champagne={champagne} />)}
        </div>
      </section>

      <section className="grid border-y border-[#DCD7CD] bg-[#FCFBF8] lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src="/terroir-vignes.jpg" alt="Vignobles de Champagne" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
          <Wine className="h-5 w-5 text-[#A58C62]" />
          <p className="page-label mt-7">La cave, autrement</p>
          <h2 className="mt-5 max-w-lg font-serif text-4xl leading-none tracking-tight text-[#171715] sm:text-5xl">Préserver le flacon, respecter le moment.</h2>
          <p className="mt-7 max-w-md text-sm leading-7 text-[#59554e]">Chaque acquisition est préparée dans un écrin isotherme et confiée à une expédition suivie, pour que la dégustation commence exactement comme elle doit commencer.</p>
          <Link href="/terroirs" className="editorial-link mt-9 w-fit text-[11px] font-medium uppercase tracking-[0.16em]">Explorer les terroirs <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-8 px-6 py-16 sm:grid-cols-3 sm:px-10 lg:px-16 lg:py-20 xl:px-24">
        {[
          ["Origine vérifiée", "Chaque cuvée est identifiée et contrôlée à son entrée en cave."],
          ["Garde maîtrisée", "Obscurité, stabilité thermique et hygrométrie accompagnent les flacons."],
          ["Conseil attentif", "Une sélection resserrée et une sommellerie disponible avant l'acquisition."],
        ].map(([title, description]) => (
          <div key={title} className="border-t border-[#A58C62] pt-5">
            <ShieldCheck className="h-4 w-4 text-[#A58C62]" />
            <h3 className="mt-5 font-serif text-2xl text-[#171715]">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#827D75]">{description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
