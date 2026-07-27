import { EmptyState } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function TableEmptyState() {
  return (
    <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <Icon className="size-12 text-muted" icon="lucide:search-x" />
      <span className="text-lg text-muted">
        No se han encontrado resultados
      </span>
    </EmptyState>
  );
}
