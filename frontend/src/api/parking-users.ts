import type { Id } from "@parking-access/schemas";
import {
  type ParkingUserCreateBody,
  type ParkingUserListResponse,
  ParkingUserListResponseSchema,
  type ParkingUserResponse,
  ParkingUserResponseSchema,
  type ParkingUserSortBySchema,
  type ParkingUserUpdateBody,
} from "@parking-access/schemas";
import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";

import { apiFetch } from "./client";

type Params = {
  page: number;
  pageSize: number;
  sortBy: z.infer<typeof ParkingUserSortBySchema>;
  sortOrder: "asc" | "desc";
  search: string;
};

export async function fetchParkingUsers(
  params: Params,
): Promise<ParkingUserListResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    search: params.search,
  });

  const json = await apiFetch(`/api/parking-users?${searchParams}`);

  return ParkingUserListResponseSchema.parse(json);
}

export const parkingUsersQuery = (params: Params) =>
  queryOptions({
    queryKey: ["parking-users", params],
    queryFn: () => fetchParkingUsers(params),
  });

export async function createParkingUser(
  payload: ParkingUserCreateBody,
): Promise<ParkingUserResponse> {
  const json = await apiFetch("/api/parking-users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return ParkingUserResponseSchema.parse(json);
}

export async function fetchParkingUser(id: Id): Promise<ParkingUserResponse> {
  const json = await apiFetch(`/api/parking-users/${id}`);

  return ParkingUserResponseSchema.parse(json);
}

export const parkingUserQuery = (id: Id) =>
  queryOptions({
    queryKey: ["parking-user", id],
    queryFn: () => fetchParkingUser(id),
  });

export async function updateParkingUser(
  id: Id,
  payload: ParkingUserUpdateBody,
): Promise<ParkingUserResponse> {
  const json = await apiFetch(`/api/parking-users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return ParkingUserResponseSchema.parse(json);
}

export async function deleteParkingUser(id: Id): Promise<void> {
  await apiFetch(`/api/parking-users/${id}`, { method: "DELETE" });
}

export async function deleteParkingUsers(ids: Id[]): Promise<void> {
  await apiFetch("/api/parking-users/delete-many", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
