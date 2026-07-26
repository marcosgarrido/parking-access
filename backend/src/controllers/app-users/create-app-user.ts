import { AppUserCreateBodySchema } from "@parking-access/schemas";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

import { Prisma, prisma } from "@/database";
import { ConflictError } from "@/errors/app-error";

const BCRYPT_ROUNDS = 12;

export async function createAppUser(req: Request, res: Response) {
  const data = AppUserCreateBodySchema.parse(req.body);

  try {
    const username = data.username.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const user = await prisma.appUser.create({
      data: {
        name: data.name,
        surname: data.surname,
        username,
        passwordHash,
        role: data.role,
        isActive: data.isActive,
      },
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

    res
      .status(201)
      .setHeader("Location", `/api/app-users/${user.id}`)
      .json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError(
        "Ya existe un usuario con el mismo nombre de usuario",
      );
    }
    throw error;
  }
}
