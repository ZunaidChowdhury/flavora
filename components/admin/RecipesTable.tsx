"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  deleteRecipe,
  updateRecipeAdminVisibility,
} from "@/lib/actions/recipe.actions";
import type { AdminRecipe } from "@/lib/api/recipe.api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function VisibilityBadge({ visibility }: { visibility: string }) {
  const isPublic = visibility === "PUBLIC";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isPublic
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
          : "border-border/60 bg-surface-secondary text-muted"
      }`}
    >
      {isPublic ? <FiEye className="size-3" /> : <FiEyeOff className="size-3" />}
      {visibility}
    </span>
  );
}

function PublishToggle({ recipe }: { recipe: AdminRecipe }) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(!recipe.isUnpublishedByAdmin);
  const [pending, setPending] = useState(false);

  async function onToggle() {
    const next = !isPublished;
    setPending(true);
    setIsPublished(next);
    try {
      await updateRecipeAdminVisibility(recipe.id, !next);
      toast.success(next ? "Recipe published" : "Recipe unpublished");
      router.refresh();
    } catch (err) {
      setIsPublished(!next);
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={pending}
      aria-label={isPublished ? "Unpublish recipe" : "Publish recipe"}
      className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        isPublished ? "border-primary/40 bg-primary" : "border-border/60 bg-surface-secondary"
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          isPublished ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function DeleteRecipeButton({ recipe }: { recipe: AdminRecipe }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirm() {
    setIsDeleting(true);
    try {
      await deleteRecipe(recipe.id);
      toast.success("Recipe deleted");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete recipe");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${recipe.title}`}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-red-500/20 bg-red-500/8 text-red-500 transition-colors hover:bg-red-500/15"
      >
        <FiTrash2 className="size-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => !isDeleting && setOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border/50 bg-surface-secondary/60 px-5 py-4">
              <span className="flex size-9 items-center justify-center rounded-xl bg-red-500/10">
                <FiTrash2 className="size-4 text-red-500" />
              </span>
              <h3 className="text-base font-semibold text-foreground">Delete Recipe</h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">{recipe.title}</span> will
                be soft-deleted and removed from all public listings. This action can&apos;t be undone.
              </p>
            </div>
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
                  <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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

function Pagination({
  currentPage,
  totalPages,
  total,
  startItem,
  endItem,
  go,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  startItem: number;
  endItem: number;
  go: (p: number) => void;
}) {
  function pages(): (number | "…")[] {
    const out: (number | "…")[] = [1];
    if (currentPage > 3) out.push("…");
    const s = Math.max(2, currentPage - 1);
    const e = Math.min(totalPages - 1, currentPage + 1);
    for (let i = s; i <= e; i++) out.push(i);
    if (currentPage < totalPages - 2) out.push("…");
    if (totalPages > 1) out.push(totalPages);
    return out;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface px-5 py-3">
      <span className="text-sm text-muted">
        Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border/60 text-muted transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronLeft className="size-4" />
        </button>
        {pages().map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="flex size-8 items-center justify-center text-muted">
              <FiMoreHorizontal className="size-4" />
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(Number(p))}
              className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === currentPage
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "border border-border/60 text-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border/60 text-muted transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function RecipesTable({
  recipes,
  total,
  page,
  limit,
}: {
  recipes: AdminRecipe[];
  total: number;
  page: number;
  limit: number;
}) {
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  function go(target: number) {
    if (target < 1 || target > totalPages || target === currentPage) return;
    const params = new URLSearchParams();
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    router.push(`/admin/recipes${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
        {/* Header */}
        <div className="grid min-w-[800px] grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-border/50 bg-surface-secondary/60 px-5 py-3">
          {["Recipe", "Category", "Visibility", "Published", "Activity", "Created", "Actions"].map((h, i) => (
            <span
              key={h}
              className={`text-xs font-semibold uppercase tracking-wider text-muted ${i === 6 ? "text-right" : ""}`}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="min-w-[800px] divide-y divide-border/40">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-secondary/30"
            >
              {/* Recipe */}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{recipe.title}</p>
                <p className="truncate text-xs text-muted">by {recipe.author.name}</p>
              </div>

              {/* Category */}
              <span className="inline-flex items-center rounded-full border border-border/60 bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-foreground/70">
                {recipe.category.name}
              </span>

              {/* Visibility */}
              <VisibilityBadge visibility={recipe.visibility} />

              {/* Publish toggle */}
              <div className="flex items-center gap-2">
                <PublishToggle recipe={recipe} />
                <span className={`text-xs font-medium ${recipe.isUnpublishedByAdmin ? "text-red-500" : "text-emerald-600"}`}>
                  {recipe.isUnpublishedByAdmin ? "Off" : "On"}
                </span>
              </div>

              {/* Activity */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-foreground/70">
                  {recipe._count.reviews} review{recipe._count.reviews !== 1 ? "s" : ""}
                </span>
                <span className="text-xs text-muted">
                  {recipe._count.favoritedBy} fav{recipe._count.favoritedBy !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Created */}
              <span className="text-sm text-muted">{formatDate(recipe.createdAt)}</span>

              {/* Actions */}
              <div className="flex justify-end">
                <DeleteRecipeButton recipe={recipe} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        startItem={startItem}
        endItem={endItem}
        go={go}
      />
    </div>
  );
}
