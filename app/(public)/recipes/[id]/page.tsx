import { notFound } from "next/navigation";
import { ApiError } from "@/lib/core/server";
import { fetchRecipeById } from "@/lib/api/recipe.api";
import { FavoriteToggle } from "@/components/recipes/FavoriteToggle";
import { ReviewForm } from "@/components/recipes/ReviewForm";
import { NotFound } from "@/components/ui/NotFound";

export const revalidate = 60;

export default async function RecipeDetailPage({
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
          title="Private recipe"
          description="This recipe is not available to the public."
        />
      );
    }
    notFound();
  }

  const avg =
    recipe.reviews.length > 0
      ? (
          recipe.reviews.reduce((sum, r) => sum + r.rating, 0) /
          recipe.reviews.length
        ).toFixed(1)
      : null;

  return (
    <article className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      {recipe.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.image}
          alt={recipe.title}
          className="aspect-[16/9] w-full rounded-2xl object-cover"
        />
      ) : null}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{recipe.title}</h1>
          <p className="mt-1 text-sm text-muted">
            by {recipe.author.name} · {recipe.category.name}
          </p>
        </div>
        <FavoriteToggle recipeId={recipe.id} />
      </div>

      <p className="mt-4 text-foreground">{recipe.description}</p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Ingredients
      </h2>
      <ul className="mt-2 list-inside list-disc text-foreground">
        {recipe.ingredients.map((ing) => (
          <li key={ing}>{ing}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Instructions
      </h2>
      <p className="mt-2 whitespace-pre-line text-foreground">
        {recipe.instructions}
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">
          Reviews{avg ? ` · ${avg}/5` : ""}
        </h2>
        {recipe.reviews.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No reviews yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recipe.reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-border/60 bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {review.user.name}
                  </span>
                  <span className="text-sm text-primary">{review.rating}/5</span>
                </div>
                <p className="mt-1 text-sm text-foreground">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
        <ReviewForm recipeId={recipe.id} />
      </section>
    </article>
  );
}
