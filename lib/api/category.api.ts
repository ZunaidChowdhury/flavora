import { serverFetch } from "../core/server";

export type CategorySummary = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export const fetchCategories = () =>
  serverFetch<CategorySummary[]>("/categories", { auth: false });

export const fetchCategoryById = (id: string) =>
  serverFetch<CategorySummary>(`/categories/${id}`, { auth: false });
