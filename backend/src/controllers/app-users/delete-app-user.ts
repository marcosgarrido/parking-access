import { IdSchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";
import { assertAtLeastOneAdminAfter } from "@/utils/last-admin-guard";

export async function deleteAppUser(req: Request, res: Response) {
  const id = IdSchema.parse(req.params.id);

  await prisma.$transaction(async (tx) => {
    await assertAtLeastOneAdminAfter(tx, { deleteIds: [id], action: "delete" });
    await tx.appUser.delete({ where: { id } });
  });

  res.status(204).send();
}
