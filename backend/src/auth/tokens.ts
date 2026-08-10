import jwt from "jsonwebtoken";

import {
  type AccessTokenSignPayload,
  AccessTokenVerifiedPayloadSchema,
} from "@/schemas/access-token-schema";

export const ACCESS_TOKEN_TTL_MS = 1000 * 60 * 15;
const ACCESS_TOKEN_TTL_S = Math.floor(ACCESS_TOKEN_TTL_MS / 1000);
export const CSRF_TOKEN_TTL_MS = ACCESS_TOKEN_TTL_MS;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return secret;
}

export function generateAccessToken(payload: AccessTokenSignPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_TTL_S,
  });
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, getJwtSecret());
  return AccessTokenVerifiedPayloadSchema.parse(decoded);
}
