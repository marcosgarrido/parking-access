import { EmptyState } from "@heroui/react";
import { Icon } from "@iconify/react";

type EmptyStateMessageProps = {
  icon: string;
  message: string;
};

export default function EmptyStateMessage({
  icon,
  message,
}: EmptyStateMessageProps) {
  return (
    <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <Icon className="size-12 text-muted" icon={icon} />
      <span className="text-lg text-muted">{message}</span>
    </EmptyState>
  );
}
