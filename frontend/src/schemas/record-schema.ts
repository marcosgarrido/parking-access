import { IdSchema, PlateSchema } from "@parking-access/schemas";
import { z } from "zod";

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

export type RecordResponse = z.infer<typeof RecordResponseSchema>;
export type RecordListResponse = z.infer<typeof RecordListResponseSchema>;
