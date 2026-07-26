import { AppUserDeleteManyBodySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";
import { assertAtLeastOneAdminAfter } from "@/utils/last-admin-guard";

export async function deleteAppUsers(req: Request, res: Response) {
  const { ids } = AppUserDeleteManyBodySchema.parse(req.body);

  await prisma.$transaction(async (tx) => {
    await assertAtLeastOneAdminAfter(tx, { deleteIds: ids, action: "delete" });
    await tx.appUser.deleteMany({ where: { id: { in: ids } } });
  });

  res.status(204).send();
}
