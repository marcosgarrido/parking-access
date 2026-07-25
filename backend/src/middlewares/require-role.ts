import type { AccessTokenPayload, AppRole } from "@parking-access/schemas";
import type { NextFunction, Request, Response } from "express";

import { ForbiddenError } from "@/errors/app-error";

export function requireRole(...roles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AccessTokenPayload | undefined;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenError("Permiso denegado");
    }
    next();
  };
}
