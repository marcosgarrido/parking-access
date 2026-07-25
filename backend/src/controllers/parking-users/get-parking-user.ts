import { IdSchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";

export async function getParkingUser(req: Request, res: Response) {
  const id = IdSchema.parse(req.params.id);

  const user = await prisma.parkingUser.findUniqueOrThrow({
    where: { id },
    include: {
      vehicles: {
        orderBy: { vehicleId: "asc" },
        select: {
          vehicle: {
            select: {
              id: true,
              plate: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      timeshifts: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          allDay: true,
        },
      },
    },
  });

  res.status(200).json({
    ...user,
    vehicles: user.vehicles.map((v) => v.vehicle),
  });
}
