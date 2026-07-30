import { z } from "zod";

export const DoorHoldBodySchema = z.object({
  hold: z.boolean(),
});

export type DoorHoldBody = z.infer<typeof DoorHoldBodySchema>;
