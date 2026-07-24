import { z } from "zod";

export const RoleSchema = z.enum(["ADMIN", "MANAGER", "SUPERVISOR"], {
  error: "Seleccione un rol de usuario",
});

export type AppRole = z.infer<typeof RoleSchema>;
