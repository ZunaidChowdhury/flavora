import { serverMutation } from "../core/server";

export const createReview = (body: {
  recipeId: string;
  rating: number;
  comment: string;
}) => serverMutation<unknown>("/reviews", "POST", body);

export const updateReview = (
  id: string,
  body: { rating?: number; comment?: string }
) => serverMutation<unknown>(`/reviews/${id}`, "PUT", body);

export const deleteReview = (id: string) =>
  serverMutation<null>(`/reviews/${id}`, "DELETE");
