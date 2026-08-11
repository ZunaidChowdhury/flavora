"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@heroui/react";
import {
  FiBook,
  FiChevronDown,
  FiImage,
  FiList,
  FiPlus,
  FiSave,
  FiTrash2,
  FiType,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { createRecipe, updateRecipe } from "@/lib/actions/recipe.actions";
import type { CategorySummary } from "@/lib/api/category.api";
import type { RecipeSummary } from "@/lib/api/recipe.api";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function RecipeForm({
  categories,
  initial,
}: {
  categories: CategorySummary[];
  initial?: RecipeSummary;
}) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients ?? [""]
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(
    initial?.category.id
  );
  const [image, setImage] = useState<string | undefined>(
    initial?.image ?? undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setIngredient(i: number, value: string) {
    setIngredients((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }
  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    const body = {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      ingredients: ingredients.filter(Boolean),
      instructions: String(form.get("instructions") ?? ""),
      categoryId,
      image: image ?? null,
    };
    if (body.ingredients.length === 0) {
      toast.error("Add at least one ingredient");
      return;
    }
    setIsSubmitting(true);
    try {
      if (initial) {
        await updateRecipe(initial.id, body);
        toast.success("Recipe updated!");
        router.push("/dashboard/my-recipes");
      } else {
        await createRecipe(body);
        toast.success("Recipe created!");
        router.push("/dashboard/my-recipes");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save recipe");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/20">
            <FiBook className="size-5 text-white" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {initial ? "Edit Recipe" : "New Recipe"}
            </h1>
            <p className="text-sm text-muted">
              {initial
                ? "Update the details below to improve your recipe."
                : "Share something delicious with the community."}
            </p>
          </div>
        </div>
      </div>

      <Form onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">

          {/* ── Section: Basic Info ─────────────────────────────── */}
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-border/50 bg-surface-secondary/60 px-5 py-3.5">
              <FiType className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Basic Info</span>
            </div>
            <div className="flex flex-col gap-5 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Title <span className="text-primary">*</span>
                </label>
                <input
                  name="title"
                  required
                  defaultValue={initial?.title}
                  placeholder="e.g. Spicy Chicken Curry"
                  className="w-full rounded-xl border border-border/70 bg-field px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Description <span className="text-primary">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={initial?.description}
                  placeholder="A short appetising summary of the dish…"
                  className="w-full resize-y rounded-xl border border-border/70 bg-field px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Category <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <select
                    value={categoryId ?? ""}
                    onChange={(e) => setCategoryId(e.target.value || undefined)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-border/70 bg-field px-4 py-3 pr-10 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Section: Ingredients ────────────────────────────── */}
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-border/50 bg-surface-secondary/60 px-5 py-3.5">
              <FiList className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Ingredients</span>
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {ingredients.filter(Boolean).length}
              </span>
            </div>
            <div className="flex flex-col gap-3 p-5">
              {ingredients.map((ing, i) => (
                <div key={i} className="group flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    className="min-w-0 flex-1 rounded-xl border border-border/70 bg-field px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={ing}
                    onChange={(e) => setIngredient(i, e.target.value)}
                    placeholder={`e.g. ${i === 0 ? "2 cups of flour" : i === 1 ? "1 tsp salt" : "Add ingredient…"}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    aria-label={`Remove ingredient ${i + 1}`}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted opacity-0 transition-all duration-150 hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                  >
                    <FiTrash2 className="size-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setIngredients((p) => [...p, ""])}
                className="mt-1 flex cursor-pointer items-center gap-2 self-start rounded-xl border border-border/60 bg-surface-secondary px-4 py-2 text-sm font-medium text-foreground/70 transition-all duration-150 hover:border-primary/40 hover:bg-primary/8 hover:text-primary"
              >
                <FiPlus className="size-4" />
                Add ingredient
              </button>
            </div>
          </section>

          {/* ── Section: Instructions ───────────────────────────── */}
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-border/50 bg-surface-secondary/60 px-5 py-3.5">
              <FiBook className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Instructions</span>
            </div>
            <div className="p-5">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Step-by-step instructions <span className="text-primary">*</span>
                </label>
                <textarea
                  name="instructions"
                  required
                  rows={6}
                  defaultValue={initial?.instructions}
                  placeholder={"Describe each step clearly. E.g.\n1. Preheat oven to 200°C.\n2. Mix ingredients in a bowl.\n3. Bake for 25 minutes…"}
                  className="w-full resize-y rounded-xl border border-border/70 bg-field px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>
          </section>

          {/* ── Section: Image ──────────────────────────────────── */}
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-border/50 bg-surface-secondary/60 px-5 py-3.5">
              <FiImage className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Cover Image</span>
              <span className="ml-auto rounded-full bg-surface-secondary px-2 py-0.5 text-xs text-muted">
                Optional
              </span>
            </div>
            <div className="p-5">
              <ImageUpload
                endpoint="recipeImageUploader"
                initialUrl={initial?.image ?? undefined}
                onUploadComplete={(url) => setImage(url || undefined)}
                onError={(message) => toast.error(message)}
              />
            </div>
          </section>

          {/* ── Submit footer ───────────────────────────────────── */}
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface px-5 py-4 shadow-sm">
            <p className="text-sm text-muted">
              {initial ? "Changes will be saved immediately." : "Your recipe will be published to the community."}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <FiSave className="size-4" />
              )}
              {isSubmitting
                ? "Saving…"
                : initial
                ? "Save changes"
                : "Publish recipe"}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
