import { Response } from "express";
import { TimelineEvent } from "../models/TimelineEvent.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getTimelineByCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId } = req.params;
    const events = await TimelineEvent.find({ caseId }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTimelineEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId, title, description, timestamp, location, isAnomaly, conflictDetails } = req.body;

    if (!caseId || !title || !timestamp) {
      res.status(400).json({ success: false, message: "Case ID, Title, and Timestamp are required." });
      return;
    }

    const event = await TimelineEvent.create({
      caseId,
      title,
      description: description || "",
      timestamp: new Date(timestamp),
      location: location || "",
      isConflict: Boolean(isAnomaly),
      conflictDetails: conflictDetails || "",
      confidence: 100,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTimelineEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const event = await TimelineEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: "Timeline event not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Timeline event removed.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
