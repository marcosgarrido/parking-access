import type { Id } from "@parking-access/schemas";
import {
  type AppUserCreateBody,
  type AppUserListResponse,
  AppUserListResponseSchema,
  type AppUserResponse,
  AppUserResponseSchema,
  type AppUserSortBy,
  type AppUserUpdateBody,
} from "@parking-access/schemas";
import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "./client";

type Params = {
  page: number;
  pageSize: number;
  sortBy: AppUserSortBy;
  sortOrder: "asc" | "desc";
  search: string;
};

export async function fetchAppUsers(
  params: Params,
): Promise<AppUserListResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    search: params.search,
  });

  const json = await apiFetch(`/api/app-users?${searchParams}`);

  return AppUserListResponseSchema.parse(json);
}

export const appUsersQuery = (params: Params) =>
  queryOptions({
    queryKey: ["app-users", params],
    queryFn: () => fetchAppUsers(params),
  });

export async function createAppUser(
  payload: AppUserCreateBody,
): Promise<AppUserResponse> {
  const json = await apiFetch("/api/app-users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return AppUserResponseSchema.parse(json);
}

export async function fetchAppUser(id: Id): Promise<AppUserResponse> {
  const json = await apiFetch(`/api/app-users/${id}`);

  return AppUserResponseSchema.parse(json);
}

export const appUserQuery = (id: Id) =>
  queryOptions({
    queryKey: ["app-user", id],
    queryFn: () => fetchAppUser(id),
  });

export async function updateAppUser(
  id: Id,
  payload: AppUserUpdateBody,
): Promise<AppUserResponse> {
  const json = await apiFetch(`/api/app-users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return AppUserResponseSchema.parse(json);
}

export async function deleteAppUser(id: Id): Promise<void> {
  await apiFetch(`/api/app-users/${id}`, { method: "DELETE" });
}

export async function deleteAppUsers(ids: Id[]): Promise<void> {
  await apiFetch("/api/app-users/delete-many", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
