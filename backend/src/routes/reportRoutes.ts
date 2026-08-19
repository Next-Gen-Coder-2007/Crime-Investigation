import { Router } from "express";
import { generateCaseReport } from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/case/:caseId", generateCaseReport);

export default router;
