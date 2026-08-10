import type { RequestHandler } from "express";

import { prisma } from "@/database";
import { UnauthenticatedError } from "@/errors/app-error";
import type { AccessTokenVerifiedPayload } from "@/schemas/access-token-schema";

export const me: RequestHandler = async (_req, res) => {
  const payload = res.locals.user as AccessTokenVerifiedPayload | undefined;

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
