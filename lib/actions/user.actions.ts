import { serverMutation } from "../core/server";

export const updateProfile = (id: string, body: { name?: string }) =>
  serverMutation<unknown>(`/users/${id}`, "PUT", body);

export const updateUserRole = (id: string, role: "USER" | "ADMIN") =>
  serverMutation<unknown>(`/users/${id}/role`, "PUT", { role });

export const deleteUser = (id: string) =>
  serverMutation<null>(`/users/${id}`, "DELETE");
