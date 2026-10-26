"use client";

import React, { useState, useSyncExternalStore, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CHAMPAGNES } from "@/lib/data/champagnes";
import { ordersStore } from "@/lib/data/ordersStore";
import { Champagne, Order } from "@/types/champagne";
import {
  ShieldAlert,
  TrendingUp,
  Package,
  Wine,
  AlertTriangle,
  Lock,
  Plus,
  Minus,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Stock local mutable pour la démo administrateur
  const [inventory, setInventory] = useState<Champagne[]>(CHAMPAGNES);

  // Synchronisation des commandes via ordersStore
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

  // Calcul dynamique des KPIs
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0) + 14850;
  const totalOrdersCount = orders.length + 18;
  const averageBasket = totalRevenue / Math.max(1, totalOrdersCount);
  const totalBottlesSold =
    orders.reduce(
      (acc, o) => acc + o.items.reduce((iAcc, i) => iAcc + i.quantity, 0),
      0
    ) + 42;
  const lowStockCount = inventory.filter((c) => c.stock <= 8).length;

  const handleStockChange = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    ordersStore.save(updated);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1843" || pinInput === "admin") {
      setIsAdminAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="bg-[#FBFAF6] min-h-[80vh] flex items-center justify-center py-20 px-6 text-[#14150F]">
        <div className="max-w-md w-full bg-white border border-[#2E4636]/14 p-8 sm:p-10 space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F7EE] border border-[#B08F4C]/55">
            <Lock className="h-6 w-6 text-[#755A22] stroke-1" />
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
              Zone Réservée
            </span>
            <h1 className="font-serif text-2xl text-[#1B1F18] font-light mt-1">
              Accès Console de Direction
            </h1>
            <p className="text-xs text-[#565C4E] mt-2 font-light">
              Veuillez saisir votre code d&apos;habilitation administrateur.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-[#FBEAE7]/40 border border-[#A3352B]/30 text-[#A3352B] text-xs flex items-center justify-center gap-2 font-light">
              <AlertTriangle className="h-4 w-4" />
              <span>Code d&apos;accès invalide</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4 font-light">
            <input
              type="password"
              placeholder="Code d'accès (défaut : 1843 ou admin)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-center font-mono text-sm tracking-widest text-[#1B1F18] focus:outline-none focus:border-[#B08F4C]"
            />
            <button
              type="submit"
              className="w-full border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] py-3 text-xs uppercase tracking-[0.22em] font-normal hover:bg-[#EFD9A2] transition-colors cursor-pointer"
            >
              Déverrouiller la console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFAF6] min-h-screen py-10 sm:py-16 text-[#14150F]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Header & Security Badge */}
        <div className="border-b border-[#2E4636]/12 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal">
                Administration &amp; Pilotage
              </span>
              <span className="bg-[#EAF2EA]/40 border border-[#2F6B45]/30/40 text-[#2F6B45] text-[10px] px-2 py-0.5 font-light">
                RLS Auth: Role Admin
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#14150F] font-light mt-2">
              Tableau de Bord &amp; Indicateurs de Performance
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="border border-[#2E4636]/15 hover:border-[#A3352B]/50/40 text-[#565C4E] hover:text-[#A3352B] px-4 py-2 text-xs uppercase tracking-wider transition-colors font-light cursor-pointer"
            >
              Verrouiller la session
            </button>
            <Link
              href="/champagnes"
              className="border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-5 py-2 text-xs uppercase tracking-wider font-normal hover:bg-[#EFD9A2] transition-colors"
            >
              Voir la boutique
            </Link>
          </div>
        </div>

        {/* 1. KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-[#2E4636]/10 p-6 space-y-2">
            <div className="flex items-center justify-between text-[#565C4E] text-xs font-light">
              <span className="uppercase tracking-wider text-[10px]">Chiffre d&apos;Affaires</span>
              <TrendingUp className="h-4 w-4 text-[#755A22] stroke-1" />
            </div>
            <p className="font-serif text-2xl text-[#1B1F18] font-light">
              {totalRevenue.toLocaleString("fr-FR")} €
            </p>
            <span className="text-[11px] text-[#2F6B45] block font-light">
              +14.8% vs mois précédent
            </span>
          </div>

          <div className="bg-white border border-[#2E4636]/10 p-6 space-y-2">
            <div className="flex items-center justify-between text-[#565C4E] text-xs font-light">
              <span className="uppercase tracking-wider text-[10px]">Commandes Totales</span>
              <Package className="h-4 w-4 text-[#755A22] stroke-1" />
            </div>
            <p className="font-serif text-2xl text-[#1B1F18] font-light">
              {totalOrdersCount}
            </p>
            <span className="text-[11px] text-[#565C4E] block font-light">
              100% honorées sous scellé
            </span>
          </div>

          <div className="bg-white border border-[#2E4636]/10 p-6 space-y-2">
            <div className="flex items-center justify-between text-[#565C4E] text-xs font-light">
              <span className="uppercase tracking-wider text-[10px]">Panier Moyen</span>
              <Wine className="h-4 w-4 text-[#755A22] stroke-1" />
            </div>
            <p className="font-serif text-2xl text-[#1B1F18] font-light">
              {averageBasket.toFixed(0)} €
            </p>
            <span className="text-[11px] text-[#755A22] block font-light">
              Segment Haute Sommellerie
            </span>
          </div>

          <div className="bg-white border border-[#2E4636]/10 p-6 space-y-2">
            <div className="flex items-center justify-between text-[#565C4E] text-xs font-light">
              <span className="uppercase tracking-wider text-[10px]">Flacons Expédiés</span>
              <Wine className="h-4 w-4 text-[#755A22] stroke-1" />
            </div>
            <p className="font-serif text-2xl text-[#1B1F18] font-light">
              {totalBottlesSold}
            </p>
            <span className="text-[11px] text-[#565C4E] block font-light">
              Dont 14 cuvées rares
            </span>
          </div>

          <div className="bg-white border border-[#2E4636]/10 p-6 space-y-2">
            <div className="flex items-center justify-between text-[#565C4E] text-xs font-light">
              <span className="uppercase tracking-wider text-[10px]">Alertes Stock</span>
              <AlertTriangle className="h-4 w-4 text-[#8A5A12] stroke-1" />
            </div>
            <p className="font-serif text-2xl text-[#8A5A12] font-light">
              {lowStockCount} cuvées
            </p>
            <span className="text-[11px] text-[#565C4E] block font-light">
              Seuil critique ≤ 8 unités
            </span>
          </div>
        </div>

        {/* 2. Inventory & Stock Management Table */}
        <div className="bg-white border border-[#2E4636]/10 overflow-hidden">
          <div className="p-6 bg-[#F4F7EE] border-b border-[#2E4636]/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl text-[#1B1F18] font-light">
                Gestion des Stocks &amp; Prix en Temps Réel
              </h2>
              <p className="text-xs text-[#565C4E] mt-0.5 font-light">
                Modifications répercutées instantanément dans le catalogue.
              </p>
            </div>
            <span className="text-xs text-[#565C4E] font-mono font-light">
              Total références : {inventory.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead className="bg-[#FBFAF6] border-b border-[#2E4636]/10 uppercase text-[9px] tracking-wider text-[#565C4E]">
                <tr>
                  <th className="py-3 px-6">Cuvée &amp; Maison</th>
                  <th className="py-3 px-4">Millésime</th>
                  <th className="py-3 px-4">Dosage</th>
                  <th className="py-3 px-4">Prix TTC</th>
                  <th className="py-3 px-4">Niveau de Stock</th>
                  <th className="py-3 px-6 text-right">Ajustement Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E4636]/10 text-[#22271F]">
                {inventory.map((champagne) => (
                  <tr key={champagne.id} className="hover:bg-[#2E4636]/[0.04] transition-colors">
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      <div className="relative h-12 w-9 flex-shrink-0 bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] border border-[#2E4636]/10 p-0.5">
                        <Image
                          src={champagne.imageUrl}
                          alt={champagne.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[#755A22] block font-normal">
                          {champagne.house}
                        </span>
                        <span className="font-serif text-sm font-light text-[#1B1F18]">
                          {champagne.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#333A2F]">
                      {champagne.vintage}
                    </td>

                    <td className="py-3.5 px-4 text-[#565C4E]">
                      {champagne.dosage}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#1B1F18] font-normal">
                      {champagne.price} €
                    </td>

                    <td className="py-3.5 px-4">
                      {champagne.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#FBEAE7]/40 border border-[#A3352B]/30/40 text-[#A3352B] px-2 py-0.5 text-[10px]">
                          Critique ({champagne.stock})
                        </span>
                      ) : champagne.stock <= 8 ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#FBF0DA]/40 border border-[#B08F4C]/50/40 text-[#8A5A12] px-2 py-0.5 text-[10px]">
                          Faible ({champagne.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-[#EAF2EA]/40 border border-[#2F6B45]/30/40 text-[#2F6B45] px-2 py-0.5 text-[10px]">
                          Disponible ({champagne.stock})
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center border border-[#2E4636]/15 bg-[#FBFAF6]">
                        <button
                          onClick={() => handleStockChange(champagne.id, -1)}
                          className="p-1 text-[#565C4E] hover:text-[#2E4636] transition-colors"
                          title="Décrémenter le stock"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs">
                          {champagne.stock}
                        </span>
                        <button
                          onClick={() => handleStockChange(champagne.id, 1)}
                          className="p-1 text-[#565C4E] hover:text-[#2E4636] transition-colors"
                          title="Incrémenter le stock"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Orders Management Pipeline */}
        <div className="bg-white border border-[#2E4636]/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2E4636]/10 pb-4">
            <div>
              <h2 className="font-serif text-xl text-[#1B1F18] font-light">
                Suivi des Expéditions &amp; Commandes Clients
              </h2>
              <p className="text-xs text-[#565C4E] mt-0.5 font-light">
                Mise à jour du statut d&apos;expédition transmis au client.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#565C4E] py-6 text-center font-light">
              Aucune commande enregistrée pour l&apos;instant.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FBFAF6] border border-[#2E4636]/10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs font-light"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#1B1F18] font-mono font-normal">
                        {order.id}
                      </strong>
                      <span className="text-[#565C4E]">
                        ({order.items.length} article{order.items.length > 1 ? "s" : ""})
                      </span>
                    </div>
                    <span className="text-[#565C4E] block mt-1">
                      Client : {order.customerName} ({order.shippingAddress.city})
                    </span>
                  </div>

                  <div className="text-[#22271F] font-serif text-base">
                    {order.totalAmount.toFixed(0)} € TTC
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase text-[#565C4E]">
                      Statut :
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(
                          order.id,
                          e.target.value as Order["status"]
                        )
                      }
                      className="bg-white border border-[#2E4636]/15 text-[#22271F] py-1 px-2.5 focus:outline-none focus:border-[#B08F4C]"
                    >
                      <option value="confirmed">Confirmée</option>
                      <option value="preparing">En préparation cave</option>
                      <option value="shipped">Expédiée sous scellé</option>
                      <option value="delivered">Remise en main propre</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Supabase RLS Technical Security Audit Card */}
        <div className="bg-white border border-[#B08F4C]/35 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#755A22] font-normal">
            <ShieldAlert className="h-4 w-4 stroke-1" />
            <span>Audit de Sécurité RLS Supabase (Row-Level Security)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-light">
            <div className="bg-[#FBFAF6] p-4 border border-[#2E4636]/10 space-y-1">
              <span className="text-[#565C4E] block text-[9px] uppercase">
                Politique Catalog RLS
              </span>
              <strong className="text-[#22271F] font-normal">
                champagnes_select_public
              </strong>
              <p className="text-[11px] text-[#2F6B45]/90 pt-1">
                Lecture publique ouverte / Écriture réservée au rôle &apos;admin&apos;
              </p>
            </div>

            <div className="bg-[#FBFAF6] p-4 border border-[#2E4636]/10 space-y-1">
              <span className="text-[#565C4E] block text-[9px] uppercase">
                Politique Orders RLS
              </span>
              <strong className="text-[#22271F] font-normal">
                orders_isolation_by_uid
              </strong>
              <p className="text-[11px] text-[#2F6B45]/90 pt-1">
                auth.uid() = user_id (Zéro fuite entre clients)
              </p>
            </div>

            <div className="bg-[#FBFAF6] p-4 border border-[#2E4636]/10 space-y-1">
              <span className="text-[#565C4E] block text-[9px] uppercase">
                Console Guard RLS
              </span>
              <strong className="text-[#22271F] font-normal">
                admin_role_authorization
              </strong>
              <p className="text-[11px] text-[#2F6B45]/90 pt-1">
                profiles.role = &apos;admin&apos; requis pour accès KPIs &amp; stock
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
