import type { Key, Selection, SortDescriptor } from "@heroui/react";
import {
  Button,
  Checkbox,
  Dropdown,
  Label,
  ListBox,
  SearchField,
  Select,
  Table,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import type { ParkingUserResponse } from "@parking-access/schemas";

import TablePagination from "@/components/table-pagination/table-pagination";

const PAGE_SIZE_OPTIONS = [
  { key: "5", label: "5" },
  { key: "10", label: "10" },
  { key: "15", label: "15" },
  { key: "0", label: "Todas" },
];

type ParkingUsersTableProps = {
  users: ParkingUserResponse[];
  totalUsers: number;
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
  onCreate: () => void;
  onDeleteSelection: () => void;
};

export default function ParkingUsersTable({
  users,
  totalUsers,
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
  onCreate,
  onDeleteSelection,
}: ParkingUsersTableProps) {
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
                placeholder="Buscar por nombre o apellidos"
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <Button variant="primary" onPress={onCreate}>
            <Icon icon="lucide:user-round-plus" />
            Nuevo
          </Button>

          {hasSelection && (
            <Button variant="danger" onPress={onDeleteSelection}>
              <Icon icon="lucide:trash-2" />
              Eliminar usuarios
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
            aria-label="Usuarios del parking"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSelectionChange={onSelectionChange}
            onSortChange={onSortChange}
          >
            <Table.Header>
              <Table.Column className="pr-0">
                <Checkbox aria-label="Seleccionar todos" slot="selection">
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox.Content>
                </Checkbox>
              </Table.Column>
              <Table.Column allowsSorting isRowHeader id="name">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("name")}
                >
                  Nombre
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column>Teléfono</Table.Column>
              <Table.Column allowsSorting id="accessAllowed">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("accessAllowed")}
                >
                  Estado
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column allowsSorting id="lastAccess">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("lastAccess")}
                >
                  Último acceso
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column allowsSorting id="createdAt">
                <Table.SortableColumnHeader
                  sortDirection={sortDirectionFor("createdAt")}
                >
                  Fecha de creación
                </Table.SortableColumnHeader>
              </Table.Column>
              <Table.Column className="text-center">Acciones</Table.Column>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id} id={user.id}>
                  <Table.Cell className="pr-0">
                    <Checkbox
                      aria-label={`Seleccionar ${user.name}`}
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
                  <Table.Cell>
                    {user.name} {user.surname}
                  </Table.Cell>
                  <Table.Cell>{user.telephone}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={
                          user.accessAllowed ? "text-success" : "text-danger"
                        }
                        icon="octicon:dot-fill-24"
                      />
                      {user.accessAllowed ? "Activo" : "Inactivo"}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {user.lastAccess
                      ? new Date(user.lastAccess).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "Nunca"}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Table.Cell>
                  <Table.Cell className="relative">
                    <Dropdown>
                      <Button
                        isIconOnly
                        aria-label="Acciones"
                        className="absolute inset-0 m-auto"
                        size="sm"
                        variant="ghost"
                      >
                        <Icon icon="lucide:ellipsis-vertical" />
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu>
                          <Dropdown.Item href={`/parking-users/${user.id}`}>
                            <Icon className="size-5" icon="lucide:eye" />
                            <Label>Ver</Label>
                          </Dropdown.Item>
                          <Dropdown.Item
                            href={`/parking-users/${user.id}/edit`}
                          >
                            <Icon className="size-5" icon="lucide:pencil" />
                            <Label>Editar</Label>
                          </Dropdown.Item>
                          <Dropdown.Item
                            href={`/parking-users/${user.id}/delete`}
                            variant="danger"
                          >
                            <Icon
                              className="size-5 text-danger"
                              icon="lucide:trash-2"
                            />
                            <Label>Eliminar</Label>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <TablePagination
            page={page}
            totalCount={totalUsers}
            totalLabel="usuarios"
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Table.Footer>
      </Table>
    </div>
  );
}
