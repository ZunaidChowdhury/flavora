import Link from "next/link";
import { fetchMyRecipes } from "@/lib/api/recipe.api";
import { DataLoadFailed } from "@/components/ui/DataLoadFailed";
import { Chip } from "@heroui/react";

export const dynamic = "force-dynamic";

export default async function MyRecipesPage() {
  const recipes = await fetchMyRecipes();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Recipes</h1>
        <Link
          href="/dashboard/my-recipes/new"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <DataLoadFailed
          title="No recipes yet"
          description="Create your first recipe to get started."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{recipe.title}</p>
                <p className="truncate text-sm text-muted">
                  {recipe.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Chip
                  color={recipe.visibility === "PRIVATE" ? "accent" : "success"}
                  size="sm"
                >
                  {recipe.visibility}
                </Chip>
                {recipe.isUnpublishedByAdmin && (
                  <Chip color="danger" size="sm">
                    Unpublished
                  </Chip>
                )}
                <Link
                  href={`/dashboard/my-recipes/${recipe.id}/edit`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
