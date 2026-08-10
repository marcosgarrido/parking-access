import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { requireAuth } from "@/middlewares/require-auth";

const router = express.Router();

router.use(
  requireAuth,
  createProxyMiddleware({
    target: "http://mediamtx:8889",
    changeOrigin: true,
    pathRewrite: (path) => `/camera${path}`,
  }),
);

export default router;
