import { Router } from "express"
import {
  getHistory,
  deleteHistory,
  clearHistory
} from "../controller/history.controller"
import { protect } from "../middleware/auth"

const router: Router = Router()

router.use(protect)

router.get("/", getHistory)
router.delete("/clear", clearHistory)
router.delete("/:id", deleteHistory)

export default router