import { Router } from "express";
import {
  runLangGraphInvestigation,
  indexVectorEvidence,
  queryVectorChroma,
  getLLMProviders,
} from "../controllers/langgraphController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/investigate", runLangGraphInvestigation);
router.post("/vector/index", indexVectorEvidence);
router.post("/vector/query", queryVectorChroma);
router.get("/llm/providers", getLLMProviders);

export default router;
