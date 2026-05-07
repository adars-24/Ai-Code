import { Router } from "express"
import { runTool } from "../controller/ai.controller"
import { validateToolRequest } from "../middleware/validate"
import { apiRateLimiter } from "../middleware/rateLimit"
import { protect } from "../middleware/auth"

const router: Router = Router()

// protect + rate limit + validate on every tool run
router.post("/run", protect, apiRateLimiter, validateToolRequest, runTool)

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

export default router