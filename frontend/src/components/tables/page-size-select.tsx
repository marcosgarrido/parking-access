import type { Key } from "@heroui/react";
import { Label, ListBox, Select } from "@heroui/react";
import { Icon } from "@iconify/react";

const PAGE_SIZE_OPTIONS = [
  { key: "5", label: "5" },
  { key: "10", label: "10" },
  { key: "15", label: "15" },
  { key: "0", label: "Todas" },
];

type PageSizeSelectProps = {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
};

export default function PageSizeSelect({
  pageSize,
  onPageSizeChange,
}: PageSizeSelectProps) {
  const handleChange = (value: Key | null) => {
    if (value) onPageSizeChange(Number(value));
  };

  return (
    <Select
      className="flex-row items-center gap-2"
      value={String(pageSize)}
      onChange={handleChange}
    >
      <Label className="text-muted">Filas por página</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="min-w-16">
        <ListBox>
          {PAGE_SIZE_OPTIONS.map((option) => (
            <ListBox.Item
              key={option.key}
              id={option.key}
              textValue={option.label}
            >
              {option.key === "0" ? (
                <Icon
                  className="inline-block align-middle"
                  icon="lucide:infinity"
                />
              ) : (
                option.label
              )}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
