import type { Selection, SortDescriptor } from "@heroui/react";
import type { AppUserSortBy } from "@parking-access/schemas";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { appUsersQuery } from "@/api/app-users";
import AppUsersTable from "@/components/tables/app-users-table";
import { useQueryString } from "@/hooks/use-query-string";
import { useTableUrlState } from "@/hooks/use-table-url-state";

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
  } = useTableUrlState({ sortBy: "createdAt" });
  const [search, setSearch] = useState(urlSearch);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  useEffect(() => {
    const id = setTimeout(() => setUrlSearch(search), 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const sortBy = (
    SORTABLE_COLUMNS.includes(rawSortBy) ? rawSortBy : "createdAt"
  ) as AppUserSortBy;

  const sortDescriptor: SortDescriptor = {
    column: sortBy,
    direction: sortOrder === "asc" ? "ascending" : "descending",
  };

  const { data, isLoading, error } = useQuery({
    ...appUsersQuery({
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

  if (isLoading) return <p>Cargando...</p>;

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSort(descriptor);
  };

  const handleDeleteSelection = () => {
    const selectedIds =
      selectedKeys === "all"
        ? (data?.data.map((user) => user.id) ?? [])
        : Array.from(selectedKeys, Number);

    navigate(`/app-users/delete-many${paramStr}`, {
      state: { userIds: selectedIds },
    });
  };

  return (
    <section className="flex justify-center w-full">
      <AppUsersTable
        isError={!!error}
        page={page}
        pageSize={pageSize}
        search={search}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        totalPages={data?.meta.totalPages ?? 1}
        totalUsers={data?.meta.totalUsers ?? 0}
        users={data?.data ?? []}
        onCreate={() => navigate(`/app-users/new${paramStr}`)}
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
