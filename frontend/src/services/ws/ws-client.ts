import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeWebSocketClient() {
  if (socket) return;

  socket = io({ path: "/ws" });

  socket.on("connect", () => {
    console.log("WebSocket conectado");
  });

  socket.on("connect_error", (err) => {
    console.error("Error en conexión WebSocket:", err);
  });
}

export function getSocket(): Socket {
  if (!socket) throw new Error("WebSocket no inicializado");

  return socket;
}
