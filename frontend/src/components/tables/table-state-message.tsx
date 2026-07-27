import IconMessage from "@/components/icon-message";

type TableStateMessageProps = {
  isError?: boolean;
};

export default function TableStateMessage({
  isError = false,
}: TableStateMessageProps) {
  return isError ? (
    <IconMessage
      icon="lucide:circle-alert"
      message="No se pudieron cargar los datos"
    />
  ) : (
    <IconMessage
      icon="lucide:search-x"
      message="No se han encontrado resultados"
    />
  );
}
