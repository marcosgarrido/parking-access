import { RecordListQuerySchema } from "@parking-access/schemas";
import type { Request, Response } from "express";

import { Prisma, prisma } from "@/database";

export async function getRecords(req: Request, res: Response) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "time",
    sortOrder = "desc",
    search,
  } = RecordListQuerySchema.parse(req.query);

  const isAll = pageSize === 0;

  const where: Prisma.RecordWhereInput | undefined =
    search && search.trim().length > 0
      ? {
          OR: [
            {
              parkingUserName: { startsWith: search, mode: "insensitive" },
            },
            {
              parkingUserSurname: { startsWith: search, mode: "insensitive" },
            },
          ],
        }
      : undefined;

  const orderBy: Prisma.RecordOrderByWithRelationInput[] =
    sortBy === "userName"
      ? [
          { parkingUserName: sortOrder },
          { parkingUserSurname: sortOrder },
          { time: "desc" },
        ]
      : [{ [sortBy]: sortOrder }, { time: "desc" }];

  const [records, totalRecords] = await prisma.$transaction([
    prisma.record.findMany({
      where,
      orderBy,
      skip: isAll ? undefined : (page - 1) * pageSize,
      take: isAll ? undefined : pageSize,
    }),
    prisma.record.count({ where }),
  ]);

  res.status(200).json({
    data: records,
    meta: {
      ...(isAll
        ? {}
        : { page, pageSize, totalPages: Math.ceil(totalRecords / pageSize) }),
      totalRecords,
    },
  });
}
