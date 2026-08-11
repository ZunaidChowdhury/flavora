import { serverFetch } from "../core/server";
import type { ReviewSummary } from "./review.api";

export type RecipeSummary = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  image: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  isUnpublishedByAdmin: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; email: string };
  category: { id: string; name: string };
};

export type RecipeListResult = {
  recipes: RecipeSummary[];
  total: number;
  page: number;
  limit: number;
};

export type RecipeListParams = {
  search?: string;
  categoryId?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
};

export const fetchPublicRecipes = (params: RecipeListParams = {}) => {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.categoryId) qs.set("categoryId", params.categoryId);
  if (params.sort) qs.set("sort", params.sort);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  return serverFetch<RecipeListResult>(`/recipes?${qs.toString()}`, {
    auth: false,
  });
};

export const fetchRecipeById = (id: string) =>
  serverFetch<RecipeSummary & { reviews: ReviewSummary[] }>(`/recipes/${id}`, {
    auth: false,
  });

export const fetchMyRecipes = () =>
  serverFetch<RecipeSummary[]>("/recipes/mine");

export const fetchMyFavorites = () =>
  serverFetch<RecipeSummary[]>("/recipes/favorites/mine");

export type AdminStats = {
  totalUsers: number;
  totalRecipes: number;
  totalReviews: number;
  totalCategories: number;
  recipesByCategory: { name: string; count: number }[];
};

export const fetchAdminStats = () =>
  serverFetch<AdminStats>("/recipes/admin/stats");

export type AdminRecipe = RecipeSummary & {
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  _count: { reviews: number; favoritedBy: number };
};

export type AdminRecipeListResult = {
  recipes: AdminRecipe[];
  total: number;
  page: number;
  limit: number;
};

export const fetchAdminRecipes = (page = 1, limit = 10) =>
  serverFetch<AdminRecipeListResult>(`/recipes/admin?page=${page}&limit=${limit}`);
