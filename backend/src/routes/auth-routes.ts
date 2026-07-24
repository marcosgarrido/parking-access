import { Router } from "express";

import { login } from "@/controllers/auth/login";
import { me } from "@/controllers/auth/me";
import { requireAuth } from "@/middlewares/require-auth";

const router = Router();

router.post("/login", login);
router.get("/me", requireAuth, me);

export default router;
