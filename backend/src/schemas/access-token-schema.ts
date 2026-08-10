import { IdSchema, RoleSchema, UsernameSchema } from "@parking-access/schemas";
import { z } from "zod";

export const AccessTokenVerifiedPayloadSchema = z.object({
  sub: IdSchema,
  username: UsernameSchema,
  role: RoleSchema,
  iat: z.number().int(),
  exp: z.number().int(),
});

export type AccessTokenVerifiedPayload = z.infer<
  typeof AccessTokenVerifiedPayloadSchema
>;
export type AccessTokenSignPayload = Omit<
  AccessTokenVerifiedPayload,
  "iat" | "exp"
>;
