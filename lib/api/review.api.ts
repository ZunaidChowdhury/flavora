import { serverFetch } from "../core/server";

export type ReviewSummary = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string };
  recipe: { id: string; title: string };
};

export const fetchReviews = (recipeId?: string) =>
  serverFetch<ReviewSummary[]>(
    recipeId ? `/reviews?recipeId=${recipeId}` : "/reviews",
    { auth: false }
  );

export const fetchReviewById = (id: string) =>
  serverFetch<ReviewSummary>(`/reviews/${id}`);
