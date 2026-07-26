import { IdSchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";

export async function getAppUser(req: Request, res: Response) {
  const id = IdSchema.parse(req.params.id);

  const user = await prisma.appUser.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      surname: true,
      username: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(user);
}
