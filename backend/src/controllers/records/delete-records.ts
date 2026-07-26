import { RecordDeleteManyBodySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";

export async function deleteRecords(req: Request, res: Response) {
  const { ids } = RecordDeleteManyBodySchema.parse(req.body);

  const result = await prisma.record.deleteMany({
    where: { id: { in: ids } },
  });

  res.status(200).json({
    requested: ids.length,
    deleted: result.count,
  });
}
