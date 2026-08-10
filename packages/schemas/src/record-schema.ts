import { z } from "zod";

import { IdSchema } from "./id-schema";
import { PlateSchema } from "./vehicle-schema";

export const RecordCreateBodySchema = z
  .object({
    parkingUserId: IdSchema.optional(),
    vehicleId: IdSchema.optional(),
    parkingUserName: z.string().min(1).default("Desconocido"),
    parkingUserSurname: z.string().min(1).optional(),
    vehiclePlate: PlateSchema.optional(),
    success: z.boolean().optional().default(false),
    reasonForDenial: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.success === false &&
      (!data.reasonForDenial || data.reasonForDenial.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "reasonForDenial es obligatorio si success es false",
        path: ["reasonForDenial"],
      });
    }

    if (
      data.success === true &&
      (typeof data.vehicleId !== "number" || data.vehicleId <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "vehicleId es obligatorio y debe ser positivo si success es true",
        path: ["vehicleId"],
      });
    }

    if (
      data.success === true &&
      (!data.vehiclePlate || data.vehiclePlate.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "vehiclePlate es obligatorio si success es true",
        path: ["vehiclePlate"],
      });
    }
  });

export const RecordSortBySchema = z.enum([
  "userName",
  "success",
  "reasonForDenial",
  "time",
]);

export const RecordListQuerySchema = z
  .object({
    search: z.string(),
    page: z.coerce.number().min(1),
    pageSize: z.coerce.number().min(0),
    sortBy: RecordSortBySchema,
    sortOrder: z.enum(["asc", "desc"]),
  })
  .partial();

export const RecordDeleteManyBodySchema = z.object({
  ids: z.array(IdSchema).min(1, {
    message: "Debe proporcionar al menos un ID de registro",
  }),
});

export type RecordCreateBody = z.infer<typeof RecordCreateBodySchema>;
export type RecordSortBy = z.infer<typeof RecordSortBySchema>;
export type RecordListQuery = z.infer<typeof RecordListQuerySchema>;
export type RecordDeleteManyBody = z.infer<typeof RecordDeleteManyBodySchema>;
