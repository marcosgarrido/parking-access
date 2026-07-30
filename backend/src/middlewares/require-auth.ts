import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "@/auth/tokens";
import { prisma } from "@/database";
import { UnauthenticatedError } from "@/errors/app-error";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.session as string | undefined;

  if (!token) throw new UnauthenticatedError("No autenticado");

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new UnauthenticatedError("Token inválido o expirado");
  }

  const user = await prisma.appUser.findUnique({
    where: { id: payload.sub },
    select: { role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw new UnauthenticatedError("Sesión no válida");
  }

  res.locals.user = { ...payload, role: user.role };
  next();
}
