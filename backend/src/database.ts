import { PrismaPg } from "@prisma/adapter-pg";

import { Prisma, PrismaClient } from "../prisma/generated/client";

export { Prisma };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
