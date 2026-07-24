import type { AccessTokenPayload } from "@parking-access/schemas";
import type { RequestHandler } from "express";

import { prisma } from "@/database";
import { UnauthenticatedError } from "@/errors/app-error";

export const me: RequestHandler = async (_req, res) => {
  const payload = res.locals.user as AccessTokenPayload | undefined;

  if (!payload) {
    throw new UnauthenticatedError("No autenticado");
  }

  const user = await prisma.appUser.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      username: true,
      role: true,
      name: true,
      surname: true,
    },
  });

  if (!user) {
    throw new UnauthenticatedError("Sesión no válida o expirada");
  }

  res.status(200).json(user);
};
