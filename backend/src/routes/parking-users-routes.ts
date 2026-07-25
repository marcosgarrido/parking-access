import { Router } from "express";

import { createParkingUser } from "@/controllers/parking-users/create-parking-user";
import { deleteParkingUser } from "@/controllers/parking-users/delete-parking-user";
import { deleteParkingUsers } from "@/controllers/parking-users/delete-parking-users";
import { getParkingUser } from "@/controllers/parking-users/get-parking-user";
import { getParkingUsers } from "@/controllers/parking-users/get-parking-users";
import { updateParkingUser } from "@/controllers/parking-users/update-parking-user";
import { requireAuth } from "@/middlewares/require-auth";
import { requireCsrf } from "@/middlewares/require-csrf";
import { requireRole } from "@/middlewares/require-role";

const router = Router();

router.use(requireAuth, requireRole("ADMIN", "MANAGER"));

router.get("/", getParkingUsers);
router.post("/", requireCsrf, createParkingUser);
router.get("/:id", getParkingUser);
router.put("/:id", requireCsrf, updateParkingUser);
router.delete("/:id", requireCsrf, deleteParkingUser);
router.post("/delete-many", requireCsrf, deleteParkingUsers);

export default router;
