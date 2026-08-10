import { TimeshiftBaseSchema } from "@parking-access/schemas";
import { z } from "zod";

export const TimeshiftResponseSchema = TimeshiftBaseSchema.extend({
  id: z.coerce.number().int().positive().optional(),
});

export type TimeshiftResponse = z.infer<typeof TimeshiftResponseSchema>;
