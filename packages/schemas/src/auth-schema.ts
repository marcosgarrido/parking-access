import { z } from "zod";

export const UsernameSchema = z
  .string()
  .trim()
  .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
  .max(32, "El nombre de usuario no puede exceder 32 caracteres")
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Solo letras, números, puntos, guiones y guiones bajos",
  );

export const PasswordPolicySchema = z
  .string()
  .min(8, "La longitud mínima debe de ser al menos de 8 caracteres")
  .regex(/[A-Z]/, "Incluya al menos una mayúscula")
  .regex(/[a-z]/, "Incluya al menos una minúscula")
  .regex(/\d/, "Incluya al menos un número")
  .regex(/[^A-Za-z0-9]/, "Incluya al menos un símbolo");

export const LoginBodySchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;
