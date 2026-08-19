import { Router } from "express";
import { queryCopilotHandler, gapAnalysisHandler } from "../controllers/copilotController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/query", queryCopilotHandler);
router.get("/gap-analysis", gapAnalysisHandler);

export default router;
