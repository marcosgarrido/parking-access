import { DoorHoldBodySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { getMqttClient } from "@/services/mqtt/mqtt-client";
import { MQTT_PUBLISH_TOPICS } from "@/services/mqtt/mqtt-topics";

export function holdDoor(req: Request, res: Response) {
  const { hold } = DoorHoldBodySchema.parse(req.body);

  getMqttClient().publish(MQTT_PUBLISH_TOPICS.DOOR_SET, hold ? "ON" : "OFF");
  res.sendStatus(204);
}
