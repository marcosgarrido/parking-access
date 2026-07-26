import { z } from "zod";

import { IdSchema } from "./id-schema";
import { PlateSchema } from "./vehicle-schema";

export const RecordResponseSchema = z.object({
  id: IdSchema,
  parkingUserId: IdSchema.nullable(),
  vehicleId: IdSchema.nullable(),
  parkingUserName: z.string().min(1),
  parkingUserSurname: z.string().nullable(),
  vehiclePlate: PlateSchema.nullable(),
  success: z.boolean(),
  reasonForDenial: z.string().nullable(),
  time: z.iso.datetime(),
});

export const RecordSortBySchema = z.enum([
  "userName",
  "success",
  "reasonForDenial",
  "time",
]);

export const RecordQuerySchema = z
  .object({
    search: z.string(),
    page: z.coerce.number().min(1),
    pageSize: z.coerce.number().min(0),
    sortBy: RecordSortBySchema,
    sortOrder: z.enum(["asc", "desc"]),
  })
  .partial();

const MetaSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  totalPages: z.number().int().nonnegative().optional(),
  totalRecords: z.number().int().nonnegative(),
});

export const RecordListResponseSchema = z.object({
  data: z.array(RecordResponseSchema),
  meta: MetaSchema,
});

export const RecordDeleteManyBodySchema = z.object({
  ids: z.array(IdSchema).min(1, {
    message: "Debe proporcionar al menos un ID de registro",
  }),
});

export type RecordResponse = z.infer<typeof RecordResponseSchema>;
export type RecordSortBy = z.infer<typeof RecordSortBySchema>;
export type RecordQuery = z.infer<typeof RecordQuerySchema>;
export type RecordListResponse = z.infer<typeof RecordListResponseSchema>;
export type RecordDeleteManyBody = z.infer<typeof RecordDeleteManyBodySchema>;
