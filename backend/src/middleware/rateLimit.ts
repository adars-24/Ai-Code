import rateLimit from "express-rate-limit"

// 10 requests per 15 minutes per IP
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait 15 minutes before trying again."
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message)
  }
})