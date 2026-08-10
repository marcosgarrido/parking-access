import { IdSchema, RoleSchema, UsernameSchema } from "@parking-access/schemas";
import { z } from "zod";

export const AppUserSessionSchema = z.object({
  id: IdSchema,
  username: UsernameSchema,
  role: RoleSchema,
  name: z.string(),
  surname: z.string(),
});

export const LoginResponseSchema = z.object({
  user: AppUserSessionSchema,
});

export type AppUserSession = z.infer<typeof AppUserSessionSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
