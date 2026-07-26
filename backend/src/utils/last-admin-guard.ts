import type { AppRole } from "@parking-access/schemas";

import { Prisma } from "@/database";
import { ConflictError } from "@/errors/app-error";

export type LastAdminAction = "delete" | "update";

export class LastAdminError extends ConflictError {
  constructor(action: LastAdminAction = "delete") {
    super(
      action === "delete"
        ? "No se puede eliminar al último administrador activo"
        : "No se puede cambiar el rol del último administrador activo",
      "LAST_ADMIN",
    );
  }
}

/**
 * Verifica que, tras aplicar eliminaciones y/o actualizaciones propuestas,
 * siga existiendo al menos un ADMIN activo.
 */
export async function assertAtLeastOneAdminAfter(
  tx: Prisma.TransactionClient,
  changes: {
    deleteIds?: number[];
    updates?: Array<{
      id: number;
      role?: AppRole;
      isActive?: boolean;
    }>;
    action?: LastAdminAction;
  } = {},
) {
  const admins = await tx.appUser.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { id: true },
  });

  const remaining = new Set(admins.map((a) => a.id));

  for (const id of changes.deleteIds ?? []) {
    remaining.delete(id);
  }

  for (const u of changes.updates ?? []) {
    if (!remaining.has(u.id)) continue;

    const demotes = u.role !== undefined && u.role !== "ADMIN";
    const deactivates = u.isActive === false;

    if (demotes || deactivates) remaining.delete(u.id);
  }

  if (remaining.size === 0) {
    throw new LastAdminError(changes.action ?? "delete");
  }
}
