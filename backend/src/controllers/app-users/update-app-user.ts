import type { AppRole } from "@parking-access/schemas";
import { AppUserUpdateBodySchema, IdSchema } from "@parking-access/schemas";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

import { prisma } from "@/database";
import { assertAtLeastOneAdminAfter } from "@/utils/last-admin-guard";

const BCRYPT_ROUNDS = 12;

export async function updateAppUser(req: Request, res: Response) {
  const id = IdSchema.parse(req.params.id);
  const data = AppUserUpdateBodySchema.parse(req.body);

  const updated = await prisma.$transaction(async (tx) => {
    const current = await tx.appUser.findUniqueOrThrow({ where: { id } });

    const updateData: Partial<{
      name: string;
      surname: string;
      role: AppRole;
      isActive: boolean;
      passwordHash: string;
    }> = {
      name: data.name,
      surname: data.surname,
      role: data.role,
      isActive: data.isActive,
    };

    if (typeof data.password === "string" && data.password.trim()) {
      updateData.passwordHash = await bcrypt.hash(
        data.password.trim(),
        BCRYPT_ROUNDS,
      );
    }

    const nextRole = updateData.role ?? current.role;
    const nextActive = updateData.isActive ?? current.isActive;

    await assertAtLeastOneAdminAfter(tx, {
      updates: [{ id, role: nextRole, isActive: nextActive }],
      action: "update",
    });

    const user = await tx.appUser.update({
      where: { id },
      data: updateData,
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

    return user;
  });

  res.status(200).json(updated);
}
