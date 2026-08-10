import { IdSchema, ParkingUserBaseSchema, VehicleListSchema } from "@parking-access/schemas";
import { z } from "zod";

import { TimeshiftResponseSchema } from "./timeshift-schema";

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

export type ParkingUserResponse = z.infer<typeof ParkingUserResponseSchema>;
export type ParkingUserListResponse = z.infer<
  typeof ParkingUserListResponseSchema
>;
