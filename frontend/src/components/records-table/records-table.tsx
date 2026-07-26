import type { Key, Selection, SortDescriptor } from "@heroui/react";
import {
  Button,
  Checkbox,
  Chip,
  Label,
  ListBox,
  SearchField,
  Select,
  Table,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { RecordResponse } from "@parking-access/schemas";

import TablePagination from "@/components/table-pagination/table-pagination";
import { useAuth } from "@/hooks/use-auth";

const PAGE_SIZE_OPTIONS = [
  { key: "5", label: "5" },
  { key: "10", label: "10" },
  { key: "15", label: "15" },
  { key: "0", label: "Todas" },
];

type RecordsTableProps = {
  records: RecordResponse[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sortDescriptor: SortDescriptor;
  selectedKeys: Selection;
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
                className="w-64"
                placeholder="Buscar por usuario"
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
          <Select
            className="flex-row items-center gap-2"
            value={String(pageSize)}
            onChange={(value: Key | Key[] | null) => {
              if (value) onPageSizeChange(Number(value));
            }}
          >
            <Label className="text-muted">Filas por página</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <ListBox.Item
                    key={option.key}
                    id={option.key}
                    textValue={option.label}
                  >
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
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
                  Usuario
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column>Matrícula</Table.Column>
              <Table.Column allowsSorting id="success">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("success")}
                >
                  Acceso
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column allowsSorting id="time">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("time")}
                >
                  Hora
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column allowsSorting id="reasonForDenial">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("reasonForDenial")}
                >
                  Motivo de rechazo
                </Table.SortableColumnHeader>
              </Table.Column>
            </Table.Header>
            <Table.Body>
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
                  <Table.Cell>
                    {record.vehiclePlate ? (
                      <Chip color="accent" variant="primary" size="sm">
                        <Chip.Label>{record.vehiclePlate}</Chip.Label>
                      </Chip>
                    ) : (
                      "Ninguna"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={
                          record.success ? "text-success" : "text-danger"
                        }
                        icon="octicon:dot-fill-24"
                      />
                      {record.success ? "Permitido" : "Denegado"}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(record.time).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Table.Cell>
                  <Table.Cell>{record.reasonForDenial ?? "Ninguno"}</Table.Cell>
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
