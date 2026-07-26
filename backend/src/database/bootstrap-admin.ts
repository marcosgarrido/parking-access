import bcrypt from "bcryptjs";

import { prisma } from "@/database";

export async function bootstrapAdmin() {
  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) throw new Error("ADMIN_USERNAME is not defined");

  const adminPasswordPlain = process.env.ADMIN_PASSWORD;
  if (!adminPasswordPlain) throw new Error("ADMIN_PASSWORD is not defined");

  const existing = await prisma.appUser.findUnique({
    where: { username: adminUsername },
  });

  if (existing) {
    console.log(`Admin ya existe, no se toca: ${adminUsername}`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPasswordPlain, 12);

  await prisma.appUser.create({
    data: {
      username: adminUsername,
      passwordHash,
      role: "ADMIN",
      isActive: true,
      name: "Administrador",
      surname: "Acceso",
    },
  });

  console.log(`Admin creado: ${adminUsername}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrapAdmin()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
