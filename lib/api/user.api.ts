import { serverFetch } from "../core/server";

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
};

export type UserListResult = {
  users: UserSummary[];
  total: number;
  page: number;
  limit: number;
};

export const fetchUsers = (page = 1, limit = 10) =>
  serverFetch<UserListResult>(`/users?page=${page}&limit=${limit}`);

export const fetchUserById = (id: string) =>
  serverFetch<UserSummary>(`/users/${id}`);
