"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { createReview } from "@/lib/actions/review.actions";
import { useAppSelector } from "@/store/hooks";

const STARS = [1, 2, 3, 4, 5] as const;

const LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

/** Inline SVG star — supports both fill and stroke via CSS currentColor */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-8"
      style={{
        fill: filled ? "var(--primary)" : "transparent",
        stroke: filled ? "var(--primary)" : "var(--border)",
        strokeWidth: 1.8,
        transition: "fill 0.1s, stroke 0.1s",
      }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function ReviewForm({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    setIsSubmitting(true);
    try {
      await createReview({ recipeId, rating, comment: comment.trim() });
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
      setIsSubmitting(false);
    }
  }

  const activeRating = hoverRating || rating;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 border-b border-border/50 bg-surface-secondary/60 px-5 py-3.5">
        <FiMessageSquare className="size-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Leave a Review</span>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6 p-5">

        {/* ── Star rating ────────────────────────────────── */}
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">
            Your Rating <span className="text-primary">*</span>
          </label>

          {/* Stars row */}
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                style={{ lineHeight: 0 }}
                className="cursor-pointer rounded-lg p-0.5 transition-transform duration-100 hover:scale-115 focus:outline-none"
              >
                <StarIcon filled={star <= activeRating} />
              </button>
            ))}

            {/* Rating label */}
            <span className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-sm font-semibold text-primary">
              {activeRating}/5
              <span className="font-normal text-primary/70">
                — {LABELS[activeRating]}
              </span>
            </span>
          </div>
        </div>

        {/* ── Comment ────────────────────────────────────── */}
        <div>
          <label
            htmlFor="review-comment"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Comment <span className="text-primary">*</span>
          </label>
          <textarea
            id="review-comment"
            name="comment"
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts — what did you love? What would you change?"
            className="w-full resize-y rounded-xl border border-border/70 bg-field px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1.5 text-right text-xs text-muted">
            {comment.trim().length} characters
          </p>
        </div>

        {/* ── Submit ─────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-border/40 pt-4">
          <p className="text-xs text-muted">
            Your review will be visible to everyone.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <FiSend className="size-4" />
            )}
            {isSubmitting ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
