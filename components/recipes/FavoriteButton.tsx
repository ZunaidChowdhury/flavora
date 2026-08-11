"use client";

import { useEffect, useState } from "react";
import { Button, Link } from "@heroui/react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import { getMyFavorites, toggleRecipeFavorite } from "@/lib/actions/recipe.actions";
import { useAppSelector } from "@/store/hooks";

export function FavoriteButton({ recipeId }: { recipeId: string }) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    getMyFavorites()
      .then((favs) => {
        if (!cancelled) setIsFavorited(favs.some((f) => f.id === recipeId));
      })
      .catch(() => {
        // ignore — button defaults to un-favorited state
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, recipeId]);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
      >
        <FiHeart className="size-4" />
        Login to favorite
      </Link>
    );
  }

  async function toggle() {
    try {
      const res = await toggleRecipeFavorite(recipeId);
      setIsFavorited(res.isFavorited);
      toast.success(res.isFavorited ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update favorite");
    }
  }

  return (
    <Button
      variant={isFavorited ? "primary" : "outline"}
      isDisabled={loading}
      onPress={toggle}
      aria-pressed={isFavorited}
    >
      <FiHeart className={`size-4 ${isFavorited ? "fill-current" : ""}`} />
      {isFavorited ? "Favorited" : "Favorite"}
    </Button>
  );
}
