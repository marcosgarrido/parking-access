import { z } from "zod";

export const IdSchema = z.coerce.number().int().positive();

export type Id = z.infer<typeof IdSchema>;
