import express from "express";

import { prisma } from "@/database.js";

const app = express();
const port = 4000;

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(500).json({ ok: false, database: "unreachable" });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
