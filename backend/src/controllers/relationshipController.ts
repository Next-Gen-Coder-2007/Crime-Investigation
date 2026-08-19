import { Response } from "express";
import { Relationship } from "../models/Relationship.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getRelationshipsByCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId } = req.params;
    const relationships = await Relationship.find({ caseId })
      .populate("sourceEntityId", "name type aliases")
      .populate("targetEntityId", "name type aliases")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: relationships.length,
      relationships,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRelationship = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId, sourceEntityId, targetEntityId, predicate, confidence = 100, notes } = req.body;

    if (!caseId || !sourceEntityId || !targetEntityId || !predicate) {
      res.status(400).json({ success: false, message: "Missing required relationship parameters." });
      return;
    }

    const relationship = await Relationship.create({
      caseId,
      sourceEntityId,
      targetEntityId,
      predicate,
      confidence,
      notes: notes || "",
      reviewStatus: "accepted",
      reviewedBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      relationship,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRelationshipStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reviewStatus } = req.body;
    const relationship = await Relationship.findByIdAndUpdate(
      req.params.id,
      { reviewStatus, reviewedBy: req.user?._id },
      { new: true }
    );

    if (!relationship) {
      res.status(404).json({ success: false, message: "Relationship not found." });
      return;
    }

    res.status(200).json({
      success: true,
      relationship,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRelationship = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const relationship = await Relationship.findByIdAndDelete(req.params.id);
    if (!relationship) {
      res.status(404).json({ success: false, message: "Relationship not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Relationship connection removed.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
