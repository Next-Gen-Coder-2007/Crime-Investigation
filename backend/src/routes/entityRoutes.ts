import { Router } from "express";
import {
  getEntitiesByCase,
  createEntity,
  verifyEntity,
  deleteEntity,
} from "../controllers/entityController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/case/:caseId", getEntitiesByCase);
router.post("/", authorize("admin", "investigator"), createEntity);
router.patch("/:id/verify", authorize("admin", "investigator"), verifyEntity);
router.delete("/:id", authorize("admin"), deleteEntity);

export default router;
