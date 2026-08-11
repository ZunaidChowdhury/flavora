import Link from "next/link";
import { fetchCategories } from "@/lib/api/category.api";
import { fetchPublicRecipes } from "@/lib/api/recipe.api";
import { fetchReviews } from "@/lib/api/review.api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { DataLoadFailed } from "@/components/ui/DataLoadFailed";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeFeatures } from "@/components/home/HomeFeatures";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsBand } from "@/components/home/StatsBand";
import { CtaSection } from "@/components/home/CtaSection";
import { Footer } from "@/components/home/Footer";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, featured, reviews] = await Promise.all([
    fetchCategories(),
    fetchPublicRecipes({ sort: "newest", limit: 6 }),
    fetchReviews(),
  ]);

  return (
    <>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <div className="flex flex-col gap-20">
          {/* Hero Slider Section */}
          <HeroSlider recipes={featured.recipes} />

          {/* Categories Section */}
          <section id="categories" className="mx-auto w-full">
            <div className="mb-10 text-center">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Discover
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Explore by category
              </h2>
              <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted leading-relaxed">
                Find your next favorite dish across cuisines and courses.
              </p>
            </div>
            {categories.length === 0 ? (
              <DataLoadFailed title="No categories yet" />
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/recipes?categoryId=${category.id}`}
                    className="cursor-pointer rounded-full border border-border/70 bg-surface px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-xs"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Features Section */}
          <HomeFeatures />

          {/* Latest Recipes Section */}
          <section className="mx-auto w-full">
            <div className="mb-10 text-center">
              <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                New Releases
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Fresh from the kitchen
              </h2>
              <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted leading-relaxed">
                The latest recipes shared by the community.
              </p>
            </div>
            {featured.recipes.length === 0 ? (
              <DataLoadFailed
                title="No recipes yet"
                description="Be the first to share a recipe with the community."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>

          {/* Process Section */}
          <HowItWorks />

          {/* Stats Band Section */}
          <StatsBand
            recipes={featured.total}
            categories={categories.length}
            reviews={reviews.length}
          />

          {/* Call to Action Section */}
          <CtaSection />
        </div>
      </div>

      <Footer categories={categories} />
    </>
  );
}
