import { Router } from "express";
import {
  summarizeEvidenceHandler,
  extractEntitiesHandler,
  proposeRelationshipsHandler,
  detectConflictsHandler,
  semanticSearchHandler,
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/summarize", summarizeEvidenceHandler);
router.post("/extract-entities", extractEntitiesHandler);
router.post("/propose-relationships", proposeRelationshipsHandler);
router.post("/detect-conflicts", detectConflictsHandler);
router.post("/semantic-search", semanticSearchHandler);

export default router;
