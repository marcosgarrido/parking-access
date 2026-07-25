import { z } from "zod";

import { IdSchema } from "./id-schema";
import {
  TimeshiftBaseSchema,
  TimeshiftBodySchema,
  TimeshiftResponseSchema,
} from "./timeshift-schema";
import { VehicleBaseSchema } from "./vehicle-schema";

function capitalize(value: string): string {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function toMinutes(timeString: string): number {
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

const TelephoneSchema = z
  .string()
  .trim()
  .min(1, "Por favor introduzca el número de teléfono")
  .refine((value) => value === "" || /^[4679]\d{8}$/.test(value), {
    message: "Introduce un número español válido (9 dígitos, sin prefijo)",
  });

const VehicleListSchema = z
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
  .superRefine((shifts, ctx) => {
    const groupedByDay = shifts.reduce(
      (acc, shift, idx) => {
        const day = (acc[shift.dayOfWeek] ??= []);

        day.push({ ...shift, __idx: idx });

        return acc;
      },
      {} as Record<
        number,
        (z.infer<typeof TimeshiftBaseSchema> & { __idx: number })[]
      >,
    );

    for (const times of Object.values(groupedByDay)) {
      const allDayShifts = times.filter((t) => t.allDay);
      const normalShifts = times.filter((t) => !t.allDay);

      if (allDayShifts.length > 1) {
        for (const t of allDayShifts) {
          ctx.addIssue({
            code: "custom",
            message: "Solo puede haber una franja 'todo el día' por día.",
            path: [t.__idx, "timeshift"],
          });
        }
      }
      if (allDayShifts.length > 0 && normalShifts.length > 0) {
        for (const t of times) {
          ctx.addIssue({
            code: "custom",
            message:
              "No puedes mezclar una franja 'todo el día' y otras franjas el mismo día.",
            path: [t.__idx, "timeshift"],
          });
        }
      }

      if (normalShifts.length > 1) {
        const sorted = normalShifts
          .filter((ts) => ts.startTime && ts.endTime)
          .map((ts) => ({
            ...ts,
            start: toMinutes(ts.startTime!),
            end: ts.endTime === "00:00" ? 1440 : toMinutes(ts.endTime!),
          }))
          .sort((a, b) => a.start - b.start);

        for (let i = 1; i < sorted.length; i++) {
          const prev = sorted[i - 1];
          const curr = sorted[i];

          if (!prev || !curr) continue;

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

export const ParkingUserQuerySchema = z
  .object({
    search: z.string(),
    page: z.coerce.number().min(1),
    pageSize: z.coerce.number().min(0),
    sortBy: ParkingUserSortBySchema,
    sortOrder: z.enum(["asc", "desc"]),
  })
  .partial();

export const ParkingUserResponseSchema = z.object({
  id: IdSchema,
  ...ParkingUserBaseSchema.shape,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  vehicles: VehicleListSchema.optional().default([]),
  timeshifts: z.array(TimeshiftResponseSchema).optional().default([]),
  lastAccess: z.iso.datetime().nullable().optional(),
});

const MetaSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  totalPages: z.number().int().nonnegative().optional(),
  totalUsers: z.number().int().nonnegative().optional(),
});

export const ParkingUserListResponseSchema = z.object({
  data: z.array(ParkingUserResponseSchema),
  meta: MetaSchema,
});

export type ParkingUserCreateBody = z.infer<typeof ParkingUserCreateBodySchema>;
export type ParkingUserUpdateBody = z.infer<typeof ParkingUserUpdateBodySchema>;
export type ParkingUserResponse = z.infer<typeof ParkingUserResponseSchema>;
export type ParkingUserSortBy = z.infer<typeof ParkingUserSortBySchema>;
export type ParkingUserListResponse = z.infer<
  typeof ParkingUserListResponseSchema
>;
export type ParkingUserQuery = z.infer<typeof ParkingUserQuerySchema>;
export type ParkingUserDeleteManyBody = z.infer<
  typeof ParkingUserDeleteManyBodySchema
>;
export type ParkingUserTimeshiftList = z.infer<
  typeof ParkingUserTimeshiftListSchema
>;
