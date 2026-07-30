import {
  type AccessTokenClaims,
  AccessTokenClaimsSchema,
  type AccessTokenPayload,
  AccessTokenPayloadSchema,
} from "@parking-access/schemas";
import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_TTL_MS = 1000 * 60 * 15;
const ACCESS_TOKEN_TTL_S = Math.floor(ACCESS_TOKEN_TTL_MS / 1000);
export const CSRF_TOKEN_TTL_MS = ACCESS_TOKEN_TTL_MS;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return secret;
}

export function generateAccessToken(p: AccessTokenClaims) {
  const claims = AccessTokenClaimsSchema.parse(p);
  return jwt.sign(claims, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_TTL_S,
  });
}

export function verifyAccessToken(t: string): AccessTokenPayload {
  const decoded = jwt.verify(t, getJwtSecret());
  return AccessTokenPayloadSchema.parse(decoded);
}
