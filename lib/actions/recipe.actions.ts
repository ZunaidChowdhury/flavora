import { serverMutation } from "../core/server";

export type RecipeInput = {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  categoryId: string;
  image?: string | null;
};

export const createRecipe = (body: RecipeInput) =>
  serverMutation<unknown>("/recipes", "POST", body);

export const updateRecipe = (id: string, body: Partial<RecipeInput>) =>
  serverMutation<unknown>(`/recipes/${id}`, "PUT", body);

export const deleteRecipe = (id: string) =>
  serverMutation<null>(`/recipes/${id}`, "DELETE");

export const updateRecipeVisibility = (
  id: string,
  visibility: "PUBLIC" | "PRIVATE"
) => serverMutation<unknown>(`/recipes/${id}/visibility`, "PUT", { visibility });

export const toggleRecipeFavorite = (id: string) =>
  serverMutation<{ isFavorited: boolean }>(`/recipes/${id}/favorite`, "POST");
