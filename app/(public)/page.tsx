import Link from "next/link";
import { fetchCategories } from "@/lib/api/category.api";
import { fetchPublicRecipes } from "@/lib/api/recipe.api";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    fetchCategories(),
    fetchPublicRecipes({ sort: "newest", limit: 6 }),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Discover and share great recipes
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          Browse recipes from the community or share your own.
        </p>
        <Link
          href="/recipes"
          className="mt-6 inline-flex items-center rounded-xl bg-primary px-6 py-3 font-medium text-background"
        >
          Browse all recipes
        </Link>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/recipes?categoryId=${c.id}`}
              className="rounded-full border border-border/60 bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Featured recipes
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
