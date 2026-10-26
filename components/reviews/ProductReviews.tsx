"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  PenLine,
  Send,
  Star,
} from "lucide-react";
import type { ProductReview, ReviewReply } from "@/types/champagne";
import { createClient } from "@/lib/supabase/client";

interface ProductReviewsProps {
  champagneId: string;
  /** "card" : aperçu compact sous une cuvée. "full" : discussion complète. */
  variant?: "card" | "full";
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const fieldClass =
  "w-full bg-[#FBFAF6] border border-[#2E4636]/15 text-[#22271F] text-[11px] px-2.5 py-2 placeholder:text-[#565C4E]/60 focus:outline-none focus:border-[#B08F4C] transition-colors font-light";

function formatReviewDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function Stars({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "md";
}) {
  const iconSize = size === "md" ? "h-4 w-4" : "h-3 w-3";
  const rounded = Math.round(value);

  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${value.toFixed(1).replace(".", ",")} sur 5 étoiles`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          strokeWidth={1.25}
          className={`${iconSize} ${
            star <= rounded
              ? "fill-[#E3C47D] text-[#B08F4C]"
              : "fill-none text-[#2E4636]/20"
          }`}
        />
      ))}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div
      className="flex items-center gap-0.5"
      role="group"
      aria-label="Votre note sur 5"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(0)}
          aria-label={`Attribuer ${star} étoile${star > 1 ? "s" : ""} sur 5`}
          aria-pressed={value === star}
          className="flex h-8 w-8 cursor-pointer items-center justify-center focus:outline-none focus:ring-1 focus:ring-[#B08F4C]/40"
        >
          <Star
            aria-hidden="true"
            strokeWidth={1.25}
            className={`h-4 w-4 transition-colors ${
              star <= active
                ? "fill-[#E3C47D] text-[#B08F4C]"
                : "fill-none text-[#2E4636]/25"
            }`}
          />
        </button>
      ))}
      <span className="ml-1 text-[10px] font-light text-[#565C4E]">
        {value}/5
      </span>
    </div>
  );
}

function mapReviewRow(
  row: Record<string, unknown>,
  champagneId: string
): ProductReview {
  const rows = Array.isArray(row.product_review_replies)
    ? (row.product_review_replies as Record<string, unknown>[])
    : [];
  return {
    id: String(row.id ?? ""),
    champagneId,
    author: String(row.author ?? "Client"),
    rating: Number(row.rating ?? 0),
    title: typeof row.title === "string" ? row.title : undefined,
    message: String(row.message ?? ""),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    verified: row.verified === true,
    replies: rows.map((reply) => ({
      id: String(reply.id ?? ""),
      author: String(reply.author ?? "Client"),
      message: String(reply.message ?? ""),
      createdAt: String(reply.created_at ?? new Date().toISOString()),
    })),
  };
}

interface ReviewItemProps {
  review: ProductReview;
  full: boolean;
  preview?: boolean;
  isReplying: boolean;
  replyAuthor: string;
  replyMessage: string;
  replyError: string | null;
  onStartReply: () => void;
  onCancelReply: () => void;
  onReplyAuthorChange: (value: string) => void;
  onReplyMessageChange: (value: string) => void;
  onSubmitReply: (event: React.FormEvent<HTMLFormElement>) => void;
}

function ReviewItem({
  review,
  full,
  preview = false,
  isReplying,
  replyAuthor,
  replyMessage,
  replyError,
  onStartReply,
  onCancelReply,
  onReplyAuthorChange,
  onReplyMessageChange,
  onSubmitReply,
}: ReviewItemProps) {
  return (
    <article
      className={`border-t border-[#2E4636]/10 ${
        full ? "px-6 py-6 sm:px-8" : "px-6 py-5 sm:px-7"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-[#2E4636]/12 bg-[#F4F7EE] font-mono text-[9px] tracking-wider text-[#755A22]"
          aria-hidden="true"
        >
          {getInitials(review.author)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span className="text-[11px] font-normal text-[#22271F]">
              {review.author}
            </span>
            <span className="text-[9px] font-light text-[#565C4E]/75">
              {formatReviewDate(review.createdAt)}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Stars value={review.rating} />
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.16em] text-[#2F6B45]">
                <CheckCircle2 className="h-3 w-3 stroke-1" aria-hidden="true" />
                Achat vérifié
              </span>
            )}
          </div>

          {review.title && (
            <h4 className="mt-2 font-serif text-lg font-light leading-snug text-[#14150F]">
              {review.title}
            </h4>
          )}

          <p
            className={`mt-1.5 font-light leading-relaxed text-[#565C4E] ${
              full ? "text-xs sm:text-sm" : "text-[11px]"
            } ${preview ? "line-clamp-3" : ""}`}
          >
            {review.message}
          </p>

          {review.replies.length > 0 && !preview && (
            <div className="mt-3 space-y-2 border-l border-[#B08F4C]/40 pl-3">
              {review.replies.map((reply) => (
                <ReplyBubble key={reply.id} reply={reply} full={full} />
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={isReplying ? onCancelReply : onStartReply}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-[#755A22] transition-colors hover:text-[#2E4636] focus:outline-none focus:ring-1 focus:ring-[#B08F4C]/40"
              aria-expanded={isReplying}
              aria-label={
                isReplying
                  ? "Fermer le formulaire de réponse"
                  : `Répondre à l'avis de ${review.author}`
              }
            >
              <MessageSquare className="h-3 w-3 stroke-1" aria-hidden="true" />
              <span>
                {isReplying
                  ? "Annuler"
                  : review.replies.length > 0
                    ? `Répondre · ${review.replies.length}`
                    : "Répondre"}
              </span>
            </button>
          </div>

          {isReplying && (
            <form
              onSubmit={onSubmitReply}
              className="mt-3 space-y-2 border border-[#2E4636]/12 bg-[#F4F7EE] p-3"
            >
              <input
                type="text"
                value={replyAuthor}
                onChange={(event) => onReplyAuthorChange(event.target.value)}
                maxLength={40}
                placeholder="Votre nom (facultatif)"
                aria-label="Votre nom pour la réponse"
                className={fieldClass}
              />
              <textarea
                value={replyMessage}
                onChange={(event) => onReplyMessageChange(event.target.value)}
                rows={2}
                maxLength={400}
                placeholder={`Répondre à ${review.author}…`}
                aria-label={`Votre réponse à l'avis de ${review.author}`}
                className={`${fieldClass} resize-none`}
              />
              {replyError && (
                <p role="alert" className="text-[10px] text-[#A3352B]">
                  {replyError}
                </p>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancelReply}
                  className="cursor-pointer px-2 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#565C4E] transition-colors hover:text-[#22271F]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 border border-[#B08F4C] bg-[#E3C47D] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#14150F] transition-colors hover:bg-[#EFD9A2]"
                >
                  <Send className="h-3 w-3 stroke-1" aria-hidden="true" />
                  Publier
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}

function ReplyBubble({
  reply,
  full,
}: {
  reply: ReviewReply;
  full: boolean;
}) {
  return (
    <div className="py-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <span className="flex flex-wrap items-center gap-1.5 text-[10px] font-normal text-[#22271F]">
          {reply.author}
          {reply.isHouse && (
            <span className="border border-[#B08F4C]/45 bg-[#E3C47D]/25 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.18em] text-[#755A22]">
              La Maison
            </span>
          )}
        </span>
        <span className="text-[9px] font-light text-[#565C4E]/70">
          {formatReviewDate(reply.createdAt)}
        </span>
      </div>
      <p
        className={`mt-1 font-light leading-relaxed text-[#565C4E] ${
          full ? "text-xs" : "text-[10.5px]"
        }`}
      >
        {reply.message}
      </p>
    </div>
  );
}

export default function ProductReviews({
  champagneId,
  variant = "card",
}: ProductReviewsProps) {
  const full = variant === "full";

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState(full);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      const { data, error } = await createClient()
        .from("product_reviews")
        .select(
          "id,product_id,author,rating,title,message,created_at,verified,product_review_replies(id,author,message,created_at)"
        )
        .eq("product_id", champagneId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLoadError(null);
      setReviews(
        ((data ?? []) as unknown as Record<string, unknown>[]).map((row) =>
          mapReviewRow(row, champagneId)
        )
      );
    } catch {
      setLoadError("Les avis ne sont pas disponibles pour le moment.");
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [champagneId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [reviews]
  );

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  const visibleReviews = expanded ? sortedReviews : sortedReviews.slice(0, 1);

  const padding = full ? "px-6 sm:px-8" : "px-6 sm:px-7";

  const handleSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      setFormError("Merci d'écrire quelques mots sur votre dégustation.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setFormError("Connectez-vous à votre compte pour publier un avis.");
      return;
    }

    const profileName = user.user_metadata.full_name;
    const publicAuthor =
      author.trim() ||
      (typeof profileName === "string" ? profileName.trim() : "") ||
      user.email?.split("@")[0] ||
      "Client";
    const { error } = await supabase.from("product_reviews").upsert(
      {
        product_id: champagneId,
        user_id: user.id,
        author: publicAuthor.slice(0, 40),
        rating,
        title: title.trim() || null,
        message: message.trim(),
      },
      { onConflict: "product_id,user_id" }
    );
    if (error) {
      setFormError("Impossible d’enregistrer votre avis pour le moment.");
      return;
    }

    await loadReviews();
    setAuthor("");
    setTitle("");
    setMessage("");
    setRating(5);
    setFormError(null);
    setFormOpen(false);
    setExpanded(true);
    setNotice("Merci, votre avis a été publié.");
  };

  const handleStartReply = (reviewId: string) => {
    setReplyingTo(reviewId);
    setReplyAuthor("");
    setReplyMessage("");
    setReplyError(null);
    setExpanded(true);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyAuthor("");
    setReplyMessage("");
    setReplyError(null);
  };

  const handleSubmitReply = async (
    event: React.FormEvent<HTMLFormElement>,
    reviewId: string
  ) => {
    event.preventDefault();

    if (!replyMessage.trim()) {
      setReplyError("Votre réponse ne peut pas être vide.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setReplyError("Connectez-vous à votre compte pour répondre.");
      return;
    }

    const profileName = user.user_metadata.full_name;
    const publicAuthor =
      replyAuthor.trim() ||
      (typeof profileName === "string" ? profileName.trim() : "") ||
      user.email?.split("@")[0] ||
      "Client";
    const { error } = await supabase.from("product_review_replies").insert({
      review_id: reviewId,
      user_id: user.id,
      author: publicAuthor.slice(0, 40),
      message: replyMessage.trim(),
    });
    if (error) {
      setReplyError("Impossible d’enregistrer votre réponse pour le moment.");
      return;
    }

    await loadReviews();
    handleCancelReply();
    setExpanded(true);
    setNotice("Votre réponse a été publiée.");
  };

  return (
    <section
      className={
        full
          ? "border border-[#2E4636]/10 bg-white"
          : "border-t border-[#2E4636]/10 bg-white"
      }
      aria-labelledby={`reviews-title-${champagneId}`}
    >
      <div className={`${padding} pt-5 pb-4`}>
        {full && (
          <div className="mb-4 border-b border-[#2E4636]/10 pb-4">
            <span className="block text-[9px] uppercase tracking-[0.3em] text-[#755A22]">
              La Parole des Amateurs
            </span>
            <h2 className="mt-1 font-serif text-2xl font-light text-[#14150F] sm:text-3xl">
              Avis &amp; Discussions
            </h2>
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span
              id={`reviews-title-${champagneId}`}
              className="block text-[9px] uppercase tracking-[0.25em] text-[#755A22]"
            >
              Avis Clients
            </span>

            <div className="mt-2 flex items-center gap-2.5">
              <span className="font-serif text-3xl font-light leading-none text-[#14150F]">
                {isLoading
                  ? "…"
                  : reviews.length
                    ? average.toFixed(1).replace(".", ",")
                    : "—"}
              </span>
              <div className="flex flex-col gap-1">
                {!isLoading && reviews.length > 0 && (
                  <Stars value={average} size="md" />
                )}
                <span className="text-[9px] font-light uppercase tracking-[0.14em] text-[#565C4E]">
                  {isLoading
                    ? "Chargement des avis"
                    : reviews.length > 0
                      ? `sur 5 · ${reviews.length} avis`
                      : "Aucune note"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormOpen((open) => !open);
              setFormError(null);
              setNotice(null);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 border border-[#2E4636]/20 bg-[#2E4636]/[0.04] px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[#333A2F] transition-colors hover:border-[#B08F4C] hover:text-[#755A22] focus:outline-none focus:ring-1 focus:ring-[#B08F4C]/40"
            aria-expanded={formOpen}
          >
            <PenLine className="h-3 w-3 stroke-1" aria-hidden="true" />
            <span>{formOpen ? "Fermer" : "Rédiger un avis"}</span>
          </button>
        </div>

        <p className="mt-2 text-[10px] font-light leading-relaxed text-[#565C4E]">
          Connectez-vous pour publier un avis et une note sur cinq.
        </p>

        {notice && (
          <p
            role="status"
            className="mt-3 flex items-start gap-1.5 border border-[#2F6B45]/25 bg-[#EAF2EA]/60 px-3 py-2 text-[10px] font-light text-[#2F6B45]"
          >
            <CheckCircle2
              className="mt-0.5 h-3 w-3 shrink-0 stroke-1"
              aria-hidden="true"
            />
            <span>{notice}</span>
          </p>
        )}
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmitReview}
          className={`${padding} pb-5`}
          aria-label="Rédiger un avis client"
        >
          <div className="space-y-2.5 border border-[#2E4636]/12 bg-[#F4F7EE] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#333A2F]">
                Votre note
              </span>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              maxLength={40}
              placeholder="Votre nom (facultatif)"
              aria-label="Votre nom"
              className={fieldClass}
            />

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              placeholder="Titre de votre avis (facultatif)"
              aria-label="Titre de votre avis"
              className={fieldClass}
            />

            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                if (formError) setFormError(null);
              }}
              rows={3}
              maxLength={600}
              placeholder="Racontez votre dégustation, vos accords, vos impressions…"
              aria-label="Votre avis"
              className={`${fieldClass} resize-none`}
            />

            {formError && (
              <p role="alert" className="text-[10px] text-[#A3352B]">
                {formError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setFormError(null);
                }}
                className="cursor-pointer px-2 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#565C4E] transition-colors hover:text-[#22271F]"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-1.5 border border-[#B08F4C] bg-[#E3C47D] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#14150F] transition-colors hover:bg-[#EFD9A2]"
              >
                <Send className="h-3 w-3 stroke-1" aria-hidden="true" />
                Publier mon avis
              </button>
            </div>
          </div>
        </form>
      )}

      {loadError ? (
        <p role="alert" className={`${padding} pb-5 text-[11px] font-light text-[#A3352B]`}>
          {loadError}
        </p>
      ) : isLoading ? (
        <p className={`${padding} pb-5 text-[11px] font-light text-[#565C4E]`}>
          Chargement des avis…
        </p>
      ) : visibleReviews.length > 0 ? (
        <div>
          {visibleReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              full={full}
              preview={!full && !expanded}
              isReplying={replyingTo === review.id}
              replyAuthor={replyAuthor}
              replyMessage={replyMessage}
              replyError={replyError}
              onStartReply={() => handleStartReply(review.id)}
              onCancelReply={handleCancelReply}
              onReplyAuthorChange={setReplyAuthor}
              onReplyMessageChange={(value) => {
                setReplyMessage(value);
                if (replyError) setReplyError(null);
              }}
              onSubmitReply={(event) => handleSubmitReply(event, review.id)}
            />
          ))}
        </div>
      ) : (
        <p className={`${padding} pb-5 text-[11px] font-light text-[#565C4E]`}>
          Aucun avis pour le moment. Soyez le premier à partager votre
          dégustation.
        </p>
      )}

      {!full &&
        (sortedReviews.length > 1 ||
          (sortedReviews[0]?.replies.length ?? 0) > 0) && (
        <div className="border-t border-[#2E4636]/10 px-6 py-3 sm:px-7">
          <button
            type="button"
            onClick={() => {
              setExpanded((open) => !open);
              if (expanded) handleCancelReply();
            }}
            className="flex w-full cursor-pointer items-center justify-between gap-2 text-[9px] uppercase tracking-[0.18em] text-[#755A22] transition-colors hover:text-[#2E4636] focus:outline-none focus:ring-1 focus:ring-[#B08F4C]/40"
            aria-expanded={expanded}
          >
            <span>
              {expanded
                ? "Réduire les avis"
                : sortedReviews.length > 1
                  ? `Lire les ${sortedReviews.length} avis`
                  : "Lire la discussion"}
            </span>
            {expanded ? (
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
