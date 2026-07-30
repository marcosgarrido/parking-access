import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;
const lastState = new Map<string, string>();

export function initializeWebSocketServer(server: HttpServer) {
  io = new SocketIOServer(server, { path: "/ws" });

  io.on("connection", (socket) => {
    socket.on("request-state", () => {
      lastState.forEach((payload, event) => {
        socket.emit(event, payload);
      });
    });
  });
}

export function broadcastToClients(
  event: string,
  payload: string,
  retain = false,
) {
  if (retain) lastState.set(event, payload);
  io.emit(event, payload);
}
