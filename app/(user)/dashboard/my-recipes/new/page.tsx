import { fetchCategories } from "@/lib/api/category.api";
import { RecipeForm } from "@/components/recipes/RecipeForm";

export const dynamic = "force-dynamic";

export default async function NewRecipePage() {
  const categories = await fetchCategories();
  return <RecipeForm categories={categories} />;
}
