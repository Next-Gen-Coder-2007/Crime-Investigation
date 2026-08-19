import { Router } from "express";
import {
  getTimelineByCase,
  createTimelineEvent,
  deleteTimelineEvent,
} from "../controllers/timelineController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/case/:caseId", getTimelineByCase);
router.post("/", authorize("admin", "investigator"), createTimelineEvent);
router.delete("/:id", authorize("admin", "investigator"), deleteTimelineEvent);

export default router;
