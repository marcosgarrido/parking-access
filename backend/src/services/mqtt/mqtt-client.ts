import mqtt, { type MqttClient } from "mqtt";

import { handleIncomingCall } from "@/services/mqtt/mqtt-handlers";
import { MQTT_SUBSCRIBE_TOPICS } from "@/services/mqtt/mqtt-topics";
import { WS_EVENTS } from "@/services/ws/ws-events";
import { broadcastToClients } from "@/services/ws/ws-server";

let client: MqttClient;

export function initializeMqttClient() {
  const host = process.env.MQTT_HOST;
  if (!host) throw new Error("MQTT_HOST is not defined");

  const port = process.env.MQTT_PORT || "1883";

  const username = process.env.MQTT_USER;
  if (!username) throw new Error("MQTT_USER is not defined");

  const password = process.env.MQTT_PASS;
  if (!password) throw new Error("MQTT_PASS is not defined");

  const clientId = `backend-${Math.random().toString(16).slice(2, 10)}`;

  console.log("Inicializando cliente MQTT...");

  client = mqtt.connect(`mqtt://${host}:${port}`, {
    clientId,
    username,
    password,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    clean: true,
  });

  client.on("connect", () => {
    console.log("Cliente MQTT conectado");

    Object.values(MQTT_SUBSCRIBE_TOPICS).forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Error al suscribirse al tópico ${topic}:`, err);
        } else {
          console.log(`Suscrito al tópico: ${topic}`);
        }
      });
    });
  });

  client.on("message", (topic, message) => {
    const payload = message.toString();

    switch (topic) {
      case MQTT_SUBSCRIBE_TOPICS.DOOR_STATE:
        broadcastToClients(WS_EVENTS.DOOR_STATE, payload, true);
        break;
      case MQTT_SUBSCRIBE_TOPICS.DOOR_AVAILABILITY:
        broadcastToClients(WS_EVENTS.DOOR_AVAILABILITY, payload, true);
        break;
      case MQTT_SUBSCRIBE_TOPICS.GSM_AVAILABILITY:
        broadcastToClients(WS_EVENTS.GSM_AVAILABILITY, payload, true);
        break;
      case MQTT_SUBSCRIBE_TOPICS.DOOR_EVENT:
        broadcastToClients(WS_EVENTS.DOOR_EVENT, payload);
        break;
      case MQTT_SUBSCRIBE_TOPICS.INCOMING_CALL:
        handleIncomingCall(payload);
        break;
      default:
        console.warn(`Tópico no manejado: ${topic}`);
        break;
    }
  });

  client.on("error", (err) => {
    console.error("Error en el cliente MQTT:", err);
  });

  client.on("close", () => {
    console.warn("Conexión MQTT cerrada");
  });
}

export function getMqttClient(): MqttClient {
  if (!client) throw new Error("Cliente MQTT no inicializado");

  return client;
}
