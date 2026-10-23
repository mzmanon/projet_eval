"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, Lock, CheckCircle2, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "Jean",
    lastName: "de Montmirail",
    email: "jean.montmirail@collection.fr",
    phone: "+33 6 12 34 56 78",
    address: "24, Rue du Faubourg Saint-Honoré",
    city: "Paris",
    postalCode: "75008",
    country: "France",
    specialInstructions: "Livraison en mains propres avec signature requise.",
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 250;
  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : 25;
  const finalTotal = totalPrice + shippingCost;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrderNumber = `LC-${new Date().getFullYear()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      setOrderNumber(generatedOrderNumber);

      // Enregistrer la commande dans le localStorage pour l'historique client
      const newOrder = {
        id: generatedOrderNumber,
        createdAt: new Date().toISOString(),
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items.map((i) => ({
          champagneId: i.champagne.id,
          name: i.champagne.name,
          house: i.champagne.house,
          vintage: i.champagne.vintage,
          price: i.champagne.price,
          quantity: i.quantity,
          imageUrl: i.champagne.imageUrl,
        })),
        totalAmount: finalTotal,
        status: "confirmed",
      };

      try {
        const existing = JSON.parse(
          localStorage.getItem("la_cave_orders") || "[]"
        );
        localStorage.setItem(
          "la_cave_orders",
          JSON.stringify([newOrder, ...existing])
        );
      } catch {
        // ignore
      }

      clearCart();
      setIsSubmitting(false);
      setOrderConfirmed(true);
    }, 1200);
  };

  if (orderConfirmed) {
    return (
      <div className="bg-[#0A0A0A] min-h-[80vh] flex items-center justify-center py-20 px-6">
        <div className="max-w-2xl w-full bg-[#121212] border border-[#C5A059]/30 p-8 sm:p-14 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C5A059]/10 border border-[#C5A059]">
            <CheckCircle2 className="h-8 w-8 text-[#C5A059]" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
            Allocation Confirmée
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#FCFBF9] font-light">
            Merci pour votre confiance
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
            Votre commande n° <strong className="text-[#C5A059] font-mono">{orderNumber}</strong>{" "}
            a été transmise à notre maître de chai. Vos flacons sont préparés
            sous scellé dans nos emballages isothermes haute protection.
          </p>

          <div className="p-4 bg-[#181818] border border-white/5 text-xs text-neutral-400 max-w-md mx-auto text-left space-y-1.5">
            <div className="flex justify-between">
              <span>Destinataire :</span>
              <strong className="text-neutral-200">
                {formData.firstName} {formData.lastName}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Lieu de livraison :</span>
              <span className="text-neutral-200">
                {formData.address}, {formData.postalCode} {formData.city}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/5 font-serif text-sm">
              <span>Montant réglé :</span>
              <strong className="text-[#C5A059]">{finalTotal.toFixed(0)} € TTC</strong>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/account"
              className="bg-[#C5A059] text-[#0A0A0A] px-7 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#DFC282] transition-colors"
            >
              Consulter mon historique
            </Link>
            <Link
              href="/champagnes"
              className="border border-white/20 px-7 py-3 text-xs uppercase tracking-widest text-neutral-300 hover:text-white transition-colors"
            >
              Retourner à la collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#0A0A0A] min-h-[70vh] flex items-center justify-center py-20 px-6 text-center">
        <div className="space-y-4">
          <h1 className="font-serif text-3xl text-neutral-200 font-light">
            Votre panier est actuellement vide
          </h1>
          <p className="text-xs text-neutral-400">
            Veuillez sélectionner au moins une cuvée avant de passer votre commande.
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
    <div className="bg-[#0A0A0A] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
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

        <h1 className="font-serif text-3xl sm:text-4xl text-[#FCFBF9] font-light mb-10">
          Finalisation de votre Acquisition
        </h1>

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
                    Compte Privilège
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Nom de famille
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Téléphone pour le coursier
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
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
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Adresse postale
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      name="country"
                      disabled
                      value={formData.country}
                      className="w-full bg-[#181818] border border-white/10 px-4 py-3 text-xs text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Instructions spécifiques de remise
                  </label>
                  <textarea
                    rows={2}
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="w-full bg-[#181818] border border-white/10 px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Validation CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-[#C5A059] text-[#0A0A0A] py-4 px-8 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[#DFC282] transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {isSubmitting
                    ? "Scellement de la commande en cours..."
                    : `Confirmer la commande • ${finalTotal.toFixed(0)} € TTC`}
                </span>
              </button>
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
                      <Image
                        src={champagne.imageUrl}
                        alt={champagne.name}
                        fill
                        className="object-contain"
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
                        Qté : {quantity} × {champagne.price} €
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#C5A059]">
                      {(champagne.price * quantity).toFixed(0)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Sous-total flacons</span>
                  <span>{totalPrice.toFixed(0)} €</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Transport isotherme sécurisé</span>
                  <span>{isFreeShipping ? "Offert" : "25 €"}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Coffrets protecteurs</span>
                  <span>Inclus</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 font-serif text-lg text-neutral-100">
                  <span>Total TTC</span>
                  <span className="text-[#C5A059]">{finalTotal.toFixed(0)} €</span>
                </div>
              </div>

              <div className="p-4 bg-[#161616] border border-white/5 text-[11px] text-neutral-400 space-y-2">
                <div className="flex items-center gap-2 text-neutral-200">
                  <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
                  <span>Protocole Haute Sécurité</span>
                </div>
                <p className="leading-relaxed">
                  Chaque flacon fait l&apos;objet d&apos;un contrôle optique avant
                  scellement. Envoi avec assurance intégrale ad valorem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
