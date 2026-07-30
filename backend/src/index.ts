import cookieParser from "cookie-parser";
import express from "express";

import { prisma } from "@/database";
import { errorHandler } from "@/middlewares/error-handler";
import appUsersRoutes from "@/routes/app-users-routes";
import authRoutes from "@/routes/auth-routes";
import parkingUsersRoutes from "@/routes/parking-users-routes";
import recordsRoutes from "@/routes/records-routes";
import { initializeMqttClient } from "@/services/mqtt/mqtt-client";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (_error) {
    res.status(500).json({ ok: false, database: "unreachable" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/parking-users", parkingUsersRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/app-users", appUsersRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

initializeMqttClient();
