export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(errors: string[] | string) {
    super(400, "VALIDATION_ERROR", "Error de validación", {
      errors: Array.isArray(errors) ? errors : [errors],
    });
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message = "No autenticado") {
    super(401, "UNAUTHENTICATED", message);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = "Permisos insuficientes",
    code: "FORBIDDEN" | "CSRF_INVALID" = "FORBIDDEN",
  ) {
    super(403, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto", code = "CONFLICT", details?: unknown) {
    super(409, code, message, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Error interno del servidor", details?: unknown) {
    super(500, "INTERNAL", message, details);
  }
}
