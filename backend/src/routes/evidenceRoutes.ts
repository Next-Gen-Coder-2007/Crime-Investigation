import { Router } from "express";
import {
  getEvidenceByCase,
  getEvidenceById,
  uploadEvidence,
  updateEvidenceStatus,
  deleteEvidence,
} from "../controllers/evidenceController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect); // Require authentication

router.get("/case/:caseId", getEvidenceByCase);
router.get("/:id", getEvidenceById);
router.post("/upload", authorize("admin", "investigator"), uploadEvidence);
router.patch("/:id/status", authorize("admin", "investigator"), updateEvidenceStatus);
router.delete("/:id", authorize("admin"), deleteEvidence);

export default router;
