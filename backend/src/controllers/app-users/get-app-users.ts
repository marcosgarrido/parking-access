import { AppUserQuerySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { Prisma, prisma } from "@/database";

export async function getAppUsers(req: Request, res: Response) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "username",
    sortOrder = "asc",
    search,
  } = AppUserQuerySchema.parse(req.query);

  const where: Prisma.AppUserWhereInput | undefined =
    search && search.trim().length > 0
      ? {
          OR: [
            { name: { startsWith: search, mode: "insensitive" } },
            { surname: { startsWith: search, mode: "insensitive" } },
          ],
        }
      : undefined;

  const isAll = pageSize === 0;

  const orderBy: Prisma.AppUserOrderByWithRelationInput[] =
    sortBy === "name"
      ? [{ name: sortOrder }, { surname: sortOrder }, { lastLoginAt: "desc" }]
      : sortBy === "lastLoginAt"
        ? [
            {
              lastLoginAt: {
                sort: sortOrder,
                nulls: sortOrder === "desc" ? "last" : "first",
              },
            },
          ]
        : [{ [sortBy]: sortOrder }, { createdAt: "desc" }];

  const [users, totalUsers] = await prisma.$transaction([
    prisma.appUser.findMany({
      where,
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip: isAll ? undefined : (page - 1) * pageSize,
      take: isAll ? undefined : pageSize,
    }),
    prisma.appUser.count({ where }),
  ]);

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
