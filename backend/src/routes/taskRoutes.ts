import { Router } from "express";
import {
  getTasksByCase,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/case/:caseId", getTasksByCase);
router.post("/", authorize("admin", "investigator"), createTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", authorize("admin", "investigator"), deleteTask);

export default router;
