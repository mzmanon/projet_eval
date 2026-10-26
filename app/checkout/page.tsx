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
      <div className="bg-[#FBFAF6] min-h-[80vh] flex items-center justify-center py-20 px-6 text-[#14150F]">
        <div className="max-w-2xl w-full bg-white border border-[#2E4636]/14 p-8 sm:p-14 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3C47D]/30 border border-[#B08F4C]/55">
            <CheckCircle2 className="h-8 w-8 text-[#755A22] stroke-1" />
          </div>

          <span className="text-[9px] uppercase tracking-[0.3em] text-[#755A22] font-normal block">
            Allocation Confirmée
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#14150F] font-light">
            Merci pour votre confiance
          </h1>

          <p className="text-xs sm:text-sm text-[#333A2F] max-w-lg mx-auto leading-relaxed font-light">
            Votre commande n° <strong className="text-[#755A22] font-mono font-normal">{orderNumber}</strong>{" "}
            a été transmise à notre maître de chai. Vos flacons sont préparés
            sous scellé dans nos emballages isothermes haute protection.
          </p>

          <div className="p-5 bg-[#FBFAF6] border border-[#2E4636]/10 text-xs text-[#565C4E] max-w-md mx-auto text-left space-y-2 font-light">
            <div className="flex justify-between">
              <span>Destinataire :</span>
              <strong className="text-[#22271F] font-normal">
                {formData.firstName} {formData.lastName}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Lieu de livraison :</span>
              <span className="text-[#22271F]">
                {formData.address}, {formData.postalCode} {formData.city}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#2E4636]/10 font-serif text-sm">
              <span>Montant réglé :</span>
              <strong className="text-[#755A22] font-normal">{finalTotal.toFixed(0)} € TTC</strong>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/account"
              className="border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] px-7 py-3 text-xs uppercase tracking-widest font-normal hover:bg-[#EFD9A2] transition-colors"
            >
              Consulter mon historique
            </Link>
            <Link
              href="/champagnes"
              className="border border-[#2E4636]/25 px-7 py-3 text-xs uppercase tracking-widest text-[#333A2F] hover:text-[#2E4636] transition-colors font-light"
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
      <div className="bg-[#FBFAF6] min-h-[70vh] flex items-center justify-center py-20 px-6 text-center text-[#14150F]">
        <div className="space-y-4">
          <h1 className="font-serif text-3xl text-[#22271F] font-light">
            Votre panier est actuellement vide
          </h1>
          <p className="text-xs text-[#565C4E] font-light">
            Veuillez sélectionner au moins une cuvée avant de passer votre commande.
          </p>
          <div className="pt-4">
            <Link
              href="/champagnes"
              className="inline-flex items-center gap-2 border border-[#B08F4C] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#755A22] hover:bg-[#E3C47D] hover:text-[#14150F] transition-colors font-light"
            >
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFAF6] min-h-screen py-12 sm:py-16 text-[#14150F]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#565C4E] font-light">
          <Link
            href="/champagnes"
            className="inline-flex items-center gap-1.5 hover:text-[#2E4636] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Continuer la sélection</span>
          </Link>
          <span>/</span>
          <span className="text-[#755A22]">Validation de Commande</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#14150F] font-light mb-10">
          Finalisation de votre Acquisition
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Coordonnées */}
              <div className="bg-white border border-[#2E4636]/12 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#2E4636]/10 pb-4">
                  <h2 className="font-serif text-xl text-[#1B1F18] font-light">
                    1. Coordonnées &amp; Contact
                  </h2>
                  <span className="text-[9px] uppercase tracking-widest text-[#755A22] font-normal">
                    Compte Privilège
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                      Nom de famille
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                      Téléphone pour le coursier
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse de livraison */}
              <div className="bg-white border border-[#2E4636]/12 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#2E4636]/10 pb-4">
                  <h2 className="font-serif text-xl text-[#1B1F18] font-light">
                    2. Adresse de Livraison Sécurisée
                  </h2>
                  <span className="text-[9px] uppercase tracking-widest text-[#565C4E] font-light">
                    Packaging Isotherme Offert
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                    Adresse postale
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                      Pays
                    </label>
                    <input
                      type="text"
                      name="country"
                      disabled
                      value={formData.country}
                      className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2.5 text-xs text-[#565C4E] font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#565C4E] mb-2 font-light">
                    Instructions spécifiques de remise
                  </label>
                  <textarea
                    rows={2}
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="w-full bg-[#FBFAF6] border border-[#2E4636]/15 px-4 py-2 text-xs text-[#22271F] focus:outline-none focus:border-[#B08F4C] font-light"
                  />
                </div>
              </div>

              {/* Validation CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 border border-[#B08F4C] bg-[#E3C47D] text-[#14150F] py-3.5 px-8 text-xs font-normal uppercase tracking-[0.22em] hover:bg-[#EFD9A2] transition-colors cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
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
            <div className="bg-white border border-[#2E4636]/14 p-6 sm:p-8 space-y-6 sticky top-28">
              <h2 className="font-serif text-xl text-[#1B1F18] font-light border-b border-[#2E4636]/10 pb-4">
                Récapitulatif de Sélection
              </h2>

              <div className="divide-y divide-[#2E4636]/10 max-h-72 overflow-y-auto pr-2">
                {items.map(({ champagne, quantity }) => (
                  <div key={champagne.id} className="py-3 flex gap-3 items-center">
                    <div className="relative h-16 w-12 flex-shrink-0 bg-[radial-gradient(ellipse_at_center,rgba(227,196,125,0.30)_0%,rgba(239,243,232,0.95)_75%)] border border-[#2E4636]/10 p-1">
                      <Image
                        src={champagne.imageUrl}
                        alt={champagne.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 font-light">
                      <span className="text-[9px] uppercase tracking-widest text-[#755A22] font-normal block truncate">
                        {champagne.house}
                      </span>
                      <p className="font-serif text-xs text-[#22271F] truncate">
                        {champagne.name}
                      </p>
                      <span className="text-[11px] text-[#565C4E]">
                        Qté : {quantity} × {champagne.price} €
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#755A22]">
                      {(champagne.price * quantity).toFixed(0)} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-[#2E4636]/12 text-xs font-light">
                <div className="flex justify-between text-[#333A2F]">
                  <span>Sous-total flacons</span>
                  <span>{totalPrice.toFixed(0)} €</span>
                </div>
                <div className="flex justify-between text-[#333A2F]">
                  <span>Transport isotherme sécurisé</span>
                  <span>{isFreeShipping ? "Offert" : "25 €"}</span>
                </div>
                <div className="flex justify-between text-[#565C4E] text-[11px]">
                  <span>Coffrets protecteurs</span>
                  <span>Inclus</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#2E4636]/12 font-serif text-lg text-[#1B1F18]">
                  <span>Total TTC</span>
                  <span className="text-[#755A22] font-light">{finalTotal.toFixed(0)} €</span>
                </div>
              </div>

              <div className="p-4 bg-[#FBFAF6] border border-[#2E4636]/10 text-[11px] text-[#565C4E] space-y-2 font-light">
                <div className="flex items-center gap-2 text-[#22271F]">
                  <ShieldCheck className="h-4 w-4 text-[#755A22] stroke-1" />
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
