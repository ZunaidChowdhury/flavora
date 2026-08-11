import { fetchMyRecipes } from "@/lib/api/recipe.api";
import { getMyFavorites } from "@/lib/actions/recipe.actions";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const [recipes, favorites] = await Promise.all([
    fetchMyRecipes(),
    getMyFavorites(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-surface p-5">
          <p className="text-sm text-muted">My Recipes</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {recipes.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-surface p-5">
          <p className="text-sm text-muted">Favorites</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {favorites.length}
          </p>
        </div>
      </div>
    </div>
  );
}
