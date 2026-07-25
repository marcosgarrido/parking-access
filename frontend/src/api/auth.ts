import {
  type LoginResponse,
  LoginResponseSchema,
} from "@parking-access/schemas";

import { apiFetch } from "./client";

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const json = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  return LoginResponseSchema.parse(json);
}

export async function logout() {
  await apiFetch("/api/auth/logout", { method: "POST" });
}

export async function fetchMe() {
  return apiFetch("/api/auth/me");
}
