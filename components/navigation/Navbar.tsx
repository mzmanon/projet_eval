"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Earth, Menu, User, X } from "lucide-react";
import ChampagneMapModal from "@/components/map/ChampagneMapModal";

const links = [
  { href: "/champagnes", label: "Collection" },
  { href: "/maisons", label: "Maisons" },
  { href: "/terroirs", label: "Terroirs" },
  { href: "/philosophie", label: "La Maison" },
  { href: "/panier", label: "Panier" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const closeMap = useCallback(() => setMapOpen(false), []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-[#F7F5F0]/95 text-[#171715] backdrop-blur-md">
      <div className="border-b border-[#DCD7CD] px-5 py-2 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#827D75] sm:text-[10px]">Expédition soignée depuis Épernay · vente réservée aux majeurs</div>
      <nav aria-label="Navigation principale" className={`border-b border-[#DCD7CD] transition-[padding] duration-300 ${isScrolled ? "py-3" : "py-4 sm:py-5"}`}>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="hidden items-center gap-7 lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className={`border-b pb-1 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors ${pathname === link.href ? "border-[#171715] text-[#171715]" : "border-transparent text-[#827D75] hover:text-[#171715]"}`}>{link.label}</Link>)}</div>
          <button onClick={() => setMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center lg:hidden" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label="LA CAVE, accueil"><span className="block font-serif text-2xl tracking-[0.22em] sm:text-3xl">LA CAVE</span><span className="block text-[8px] font-medium uppercase tracking-[0.3em] text-[#A58C62]">Champagne</span></Link>
          <div className="flex items-center gap-1 sm:gap-3"><Link href="/account" className="flex h-11 w-11 items-center justify-center text-[#59554e] transition-colors hover:text-[#171715]" aria-label="Espace client"><User className="h-[18px] w-[18px]" /></Link><button onClick={() => setMapOpen(true)} className="flex h-11 w-11 items-center justify-center text-[#59554e] transition-colors hover:text-[#171715]" aria-label="Voir la carte de nos terroirs" aria-haspopup="dialog"><Earth className="h-[18px] w-[18px]" /></button></div>
        </div>
      </nav>
      {menuOpen && <div className="border-b border-[#DCD7CD] bg-[#FCFBF8] px-6 py-7 lg:hidden"><div className="mx-auto flex max-w-md flex-col">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="border-b border-[#DCD7CD] py-4 font-serif text-2xl text-[#171715]">{link.label}</Link>)}<Link href="/account" onClick={() => setMenuOpen(false)} className="pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#827D75]">Mon compte</Link><Link href="/admin" onClick={() => setMenuOpen(false)} className="pt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#827D75]">Administration</Link></div></div>}
      </header>
      {mapOpen && <ChampagneMapModal onClose={closeMap} />}
    </>
  );
}
