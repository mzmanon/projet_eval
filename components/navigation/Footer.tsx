"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
    window.setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="mt-auto border-t border-[#DCD7CD] bg-[#171715] text-[#F7F5F0]">
      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-24">
        <div className="grid gap-12 border-b border-white/15 pb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c7b28b]">La lettre de LA CAVE</p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl leading-none sm:text-5xl">Des nouvelles choisies, jamais trop nombreuses.</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex border-b border-white/50 lg:col-span-5 lg:col-start-8">
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Votre adresse e-mail" required className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#F7F5F0] outline-none placeholder:text-[#aaa49b]" aria-label="Adresse e-mail" />
            <button type="submit" className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#F7F5F0] transition-colors hover:text-[#c7b28b]">{subscribed ? "Inscription confirmée" : "S'inscrire"}</button>
          </form>
        </div>
        <div className="grid gap-10 py-14 text-sm leading-6 text-[#c9c4ba] sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="font-serif text-2xl text-[#F7F5F0]">LA CAVE</p><p className="mt-4 max-w-xs">Une sélection de grandes cuvées, accompagnée par une conservation attentive.</p></div>
          <div><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#c7b28b]">Découvrir</p><div className="mt-4 flex flex-col gap-2"><Link href="/champagnes">La collection</Link><Link href="/maisons">Les maisons</Link><Link href="/terroirs">Les terroirs</Link></div></div>
          <div><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#c7b28b]">La Maison</p><div className="mt-4 flex flex-col gap-2"><Link href="/philosophie">Notre philosophie</Link><Link href="/account">Mon compte</Link><Link href="/admin">Administration</Link></div></div>
          <div><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#c7b28b]">Conciergerie</p><p className="mt-4">12, avenue de Champagne<br />51200 Épernay<br />contact@lacave-champagne.fr</p></div>
        </div>
        <div className="flex flex-col gap-5 border-t border-white/15 pt-7 text-[10px] uppercase tracking-[0.12em] text-[#aaa49b] sm:flex-row sm:items-center sm:justify-between">
          <p>L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.</p>
          <p>© 2026 LA CAVE</p>
        </div>
      </div>
    </footer>
  );
}
