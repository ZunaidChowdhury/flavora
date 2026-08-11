import { notFound } from "next/navigation";
import { ApiError } from "@/lib/core/server";
import { fetchCategories } from "@/lib/api/category.api";
import { fetchRecipeById } from "@/lib/api/recipe.api";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { VisibilityToggle } from "@/components/recipes/VisibilityToggle";
import { NotFound } from "@/components/ui/NotFound";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let recipe;
  try {
    recipe = await fetchRecipeById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      return (
        <NotFound
          title="Access denied"
          description="You can't edit this recipe."
        />
      );
    }
    notFound();
  }
  const categories = await fetchCategories();
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Edit recipe</h1>
        <VisibilityToggle
          recipeId={recipe.id}
          visibility={recipe.visibility}
          isUnpublishedByAdmin={recipe.isUnpublishedByAdmin}
        />
      </div>
      <RecipeForm categories={categories} initial={recipe} />
    </div>
  );
}
