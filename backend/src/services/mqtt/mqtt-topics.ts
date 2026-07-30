export const MQTT_SUBSCRIBE_TOPICS = {
  INCOMING_CALL: "parking/gsm/incoming_call",
  DOOR_STATE: "parking/door/state",
  DOOR_EVENT: "parking/door/event",
  DOOR_AVAILABILITY: "parking/door/availability",
  GSM_AVAILABILITY: "parking/gsm/availability",
} as const;

export const MQTT_PUBLISH_TOPICS = {
  DOOR_SET: "parking/door/set",
} as const;
