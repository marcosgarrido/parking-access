import { LoginBodySchema } from "@parking-access/schemas";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { Request, Response } from "express";

import {
  ACCESS_TOKEN_TTL_MS,
  CSRF_TOKEN_TTL_MS,
  generateAccessToken,
} from "@/auth/tokens";
import { prisma } from "@/database";
import { UnauthenticatedError } from "@/errors/app-error";

const DUMMY_PASSWORD_HASH =
  "$2a$10$CwTycUXWue0Thq9StjUM0uJ8w6C0kD9C6Kk8UsPnUX2/RGz.dGh0S";

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = LoginBodySchema.parse(req.body);

  const user = await prisma.appUser.findUnique({ where: { username } });
  const ok = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_PASSWORD_HASH,
  );

  if (!user || !user.isActive || !ok)
    throw new UnauthenticatedError("Usuario o contraseña incorrectos");

  await prisma.appUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const accessToken = generateAccessToken({
    sub: user.id,
    role: user.role,
    username: user.username,
  });

  const csrfToken = randomUUID();

  res.setHeader("Cache-Control", "no-store");

  res.cookie("session", accessToken, {
    httpOnly: true,
    secure: req.secure,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_MS,
  });

  res.cookie("csrf", csrfToken, {
    httpOnly: false,
    secure: req.secure,
    sameSite: "lax",
    path: "/",
    maxAge: CSRF_TOKEN_TTL_MS,
  });

  res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      surname: user.surname,
    },
  });
}
