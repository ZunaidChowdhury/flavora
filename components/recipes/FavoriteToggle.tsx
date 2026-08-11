"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import { getMyFavorites, toggleRecipeFavorite } from "@/lib/actions/recipe.actions";
import { useAppSelector } from "@/store/hooks";

export function FavoriteToggle({
  recipeId,
  isIconOnly = false,
}: {
  recipeId: string;
  isIconOnly?: boolean;
}) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    getMyFavorites()
      .then((favs) => {
        if (cancelled) return;
        setFavorites(favs.map((f) => f.id));
      })
      .catch(() => {
        // ignore — defaults to un-favorited
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setIsFavorited(favorites.includes(recipeId));
  }, [favorites, recipeId]);

  /* ── Not logged in ───────────────────────────── */
  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 bg-surface px-4 py-2.5 text-sm font-medium text-foreground/80 shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
      >
        <FiHeart className="size-4" />
        {!isIconOnly && "Login to favorite"}
      </Link>
    );
  }

  async function toggle() {
    const next = !isFavorited;
    setIsFavorited(next);
    try {
      const res = await toggleRecipeFavorite(recipeId);
      setIsFavorited(res.isFavorited);
      toast.success(
        res.isFavorited ? "Added to favorites ❤️" : "Removed from favorites"
      );
    } catch (err) {
      setIsFavorited(!next);
      toast.error(err instanceof Error ? err.message : "Failed to update favorite");
    }
  }

  /* ── Logged in ───────────────────────────────── */
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready && isAuthenticated}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={`group inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        isFavorited
          ? "border-primary/40 bg-primary text-white shadow-primary/25 hover:brightness-110"
          : "border-border/70 bg-surface text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
      }`}
    >
      <FiHeart
        className={`size-4 transition-transform duration-200 group-hover:scale-110 ${
          isFavorited ? "fill-current" : ""
        }`}
      />
      {!isIconOnly && (isFavorited ? "Favorited" : "Add to Favorite")}
    </button>
  );
}
