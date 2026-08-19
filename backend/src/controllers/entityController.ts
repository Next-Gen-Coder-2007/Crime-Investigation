import { Response } from "express";
import { Entity } from "../models/Entity.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getEntitiesByCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId } = req.params;
    const entities = await Entity.find({ caseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: entities.length,
      entities,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEntity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId, name, type, aliases, metadata } = req.body;

    if (!caseId || !name || !type) {
      res.status(400).json({ success: false, message: "Case ID, Name, and Type are required." });
      return;
    }

    const entity = await Entity.create({
      caseId,
      name,
      type,
      aliases: aliases || [],
      metadata: metadata || {},
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      entity,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEntity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { isVerified } = req.body;
    const entity = await Entity.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });

    if (!entity) {
      res.status(404).json({ success: false, message: "Entity not found." });
      return;
    }

    res.status(200).json({
      success: true,
      entity,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEntity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const entity = await Entity.findByIdAndDelete(req.params.id);
    if (!entity) {
      res.status(404).json({ success: false, message: "Entity not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Entity deleted.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
