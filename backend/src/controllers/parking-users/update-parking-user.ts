import { IdSchema, ParkingUserUpdateBodySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { Prisma, prisma } from "@/database";
import { ConflictError } from "@/errors/app-error";

export async function updateParkingUser(req: Request, res: Response) {
  const id = IdSchema.parse(req.params.id);
  const data = ParkingUserUpdateBodySchema.parse(req.body);

  try {
    const formattedUser = await prisma.$transaction(async (tx) => {
      const previousVehicleIds = data.vehicles.length
        ? (
            await tx.parkingUser.findUniqueOrThrow({
              where: { id },
              include: { vehicles: { select: { vehicleId: true } } },
            })
          ).vehicles.map((v) => v.vehicleId)
        : [];

      const user = await tx.parkingUser.update({
        where: { id },
        data: {
          name: data.name,
          surname: data.surname,
          telephone: data.telephone,
          accessAllowed: data.accessAllowed,
          vehicles: data.vehicles.length
            ? {
                deleteMany: {},
                create: data.vehicles.map((vehicle) => ({
                  vehicle: {
                    connectOrCreate: {
                      where: { plate: vehicle.plate },
                      create: { plate: vehicle.plate },
                    },
                  },
                })),
              }
            : undefined,
          timeshifts: data.timeshifts.length
            ? {
                deleteMany: {},
                createMany: {
                  data: data.timeshifts.map((shift) => ({
                    dayOfWeek: shift.dayOfWeek,
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    allDay: shift.allDay ?? false,
                  })),
                },
              }
            : undefined,
        },
        include: {
          vehicles: {
            orderBy: { vehicleId: "asc" },
            select: {
              vehicle: {
                select: { id: true, plate: true },
              },
            },
          },
          timeshifts: {
            orderBy: { id: "asc" },
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              allDay: true,
            },
          },
        },
      });

      if (previousVehicleIds.length > 0) {
        await tx.vehicle.deleteMany({
          where: { id: { in: previousVehicleIds }, users: { none: {} } },
        });
      }

      return {
        ...user,
        vehicles: user.vehicles.map((v) => v.vehicle),
      };
    });

    res.status(200).json(formattedUser);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError(
        "El número de teléfono ya está en uso por otro usuario",
      );
    }
    throw error;
  }
}
