import type { AppRole } from "@parking-access/schemas";

export const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  SUPERVISOR: "Supervisor",
};

export const ROLE_CHIP_CLASS: Record<AppRole, string> = {
  ADMIN: "!bg-amber-400 !text-black",
  MANAGER: "!bg-purple-300 dark:!bg-purple-400 !text-black",
  SUPERVISOR: "!bg-gray-300 dark:!bg-gray-400 !text-black",
};
