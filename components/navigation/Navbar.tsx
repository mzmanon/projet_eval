"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { User, Shield, Menu, X } from "lucide-react";

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
      <div className="bg-[#C6D6B5] border-b border-[#2E4636]/8 py-1 px-4 text-center">
        <p className="text-[9px] uppercase tracking-[0.28em] text-[#14150F] font-normal">
          Maison Fondée en Champagne • Expédition Confidentielle &amp; Flacons Garantis d&apos;Origine
        </p>
      </div>

      {/* Main Bar */}
      <nav
        aria-label="Navigation principale"
        className={`w-full transition-all duration-500 ${
          isScrolled
            ? "bg-[#FBFAF6]/94 backdrop-blur-md border-b border-[#2E4636]/12 py-3 shadow-xl"
            : "bg-gradient-to-b from-[#FBFAF6]/92 via-[#FBFAF6]/70 to-transparent backdrop-blur-sm border-b border-[#2E4636]/8 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-[#333A2F] hover:text-[#755A22] transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Left navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-[0.22em] font-normal">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.href === "/panier") {
                return (
                  <button
                    key={link.href}
                    onClick={toggleCart}
                    className={`transition-colors duration-300 relative py-1 flex items-center gap-2 cursor-pointer uppercase ${
                      isActive
                        ? "text-[#755A22]"
                        : "text-[#333A2F] hover:text-[#14150F]"
                    }`}
                    title={
                      totalCount > 0
                        ? `Votre sélection (${totalCount} flacons) — Cliquez pour valider votre commande`
                        : "Votre panier"
                    }
                  >
                    <span>{link.label}</span>
                    {totalCount > 0 && (
                      <span
                        className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#E3C47D] text-[9px] font-medium text-[#14150F] transition-all duration-300 ${
                          isBadgeAnimating
                            ? "scale-110 ring-2 ring-[#EFD9A2]"
                            : "scale-100"
                        }`}
                      >
                        {totalCount}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E3C47D]" />
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-300 relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#755A22]"
                      : "text-[#333A2F] hover:text-[#14150F]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E3C47D]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Center Brand Monogram & Title */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <span className="block font-serif text-2xl sm:text-3xl font-light tracking-[0.35em] text-[#14150F] group-hover:text-[#755A22] transition-colors duration-500">
                LA CAVE
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.45em] text-[#755A22] font-light mt-0.5">
                Haute Champagne • Épernay
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1.5 text-xs text-[#565C4E] hover:text-[#755A22] transition-colors tracking-widest uppercase font-light"
              title="Espace Administrateur"
            >
              <Shield className="h-3.5 w-3.5 text-[#755A22]" />
              <span className="hidden xl:inline text-[10px]">Espace Privilège</span>
            </Link>

            <Link
              href="/account"
              className="p-2 text-[#333A2F] hover:text-[#755A22] transition-colors"
              aria-label="Espace Client Privilège"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Curtain Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[75px] bg-[#E6EFDD]/98 backdrop-blur-xl border-b border-[#B08F4C]/35 p-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4 text-xs uppercase tracking-[0.25em] font-light">
            {navLinks.map((link) => {
              if (link.href === "/panier") {
                return (
                  <button
                    key={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      toggleCart();
                    }}
                    className="text-[#22271F] hover:text-[#755A22] py-2.5 border-b border-[#2E4636]/10 flex items-center justify-between cursor-pointer text-left uppercase"
                  >
                    <span>{link.label}</span>
                    {totalCount > 0 && (
                      <span className="bg-[#E3C47D] text-[#14150F] text-[10px] font-medium px-2 py-0.5 rounded-full">
                        {totalCount}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#22271F] hover:text-[#755A22] py-2.5 border-b border-[#2E4636]/10 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#22271F] hover:text-[#755A22] py-2.5 border-b border-[#2E4636]/10 flex items-center gap-2"
            >
              <User className="h-4 w-4 text-[#755A22]" />
              Espace Privilège Client
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#22271F] hover:text-[#755A22] py-2.5 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-[#755A22]" />
              Espace Administrateur
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
