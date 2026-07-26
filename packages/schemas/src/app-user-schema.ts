import { z } from "zod";

import { PasswordPolicySchema, UsernameSchema } from "./auth-schema";
import { IdSchema } from "./id-schema";
import { RoleSchema } from "./role-schema";

function capitalize(value: string): string {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const NameSchema = z
  .string()
  .trim()
  .min(1, "Por favor introduzca el nombre")
  .max(50, "El nombre no puede tener más de 50 caracteres")
  .transform(capitalize);

const SurnameSchema = z
  .string()
  .trim()
  .min(1, "Por favor introduzca los apellidos")
  .max(50, "Los apellidos no pueden tener más de 50 caracteres en total")
  .transform(capitalize);

export const AppUserBaseSchema = z
  .object({
    name: NameSchema,
    surname: SurnameSchema,
    username: UsernameSchema,
    role: RoleSchema,
    isActive: z.boolean().optional().default(true),
  })
  .strict();

export const AppUserCreateBodySchema = AppUserBaseSchema.extend({
  password: PasswordPolicySchema,
});

export const AppUserUpdateBodySchema = AppUserBaseSchema.omit({
  username: true,
})
  .extend({ password: PasswordPolicySchema.optional() })
  .strict();

export const AppUserSortBySchema = z.enum([
  "name",
  "username",
  "isActive",
  "role",
  "lastLoginAt",
  "createdAt",
]);

export const AppUserDeleteManyBodySchema = z.object({
  ids: z.array(IdSchema).min(1, "Debe proporcionar algún ID de usuario"),
});

export const AppUserQuerySchema = z
  .object({
    search: z.string(),
    page: z.coerce.number().min(1),
    pageSize: z.coerce.number().min(0),
    sortBy: AppUserSortBySchema,
    sortOrder: z.enum(["asc", "desc"]),
  })
  .partial();

export const AppUserResponseSchema = z.object({
  id: IdSchema,
  ...AppUserBaseSchema.shape,
  lastLoginAt: z.iso.datetime().nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const MetaSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  totalPages: z.number().int().nonnegative().optional(),
  totalUsers: z.number().int().nonnegative(),
});

export const AppUserListResponseSchema = z.object({
  data: z.array(AppUserResponseSchema),
  meta: MetaSchema,
});

export type AppUserResponse = z.infer<typeof AppUserResponseSchema>;
export type AppUserListResponse = z.infer<typeof AppUserListResponseSchema>;
export type AppUserCreateBody = z.infer<typeof AppUserCreateBodySchema>;
export type AppUserUpdateBody = z.infer<typeof AppUserUpdateBodySchema>;
export type AppUserSortBy = z.infer<typeof AppUserSortBySchema>;
export type AppUserQuery = z.infer<typeof AppUserQuerySchema>;
export type AppUserDeleteManyBody = z.infer<typeof AppUserDeleteManyBodySchema>;
