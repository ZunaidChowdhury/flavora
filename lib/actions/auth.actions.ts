"use server";

import { serverMutation, setAuthCookie, clearAuthCookie } from "../core/server";
import type { UserSummary } from "../api/user.api";

export async function registerUser(body: {
  name: string;
  email: string;
  password: string;
  image?: string;
}) {
  const data = await serverMutation<{ token: string; user: UserSummary }>(
    "/auth/register",
    "POST",
    body
  );
  await setAuthCookie(data.token);
  return data;
}

export async function loginUser(body: { email: string; password: string }) {
  const data = await serverMutation<{ token: string; user: UserSummary }>(
    "/auth/login",
    "POST",
    body
  );
  await setAuthCookie(data.token);
  return data;
}

export async function logoutUser() {
  await clearAuthCookie();
}
