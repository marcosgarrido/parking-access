import type { Selection, SortDescriptor } from "@heroui/react";
import type { ParkingUserSortBySchema } from "@parking-access/schemas";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { parkingUsersQuery } from "@/api/parking-users";
import ParkingUsersTable from "@/components/tables/parking-users-table";

type SortBy = z.infer<typeof ParkingUserSortBySchema>;

const SORTABLE_COLUMNS = ["name", "accessAllowed", "lastAccess", "createdAt"];

export default function ParkingUsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
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
      : "createdAt"
  ) as SortBy;
  const sortOrder = sortDescriptor.direction === "ascending" ? "asc" : "desc";

  const { data, isLoading, error } = useQuery({
    ...parkingUsersQuery({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search: debouncedSearch,
    }),
    placeholderData: keepPreviousData,
  });

  const [prevData, setPrevData] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    setSelectedKeys(new Set());
  }

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los usuarios del parking</p>;

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    setPage(1);
  };

  const handleDeleteSelection = () => {
    const selectedIds =
      selectedKeys === "all"
        ? (data?.data.map((user) => user.id) ?? [])
        : Array.from(selectedKeys, Number);

    navigate("/parking-users/delete-many", { state: { userIds: selectedIds } });
  };

  return (
    <section className="flex justify-center w-full">
      <ParkingUsersTable
        page={page}
        pageSize={pageSize}
        search={search}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        totalPages={data?.meta.totalPages ?? 1}
        totalUsers={data?.meta.totalUsers ?? 0}
        users={data?.data ?? []}
        onCreate={() => navigate("/parking-users/new")}
        onDeleteSelection={handleDeleteSelection}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={setSearch}
        onSelectionChange={setSelectedKeys}
        onSortChange={handleSortChange}
      />
      <Outlet />
    </section>
  );
}
