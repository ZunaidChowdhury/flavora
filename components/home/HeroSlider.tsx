"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { RecipeSummary } from "@/lib/api/recipe.api";

const AUTOPLAY_MS = 6000;

export function HeroSlider({ recipes }: { recipes: RecipeSummary[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = recipes.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % count),
      AUTOPLAY_MS
    );
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-lg">
        <div className="relative h-[440px] overflow-hidden bg-gradient-to-br from-surface via-surface-secondary/40 to-surface md:h-[500px]">
          {/* Glowing blur elements */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-[100px]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Welcome to Flavora
            </span>
            <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Discover and share <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">great recipes</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              Browse recipes from the community or share your own kitchen masterpieces with food lovers globally.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/recipes"
                className="inline-flex cursor-pointer items-center rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:brightness-105"
              >
                Browse all recipes
              </Link>
              <Link
                href="/#categories"
                className="inline-flex cursor-pointer items-center rounded-xl border border-border/70 bg-surface px-6 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                Explore categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const go = (next: number) => setIndex(((next % count) + count) % count);
  const slide = recipes[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[460px] overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-xl md:h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {slide.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-black/20"
                />
              </>
            ) : (
              <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-surface via-surface-secondary/40 to-surface">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
                />
              </div>
            )}

            {/* Slider Content Wrapper */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-12">
              <span className="inline-flex rounded-full bg-primary/15 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-xs">
                {slide.category.name}
              </span>
              <h1 className="mt-3.5 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground md:text-5xl leading-tight drop-shadow-xs">
                {slide.title}
              </h1>
              <p className="mt-3 max-w-xl line-clamp-2 text-sm text-muted md:text-base leading-relaxed">
                {slide.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/recipes/${slide.id}`}
                  className="inline-flex cursor-pointer items-center rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 hover:brightness-105"
                >
                  View Recipe
                </Link>
                <Link
                  href="/recipes"
                  className="inline-flex cursor-pointer items-center rounded-xl border border-border/70 bg-surface/85 px-6 py-2.5 text-sm font-semibold text-foreground/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  Browse All Recipes
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows (redesigned custom buttons) */}
        {count > 1 && (
          <div className="absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 justify-between pointer-events-none">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="pointer-events-auto flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-surface/75 text-foreground/80 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25"
            >
              <FiChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="pointer-events-auto flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-surface/75 text-foreground/80 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25"
            >
              <FiChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {recipes.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === index ? "w-8 bg-primary shadow-xs shadow-primary/45" : "w-2.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
