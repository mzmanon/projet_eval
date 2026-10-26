"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { mapOrderRow } from "@/lib/orders/map";
import { formatEuro } from "@/lib/checkout/pricing";
import type { Order } from "@/types/champagne";
import type { OrderWithItemsRow } from "@/types/order";
import ProductImage from "@/components/product/ProductImage";
import {
  User as UserIcon,
  Package,
  Shield,
  KeyRound,
  CheckCircle2,
  Clock,
  Wine,
  LogOut,
  Loader2,
  AlertCircle,
  RefreshCw,
  Lock,
} from "lucide-react";

type AccountTab = "orders" | "profile" | "auth";
type AuthMode = "login" | "register";

function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Veuillez confirmer votre adresse email avant de vous connecter.";
  }
  if (normalized.includes("already registered")) {
    return "Un compte existe déjà avec cette adresse email.";
  }
  if (normalized.includes("password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (normalized.includes("unable to validate email")) {
    return "Cette adresse email n'est pas valide.";
  }
  if (
    normalized.includes("fetch") ||
    normalized.includes("network") ||
    normalized.includes("placeholder")
  ) {
    return "Supabase est injoignable. Vérifiez les variables d'environnement.";
  }

  return message;
}

function getOrderStatus(order: Order) {
  if (order.status === "cancelled") {
    return {
      label: "Annulée",
      className: "bg-red-950/50 border-red-800/50 text-red-300",
      icon: AlertCircle,
    };
  }
  if (order.paymentStatus === "failed") {
    return {
      label: "Paiement échoué",
      className: "bg-red-950/50 border-red-800/50 text-red-300",
      icon: AlertCircle,
    };
  }
  if (order.paymentStatus === "unpaid" || order.paymentStatus === "processing") {
    return {
      label:
        order.paymentStatus === "processing"
          ? "Paiement en cours de confirmation"
          : "En attente de paiement",
      className: "bg-amber-950/50 border-amber-800/50 text-amber-300",
      icon: Clock,
    };
  }
  if (order.status === "delivered") {
    return {
      label: "Remise en main propre",
      className: "bg-emerald-950/60 border-emerald-800/40 text-emerald-400",
      icon: CheckCircle2,
    };
  }
  if (order.status === "shipped") {
    return {
      label: "Expédiée sous scellé",
      className: "bg-emerald-950/60 border-emerald-800/40 text-emerald-400",
      icon: Package,
    };
  }
  if (order.status === "preparing") {
    return {
      label: "En préparation en cave",
      className: "bg-emerald-950/60 border-emerald-800/40 text-emerald-400",
      icon: Wine,
    };
  }

  return {
    label: "Payée • En préparation en cave",
    className: "bg-emerald-950/60 border-emerald-800/40 text-emerald-400",
    icon: CheckCircle2,
  };
}

function initialsFor(user: User | null): string {
  const fullName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "";
  if (fullName.trim()) {
    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }
  return user?.email?.charAt(0).toUpperCase() ?? "LC";
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>("orders");
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [user, setUser] = useState<User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);

  const [fullName, setFullName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  const supabaseConfigured = getSupabasePublicConfig().configured;

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setUser(data.session?.user ?? null);
        setIsSessionLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setIsSessionLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (!nextUser) {
        setOrders([]);
        setOrdersError(null);
        setIsOrdersLoading(false);
      }
      setIsSessionLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const currentUser = user;
    let active = true;

    async function loadOrders() {
      setIsOrdersLoading(true);
      setOrdersError(null);

      try {
        const supabase = createClient();
        const selectColumns = "*, order_items(*)";

        const { data: ownRows, error: ownError } = await supabase
          .from("orders")
          .select(selectColumns)
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (ownError) {
          throw new Error(ownError.message);
        }

        let guestRows: OrderWithItemsRow[] = [];
        if (currentUser.email) {
          const { data, error } = await supabase
            .from("orders")
            .select(selectColumns)
            .is("user_id", null)
            .eq("customer_email", currentUser.email.toLowerCase())
            .order("created_at", { ascending: false });

          if (!error && data) {
            guestRows = data as unknown as OrderWithItemsRow[];
          }
        }

        const byId = new Map<string, OrderWithItemsRow>();
        for (const row of [
          ...((ownRows ?? []) as unknown as OrderWithItemsRow[]),
          ...guestRows,
        ]) {
          byId.set(row.id, row);
        }

        const mapped = Array.from(byId.values())
          .map(mapOrderRow)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        if (active) setOrders(mapped);
      } catch (error) {
        if (active) {
          setOrdersError(
            error instanceof Error
              ? error.message
              : "Impossible de charger votre historique."
          );
        }
      } finally {
        if (active) setIsOrdersLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, [user, ordersRefreshKey]);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    setAuthNotice(null);
    setIsAuthSubmitting(true);

    try {
      if (!supabaseConfigured) {
        throw new Error(
          "Supabase n'est pas configuré. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local."
        );
      }

      const supabase = createClient();
      const cleanEmail = authEmail.trim().toLowerCase();

      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: authPassword,
        });
        if (error) throw error;
        setAuthPassword("");
        setActiveTab("orders");
      } else {
        const cleanName = fullName.trim();
        if (!cleanName) {
          throw new Error("Veuillez renseigner votre nom complet.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: authPassword,
          options: {
            data: { full_name: cleanName },
          },
        });
        if (error) throw error;

        setAuthPassword("");
        if (data.session) {
          setActiveTab("orders");
        } else {
          setAuthNotice(
            "Compte créé. Consultez votre boîte email pour confirmer votre adresse, puis connectez-vous."
          );
          setAuthMode("login");
        }
      }
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? translateAuthError(error.message)
          : "Une erreur d'authentification est survenue."
      );
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setActiveTab("orders");
    setAuthError(null);
    setAuthNotice(null);
    setAuthPassword("");
    setOrders([]);
    setOrdersError(null);
    setIsOrdersLoading(false);
  };

  const displayName =
    typeof user?.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : user?.email ?? "Client LA CAVE";

  return (
    <div className="luxury-page min-h-screen py-16 sm:py-20">
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
            <p className="text-xs text-neutral-400 mt-2">
              {user
                ? `Connecté en tant que ${displayName}`
                : "Connectez-vous pour retrouver vos commandes et vos informations."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-neutral-400 bg-[#141414] border border-white/5 px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-[#C5A059]" />
              Supabase Auth • RLS par utilisateur
            </span>
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 border border-white/10 px-3 py-1.5 text-xs text-neutral-400 hover:text-red-400 hover:border-red-400/40 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Déconnexion</span>
              </button>
            )}
          </div>
        </div>

        {!supabaseConfigured && (
          <div className="mt-8 flex items-start gap-2 border border-amber-500/40 bg-amber-950/20 px-4 py-3 text-xs text-amber-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Supabase n&apos;est pas encore configuré. Renseignez{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              dans <code className="font-mono">.env.local</code>.
            </span>
          </div>
        )}

        {/* Tab buttons */}
        <div className="flex gap-8 overflow-x-auto border-b border-white/10 mt-8 text-xs uppercase tracking-widest font-medium">
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
            <UserIcon className="h-4 w-4" />
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
            <span>{user ? "Mon Compte" : "Connexion & Inscription"}</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="mt-10 space-y-8">
            {isSessionLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#C5A059] mx-auto" />
              </div>
            ) : !user ? (
              <div className="bg-[#121212] border border-[#C5A059]/20 p-10 sm:p-14 text-center max-w-xl mx-auto space-y-5">
                <Lock className="h-10 w-10 text-[#C5A059] mx-auto" />
                <h2 className="font-serif text-2xl text-neutral-100 font-light">
                  Votre historique vous attend
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Connectez-vous pour consulter vos commandes, leur statut de
                  préparation et leur suivi d&apos;expédition. Les commandes
                  passées en invité avec la même adresse email seront également
                  rattachées à votre compte.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("auth")}
                  className="inline-flex items-center gap-2 bg-[#C5A059] text-[#0A0A0A] px-7 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#DFC282] transition-colors"
                >
                  <KeyRound className="h-4 w-4" />
                  Se connecter
                </button>
              </div>
            ) : isOrdersLoading ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="h-7 w-7 animate-spin text-[#C5A059] mx-auto" />
                <p className="text-xs text-neutral-400">
                  Chargement de vos commandes…
                </p>
              </div>
            ) : ordersError ? (
              <div className="bg-[#121212] border border-red-800/50 p-8 text-center max-w-xl mx-auto space-y-4">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
                <p className="text-sm text-red-300">
                  Impossible de charger l&apos;historique : {ordersError}
                </p>
                <button
                  type="button"
                  onClick={() => setOrdersRefreshKey((key) => key + 1)}
                  className="inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 text-xs uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Réessayer
                </button>
              </div>
            ) : orders.length === 0 ? (
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
              <>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOrdersRefreshKey((key) => key + 1)}
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-[#C5A059] transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Actualiser
                  </button>
                </div>

                {orders.map((order) => {
                  const status = getOrderStatus(order);
                  const StatusIcon = status.icon;

                  return (
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
                            {order.orderNumber ?? order.id}
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
                            {formatEuro(order.totalAmount)}
                          </strong>
                        </div>

                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 border text-xs px-3 py-1 ${status.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            <span>{status.label}</span>
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="p-6 divide-y divide-white/5">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-${item.champagneId}-${idx}`}
                            className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-12 flex-shrink-0 bg-[#181818] border border-white/5 p-1">
                                <ProductImage
                                  src={item.imageUrl}
                                  alt={item.name}
                                  house={item.house}
                                  name={item.name}
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
                                  Millésime {item.vintage} • Quantité :{" "}
                                  {item.quantity}
                                </span>
                              </div>
                            </div>

                            <span className="font-mono text-sm text-neutral-200">
                              {formatEuro(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order footer */}
                      <div className="px-6 py-4 bg-[#141414] border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#C5A059]" />
                          {order.paymentStatus === "paid"
                            ? "Paiement Stripe confirmé"
                            : "En attente de confirmation du paiement"}
                        </span>
                        <span>
                          Adresse : {order.shippingAddress.street},{" "}
                          {order.shippingAddress.city}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === "profile" && (
          <div className="mt-10 max-w-2xl bg-[#121212] border border-white/5 p-8 space-y-6">
            {!user ? (
              <div className="text-center py-8 space-y-4">
                <UserIcon className="h-10 w-10 text-[#C5A059] mx-auto" />
                <p className="text-xs text-neutral-400">
                  Connectez-vous pour consulter vos informations personnelles.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("auth")}
                  className="bg-[#C5A059] text-[#0A0A0A] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold"
                >
                  Se connecter
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#181818] border border-[#C5A059]">
                    <span className="font-serif text-2xl text-[#C5A059]">
                      {initialsFor(user)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-neutral-100">
                      {displayName}
                    </h3>
                    <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-medium">
                      Client Privilège LA CAVE
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">
                      Email du compte
                    </span>
                    <span className="text-neutral-200 font-medium break-all">
                      {user.email ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">
                      Statut du compte
                    </span>
                    <span className="text-emerald-400 font-medium">
                      Authentifié • Session Supabase
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">
                      Membre depuis
                    </span>
                    <span className="text-neutral-200">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">
                      Sécurité des données
                    </span>
                    <span className="text-neutral-300">
                      Isolation RLS • Chiffrement SSL 256-bit
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 border border-white/10 px-5 py-2.5 text-xs uppercase tracking-wider text-neutral-400 hover:text-red-400 hover:border-red-400/40 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 3: Auth */}
        {activeTab === "auth" && (
          <div className="mt-10 max-w-md mx-auto bg-[#121212] border border-white/10 p-8 space-y-6">
            {user ? (
              <div className="text-center space-y-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#181818] border border-[#C5A059] mx-auto">
                  <span className="font-serif text-2xl text-[#C5A059]">
                    {initialsFor(user)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
                    Session Authentifiée
                  </span>
                  <h3 className="font-serif text-2xl text-neutral-100 font-light mt-1">
                    {displayName}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 break-all">
                    {user.email}
                  </p>
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Votre historique est synchronisé avec Supabase</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="w-full bg-[#C5A059] text-[#0A0A0A] py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#DFC282] transition-colors"
                  >
                    Voir mes commandes
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full border border-white/10 py-3.5 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-red-400 hover:border-red-400/40 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block">
                    Portail d&apos;Accès Sécurisé
                  </span>
                  <h3 className="font-serif text-2xl text-neutral-100 font-light">
                    {authMode === "login"
                      ? "Connexion Client"
                      : "Créer un Compte"}
                  </h3>
                  <p className="text-[11px] text-neutral-400 pt-1">
                    {authMode === "login"
                      ? "Retrouvez vos commandes et votre historique d'allocations."
                      : "Les commandes passées avec cet email vous seront rattachées."}
                  </p>
                </div>

                {authNotice && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{authNotice}</span>
                  </div>
                )}

                {authError && (
                  <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                  {authMode === "register" && (
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-neutral-400 mb-1.5 uppercase tracking-wider"
                      >
                        Nom complet
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="authEmail"
                      className="block text-neutral-400 mb-1.5 uppercase tracking-wider"
                    >
                      Adresse email
                    </label>
                    <input
                      id="authEmail"
                      type="email"
                      autoComplete="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="authPassword"
                      className="block text-neutral-400 mb-1.5 uppercase tracking-wider"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="authPassword"
                      type="password"
                      autoComplete={
                        authMode === "login" ? "current-password" : "new-password"
                      }
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      minLength={6}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                    {authMode === "register" && (
                      <span className="block text-[10px] text-neutral-500 mt-1.5">
                        6 caractères minimum.
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-[#0A0A0A] py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#DFC282] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isAuthSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <span>
                      {authMode === "login"
                        ? "Accéder à mon espace"
                        : "Finaliser mon inscription"}
                    </span>
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode((mode) =>
                        mode === "login" ? "register" : "login"
                      );
                      setAuthError(null);
                      setAuthNotice(null);
                    }}
                    className="text-xs text-neutral-400 hover:text-[#C5A059] transition-colors underline"
                  >
                    {authMode === "login"
                      ? "Nouveau client ? Créer un compte privilégié"
                      : "Déjà membre ? Se connecter"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
