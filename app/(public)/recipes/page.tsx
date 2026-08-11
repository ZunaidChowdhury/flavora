import { fetchCategories } from "@/lib/api/category.api";
import { fetchPublicRecipes } from "@/lib/api/recipe.api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { RecipePagination } from "@/components/recipes/RecipePagination";
import { DataLoadFailed } from "@/components/ui/DataLoadFailed";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function RecipesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const [categories, result] = await Promise.all([
    fetchCategories(),
    fetchPublicRecipes({
      search: sp.search,
      categoryId: sp.categoryId,
      sort: sp.sort === "oldest" ? "oldest" : "newest",
      page,
      limit: 12,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / result.limit));
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground">All Recipes</h1>
      <RecipeFilters categories={categories} />

      {result.recipes.length === 0 ? (
        <div className="mt-6">
          <DataLoadFailed
            title="No recipes found"
            description="Try adjusting your search or filters."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {totalPages > 1 && (
            <RecipePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={result.total}
              itemsPerPage={result.limit}
              search={sp.search}
              categoryId={sp.categoryId}
              sort={sp.sort}
            />
          )}
        </>
      )}
    </div>
  );
}
