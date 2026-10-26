"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Earth, Menu, User, X } from "lucide-react";
import { Moon, Sun } from "lucide-react";

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
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("la-cave-theme");
    const dark = savedTheme === "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", dark);
    const frame = window.requestAnimationFrame(() => setIsDarkTheme(dark));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDarkTheme;
    setIsDarkTheme(nextIsDark);
    document.documentElement.dataset.theme = nextIsDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("la-cave-theme", nextIsDark ? "dark" : "light");
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-[var(--paper)] text-[var(--ink)] backdrop-blur-md">
       <div className="border-b border-[var(--line)] px-5 py-2 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--taupe)] sm:text-[10px]">Expédition soignée depuis Épernay · vente réservée aux majeurs</div>
       <nav aria-label="Navigation principale" className={`border-b border-[var(--line)] transition-[padding] duration-300 ${isScrolled ? "py-3" : "py-4 sm:py-5"}`}>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="hidden items-center gap-7 lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className={`border-b pb-1 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors ${pathname === link.href ? "border-[var(--ink)] text-[var(--ink)]" : "border-transparent text-[var(--taupe)] hover:text-[var(--ink)]"}`}>{link.label}</Link>)}</div>
          <button onClick={() => setMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center lg:hidden" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label="LA CAVE, accueil"><span className="block font-serif text-2xl tracking-[0.22em] sm:text-3xl">LA CAVE</span><span className="block text-[8px] font-medium uppercase tracking-[0.3em] text-[var(--champagne)]">Champagne</span></Link>
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="group flex h-10 items-center gap-2 border border-[var(--line-dark)] px-2.5 text-[var(--ink)] transition-colors hover:border-[var(--champagne)] hover:bg-[var(--surface)] focus-visible:outline-offset-2 sm:px-3"
              aria-label={`Activer le thème ${isDarkTheme ? "clair" : "sombre"}`}
              aria-pressed={isDarkTheme}
              title={`Thème ${isDarkTheme ? "sombre" : "clair"}`}
            >
              {isDarkTheme ? <Sun className="h-4 w-4" strokeWidth={1.5} /> : <Moon className="h-4 w-4" strokeWidth={1.5} />}
              <span className="hidden text-[9px] font-medium uppercase tracking-[0.15em] sm:inline">{isDarkTheme ? "Clair" : "Sombre"}</span>
            </button>
            <Link href="/account" className="flex h-11 w-11 items-center justify-center text-[var(--taupe)] transition-colors hover:text-[var(--ink)]" aria-label="Espace client"><User className="h-[18px] w-[18px]" /></Link>
            <Link href="/carte" aria-current={pathname === "/carte" ? "page" : undefined} className={`flex h-11 w-11 items-center justify-center transition-colors ${pathname === "/carte" ? "text-[var(--champagne)]" : "text-[var(--taupe)] hover:text-[var(--ink)]"}`} aria-label="Voir la carte de nos terroirs"><Earth className="h-[18px] w-[18px]" /></Link>
          </div>
        </div>
      </nav>
       {menuOpen && <div className="border-b border-[var(--line)] bg-[var(--paper)] px-6 py-7 lg:hidden"><div className="mx-auto flex max-w-md flex-col">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="border-b border-[var(--line)] py-4 font-serif text-2xl text-[var(--ink)]">{link.label}</Link>)}<Link href="/carte" onClick={() => setMenuOpen(false)} className="border-b border-[var(--line)] py-4 font-serif text-2xl text-[var(--ink)]">Carte des terroirs</Link><Link href="/account" onClick={() => setMenuOpen(false)} className="pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--taupe)]">Mon compte</Link><Link href="/admin" onClick={() => setMenuOpen(false)} className="pt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--taupe)]">Administration</Link></div></div>}
      </header>
    </>
  );
}
