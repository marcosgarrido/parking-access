import type { AppRole } from "@parking-access/schemas";
import type { NextFunction, Request, Response } from "express";

import { ForbiddenError } from "@/errors/app-error";
import type { AccessTokenVerifiedPayload } from "@/schemas/access-token-schema";

export function requireRole(...roles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AccessTokenVerifiedPayload | undefined;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenError("Permiso denegado");
    }
    next();
  };
}
