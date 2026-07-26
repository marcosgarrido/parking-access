import {
  type AppUserListResponse,
  AppUserListResponseSchema,
  type AppUserSortBy,
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
