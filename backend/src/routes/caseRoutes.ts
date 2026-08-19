import { Router } from "express";
import {
  getCases,
  getCaseById,
  createCase,
  updateCaseStatus,
  deleteCase,
} from "../controllers/caseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect); // All case endpoints require authentication

router.get("/", getCases);
router.get("/:id", getCaseById);
router.post("/", authorize("admin", "investigator"), createCase);
router.patch("/:id/status", authorize("admin", "investigator"), updateCaseStatus);
router.delete("/:id", authorize("admin"), deleteCase);

export default router;
