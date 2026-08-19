import { Router } from "express";
import {
  getRelationshipsByCase,
  createRelationship,
  updateRelationshipStatus,
  deleteRelationship,
} from "../controllers/relationshipController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/case/:caseId", getRelationshipsByCase);
router.post("/", authorize("admin", "investigator"), createRelationship);
router.patch("/:id/status", authorize("admin", "investigator"), updateRelationshipStatus);
router.delete("/:id", authorize("admin", "investigator"), deleteRelationship);

export default router;
