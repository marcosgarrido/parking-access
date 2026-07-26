import { Icon } from "@iconify/react";

type StatusIndicatorProps = {
  active: boolean;
};

export default function StatusIndicator({ active }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        className={active ? "text-success" : "text-zinc-300 dark:text-zinc-700"}
        icon="octicon:dot-fill-24"
      />
      {active ? "Activo" : "Inactivo"}
    </div>
  );
}
