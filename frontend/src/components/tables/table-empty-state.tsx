import EmptyStateMessage from "@/components/empty-state-message";

export default function TableEmptyState() {
  return (
    <EmptyStateMessage
      icon="lucide:search-x"
      message="No se han encontrado resultados"
    />
  );
}
