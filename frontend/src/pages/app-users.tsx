import type { Selection, SortDescriptor } from "@heroui/react";
import type { AppUserSortBy } from "@parking-access/schemas";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { appUsersQuery } from "@/api/app-users";
import AppUsersTable from "@/components/app-users-table/app-users-table";

const SORTABLE_COLUMNS = [
  "name",
  "username",
  "role",
  "isActive",
  "lastLoginAt",
  "createdAt",
];

export default function AppUsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "username",
    direction: "ascending",
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
      : "username"
  ) as AppUserSortBy;
  const sortOrder = sortDescriptor.direction === "ascending" ? "asc" : "desc";

  const { data, isLoading, error } = useQuery({
    ...appUsersQuery({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search: debouncedSearch,
    }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los usuarios del sistema</p>;

  const handleDeleteSelection = () => {
    const selectedIds =
      selectedKeys === "all"
        ? (data?.data.map((user) => user.id) ?? [])
        : Array.from(selectedKeys, Number);

    navigate("/app-users/delete-many", { state: { userIds: selectedIds } });
  };

  return (
    <section className="flex justify-center w-full">
      <AppUsersTable
        page={page}
        pageSize={pageSize}
        search={search}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        totalPages={data?.meta.totalPages ?? 1}
        totalUsers={data?.meta.totalUsers ?? 0}
        users={data?.data ?? []}
        onCreate={() => navigate("/app-users/new")}
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
