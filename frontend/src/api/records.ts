import type { Id } from "@parking-access/schemas";
import {
  type RecordDeleteManyBody,
  type RecordListQuery,
} from "@parking-access/schemas";
import { queryOptions } from "@tanstack/react-query";

import {
  type RecordListResponse,
  RecordListResponseSchema,
} from "@/schemas/record-schema";

import { apiFetch } from "./client";

type Params = Required<RecordListQuery>;

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

export async function deleteRecords(ids: Id[]): Promise<void> {
  const body: RecordDeleteManyBody = { ids };

  await apiFetch("/api/records/delete-many", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
