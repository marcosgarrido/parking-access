import {
  type ParkingUserListResponse,
  ParkingUserListResponseSchema,
  type ParkingUserSortBySchema,
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
