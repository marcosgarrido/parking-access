import type { Request, Response } from "express";

import { getMqttClient } from "@/services/mqtt/mqtt-client";
import { MQTT_PUBLISH_TOPICS } from "@/services/mqtt/mqtt-topics";

export function openDoor(_req: Request, res: Response) {
  getMqttClient().publish(MQTT_PUBLISH_TOPICS.DOOR_SET, "PULSE");
  res.sendStatus(204);
}
