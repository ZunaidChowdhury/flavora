"use server";

import { serverMutation } from "../core/server";

export async function updateProfile(id: string, body: { name?: string }) {
  return serverMutation<unknown>(`/users/${id}`, "PUT", body);
}

export async function updateUserRole(id: string, role: "USER" | "ADMIN") {
  return serverMutation<unknown>(`/users/${id}/role`, "PUT", { role });
}

export async function deleteUser(id: string) {
  return serverMutation<null>(`/users/${id}`, "DELETE");
}
