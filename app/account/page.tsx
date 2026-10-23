"use client";

import React, { useState, useSyncExternalStore, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types/champagne";
import { ordersStore } from "@/lib/data/ordersStore";
import {
  User,
  Package,
  Shield,
  KeyRound,
  CheckCircle2,
  Clock,
  Wine,
} from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "auth">("orders");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("amateur.eclat@haute-champagne.fr");
  const [authPassword, setAuthPassword] = useState("••••••••••••");
  const [authSuccess, setAuthSuccess] = useState(false);

  // Sync orders reactively without set-state-in-effect
  const rawOrders = useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.getSnapshot,
    ordersStore.getServerSnapshot
  );

  const orders: Order[] = useMemo(() => {
    try {
      return JSON.parse(rawOrders);
    } catch {
      return [];
    }
  }, [rawOrders]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSuccess(true);
    setTimeout(() => {
      setActiveTab("orders");
    }, 1000);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
              Espace Client Privilège
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#FCFBF9] font-light mt-2">
              Le Salon des Allocations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400 bg-[#141414] border border-white/5 px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-[#C5A059]" />
              Protection Supabase RLS Active
            </span>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-white/10 mt-8 gap-8 text-xs uppercase tracking-widest font-medium">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "orders"
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Historique des Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "profile"
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Informations Personnelles</span>
          </button>

          <button
            onClick={() => setActiveTab("auth")}
            className={`pb-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "auth"
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>Connexion &amp; Inscription</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="mt-10 space-y-8">
            {orders.length === 0 ? (
              <div className="bg-[#121212] border border-white/5 p-12 text-center max-w-lg mx-auto">
                <Wine className="h-10 w-10 text-[#C5A059] mx-auto mb-4" />
                <h3 className="font-serif text-xl text-neutral-200">
                  Aucune commande enregistrée
                </h3>
                <p className="text-xs text-neutral-400 mt-2">
                  Vos futures acquisitions de prestige apparaîtront ici avec leur
                  suivi en temps réel.
                </p>
                <div className="mt-6">
                  <Link
                    href="/champagnes"
                    className="inline-block bg-[#C5A059] text-[#0A0A0A] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold"
                  >
                    Visiter la cave
                  </Link>
                </div>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#121212] border border-white/5 overflow-hidden"
                >
                  {/* Order header */}
                  <div className="p-6 bg-[#161616] border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                        Référence de commande
                      </span>
                      <strong className="text-neutral-100 font-mono text-sm">
                        {order.id}
                      </strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                        Date de commande
                      </span>
                      <span className="text-neutral-300">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                        Montant Total TTC
                      </span>
                      <strong className="text-[#C5A059] font-serif text-base">
                        {order.totalAmount.toFixed(0)} €
                      </strong>
                    </div>

                    <div>
                      <span className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Confirmée • En préparation en cave</span>
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="p-6 divide-y divide-white/5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-12 flex-shrink-0 bg-[#181818] border border-white/5 p-1">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] block">
                              {item.house}
                            </span>
                            <span className="font-serif text-sm text-neutral-200">
                              {item.name}
                            </span>
                            <span className="text-xs text-neutral-400 block">
                              Millésime {item.vintage} • Quantité : {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono text-sm text-neutral-200">
                          {(item.price * item.quantity).toFixed(0)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="px-6 py-4 bg-[#141414] border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#C5A059]" />
                      Livraison programmée sous scellé isotherme
                    </span>
                    <span>
                      Adresse : {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === "profile" && (
          <div className="mt-10 max-w-2xl bg-[#121212] border border-white/5 p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#181818] border border-[#C5A059]">
                <span className="font-serif text-2xl text-[#C5A059]">JM</span>
              </div>
              <div>
                <h3 className="font-serif text-xl text-neutral-100">
                  Jean de Montmirail
                </h3>
                <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-medium">
                  Membre Privilège du Cercle des Initiés
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Email du compte
                </span>
                <span className="text-neutral-200 font-medium">
                  amateur.eclat@haute-champagne.fr
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Statut d&apos;Allocation
                </span>
                <span className="text-emerald-400 font-medium">
                  Accès Prioritaire Grands Crus
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Adresse de livraison principale
                </span>
                <span className="text-neutral-200">
                  24, Rue du Faubourg Saint-Honoré, 75008 Paris
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Sécurité des données
                </span>
                <span className="text-neutral-300">
                  Conforme RGPD &amp; Chiffrement SSL 256-bit
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Auth simulation */}
        {activeTab === "auth" && (
          <div className="mt-10 max-w-md mx-auto bg-[#121212] border border-white/10 p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
                Portail d&apos;Accès Sécurisé
              </span>
              <h3 className="font-serif text-2xl text-neutral-100 font-light">
                {authMode === "login" ? "Connexion Client" : "Créer un Compte"}
              </h3>
            </div>

            {authSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Session authentifiée avec succès</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C5A059] text-[#0A0A0A] py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#DFC282] transition-colors"
              >
                {authMode === "login"
                  ? "Accéder à mon espace"
                  : "Finaliser mon inscription"}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() =>
                  setAuthMode((m) => (m === "login" ? "register" : "login"))
                }
                className="text-xs text-neutral-400 hover:text-[#C5A059] transition-colors underline"
              >
                {authMode === "login"
                  ? "Nouveau client ? Créer un compte privilégié"
                  : "Déjà membre ? Se connecter"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
