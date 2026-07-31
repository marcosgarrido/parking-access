import { Router } from "express";

import { login } from "@/controllers/auth/login";
import { logout } from "@/controllers/auth/logout";
import { me } from "@/controllers/auth/me";
import { loginRateLimit } from "@/middlewares/login-rate-limit";
import { requireAuth } from "@/middlewares/require-auth";

const router = Router();

router.post("/login", loginRateLimit, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
