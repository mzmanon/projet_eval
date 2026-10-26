import Link from "next/link";
import ChampagneTerroirsMap from "@/components/map/ChampagneTerroirsMap";
import { CHAMPAGNE_LOCATIONS } from "@/lib/data/champagneLocations";
import { getChampagneBySlug } from "@/lib/data/champagnes";

export const metadata = {
  title: "La carte des terroirs | LA CAVE — Haute Champagne",
  description:
    "Découvrez sur la carte de France les villages d'origine de nos champagnes : Reims, Hautvillers, Aÿ, Mareuil-sur-Aÿ et Le Mesnil-sur-Oger.",
};

export default function CartePage() {
  const totalCuvees = CHAMPAGNE_LOCATIONS.reduce(
    (total, location) =>
      total +
      location.champagneSlugs.filter((slug) => getChampagneBySlug(slug)).length,
    0
  );

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-20 sm:pb-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 pt-8 text-[10px] uppercase tracking-[0.22em] text-[#827D75]"
        >
          <Link href="/" className="transition-colors hover:text-[#171715]">
            Accueil
          </Link>
          <span className="text-[#C8C1B4]">/</span>
          <span className="text-[#A58C62]">Carte des terroirs</span>
        </nav>

        <header className="mt-7 grid gap-8 border-b border-[#DCD7CD] pb-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <span className="page-label">Nos origines</span>
            <h1 className="page-title mt-4">La carte des terroirs</h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#827D75]">
              Maisons historiques de Reims, coteaux d&apos;Aÿ et crayères de la
              Côte des Blancs : chaque cuvée de notre collection est rattachée à
              son village d&apos;origine. Zoomez sur la carte pour découvrir les
              terroirs et les champagnes qui y naissent.
            </p>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end">
            <div className="grid w-full grid-cols-2 border border-[#DCD7CD] bg-[#FCFBF8] sm:max-w-xs">
              <div className="border-r border-[#DCD7CD] px-5 py-4">
                <span className="block font-serif text-3xl leading-none">
                  {String(CHAMPAGNE_LOCATIONS.length).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-[9px] uppercase tracking-[0.2em] text-[#827D75]">
                  Villages
                </span>
              </div>
              <div className="px-5 py-4">
                <span className="block font-serif text-3xl leading-none">
                  {String(totalCuvees).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-[9px] uppercase tracking-[0.2em] text-[#827D75]">
                  Cuvées
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="pt-10 sm:pt-12">
          <ChampagneTerroirsMap />
        </div>
      </div>
    </div>
  );
}
