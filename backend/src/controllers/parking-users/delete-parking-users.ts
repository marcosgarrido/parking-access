import { ParkingUserDeleteManyBodySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";

export async function deleteParkingUsers(req: Request, res: Response) {
  const { ids } = ParkingUserDeleteManyBodySchema.parse(req.body);

  const result = await prisma.$transaction(async (tx) => {
    const users = await tx.parkingUser.findMany({
      where: { id: { in: ids } },
      select: { id: true, vehicles: { select: { vehicleId: true } } },
    });

    const vehicleIds = users.flatMap((u) => u.vehicles.map((v) => v.vehicleId));

    const deleteUsers = await tx.parkingUser.deleteMany({
      where: { id: { in: ids } },
    });

    let deletedVehicles = 0;

    if (vehicleIds.length > 0) {
      const deleteVehicles = await tx.vehicle.deleteMany({
        where: { id: { in: vehicleIds }, users: { none: {} } },
      });

      deletedVehicles = deleteVehicles.count;
    }

    return {
      requestedUsers: ids.length,
      deletedUsers: deleteUsers.count,
      deletedVehicles,
    };
  });

  res.status(200).json(result);
}
