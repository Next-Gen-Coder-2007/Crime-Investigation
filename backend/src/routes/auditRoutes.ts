import { Router } from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", authorize("admin", "investigator"), getAuditLogs);

export default router;
