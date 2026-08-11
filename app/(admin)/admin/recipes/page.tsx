import { fetchAdminRecipes } from "@/lib/api/recipe.api";
import { RecipesTable } from "@/components/admin/RecipesTable";
import { DataLoadFailed } from "@/components/ui/DataLoadFailed";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminRecipesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const result = await fetchAdminRecipes(page, 10);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recipes</h1>
        <p className="mt-1 text-sm text-muted">
          {result.total} recipe{result.total === 1 ? "" : "s"}
        </p>
      </div>

      {result.recipes.length === 0 ? (
        <DataLoadFailed
          title="No recipes found"
          description="There are no recipes to manage yet."
        />
      ) : (
        <RecipesTable
          recipes={result.recipes}
          total={result.total}
          page={result.page}
          limit={result.limit}
        />
      )}
    </div>
  );
}
