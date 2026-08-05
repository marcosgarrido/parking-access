import type { ParkingUserTimeshiftList } from "@parking-access/schemas";
import type { RecordCreateBody } from "@parking-access/schemas";
import { PlateSchema } from "@parking-access/schemas";

import { getCameraImage } from "@/api/camera-api";
import { recognizePlate } from "@/api/plate-recognizer-api";
import { prisma } from "@/database";
import { getMqttClient } from "@/services/mqtt/mqtt-client";
import { MQTT_PUBLISH_TOPICS } from "@/services/mqtt/mqtt-topics";
import { WS_EVENTS } from "@/services/ws/ws-events";
import { broadcastToClients } from "@/services/ws/ws-server";

function nowString(): string {
  const now = new Date();
  const d = now.getDate().toString().padStart(2, "0");
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const y = now.getFullYear();
  const h = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");

  return `${d}-${m}-${y} ${h}:${min}:${s}`;
}

async function createRecord(data: RecordCreateBody) {
  await prisma.record.create({ data });
  broadcastToClients(WS_EVENTS.NEW_RECORD, "");
}

function toMinutes(timeString: string): number {
  const [hoursPart, minutesPart] = timeString.split(":");

  return Number(hoursPart ?? 0) * 60 + Number(minutesPart ?? 0);
}

function isInTime(timeshifts: ParkingUserTimeshiftList): boolean {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const shifts = timeshifts.filter((s) => s.dayOfWeek === day);

  if (shifts.some((s) => s.allDay)) return true;

  return shifts.some((s) => {
    if (!s.allDay && s.startTime && s.endTime) {
      const start = toMinutes(s.startTime);
      const end = s.endTime === "00:00" ? 24 * 60 : toMinutes(s.endTime);

      return start <= mins && mins < end;
    }

    return false;
  });
}

export async function handleIncomingCall(phoneNumber: string) {
  const startTime = Date.now();
  console.log(`[${nowString()}] Llamada recibida de: ${phoneNumber}`);

  try {
    const user = await prisma.parkingUser.findUnique({
      where: { telephone: phoneNumber },
      include: { vehicles: { select: { vehicle: true } }, timeshifts: true },
    });

    if (!user) {
      await createRecord({
        parkingUserName: "Desconocido",
        parkingUserSurname: "",
        success: false,
        reasonForDenial: `Teléfono desconocido (${phoneNumber})`,
      });
      console.log(
        `[${nowString()}] Acceso denegado: Usuario desconocido (tel: ${phoneNumber})`,
      );

      return;
    }

    let platesRecognized: string[] = [];
    let recognitionFailed = false;

    try {
      const image = await getCameraImage();

      platesRecognized = await recognizePlate(image);
    } catch (err) {
      console.error(
        `[${nowString()}] Error obteniendo imagen o reconociendo matrícula:`,
        err,
      );
      recognitionFailed = true;
      platesRecognized = [];
    }

    if (!user.accessAllowed) {
      await createRecord({
        parkingUserId: user.id,
        parkingUserName: user.name,
        parkingUserSurname: user.surname,
        vehiclePlate: platesRecognized[0] || undefined,
        success: false,
        reasonForDenial: "El usuario no tiene permiso de acceso",
      });
      console.log(`[${nowString()}] Acceso denegado: Usuario sin permiso`);

      return;
    }

    if (user.vehicles.length === 0) {
      await createRecord({
        parkingUserId: user.id,
        parkingUserName: user.name,
        parkingUserSurname: user.surname,
        vehiclePlate: platesRecognized[0] || undefined,
        success: false,
        reasonForDenial: "El usuario no tiene vehículos registrados",
      });
      console.log(`[${nowString()}] Acceso denegado: Sin vehículos`);

      return;
    }

    const userVehicles = user.vehicles.map((v) => v.vehicle);
    const userPlates = userVehicles.map((v) => v.plate);
    const matchedUserPlate = platesRecognized.find((p) =>
      userPlates.includes(p),
    );
    const matchedVehicle = userVehicles.find(
      (v) => v.plate === matchedUserPlate,
    );

    const plateToSave =
      matchedUserPlate ??
      platesRecognized.find((p) => PlateSchema.safeParse(p).success);

    if (!matchedVehicle) {
      let reason: string;

      if (recognitionFailed) {
        reason = "Error de cámara o reconocimiento de matrículas";
      } else if (plateToSave) {
        reason = "Matrícula no asociada al usuario";
      } else {
        reason = "Matrícula no reconocida";
      }

      await createRecord({
        parkingUserId: user.id,
        parkingUserName: user.name,
        parkingUserSurname: user.surname,
        vehiclePlate: plateToSave,
        success: false,
        reasonForDenial: reason,
      });

      console.log(`[${nowString()}] Acceso denegado: ${reason}`);

      return;
    }

    if (!isInTime(user.timeshifts)) {
      await createRecord({
        parkingUserId: user.id,
        parkingUserName: user.name,
        parkingUserSurname: user.surname,
        vehicleId: matchedVehicle.id,
        vehiclePlate: matchedVehicle.plate,
        success: false,
        reasonForDenial: "El usuario ha llamado fuera de horario",
      });
      console.log(`[${nowString()}] Acceso denegado: Fuera de horario`);

      return;
    }

    getMqttClient().publish(MQTT_PUBLISH_TOPICS.DOOR_SET, "PULSE");
    await createRecord({
      parkingUserId: user.id,
      parkingUserName: user.name,
      parkingUserSurname: user.surname,
      vehicleId: matchedVehicle.id,
      vehiclePlate: matchedVehicle.plate,
      success: true,
    });
    console.log(
      `[${nowString()}] Acceso concedido: Puerta abierta (${Date.now() - startTime} ms)`,
    );
  } catch (error) {
    console.error(
      `[${nowString()}] Error procesando llamada de ${phoneNumber}:`,
      error,
    );
  }
}
