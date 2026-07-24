import bcrypt from "bcryptjs";

import { prisma } from "@/database";

async function main() {
  console.log("Borrando datos existentes...");

  await prisma.$transaction([
    prisma.record.deleteMany(),
    prisma.timeshift.deleteMany(),
    prisma.parkingUserVehicle.deleteMany(),
    prisma.vehicle.deleteMany(),
    prisma.parkingUser.deleteMany(),
    prisma.appUser.deleteMany(),
  ]);

  console.log("Datos eliminados con éxito");

  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) throw new Error("ADMIN_USERNAME is not defined");

  const adminPasswordPlain = process.env.ADMIN_PASSWORD;
  if (!adminPasswordPlain) throw new Error("ADMIN_PASSWORD is not defined");

  const adminPasswordHash = await bcrypt.hash(adminPasswordPlain, 12);

  await prisma.appUser.upsert({
    where: { username: adminUsername },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isActive: true,
      name: "Administrador",
      surname: "Acceso",
    },
    create: {
      username: adminUsername,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isActive: true,
      name: "Administrador",
      surname: "Acceso",
    },
  });

  console.log(`Admin creado: ${adminUsername}`);
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
