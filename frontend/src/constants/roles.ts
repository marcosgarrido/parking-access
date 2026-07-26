import type { ChipProps } from "@heroui/react";
import type { AppRole } from "@parking-access/schemas";

export const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  SUPERVISOR: "Supervisor",
};

export const ROLE_COLORS: Record<AppRole, ChipProps["color"]> = {
  ADMIN: "danger",
  MANAGER: "warning",
  SUPERVISOR: "default",
};
