import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get("flavora_token")?.value;
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T | null;
}

async function request<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message ?? "Request failed",
      json?.data ?? null
    );
  }

  return json.data as T;
}

export const serverFetch = <T>(url: string, _options?: RequestInit) =>
  request<T>(url, "GET");

export const serverMutation = <T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
) => request<T>(url, method, body);

export async function setAuthCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set("flavora_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete("flavora_token");
}
