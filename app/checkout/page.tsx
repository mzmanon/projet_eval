"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import {
  formatEuro,
  getFreeShippingProgress,
  getMissingAmountForFreeShipping,
  getShippingCost,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/checkout/pricing";
import { AlertCircle, ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  specialInstructions: string;
}

const EMPTY_FORM: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "France",
  specialInstructions: "",
};

function PaymentCancelledNotice() {
  const searchParams = useSearchParams();

  if (searchParams.get("annule") !== "1") {
    return null;
  }

  return (
    <div className="mb-8 flex items-start gap-2 border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-500">
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <span>
        Le paiement a été interrompu. Votre panier est conservé : vous pouvez
        reprendre la validation quand vous le souhaitez.
      </span>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = getShippingCost(totalPrice);
  const finalTotal = totalPrice + shippingCost;
  const missingForFreeShipping = getMissingAmountForFreeShipping(totalPrice);
  const progressRatio = getFreeShippingProgress(totalPrice);

  useEffect(() => {
    let cancelled = false;

    async function prefillAccount() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (!user || cancelled) return;

        const fullName =
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : "";
        const [firstName = "", ...lastNameParts] = fullName.split(" ");

        setAccountEmail(user.email ?? null);
        setFormData((previous) => ({
          ...previous,
          email: previous.email || user.email || "",
          firstName: previous.firstName || firstName,
          lastName: previous.lastName || lastNameParts.join(" "),
        }));
      } catch {
        // Supabase non configuré : le paiement invité reste possible.
      }
    }

    prefillAccount();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ champagne, quantity }) => ({
            champagneId: champagne.id,
            quantity,
          })),
          customer: formData,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        throw new Error(
          payload.error ??
            "Le paiement n'a pas pu être initialisé. Veuillez réessayer."
        );
      }

      window.location.assign(payload.url);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue pendant la préparation du paiement."
      );
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="luxury-page min-h-[70vh] flex items-center justify-center py-20 px-6 text-center">
        <div className="space-y-4">
          <h1 className="font-serif text-3xl text-neutral-200 font-light">
            Votre panier est actuellement vide
          </h1>
          <p className="text-xs text-neutral-400">
            Veuillez sélectionner au moins une cuvée avant de passer votre
            commande.
          </p>
          <div className="pt-4">
            <Link
              href="/champagnes"
              className="inline-flex items-center gap-2 border border-[#C5A059] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0A0A0A] transition-colors"
            >
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-page min-h-screen py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-400">
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continuer la sélection</span>
          </Link>
          <span>/</span>
          <span className="text-[#C5A059]">Validation de Commande</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#FCFBF9] font-light mb-4">
          Finalisation de votre Acquisition
        </h1>

        <p className="text-xs text-neutral-400 mb-10 max-w-2xl">
          Après validation, vous serez redirigé vers la page de paiement sécurisée
          Stripe. Aucune donnée bancaire ne transite par nos serveurs.
        </p>

        <Suspense fallback={null}>
          <PaymentCancelledNotice />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Coordonnées */}
              <div className="bg-[#121212] border border-white/5 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="font-serif text-xl text-neutral-100 font-light">
                    1. Coordonnées &amp; Contact
                  </h2>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                    {accountEmail ? "Compte Privilège" : "Commande Invité"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                    >
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      required
                      maxLength={80}
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                    >
                      Nom de famille
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      required
                      maxLength={80}
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                    >
                      Adresse email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                    >
                      Téléphone pour le coursier
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      required
                      maxLength={40}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500">
                  {accountEmail ? (
                    <>
                      Vous êtes connecté avec{" "}
                      <span className="text-[#C5A059]">{accountEmail}</span>. La
                      commande sera automatiquement ajoutée à votre historique.
                    </>
                  ) : (
                    <>
                      Vous commandez en tant qu&apos;invité.{" "}
                      <Link
                        href="/account"
                        className="text-[#C5A059] underline hover:no-underline"
                      >
                        Connectez-vous
                      </Link>{" "}
                      pour retrouver ensuite cet achat dans votre historique.
                    </>
                  )}
                </p>
              </div>

              {/* Adresse de livraison */}
              <div className="bg-[#121212] border border-white/5 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="font-serif text-xl text-neutral-100 font-light">
                    2. Adresse de Livraison Sécurisée
                  </h2>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                    Packaging Isotherme Offert
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                  >
                    Adresse postale
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    required
                    maxLength={200}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                    >
                      Code postal
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      autoComplete="postal-code"
                      required
                      maxLength={20}
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                    >
                      Ville
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      required
                      maxLength={120}
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                    >
                      Pays
                    </label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      autoComplete="country-name"
                      readOnly
                      value={formData.country}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="specialInstructions"
                    className="block text-xs uppercase tracking-wider text-neutral-400 mb-2"
                  >
                    Instructions spécifiques de remise
                  </label>
                  <textarea
                    id="specialInstructions"
                    rows={2}
                    name="specialInstructions"
                    maxLength={500}
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="w-full bg-[#181818] border border-white/10 px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-[#C5A059] text-[#0A0A0A] py-4 px-8 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[#DFC282] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>
                  {isSubmitting
                    ? "Redirection vers Stripe…"
                    : `Payer avec Stripe • ${formatEuro(finalTotal)} TTC`}
                </span>
              </button>

              <p className="text-[10px] text-center text-neutral-500 leading-relaxed">
                En validant, vous acceptez nos conditions de vente. Le paiement est
                traité par Stripe ; la commande est enregistrée dans votre espace
                client dès confirmation.
              </p>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-6 sticky top-28">
              <h2 className="font-serif text-xl text-neutral-100 font-light border-b border-white/5 pb-4">
                Récapitulatif de Sélection
              </h2>

              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto pr-2">
                {items.map(({ champagne, quantity }) => (
                  <div key={champagne.id} className="py-3 flex gap-3 items-center">
                    <div className="relative h-16 w-12 flex-shrink-0 bg-[#181818] border border-white/5 p-1">
                      <ProductImage
                        src={champagne.imageUrl}
                        alt={champagne.name}
                        house={champagne.house}
                        name={champagne.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block truncate">
                        {champagne.house}
                      </span>
                      <p className="font-serif text-xs text-neutral-200 truncate">
                        {champagne.name}
                      </p>
                      <span className="text-[11px] text-neutral-400">
                        Qté : {quantity} × {formatEuro(champagne.price)}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#C5A059]">
                      {formatEuro(champagne.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Sous-total flacons</span>
                  <span>{formatEuro(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Transport isotherme sécurisé</span>
                  <span>{isFreeShipping ? "Offert" : formatEuro(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Coffrets protecteurs</span>
                  <span>Inclus</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 font-serif text-lg text-neutral-100">
                  <span>Total TTC</span>
                  <span className="text-[#C5A059]">{formatEuro(finalTotal)}</span>
                </div>
              </div>

              {!isFreeShipping && (
                <div className="space-y-2">
                  <p className="text-[11px] text-neutral-400">
                    Ajoutez{" "}
                    <strong className="text-[#C5A059]">
                      {formatEuro(missingForFreeShipping)}
                    </strong>{" "}
                    pour bénéficier de la livraison offerte.
                  </p>
                  <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8E733E] via-[#C5A059] to-[#DFC282] transition-all duration-500"
                      style={{ width: `${progressRatio}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 bg-[#161616] border border-white/5 text-[11px] text-neutral-400 space-y-2">
                <div className="flex items-center gap-2 text-neutral-200">
                  <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
                  <span>Paiement Haute Sécurité</span>
                </div>
                <p className="leading-relaxed">
                  Votre paiement est traité par Stripe. Chaque flacon fait
                  l&apos;objet d&apos;un contrôle optique avant scellement. Envoi
                  avec assurance intégrale ad valorem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
