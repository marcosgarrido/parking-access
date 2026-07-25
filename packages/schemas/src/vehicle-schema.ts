import { z } from "zod";

export const PlateSchema = z
  .string()
  .toUpperCase()
  .regex(/^\d{4}[B-DF-HJ-NP-TV-Z]{3}$/, {
    message:
      "La matrícula debe tener 4 dígitos seguidos de 3 letras (sin vocales ni Ñ)",
  })
  .transform((value) => value.toUpperCase());

export const VehicleBaseSchema = z.object({
  plate: PlateSchema,
});

export type VehicleBase = z.infer<typeof VehicleBaseSchema>;
