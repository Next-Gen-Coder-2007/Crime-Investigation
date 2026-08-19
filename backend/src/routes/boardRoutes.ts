import { Router } from "express";
import { getBoardByCase, saveBoard } from "../controllers/boardController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/case/:caseId", getBoardByCase);
router.put("/case/:caseId", authorize("admin", "investigator"), saveBoard);

export default router;
