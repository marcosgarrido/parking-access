import type { Request, Response } from "express";

export function logout(req: Request, res: Response): void {
  res.clearCookie("session", { path: "/" });
  res.clearCookie("csrf", { path: "/" });

  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({ message: "Sesión cerrada correctamente" });
}
