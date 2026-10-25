"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User, Shield, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, toggleCart, isBadgeAnimating } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/champagnes", label: "La Collection" },
    { href: "/maisons", label: "Les Maisons" },
    { href: "/terroirs", label: "Les Terroirs" },
    { href: "/philosophie", label: "La Maison" },
    { href: "/panier", label: "Panier" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-[#050505] border-b border-white/5 py-1.5 px-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
          Maison Fondée en Champagne • Expédition Confidentielle &amp; Flacons Garantis d&apos;Origine
        </p>
      </div>

      {/* Main Bar */}
      <nav
        aria-label="Navigation principale"
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-[#0A0A0A]/90 to-[#0A0A0A]/40 backdrop-blur-sm border-b border-white/5 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-neutral-300 hover:text-[#C5A059] transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Left navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-[0.2em] font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-300 relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#C5A059]"
                      : "text-neutral-300 hover:text-[#FCFBF9]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.href === "/panier" && totalCount > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#C5A059] text-[9px] font-bold text-[#0A0A0A]">
                      {totalCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A059]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Center Brand Monogram & Title */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <span className="block font-serif text-2xl sm:text-3xl font-light tracking-[0.3em] text-[#FCFBF9] group-hover:text-[#C5A059] transition-colors duration-300">
                LA CAVE
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.45em] text-[#C5A059] font-medium mt-0.5">
                Haute Champagne • Épernay
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#C5A059] transition-colors tracking-widest uppercase"
              title="Espace Administrateur"
            >
              <Shield className="h-3.5 w-3.5 text-[#C5A059]" />
              <span className="hidden xl:inline text-[10px]">Espace Privilège</span>
            </Link>

            <Link
              href="/account"
              className="p-2 text-neutral-300 hover:text-[#C5A059] transition-colors"
              aria-label="Espace Client Privilège"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={toggleCart}
              className={`p-2 transition-all duration-300 relative rounded-full ${
                isBadgeAnimating
                  ? "text-[#C5A059] scale-110"
                  : "text-neutral-300 hover:text-[#C5A059]"
              }`}
              aria-label={`Panier, ${totalCount} articles. Cliquez pour valider votre commande.`}
              title={
                totalCount > 0
                  ? `Votre sélection (${totalCount} flacons) — Cliquez pour valider votre commande`
                  : "Votre panier est vide"
              }
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCount > 0 && (
                <span
                  className={`absolute top-0.5 right-0 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#C5A059] text-[10px] font-bold text-[#0A0A0A] shadow-md transition-all duration-300 ${
                    isBadgeAnimating
                      ? "scale-125 ring-2 ring-[#DFC282] bg-[#DFC282] animate-bounce"
                      : "scale-100"
                  }`}
                >
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Curtain Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[85px] bg-[#0E0E0E] border-b border-[#C5A059]/20 p-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-5 text-sm uppercase tracking-[0.25em]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-200 hover:text-[#C5A059] py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.href === "/panier" && totalCount > 0 && (
                  <span className="bg-[#C5A059] text-[#0A0A0A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {totalCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-200 hover:text-[#C5A059] py-2 border-b border-white/5 flex items-center gap-2"
            >
              <User className="h-4 w-4 text-[#C5A059]" />
              Espace Privilège Client
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-200 hover:text-[#C5A059] py-2 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-[#C5A059]" />
              Espace Administrateur
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
