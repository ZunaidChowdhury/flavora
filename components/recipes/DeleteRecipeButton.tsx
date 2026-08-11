"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { deleteRecipe } from "@/lib/actions/recipe.actions";

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirm() {
    setIsDeleting(true);
    try {
      await deleteRecipe(recipeId);
      toast.success("Recipe deleted");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete recipe"
      );
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Delete recipe"
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
      >
        <FiTrash2 className="size-3.5" />
      </button>

      {/* Native confirm modal — same pattern as admin tables */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => !isDeleting && setOpen(false)}
          />
          {/* Dialog */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/50 bg-surface-secondary/60 px-5 py-4">
              <span className="flex size-9 items-center justify-center rounded-xl bg-red-500/10">
                <FiTrash2 className="size-4 text-red-500" />
              </span>
              <h3 className="text-base font-semibold text-foreground">
                Delete this recipe?
              </h3>
            </div>
            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-sm text-muted">
                This recipe will be removed from your dashboard and all public
                listings. This action can&apos;t be undone.
              </p>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-border/50 bg-surface-secondary/40 px-5 py-3.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
                className="cursor-pointer rounded-xl border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={isDeleting}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting && (
                  <svg
                    className="size-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                )}
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
