"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatEuro } from "@/lib/checkout/pricing";
import type { CheckoutSessionResponse } from "@/types/order";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
} from "lucide-react";

type ConfirmedOrder = CheckoutSessionResponse["order"];

function OrderErrorPage({ message }: { message: string }) {
  return (
    <div className="luxury-page min-h-[70vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-lg w-full bg-[#121212] border border-[#C5A059]/30 p-8 sm:p-10 text-center space-y-5">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h1 className="font-serif text-2xl text-neutral-100 font-light">
          Confirmation indisponible
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
        <p className="text-[11px] text-neutral-500">
          Si votre paiement a bien été débité, votre commande apparaîtra dans
          votre espace client. Vous pouvez aussi contacter notre conciergerie.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/account"
            className="bg-[#C5A059] text-[#0A0A0A] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#DFC282] transition-colors"
          >
            Mon espace client
          </Link>
          <Link
            href="/champagnes"
            className="border border-white/20 px-6 py-3 text-xs uppercase tracking-widest text-neutral-300 hover:text-white transition-colors"
          >
            Retour à la collection
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(sessionId));

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId as string)}`,
          { cache: "no-store" }
        );
        const payload = (await response.json()) as
          | CheckoutSessionResponse
          | { error?: string };

        if (!response.ok || !("order" in payload)) {
          throw new Error(
            "error" in payload && payload.error
              ? payload.error
              : "Impossible de confirmer votre commande."
          );
        }

        if (!cancelled) {
          setOrder(payload.order);
          clearCart();
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Impossible de confirmer votre commande."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  if (!sessionId) {
    return <OrderErrorPage message="Aucune session de paiement n'a été fournie." />;
  }

  if (isLoading) {
    return (
      <div className="luxury-page min-h-[70vh] flex items-center justify-center py-20 px-6">
        <div className="text-center space-y-4">
          <Loader2 className="h-9 w-9 animate-spin text-[#C5A059] mx-auto" />
          <p className="font-serif text-xl text-neutral-200">
            Vérification de votre paiement…
          </p>
          <p className="text-xs text-neutral-400">
            Nous sécurisons la confirmation auprès de Stripe.
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return <OrderErrorPage message={error ?? "Cette commande est introuvable."} />;
  }

  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="luxury-page min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl w-full bg-[#121212] border border-[#C5A059]/30 p-8 sm:p-14 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C5A059]/10 border border-[#C5A059]">
          {isPaid ? (
            <CheckCircle2 className="h-8 w-8 text-[#C5A059]" />
          ) : (
            <Clock className="h-8 w-8 text-[#C5A059]" />
          )}
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium block">
          {isPaid ? "Paiement Confirmé" : "Paiement En Cours De Confirmation"}
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#FCFBF9] font-light">
          {isPaid ? "Merci pour votre confiance" : "Votre commande est enregistrée"}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
          Votre commande n°{" "}
          <strong className="text-[#C5A059] font-mono">
            {order.orderNumber ?? order.id}
          </strong>{" "}
          a bien été enregistrée. Vos flacons sont préparés sous scellé dans nos
          emballages isothermes haute protection.
        </p>

        <div className="p-4 bg-[#181818] border border-white/5 text-xs text-neutral-400 max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between gap-4">
            <span>Destinataire :</span>
            <strong className="text-neutral-200 text-right">
              {order.customerName}
            </strong>
          </div>
          <div className="flex justify-between gap-4">
            <span>Email :</span>
            <span className="text-neutral-200 text-right">
              {order.customerEmail}
            </span>
          </div>
          {order.shippingAddress && (
            <div className="flex justify-between gap-4">
              <span>Livraison :</span>
              <span className="text-neutral-200 text-right">
                {order.shippingAddress.street}, {order.shippingAddress.postalCode}{" "}
                {order.shippingAddress.city}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-1 border-t border-white/5 font-serif text-sm">
            <span>Montant réglé :</span>
            <strong className="text-[#C5A059]">
              {formatEuro(order.totalAmount)} TTC
            </strong>
          </div>
        </div>

        <div className="text-left max-w-md mx-auto border-t border-white/5 pt-4 space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
            Détail de votre sélection
          </span>
          {order.items.map((item) => (
            <div
              key={`${item.house}-${item.name}`}
              className="flex items-center justify-between gap-4 text-xs text-neutral-300"
            >
              <span className="truncate">
                {item.house} — {item.name}
              </span>
              <span className="font-mono whitespace-nowrap">
                {item.quantity} × {formatEuro(item.unitPrice)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
          <span>Paiement traité par Stripe — transaction chiffrée</span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 bg-[#C5A059] text-[#0A0A0A] px-7 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#DFC282] transition-colors"
          >
            Consulter mon historique
            <ArrowRight className="h-4 w-4" />
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="luxury-page min-h-[70vh] flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
