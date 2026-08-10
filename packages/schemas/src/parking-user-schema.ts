import { z } from "zod";

import { IdSchema } from "./id-schema";
import { TimeshiftBaseSchema, TimeshiftBodySchema } from "./timeshift-schema";
import { VehicleBaseSchema } from "./vehicle-schema";

function capitalize(value: string): string {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function toMinutes(timeString?: string | null): number {
  if (!timeString) return 0;

  const [hoursPart, minutesPart] = timeString.split(":");

  return Number(hoursPart ?? 0) * 60 + Number(minutesPart ?? 0);
}

const NameSchema = z
  .string()
  .trim()
  .min(1, "Por favor introduzca el nombre")
  .max(50, "El nombre no puede tener más de 50 caracteres")
  .transform(capitalize);

const SurnameSchema = z
  .string()
  .trim()
  .min(1, "Por favor introduzca los apellidos")
  .max(50, "Los apellidos no pueden tener más de 50 caracteres en total")
  .transform(capitalize);

// Aceptamos provisionalmente números que empiecen por 4 y 9, para realizar pruebas.
const TelephoneSchema = z
  .string()
  .trim()
  .min(1, "Por favor introduzca el número de teléfono")
  .refine((value) => value === "" || /^[4679]\d{8}$/.test(value), {
    message: "Introduce un número español válido (9 dígitos, sin prefijo)",
  });

export const VehicleListSchema = z
  .array(VehicleBaseSchema)
  .superRefine((vehicles, ctx) => {
    const plates = vehicles.map((vehicle) => vehicle.plate);
    const duplicates = plates.filter(
      (plate, index) => plates.indexOf(plate) !== index,
    );

    if (duplicates.length > 0) {
      duplicates.forEach((plate) => {
        ctx.addIssue({
          code: "custom",
          message: `La matrícula ${plate} está duplicada`,
          path: ["plate"],
        });
      });
    }
  });

export const ParkingUserTimeshiftListSchema = z
  .array(TimeshiftBodySchema)
  .superRefine((timeshifts, ctx) => {
    const groupedByDay: Record<
      number,
      (z.infer<typeof TimeshiftBaseSchema> & { __idx: number })[]
    > = {};

    for (const [idx, timeshift] of timeshifts.entries()) {
      (groupedByDay[timeshift.dayOfWeek] ??= []).push({
        ...timeshift,
        __idx: idx,
      });
    }

    for (const dayShifts of Object.values(groupedByDay)) {
      const allDayShifts = dayShifts.filter((shift) => shift.allDay);
      const normalShifts = dayShifts.filter((shift) => !shift.allDay);

      if (allDayShifts.length > 1) {
        for (const shift of allDayShifts) {
          ctx.addIssue({
            code: "custom",
            message: "Solo puede haber una franja 'todo el día' por día.",
            path: [shift.__idx, "timeshift"],
          });
        }
      }

      if (allDayShifts.length > 0 && normalShifts.length > 0) {
        for (const shift of dayShifts) {
          ctx.addIssue({
            code: "custom",
            message:
              "No puedes mezclar una franja 'todo el día' y otras franjas el mismo día.",
            path: [shift.__idx, "timeshift"],
          });
        }
      }

      if (normalShifts.length > 1) {
        const sorted = normalShifts
          .filter((shift) => shift.startTime && shift.endTime)
          .map((shift) => ({
            ...shift,
            start: toMinutes(shift.startTime),
            end: shift.endTime === "00:00" ? 1440 : toMinutes(shift.endTime),
          }))
          .sort((a, b) => a.start - b.start);

        for (let i = 1; i < sorted.length; i++) {
          const prev = sorted[i - 1]!;
          const curr = sorted[i]!;

          if (curr.start < prev.end) {
            ctx.addIssue({
              code: "custom",
              message: "Las franjas horarias del día no deben solaparse.",
              path: [curr.__idx, "timeshift"],
            });
          }
        }
      }
    }
  });

export const ParkingUserBaseSchema = z.object({
  name: NameSchema,
  surname: SurnameSchema,
  telephone: TelephoneSchema,
  accessAllowed: z.boolean().default(false),
});

export const ParkingUserCreateBodySchema = ParkingUserBaseSchema.extend({
  vehicles: VehicleListSchema.optional().default([]),
  timeshifts: ParkingUserTimeshiftListSchema.optional().default([]),
});

export const ParkingUserUpdateBodySchema = ParkingUserCreateBodySchema;

export const ParkingUserDeleteManyBodySchema = z.object({
  ids: z.array(IdSchema).min(1, "Debe proporcionar algún ID de usuario"),
});

export const ParkingUserSortBySchema = z.enum([
  "name",
  "accessAllowed",
  "lastAccess",
  "createdAt",
]);

export const ParkingUserListQuerySchema = z
  .object({
    search: z.string(),
    page: z.coerce.number().min(1),
    pageSize: z.coerce.number().min(0),
    sortBy: ParkingUserSortBySchema,
    sortOrder: z.enum(["asc", "desc"]),
  })
  .partial();

export type ParkingUserCreateBody = z.infer<typeof ParkingUserCreateBodySchema>;
export type ParkingUserUpdateBody = z.infer<typeof ParkingUserUpdateBodySchema>;
export type ParkingUserSortBy = z.infer<typeof ParkingUserSortBySchema>;
export type ParkingUserListQuery = z.infer<typeof ParkingUserListQuerySchema>;
export type ParkingUserDeleteManyBody = z.infer<
  typeof ParkingUserDeleteManyBodySchema
>;
export type ParkingUserTimeshiftList = z.infer<
  typeof ParkingUserTimeshiftListSchema
>;
