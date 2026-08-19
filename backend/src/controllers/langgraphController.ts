import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { InvestigationGraph } from "../services/investigationGraph.js";
import { ChromaVectorService } from "../services/chromaService.js";
import { LLMEngine } from "../services/llmEngine.js";

export const runLangGraphInvestigation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId, rawText } = req.body;

    const result = await InvestigationGraph.runInvestigation(
      caseId || "CASE-2026-0715",
      rawText || ""
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const indexVectorEvidence = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id, caseId, title, content, type, metadata } = req.body;

    if (!id || !title || !content) {
      res.status(400).json({ success: false, message: "ID, Title, and Content are required." });
      return;
    }

    const result = await ChromaVectorService.indexDocument({
      id,
      caseId: caseId || "default",
      title,
      content,
      type: type || "document",
      metadata,
    });

    res.status(201).json({
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const queryVectorChroma = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { query, caseId, topK } = req.body;

    if (!query) {
      res.status(400).json({ success: false, message: "Query string is required." });
      return;
    }

    const matches = await ChromaVectorService.querySimilarity(query, caseId, topK || 5);

    res.status(200).json({
      success: true,
      matches,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLLMProviders = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const providers = LLMEngine.getActiveProviders();

    res.status(200).json({
      success: true,
      providers,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
