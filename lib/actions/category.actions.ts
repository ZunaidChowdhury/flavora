import { serverMutation } from "../core/server";

export const createCategory = (name: string) =>
  serverMutation<unknown>("/categories", "POST", { name });

export const updateCategory = (
  id: string,
  body: { name?: string; status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" }
) => serverMutation<unknown>(`/categories/${id}`, "PUT", body);

export const deleteCategory = (id: string) =>
  serverMutation<null>(`/categories/${id}`, "DELETE");
