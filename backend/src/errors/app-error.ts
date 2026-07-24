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

export class InternalServerError extends AppError {
  constructor(message = "Error interno del servidor", details?: unknown) {
    super(500, "INTERNAL", message, details);
  }
}
