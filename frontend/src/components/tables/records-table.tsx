import type { Selection, SortDescriptor } from "@heroui/react";
import { Button, Checkbox, Chip, SearchField, Table } from "@heroui/react";
import { Icon } from "@iconify/react";

import PageSizeSelect from "@/components/tables/page-size-select";
import TablePagination from "@/components/tables/table-pagination/table-pagination";
import TableStateMessage from "@/components/tables/table-state-message";
import { useAuth } from "@/hooks/use-auth";
import type { RecordResponse } from "@/schemas/record-schema";

type RecordsTableProps = {
  records: RecordResponse[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sortDescriptor: SortDescriptor;
  selectedKeys: Selection;
  isError?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (descriptor: SortDescriptor) => void;
  onSelectionChange: (keys: Selection) => void;
  onDeleteSelection: () => void;
};

export default function RecordsTable({
  records,
  totalRecords,
  page,
  pageSize,
  totalPages,
  search,
  sortDescriptor,
  selectedKeys,
  isError = false,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
  onSelectionChange,
  onDeleteSelection,
}: RecordsTableProps) {
  const { user } = useAuth();
  const canDelete = user?.role === "ADMIN";

  const hasSelection =
    selectedKeys === "all" ||
    (selectedKeys instanceof Set && selectedKeys.size > 0);

  const sortDirectionFor = (column: string) =>
    sortDescriptor.column === column ? sortDescriptor.direction : undefined;

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2">
          <SearchField value={search} onChange={onSearchChange}>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                className="w-56"
                placeholder="Buscar"
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          {canDelete && hasSelection && (
            <Button variant="danger" onPress={onDeleteSelection}>
              <Icon icon="lucide:trash-2" />
              Eliminar registros
            </Button>
          )}
        </div>

        <div className="flex gap-5 items-center">
          <PageSizeSelect
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tabla de registros"
            selectedKeys={selectedKeys}
            selectionMode={canDelete ? "multiple" : "none"}
            sortDescriptor={sortDescriptor}
            onSelectionChange={onSelectionChange}
            onSortChange={onSortChange}
          >
            <Table.Header>
              {canDelete && (
                <Table.Column className="pr-0">
                  <Checkbox aria-label="Seleccionar todos" slot="selection">
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox.Content>
                  </Checkbox>
                </Table.Column>
              )}
              <Table.Column allowsSorting isRowHeader id="userName">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("userName")}
                >
                  USUARIO
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column className="text-center">MATRÍCULA</Table.Column>
              <Table.Column allowsSorting className="text-center" id="success">
                <Table.SortableColumnHeader
                  className="justify-center"
                  sortDirection={sortDirectionFor("success")}
                >
                  ACCESO
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column allowsSorting className="text-center" id="time">
                <Table.SortableColumnHeader
                  className="justify-center"
                  sortDirection={sortDirectionFor("time")}
                >
                  HORA
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column
                allowsSorting
                className="text-center"
                id="reasonForDenial"
              >
                <Table.SortableColumnHeader
                  className="justify-center"
                  sortDirection={sortDirectionFor("reasonForDenial")}
                >
                  MOTIVO DE RECHAZO
                </Table.SortableColumnHeader>
              </Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => <TableStateMessage isError={isError} />}
            >
              {records.map((record) => (
                <Table.Row key={record.id} id={record.id}>
                  {canDelete && (
                    <Table.Cell className="pr-0">
                      <Checkbox
                        aria-label={`Seleccionar registro ${record.id}`}
                        slot="selection"
                        variant="secondary"
                      >
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                      </Checkbox>
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    {record.parkingUserName}
                    {record.parkingUserSurname
                      ? ` ${record.parkingUserSurname}`
                      : ""}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    {record.vehiclePlate ? (
                      <Chip color="accent" variant="primary" size="sm">
                        <Chip.Label>{record.vehiclePlate}</Chip.Label>
                      </Chip>
                    ) : (
                      "Ninguna"
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Icon
                        className={
                          record.success ? "text-success" : "text-danger"
                        }
                        icon="octicon:dot-fill-24"
                      />
                      {record.success ? "Permitido" : "Denegado"}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    {new Date(record.time).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    {record.reasonForDenial ?? "Ninguno"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <TablePagination
            page={page}
            totalCount={totalRecords}
            totalLabel="registros"
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Table.Footer>
      </Table>
    </div>
  );
}
