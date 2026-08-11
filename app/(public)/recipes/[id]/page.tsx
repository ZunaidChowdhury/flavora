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
      {/* Cover image */}
      {recipe.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.image}
          alt={recipe.title}
          className="aspect-[16/9] w-full rounded-2xl object-cover shadow-lg"
        />
      ) : null}

      {/* Title + favorite */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-bold text-foreground">
            {recipe.title}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>by <span className="font-medium text-foreground/80">{recipe.author.name}</span></span>
            <span className="inline-block size-1 rounded-full bg-border" />
            <span className="inline-flex items-center rounded-full border border-border/60 bg-surface-secondary px-2.5 py-0.5 text-xs font-medium">
              {recipe.category.name}
            </span>
            {avg && (
              <>
                <span className="inline-block size-1 rounded-full bg-border" />
                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                  <svg className="size-3.5 fill-primary" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {avg} / 5 ({recipe.reviews.length})
                </span>
              </>
            )}
          </p>
        </div>
        <FavoriteToggle recipeId={recipe.id} />
      </div>

      {/* Description */}
      <p className="mt-5 break-words leading-relaxed text-foreground/90">
        {recipe.description}
      </p>

      {/* Ingredients */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border/50 bg-surface-secondary/60 px-5 py-3.5">
          <svg className="size-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <h2 className="text-sm font-semibold text-foreground">Ingredients</h2>
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {recipe.ingredients.length}
          </span>
        </div>
        <ul className="flex flex-col gap-0 divide-y divide-border/40 px-5">
          {recipe.ingredients.map((ing, i) => (
            <li key={ing} className="flex items-center gap-3 py-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{ing}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border/50 bg-surface-secondary/60 px-5 py-3.5">
          <svg className="size-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10"/></svg>
          <h2 className="text-sm font-semibold text-foreground">Instructions</h2>
        </div>
        <p className="break-words whitespace-pre-line px-5 py-5 text-sm leading-relaxed text-foreground/90">
          {recipe.instructions}
        </p>
      </section>

      {/* Reviews section */}
      <section className="mt-10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
          {avg && (
            <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <svg className="size-3.5 fill-primary" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {avg} · {recipe.reviews.length} review{recipe.reviews.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {recipe.reviews.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-surface px-6 py-10 text-center">
            <svg className="mx-auto mb-3 size-10 text-muted/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <p className="text-sm font-medium text-muted">No reviews yet</p>
            <p className="mt-1 text-xs text-muted/70">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {recipe.reviews.map((review) => {
              const initials = review.user.name
                .trim()
                .split(/\s+/)
                .map((p: string) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <li
                  key={review.id}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-border/40 bg-surface-secondary/40 px-4 py-3">
                    {/* Avatar */}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                      {initials}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-foreground">
                      {review.user.name}
                    </span>
                    {/* Stars */}
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          className={`size-3.5 ${s <= review.rating ? "fill-primary text-primary" : "fill-transparent text-border stroke-border"}`}
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <span className="ml-1.5 text-xs font-medium text-primary">
                        {review.rating}/5
                      </span>
                    </span>
                  </div>
                  <p className="px-4 py-3.5 text-sm leading-relaxed text-foreground/85">
                    {review.comment}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        <ReviewForm recipeId={recipe.id} />
      </section>
    </article>
  );
}
