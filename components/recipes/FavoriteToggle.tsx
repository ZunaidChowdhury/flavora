"use client";

import { useEffect, useState } from "react";
import { Button, Link } from "@heroui/react";
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

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-2 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-surface"
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
        res.isFavorited ? "Added to favorites" : "Removed from favorites"
      );
    } catch (err) {
      setIsFavorited(!next);
      toast.error(err instanceof Error ? err.message : "Failed to update favorite");
    }
  }

  return (
    <Button
      isIconOnly={isIconOnly}
      variant={isFavorited ? "primary" : "outline"}
      isDisabled={!ready && isAuthenticated}
      onPress={toggle}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <FiHeart className={`size-4 ${isFavorited ? "fill-current" : ""}`} />
      {!isIconOnly && (isFavorited ? "Favorited" : "Favorite")}
    </Button>
  );
}
