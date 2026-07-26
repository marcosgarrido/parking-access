import { Router } from "express";

import { deleteRecords } from "@/controllers/records/delete-records";
import { getRecords } from "@/controllers/records/get-records";
import { requireAuth } from "@/middlewares/require-auth";
import { requireCsrf } from "@/middlewares/require-csrf";
import { requireRole } from "@/middlewares/require-role";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "MANAGER", "SUPERVISOR"),
  getRecords,
);

router.post(
  "/delete-many",
  requireAuth,
  requireCsrf,
  requireRole("ADMIN"),
  deleteRecords,
);

export default router;
