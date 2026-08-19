import { Router } from "express";
import {
  getCases,
  getCaseById,
  createCase,
  updateCaseStatus,
  deleteCase,
  requestCaseAccess,
  reviewAccessRequest,
  getAccessRequests,
} from "../controllers/caseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getCases);
router.get("/:id", getCaseById);
router.post("/", authorize("admin", "investigator"), createCase);
router.patch("/:id/status", authorize("admin", "investigator"), updateCaseStatus);
router.delete("/:id", authorize("admin"), deleteCase);

router.post("/:id/request-access", requestCaseAccess);
router.put("/:id/access-requests/:requestId", authorize("admin", "investigator"), reviewAccessRequest);
router.get("/:id/access-requests", getAccessRequests);

export default router;
