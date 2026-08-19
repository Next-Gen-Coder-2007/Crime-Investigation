import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import {
  generateTextSummary,
  extractNamedEntities,
  proposeEntityRelationships,
  detectTimelineConflicts,
} from "../services/aiService.js";
import { Evidence } from "../models/Evidence.js";

export const summarizeEvidenceHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { text, evidenceId } = req.body;
    let targetText = text;

    if (!targetText && evidenceId) {
      const item = await Evidence.findById(evidenceId);
      targetText = item?.description || item?.title || "";
    }

    if (!targetText) {
      res.status(400).json({ success: false, message: "Text or Evidence ID is required." });
      return;
    }

    const result = await generateTextSummary(targetText);

    if (evidenceId) {
      await Evidence.findByIdAndUpdate(evidenceId, {
        aiSummary: result.summary,
        aiConfidence: result.confidence,
      });
    }

    res.status(200).json({
      success: true,
      summary: result.summary,
      confidence: result.confidence,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const extractEntitiesHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ success: false, message: "Text is required for entity extraction." });
      return;
    }

    const entities = await extractNamedEntities(text);

    res.status(200).json({
      success: true,
      count: entities.length,
      entities,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const proposeRelationshipsHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { entities, evidenceText } = req.body;
    if (!entities || !Array.isArray(entities)) {
      res.status(400).json({ success: false, message: "Entities array is required." });
      return;
    }

    const proposals = await proposeEntityRelationships(entities, evidenceText || "");

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const detectConflictsHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { events } = req.body;
    const conflicts = await detectTimelineConflicts(events || []);

    res.status(200).json({
      success: true,
      count: conflicts.length,
      conflicts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const semanticSearchHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { query, caseId } = req.body;
    if (!query) {
      res.status(400).json({ success: false, message: "Search query is required." });
      return;
    }

    const filter: any = {};
    if (caseId) filter.caseId = caseId;

    const items = await Evidence.find(filter).limit(20);
    const qLower = query.toLowerCase();

    const scored = items.map((item) => {
      let score = 70;
      if (item.title.toLowerCase().includes(qLower)) score += 20;
      if (item.description?.toLowerCase().includes(qLower)) score += 15;
      if (item.tags?.some((t) => t.toLowerCase().includes(qLower))) score += 10;
      if (item.aiSummary?.toLowerCase().includes(qLower)) score += 15;
      return {
        evidence: item,
        similarityScore: Math.min(score, 99),
      };
    });

    scored.sort((a, b) => b.similarityScore - a.similarityScore);

    res.status(200).json({
      success: true,
      results: scored,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
