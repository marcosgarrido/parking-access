import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { Prisma } from "@/database";
import {
  AppError,
  InternalServerError,
  ValidationError,
} from "@/errors/app-error";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("[ErrorHandler]", err);

  if (err instanceof AppError) {
    res.status(err.status).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => e.message);
    const ve = new ValidationError(errors);

    res.status(ve.status).json({
      message: ve.message,
      code: ve.code,
      errors,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({
        message: "Recurso no encontrado",
        code: "NOT_FOUND",
        details: err.meta,
      });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({
        message: "Valor duplicado",
        code: "UNIQUE_CONSTRAINT",
        details: err.meta,
      });
      return;
    }
    res.status(400).json({
      message: "Error de base de datos",
      code: "DATABASE_ERROR",
    });
    return;
  }

  const internal = new InternalServerError();

  res.status(internal.status).json({
    message: internal.message,
    code: internal.code,
  });
};
