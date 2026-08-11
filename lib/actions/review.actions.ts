"use server";

import { serverMutation } from "../core/server";

export async function createReview(body: {
  recipeId: string;
  rating: number;
  comment: string;
}) {
  return serverMutation<unknown>("/reviews", "POST", body);
}

export async function updateReview(
  id: string,
  body: { rating?: number; comment?: string }
) {
  return serverMutation<unknown>(`/reviews/${id}`, "PUT", body);
}

export async function deleteReview(id: string) {
  return serverMutation<null>(`/reviews/${id}`, "DELETE");
}
