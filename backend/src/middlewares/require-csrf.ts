import type { NextFunction, Request, Response } from "express";

import { ForbiddenError } from "@/errors/app-error";

export function requireCsrf(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.header("x-csrf-token");
  const cookie = req.cookies?.csrf;

  if (!header || !cookie || header !== cookie) {
    throw new ForbiddenError("CSRF inválido", "CSRF_INVALID");
  }
  next();
}
