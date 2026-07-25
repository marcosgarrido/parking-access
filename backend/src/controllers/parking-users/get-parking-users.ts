import { ParkingUserQuerySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { prisma } from "@/database";

export async function getParkingUsers(req: Request, res: Response) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
  } = ParkingUserQuerySchema.parse(req.query);

  const isAll = pageSize === 0;

  const where =
    search && search.trim().length > 0
      ? {
          OR: [
            { name: { startsWith: search, mode: "insensitive" as const } },
            { surname: { startsWith: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

  const needsMemorySort = sortBy === "lastAccess";

  const [usersRaw, totalUsers] = await prisma.$transaction([
    prisma.parkingUser.findMany({
      where,
      select: {
        id: true,
        name: true,
        surname: true,
        telephone: true,
        accessAllowed: true,
        createdAt: true,
        updatedAt: true,
        records: {
          where: { success: true },
          select: { time: true },
          orderBy: { time: "desc" },
          take: 1,
        },
      },
      ...(needsMemorySort
        ? {}
        : {
            orderBy: { [sortBy]: sortOrder },
            skip: isAll ? undefined : (page - 1) * pageSize,
            take: isAll ? undefined : pageSize,
          }),
    }),
    prisma.parkingUser.count({ where }),
  ]);

  let users = usersRaw.map(({ records, ...user }) => ({
    ...user,
    lastAccess: records[0]?.time ?? null,
  }));

  if (needsMemorySort) {
    users.sort((a, b) => {
      const t1 = a.lastAccess ? new Date(a.lastAccess).getTime() : 0;
      const t2 = b.lastAccess ? new Date(b.lastAccess).getTime() : 0;

      return sortOrder === "desc" ? t2 - t1 : t1 - t2;
    });

    if (!isAll) {
      const start = (page - 1) * pageSize;

      users = users.slice(start, start + pageSize);
    }
  }

  res.status(200).json({
    data: users,
    meta: {
      ...(isAll
        ? {}
        : { page, pageSize, totalPages: Math.ceil(totalUsers / pageSize) }),
      totalUsers,
    },
  });
}
