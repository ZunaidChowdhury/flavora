import Link from "next/link";
import type { RecipeSummary } from "@/lib/api/recipe.api";
import { FavoriteToggle } from "./FavoriteToggle";

export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-lg transition-all hover:shadow-xl">
      <div className="absolute right-3 top-3 z-10">
        <FavoriteToggle recipeId={recipe.id} isIconOnly />
      </div>

      <Link href={`/recipes/${recipe.id}`} className="flex flex-1 flex-col">
        {recipe.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface-secondary text-muted">
            No image
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="line-clamp-2 font-semibold text-foreground">
            {recipe.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted">{recipe.description}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted">
            <span>{recipe.category.name}</span>
            <span>{recipe.author.name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
