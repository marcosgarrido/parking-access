import type { SortDescriptor } from "@heroui/react";
import { useSearchParams } from "react-router-dom";

type TableUrlStateDefaults = {
  sortBy: string;
  sortOrder?: "asc" | "desc";
  pageSize?: number;
};

export function useTableUrlState(defaults: TableUrlStateDefaults) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(
    searchParams.get("pageSize") ?? defaults.pageSize ?? 10,
  );
  const sortBy = searchParams.get("sortBy") ?? defaults.sortBy;
  const sortOrder = (searchParams.get("sortOrder") ??
    defaults.sortOrder ??
    "desc") as "asc" | "desc";
  const search = searchParams.get("search") ?? "";

  function setPage(newPage: number) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("page", String(newPage));

      return params;
    });
  }

  function setPageSize(newPageSize: number) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("pageSize", String(newPageSize));
      params.set("page", "1");

      return params;
    });
  }

  function setSort(descriptor: SortDescriptor) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("sortBy", String(descriptor.column));
      params.set(
        "sortOrder",
        descriptor.direction === "ascending" ? "asc" : "desc",
      );
      params.set("page", "1");

      return params;
    });
  }

  function setSearch(newSearch: string) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (newSearch) params.set("search", newSearch);
      else params.delete("search");
      params.set("page", "1");

      return params;
    });
  }

  return {
    page,
    pageSize,
    sortBy,
    sortOrder,
    search,
    setPage,
    setPageSize,
    setSort,
    setSearch,
  };
}
