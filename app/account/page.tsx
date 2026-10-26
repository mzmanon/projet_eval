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
    <div className="bg-[#FBFAF6] min-h-screen py-12 sm:py-16 text-[#14150F]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="border-b border-[#2E4636]/12 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
              Espace Client Privilège
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#14150F] font-light mt-2">
              Le Salon des Allocations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-[#565C4E] bg-white border border-[#2E4636]/10 px-3.5 py-1.5 font-light">
              <Shield className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
              Protection Supabase RLS Active
            </span>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap border-b border-[#2E4636]/12 mt-8 gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] font-light">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "border-[#B08F4C] text-[#755A22]"
                : "border-transparent text-[#565C4E] hover:text-[#2E4636]"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Historique des Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "border-[#B08F4C] text-[#755A22]"
                : "border-transparent text-[#565C4E] hover:text-[#2E4636]"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Informations Personnelles</span>
          </button>

          <button
            onClick={() => setActiveTab("auth")}
            className={`pb-4 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "auth"
                ? "border-[#B08F4C] text-[#755A22]"
                : "border-transparent text-[#565C4E] hover:text-[#2E4636]"
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
              <div className="bg-white border border-[#2E4636]/10 p-12 text-center max-w-lg mx-auto">
                <Wine className="h-10 w-10 text-[#755A22] mx-auto mb-4 stroke-1" />
                <h3 className="font-serif text-xl text-[#22271F] font-light">
                  Aucune commande enregistrée
                </h3>
                <p className="text-xs text-[#565C4E] mt-2 font-light">
                  Vos futures acquisitions de prestige apparaîtront ici avec leur
                  suivi en temps réel.
                </p>
                <div className="mt-6">
                  <Link
                    href="/champagnes"
                    className="inline-block border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-normal hover:bg-[#EFD9A2] transition-colors"
                  >
                    Visiter la cave
                  </Link>
                </div>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#2E4636]/10 overflow-hidden"
                >
                  {/* Order header */}
                  <div className="p-6 bg-[#F4F7EE] border-b border-[#2E4636]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-light">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#565C4E] block">
                        Référence de commande
                      </span>
                      <strong className="text-[#1B1F18] font-mono text-sm font-normal">
                        {order.id}
                      </strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#565C4E] block">
                        Date de commande
                      </span>
                      <span className="text-[#333A2F]">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#565C4E] block">
                        Montant Total TTC
                      </span>
                      <strong className="text-[#755A22] font-serif text-base font-light">
                        {order.totalAmount.toFixed(0)} €
                      </strong>
                    </div>

                    <div>
                      <span className="inline-flex items-center gap-1.5 bg-[#EAF2EA]/40 border border-[#2F6B45]/30/30 text-[#2F6B45] text-xs px-3 py-1 font-light">
                        <CheckCircle2 className="h-3.5 w-3.5 stroke-1" />
                        <span>Confirmée • En préparation en cave</span>
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="p-6 divide-y divide-[#2E4636]/10">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-12 flex-shrink-0 bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] border border-[#2E4636]/10 p-1">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="font-light">
                            <span className="text-[9px] uppercase tracking-widest text-[#755A22] block">
                              {item.house}
                            </span>
                            <span className="font-serif text-sm text-[#22271F]">
                              {item.name}
                            </span>
                            <span className="text-xs text-[#565C4E] block font-light">
                              Millésime {item.vintage} • Quantité : {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono text-sm text-[#22271F] font-light">
                          {(item.price * item.quantity).toFixed(0)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="px-6 py-4 bg-[#FBFAF6] border-t border-[#2E4636]/10 flex flex-wrap items-center justify-between text-xs text-[#565C4E] gap-2 font-light">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#755A22] stroke-1" />
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
          <div className="mt-10 max-w-2xl bg-white border border-[#2E4636]/10 p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-[#2E4636]/10 pb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F7EE] border border-[#B08F4C]/55">
                <span className="font-serif text-xl text-[#755A22]">JM</span>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#1B1F18] font-light">
                  Jean de Montmirail
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-[#755A22] font-light">
                  Membre Privilège du Cercle des Initiés
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-light">
              <div>
                <span className="text-[#585F50] block text-[9px] uppercase tracking-wider">
                  Email du compte
                </span>
                <span className="text-[#22271F]">
                  amateur.eclat@haute-champagne.fr
                </span>
              </div>
              <div>
                <span className="text-[#585F50] block text-[9px] uppercase tracking-wider">
                  Statut d&apos;Allocation
                </span>
                <span className="text-[#2F6B45]">
                  Accès Prioritaire Grands Crus
                </span>
              </div>
              <div>
                <span className="text-[#585F50] block text-[9px] uppercase tracking-wider">
                  Adresse de livraison principale
                </span>
                <span className="text-[#22271F]">
                  24, Rue du Faubourg Saint-Honoré, 75008 Paris
                </span>
              </div>
              <div>
                <span className="text-[#585F50] block text-[9px] uppercase tracking-wider">
                  Sécurité des données
                </span>
                <span className="text-[#333A2F]">
                  Conforme RGPD &amp; Chiffrement SSL 256-bit
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Auth simulation */}
        {activeTab === "auth" && (
          <div className="mt-10 max-w-md mx-auto bg-white border border-[#2E4636]/14 p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#755A22] font-normal block">
                Portail d&apos;Accès Sécurisé
              </span>
              <h3 className="font-serif text-2xl text-[#1B1F18] font-light">
                {authMode === "login" ? "Connexion Client" : "Créer un Compte"}
              </h3>
            </div>

            {authSuccess && (
              <div className="p-3 bg-[#EAF2EA]/40 border border-[#2F6B45]/30 text-[#2F6B45] text-xs text-center flex items-center justify-center gap-2 font-light">
                <CheckCircle2 className="h-4 w-4 stroke-1" />
                <span>Session authentifiée avec succès</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-light">
              <div>
                <label className="block text-[#565C4E] mb-1.5 uppercase tracking-wider text-[10px]">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-[#22271F] focus:outline-none focus:border-[#B08F4C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#565C4E] mb-1.5 uppercase tracking-wider text-[10px]">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-[#22271F] focus:outline-none focus:border-[#B08F4C]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] py-3 text-xs uppercase tracking-[0.22em] font-normal hover:bg-[#EFD9A2] transition-colors cursor-pointer"
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
                className="text-xs text-[#565C4E] hover:text-[#755A22] transition-colors underline font-light"
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
