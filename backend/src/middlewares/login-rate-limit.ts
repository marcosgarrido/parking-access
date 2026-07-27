import rateLimit from "express-rate-limit";

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message: "Demasiados intentos fallidos. Inténtalo de nuevo más tarde.",
    code: "TOO_MANY_REQUESTS",
  },
});
