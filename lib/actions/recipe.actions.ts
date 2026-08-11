"use server";

import { serverMutation } from "../core/server";
import { fetchMyFavorites } from "../api/recipe.api";

export type RecipeInput = {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  categoryId: string;
  image?: string | null;
};

export async function createRecipe(body: RecipeInput) {
  return serverMutation<unknown>("/recipes", "POST", body);
}

export async function updateRecipe(id: string, body: Partial<RecipeInput>) {
  return serverMutation<unknown>(`/recipes/${id}`, "PUT", body);
}

export async function deleteRecipe(id: string) {
  return serverMutation<null>(`/recipes/${id}`, "DELETE");
}

export async function updateRecipeVisibility(
  id: string,
  visibility: "PUBLIC" | "PRIVATE"
) {
  return serverMutation<unknown>(`/recipes/${id}/visibility`, "PUT", {
    visibility,
  });
}

export async function toggleRecipeFavorite(id: string) {
  return serverMutation<{ isFavorited: boolean }>(
    `/recipes/${id}/favorite`,
    "POST"
  );
}

export async function getMyFavorites() {
  return fetchMyFavorites();
}
