import { ParkingUserCreateBodySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { Prisma, prisma } from "@/database";
import { ConflictError } from "@/errors/app-error";

export async function createParkingUser(req: Request, res: Response) {
  const data = ParkingUserCreateBodySchema.parse(req.body);

  try {
    const user = await prisma.parkingUser.create({
      data: {
        name: data.name,
        surname: data.surname,
        telephone: data.telephone,
        accessAllowed: data.accessAllowed,
        vehicles: data.vehicles.length
          ? {
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
              create: data.timeshifts.map((timeshift) => ({
                dayOfWeek: timeshift.dayOfWeek,
                startTime: timeshift.startTime,
                endTime: timeshift.endTime,
                allDay: timeshift.allDay ?? false,
              })),
            }
          : undefined,
      },
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
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            allDay: true,
          },
        },
      },
    });

    res.status(201).json({
      ...user,
      vehicles: user.vehicles.map((v) => v.vehicle),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError(
        "Ya existe un usuario con el mismo número de teléfono",
      );
    }
    throw error;
  }
}
