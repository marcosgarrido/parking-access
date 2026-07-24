import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "@/auth/tokens";
import { UnauthenticatedError } from "@/errors/app-error";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.session as string | undefined;

  if (!token) throw new UnauthenticatedError("No autenticado");

  try {
    res.locals.user = verifyAccessToken(token);
    next();
  } catch {
    throw new UnauthenticatedError("Token inválido o expirado");
  }
}
