import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import path from "path";

import { prisma } from "@/database";
import { errorHandler } from "@/middlewares/error-handler";
import appUsersRoutes from "@/routes/app-users-routes";
import authRoutes from "@/routes/auth-routes";
import doorRoutes from "@/routes/door-routes";
import parkingUsersRoutes from "@/routes/parking-users-routes";
import recordsRoutes from "@/routes/records-routes";
import { initializeMqttClient } from "@/services/mqtt/mqtt-client";
import { initializeWebSocketServer } from "@/services/ws/ws-server";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/door", doorRoutes);
app.use("/api/parking-users", parkingUsersRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/app-users", appUsersRoutes);

const frontendDist = path.join(process.cwd(), "../frontend/dist");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

initializeWebSocketServer(server);
initializeMqttClient();
