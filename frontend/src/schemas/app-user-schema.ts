import { AppUserBaseSchema, IdSchema } from "@parking-access/schemas";
import { z } from "zod";

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
