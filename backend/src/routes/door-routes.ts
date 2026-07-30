import { Router } from "express";

import { holdDoor } from "@/controllers/door/hold-door";
import { openDoor } from "@/controllers/door/open-door";
import { requireAuth } from "@/middlewares/require-auth";
import { requireCsrf } from "@/middlewares/require-csrf";

const router = Router();

router.post("/open", requireAuth, requireCsrf, openDoor);
router.post("/hold", requireAuth, requireCsrf, holdDoor);

export default router;
