import type { NextFunction, Request, Response } from "express";

import {
  ACCESS_TOKEN_TTL_MS,
  generateAccessToken,
  verifyAccessToken,
} from "@/auth/tokens";
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

  const remainingMs = payload.exp * 1000 - Date.now();

  if (remainingMs < ACCESS_TOKEN_TTL_MS / 2) {
    const newToken = generateAccessToken({
      sub: payload.sub,
      role: user.role,
      username: payload.username,
    });

    res.cookie("session", newToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_TTL_MS,
    });
  }

  res.locals.user = { ...payload, role: user.role };
  next();
}
