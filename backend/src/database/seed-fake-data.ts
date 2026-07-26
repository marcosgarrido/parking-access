import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

import { prisma } from "@/database";
import { bootstrapAdmin } from "@/database/bootstrap-admin";

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) throw new Error("ADMIN_USERNAME is not defined");

  console.log("Borrando datos existentes...");

  await prisma.$transaction([
    prisma.record.deleteMany(),
    prisma.timeshift.deleteMany(),
    prisma.parkingUserVehicle.deleteMany(),
    prisma.vehicle.deleteMany(),
    prisma.parkingUser.deleteMany(),
    prisma.appUser.deleteMany({ where: { username: { not: adminUsername } } }),
  ]);

  console.log("Datos eliminados con éxito");

  await bootstrapAdmin();

  const roles = ["MANAGER", "SUPERVISOR"] as const;

  for (let i = 0; i < 5; i++) {
    const passwordHash = await bcrypt.hash("changeMe123!", 12);

    await prisma.appUser.create({
      data: {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        username: faker.internet.username().toLowerCase().slice(0, 32),
        passwordHash,
        role: faker.helpers.arrayElement(roles),
        isActive: faker.datatype.boolean(),
      },
    });
  }

  console.log("Insertados 5 usuarios del sistema de prueba");

  let totalRecords = 0;

  for (let i = 0; i < 100; i++) {
    const telephone = faker.helpers.fromRegExp(/[4679][0-9]{8}/);

    const parkingUser = await prisma.parkingUser.create({
      data: {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        telephone,
        accessAllowed: faker.datatype.boolean(),
      },
    });

    const vehicleCount = faker.number.int({ min: 1, max: 3 });
    const createdVehicles: Array<{ id: number; plate: string }> = [];

    for (let v = 0; v < vehicleCount; v++) {
      const plate = faker.helpers.fromRegExp(/[0-9]{4}[B-DF-HJ-NP-TV-Z]{3}/);

      const vehicle = await prisma.vehicle.create({ data: { plate } });

      createdVehicles.push({ id: vehicle.id, plate: vehicle.plate });

      await prisma.parkingUserVehicle.create({
        data: { parkingUserId: parkingUser.id, vehicleId: vehicle.id },
      });
    }

    const allDays = [0, 1, 2, 3, 4, 5, 6];
    const days = faker.helpers.arrayElements(
      allDays,
      faker.number.int({ min: 1, max: 5 }),
    );

    const timeshifts = days.map((dayOfWeek) => {
      const isAllDay = faker.number.int({ min: 1, max: 5 }) === 1;

      if (isAllDay) {
        return {
          parkingUserId: parkingUser.id,
          dayOfWeek,
          allDay: true,
          startTime: null,
          endTime: null,
        };
      }

      const startHour = faker.number.int({ min: 0, max: 21 });
      const endHour = faker.number.int({ min: startHour + 1, max: 23 });
      const startTime = `${String(startHour).padStart(2, "0")}:${String(
        faker.number.int({ min: 0, max: 59 }),
      ).padStart(2, "0")}`;
      const endTime = `${String(endHour).padStart(2, "0")}:${String(
        faker.number.int({ min: 0, max: 59 }),
      ).padStart(2, "0")}`;

      return {
        parkingUserId: parkingUser.id,
        dayOfWeek,
        startTime,
        endTime,
        allDay: false,
      };
    });

    await prisma.timeshift.createMany({ data: timeshifts });

    const numRecords = faker.number.int({ min: 3, max: 10 });

    for (let j = 0; j < numRecords; j++) {
      const success = faker.datatype.boolean();
      const vehicle = faker.helpers.arrayElement(createdVehicles);

      await prisma.record.create({
        data: {
          parkingUserId: parkingUser.id,
          parkingUserName: parkingUser.name,
          parkingUserSurname: parkingUser.surname,
          vehicleId: vehicle.id,
          vehiclePlate: vehicle.plate,
          time: faker.date.recent({ days: 30 }),
          success,
          reasonForDenial: !success
            ? faker.lorem.sentence().slice(0, 50)
            : null,
        },
      });
      totalRecords++;
    }
  }

  console.log(
    `Insertados 100 usuarios de parking con vehículos, franjas y ${totalRecords} registros`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
