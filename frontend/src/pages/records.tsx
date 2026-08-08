import type { Selection, SortDescriptor } from "@heroui/react";
import type { RecordSortBySchema } from "@parking-access/schemas";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { recordsQuery } from "@/api/records";
import RecordsTable from "@/components/tables/records-table";
import { useQueryString } from "@/hooks/use-query-string";
import { useTableUrlState } from "@/hooks/use-table-url-state";

type SortBy = z.infer<typeof RecordSortBySchema>;

const SORTABLE_COLUMNS = ["userName", "success", "reasonForDenial", "time"];

export default function RecordsPage() {
  const navigate = useNavigate();
  const paramStr = useQueryString();
  const {
    page,
    pageSize,
    sortBy: rawSortBy,
    sortOrder,
    search: urlSearch,
    setPage,
    setPageSize,
    setSort,
    setSearch: setUrlSearch,
  } = useTableUrlState({ sortBy: "time" });
  const [search, setSearch] = useState(urlSearch);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  useEffect(() => {
    const id = setTimeout(() => setUrlSearch(search), 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const sortBy = (
    SORTABLE_COLUMNS.includes(rawSortBy) ? rawSortBy : "time"
  ) as SortBy;

  const sortDescriptor: SortDescriptor = {
    column: sortBy,
    direction: sortOrder === "asc" ? "ascending" : "descending",
  };

  const { data, isLoading, error } = useQuery({
    ...recordsQuery({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search: urlSearch,
    }),
    placeholderData: keepPreviousData,
  });

  const [prevData, setPrevData] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    setSelectedKeys(new Set());
  }

  if (isLoading) return null;

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSort(descriptor);
  };

  const handleDeleteSelection = () => {
    const selectedIds =
      selectedKeys === "all"
        ? (data?.data.map((record) => record.id) ?? [])
        : Array.from(selectedKeys, Number);

    navigate(`/records/delete-many${paramStr}`, {
      state: { recordIds: selectedIds },
    });
  };

  return (
    <section className="flex justify-center w-full">
      <RecordsTable
        isError={!!error}
        page={page}
        pageSize={pageSize}
        records={data?.data ?? []}
        search={search}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        totalPages={data?.meta.totalPages ?? 1}
        totalRecords={data?.meta.totalRecords ?? 0}
        onDeleteSelection={handleDeleteSelection}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearch}
        onSelectionChange={setSelectedKeys}
        onSortChange={handleSortChange}
      />
      <Outlet />
    </section>
  );
}
