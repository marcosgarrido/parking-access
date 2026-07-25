import { IdSchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";

export async function deleteParkingUser(req: Request, res: Response) {
  const id = IdSchema.parse(req.params.id);

  const user = await prisma.parkingUser.delete({
    where: { id },
    include: { vehicles: { select: { vehicleId: true } } },
  });

  const vehicleIds = user.vehicles.map((v) => v.vehicleId);

  if (vehicleIds.length > 0) {
    await prisma.vehicle.deleteMany({
      where: { id: { in: vehicleIds }, users: { none: {} } },
    });
  }

  res.status(204).send();
}
