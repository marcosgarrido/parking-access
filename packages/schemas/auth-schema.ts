import { z } from "zod";

export const LoginBodySchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;
