import {
  type RecordListResponse,
  RecordListResponseSchema,
  type RecordSortBy,
} from "@parking-access/schemas";
import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "./client";

type Params = {
  page: number;
  pageSize: number;
  sortBy: RecordSortBy;
  sortOrder: "asc" | "desc";
  search: string;
};

export async function fetchRecords(
  params: Params,
): Promise<RecordListResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    search: params.search,
  });

  const json = await apiFetch(`/api/records?${searchParams}`);

  return RecordListResponseSchema.parse(json);
}

export const recordsQuery = (params: Params) =>
  queryOptions({
    queryKey: ["records", params],
    queryFn: () => fetchRecords(params),
  });
