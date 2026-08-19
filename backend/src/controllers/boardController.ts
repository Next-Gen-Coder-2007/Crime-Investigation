import { Response } from "express";
import mongoose from "mongoose";
import { Board } from "../models/Board.js";
import { Case } from "../models/Case.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getBoardByCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const caseIdParam = Array.isArray(req.params.caseId) ? req.params.caseId[0] : req.params.caseId;

    let targetCaseId: mongoose.Types.ObjectId | null = null;
    if (mongoose.Types.ObjectId.isValid(caseIdParam)) {
      targetCaseId = new mongoose.Types.ObjectId(caseIdParam);
    } else {
      const foundCase = await Case.findOne({ caseNumber: caseIdParam });
      if (foundCase) {
        targetCaseId = foundCase._id as mongoose.Types.ObjectId;
      }
    }

    let board = null;
    if (targetCaseId) {
      board = await Board.findOne({ caseId: targetCaseId });
    }

    if (!board && targetCaseId) {
      board = await Board.create({
        caseId: targetCaseId,
        nodes: [
          {
            id: "node-1",
            type: "person",
            position: { x: 100, y: 150 },
            data: { label: "Viktor Mercer", subtitle: "Primary Suspect", type: "PERSON", verified: true },
          },
          {
            id: "node-2",
            type: "person",
            position: { x: 450, y: 150 },
            data: { label: "Dmitri Vance", subtitle: "Logistics Broker", type: "PERSON", verified: true },
          },
          {
            id: "node-3",
            type: "location",
            position: { x: 300, y: 350 },
            data: { label: "Warehouse 14B", subtitle: "Port Horizon Pier 4", type: "LOCATION", verified: true },
          },
          {
            id: "node-4",
            type: "evidence",
            position: { x: 650, y: 300 },
            data: { label: "CCTV Log #EVD-0914", subtitle: "Pier 4 Surveillance", type: "EVIDENCE", verified: true },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "node-1",
            target: "node-2",
            label: "MET_WITH",
            type: "smoothstep",
            data: { confidence: 92 },
          },
          {
            id: "edge-2",
            source: "node-2",
            target: "node-3",
            label: "LOCATED_AT",
            type: "smoothstep",
            data: { confidence: 96 },
          },
          {
            id: "edge-3",
            source: "node-2",
            target: "node-4",
            label: "CAPTURED_IN",
            type: "smoothstep",
            data: { confidence: 94 },
          },
        ],
        lastUpdatedBy: req.user?._id,
      });
    }

    res.status(200).json({
      success: true,
      board,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const caseIdParam = Array.isArray(req.params.caseId) ? req.params.caseId[0] : req.params.caseId;
    const { nodes, edges } = req.body;

    let targetCaseId: mongoose.Types.ObjectId | null = null;
    if (mongoose.Types.ObjectId.isValid(caseIdParam)) {
      targetCaseId = new mongoose.Types.ObjectId(caseIdParam);
    } else {
      const foundCase = await Case.findOne({ caseNumber: caseIdParam });
      if (foundCase) {
        targetCaseId = foundCase._id as mongoose.Types.ObjectId;
      }
    }

    if (!targetCaseId) {
      res.status(400).json({ success: false, message: "Valid Case ID or Case Number is required." });
      return;
    }

    const board = await Board.findOneAndUpdate(
      { caseId: targetCaseId },
      {
        nodes: nodes || [],
        edges: edges || [],
        lastUpdatedBy: req.user?._id,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Investigation board saved successfully.",
      board,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
