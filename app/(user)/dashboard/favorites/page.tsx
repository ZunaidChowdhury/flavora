import { getMyFavorites } from "@/lib/actions/recipe.actions";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { DataLoadFailed } from "@/components/ui/DataLoadFailed";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const favorites = await getMyFavorites();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        <p className="mt-1 text-sm text-muted">
          {favorites.length} saved recipe{favorites.length === 1 ? "" : "s"}
        </p>
      </div>

      {favorites.length === 0 ? (
        <DataLoadFailed
          title="No favorites yet"
          description="Tap the heart on any recipe to save it here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
