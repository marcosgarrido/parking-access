import { z } from "zod";

function toMinutes(timeString: string): number {
  const [hoursPart, minutesPart] = timeString.split(":");

  return Number(hoursPart ?? 0) * 60 + Number(minutesPart ?? 0);
}

function isValidTime(timeString?: string | null): boolean {
  if (!timeString) return false;
  const [hoursPart, minutesPart] = timeString.split(":");
  const hours = Number(hoursPart ?? NaN);
  const minutes = Number(minutesPart ?? NaN);

  return (
    Number.isInteger(hours) &&
    Number.isInteger(minutes) &&
    hours >= 0 &&
    hours <= 23 &&
    minutes >= 0 &&
    minutes <= 59
  );
}

export const TimeshiftBaseSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  allDay: z.boolean().optional().default(false),
});

export const TimeshiftBodySchema = TimeshiftBaseSchema.superRefine(
  (data, ctx) => {
    if (data.allDay) {
      if (data.startTime || data.endTime) {
        ctx.addIssue({
          code: "custom",
          message: "Si es 'todo el día' no debe tener horas de inicio ni fin.",
          path: ["timeshift"],
        });
      }

      return;
    }

    if (!data.startTime || !data.endTime) {
      ctx.addIssue({
        code: "custom",
        message: "Debe indicar la hora de inicio y la de fin.",
        path: ["timeshift"],
      });

      return;
    }

    if (!isValidTime(data.startTime)) {
      ctx.addIssue({
        code: "custom",
        message: "Hora de inicio en formato inválido.",
        path: ["startTime"],
      });
    }
    if (!isValidTime(data.endTime)) {
      ctx.addIssue({
        code: "custom",
        message: "Hora de fin en formato inválido.",
        path: ["endTime"],
      });
    }

    if (data.startTime === data.endTime) {
      ctx.addIssue({
        code: "custom",
        message: "La hora de inicio y la de fin no pueden ser iguales.",
        path: ["timeshift"],
      });
    }

    if (
      data.endTime !== "00:00" &&
      toMinutes(data.startTime) > toMinutes(data.endTime)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "La hora de inicio debe ser anterior a la de fin, salvo que la hora de fin sea '00:00' (fin del día).",
        path: ["timeshift"],
      });
    }
  },
);

export const TimeshiftResponseSchema = TimeshiftBaseSchema.extend({
  id: z.coerce.number().int().positive().optional(),
});

export type TimeshiftResponse = z.infer<typeof TimeshiftResponseSchema>;
export type TimeshiftBase = z.infer<typeof TimeshiftBaseSchema>;
