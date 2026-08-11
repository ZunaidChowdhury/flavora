"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { updateRecipeVisibility } from "@/lib/actions/recipe.actions";

export function VisibilityToggle({
  recipeId,
  visibility,
  isUnpublishedByAdmin,
}: {
  recipeId: string;
  visibility: "PUBLIC" | "PRIVATE";
  isUnpublishedByAdmin: boolean;
}) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(visibility === "PUBLIC");
  const [pending, setPending] = useState(false);

  /* ── Locked by admin ─────────────────────────────── */
  if (isUnpublishedByAdmin) {
    return (
      <div className="group relative inline-flex items-center gap-1.5">
        {/* Disabled toggle */}
        <div className="flex h-5 w-9 cursor-not-allowed items-center rounded-full bg-border/60 px-0.5">
          <span className="size-4 rounded-full bg-muted/60 shadow-sm" />
        </div>
        {/* Lock badge with tooltip */}
        <span className="relative inline-flex cursor-default items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
          <FiLock className="size-3" />
          Admin lock
          {/* Tooltip on hover */}
          <span className="pointer-events-none invisible absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background shadow-lg group-hover:visible">
            Can&apos;t change — unpublished by admin
          </span>
        </span>
      </div>
    );
  }

  async function onToggle() {
    const next = !isPublic;
    setPending(true);
    setIsPublic(next);
    try {
      await updateRecipeVisibility(recipeId, next ? "PUBLIC" : "PRIVATE");
      toast.success(next ? "Recipe is now public" : "Recipe is now private");
      router.refresh();
    } catch (err) {
      setIsPublic(!next); // revert on error
      toast.error(
        err instanceof Error ? err.message : "Failed to update visibility"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Custom native toggle switch */}
      <button
        type="button"
        role="switch"
        aria-checked={isPublic}
        aria-label="Toggle recipe visibility"
        disabled={pending}
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full border transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
          isPublic
            ? "border-primary/40 bg-primary"
            : "border-border/60 bg-border/40"
        }`}
      >
        <span
          className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isPublic ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>

      {/* Label with icon */}
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
          isPublic ? "text-primary" : "text-muted"
        }`}
      >
        {isPublic ? (
          <FiEye className="size-3.5" />
        ) : (
          <FiEyeOff className="size-3.5" />
        )}
        {isPublic ? "Public" : "Private"}
      </span>
    </div>
  );
}
