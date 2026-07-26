import type { Selection, SortDescriptor } from "@heroui/react";
import type { RecordSortBySchema } from "@parking-access/schemas";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { recordsQuery } from "@/api/records";
import RecordsTable from "@/components/records-table";

type SortBy = z.infer<typeof RecordSortBySchema>;

const SORTABLE_COLUMNS = ["userName", "success", "reasonForDenial", "time"];

export default function RecordsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "time",
    direction: "descending",
  });

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(id);
  }, [search]);

  const sortBy = (
    SORTABLE_COLUMNS.includes(String(sortDescriptor.column))
      ? sortDescriptor.column
      : "time"
  ) as SortBy;
  const sortOrder = sortDescriptor.direction === "ascending" ? "asc" : "desc";

  const { data, isLoading, error } = useQuery({
    ...recordsQuery({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search: debouncedSearch,
    }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar el historial de accesos</p>;

  const handleDeleteSelection = () => {
    const selectedIds =
      selectedKeys === "all"
        ? (data?.data.map((record) => record.id) ?? [])
        : Array.from(selectedKeys, Number);

    navigate("/records/delete-many", { state: { recordIds: selectedIds } });
  };

  return (
    <section className="flex justify-center w-full">
      <RecordsTable
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
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        onSearchChange={setSearch}
        onSelectionChange={setSelectedKeys}
        onSortChange={(descriptor) => {
          setSortDescriptor(descriptor);
          setPage(1);
        }}
      />
      <Outlet />
    </section>
  );
}
