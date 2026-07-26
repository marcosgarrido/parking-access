import { Router } from "express";

import { createAppUser } from "@/controllers/app-users/create-app-user";
import { deleteAppUser } from "@/controllers/app-users/delete-app-user";
import { deleteAppUsers } from "@/controllers/app-users/delete-app-users";
import { getAppUser } from "@/controllers/app-users/get-app-user";
import { getAppUsers } from "@/controllers/app-users/get-app-users";
import { updateAppUser } from "@/controllers/app-users/update-app-user";
import { requireAuth } from "@/middlewares/require-auth";
import { requireCsrf } from "@/middlewares/require-csrf";
import { requireRole } from "@/middlewares/require-role";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/", getAppUsers);
router.get("/:id", getAppUser);
router.post("/", requireCsrf, createAppUser);
router.put("/:id", requireCsrf, updateAppUser);
router.delete("/:id", requireCsrf, deleteAppUser);
router.post("/delete-many", requireCsrf, deleteAppUsers);

export default router;
