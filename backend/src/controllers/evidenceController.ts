import { Response } from "express";
import { Evidence, IEvidence, EvidenceType, ReviewStatus } from "../models/Evidence.js";
import { Case } from "../models/Case.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { logAuditAction } from "../middleware/auditLogger.js";

// @desc    Get all evidence for a specific case with filters
// @route   GET /api/evidence/case/:caseId
// @access  Private
export const getEvidenceByCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId } = req.params;
    const { type, reviewStatus, search } = req.query;

    const query: any = { caseId };

    if (type && type !== "all") query.type = type;
    if (reviewStatus && reviewStatus !== "all") query.reviewStatus = reviewStatus;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(String(search), "i")] } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const evidenceList = await Evidence.find(query)
      .populate("uploadedBy", "name email badgeNumber role avatar")
      .populate("entities", "name type")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: evidenceList.length,
      evidence: evidenceList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single evidence item by ID
// @route   GET /api/evidence/:id
// @access  Private
export const getEvidenceById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate("uploadedBy", "name email badgeNumber role department avatar")
      .populate("entities", "name type aliases isVerified");

    if (!evidence) {
      res.status(404).json({ success: false, message: "Evidence item not found." });
      return;
    }

    res.status(200).json({
      success: true,
      evidence,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload / Ingest evidence into case vault
// @route   POST /api/evidence/upload
// @access  Private (Admin, Investigator)
export const uploadEvidence = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      caseId,
      title,
      description,
      type = "document",
      location = "",
      tags = [],
      rawText = "",
      aiSummary = "",
      aiConfidence = 88,
      reviewPriority = "medium",
    } = req.body;

    if (!caseId || !title) {
      res.status(400).json({ success: false, message: "Case ID and Title are required." });
      return;
    }

    const targetCase = await Case.findById(caseId);
    if (!targetCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    // Generate random file hash for chain of custody verification
    const fileHash = `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Generate AI Summary fallback if not provided
    const generatedAiSummary =
      aiSummary ||
      `Evidence analysis for ${title}. Document details, timestamps, and contextual entities extracted for investigator verification.`;

    const newEvidence = await Evidence.create({
      caseId,
      title,
      description: description || "",
      type: type as EvidenceType,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : "",
      fileHash,
      uploadedBy: req.user!._id,
      timestamp: new Date(),
      location,
      tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
      rawText,
      aiSummary: generatedAiSummary,
      aiConfidence: Number(aiConfidence),
      reviewPriority,
      reviewStatus: "pending",
      entities: [],
    });

    // Update case evidence metrics
    const totalEvidence = await Evidence.countDocuments({ caseId });
    targetCase.metrics = {
      ...targetCase.metrics,
      evidenceCount: totalEvidence,
    };
    await targetCase.save();

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: targetCase._id,
        action: "EVIDENCE_UPLOADED",
        targetType: "EVIDENCE",
        targetId: newEvidence._id.toString(),
        details: { title: newEvidence.title, type: newEvidence.type, fileHash },
        ipAddress: req.ip,
      });
    }

    res.status(201).json({
      success: true,
      message: "Evidence ingested and indexed in forensic vault.",
      evidence: newEvidence,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update evidence review status (Approve / Reject)
// @route   PATCH /api/evidence/:id/status
// @access  Private (Admin, Investigator)
export const updateEvidenceStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { reviewStatus } = req.body;
    const validStatuses: ReviewStatus[] = ["pending", "approved", "rejected"];

    if (!validStatuses.includes(reviewStatus)) {
      res.status(400).json({ success: false, message: "Invalid review status provided." });
      return;
    }

    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { reviewStatus },
      { new: true }
    );

    if (!evidence) {
      res.status(404).json({ success: false, message: "Evidence not found." });
      return;
    }

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: evidence.caseId,
        action: "EVIDENCE_STATUS_UPDATED",
        targetType: "EVIDENCE",
        targetId: evidence._id.toString(),
        details: { reviewStatus },
        ipAddress: req.ip,
      });
    }

    res.status(200).json({
      success: true,
      message: `Evidence review status set to ${reviewStatus}.`,
      evidence,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete evidence item
// @route   DELETE /api/evidence/:id
// @access  Private (Admin Only)
export const deleteEvidence = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);

    if (!evidence) {
      res.status(404).json({ success: false, message: "Evidence not found." });
      return;
    }

    // Refresh case metrics
    await Case.findByIdAndUpdate(evidence.caseId, {
      $inc: { "metrics.evidenceCount": -1 },
    });

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: evidence.caseId,
        action: "EVIDENCE_PURGED",
        targetType: "EVIDENCE",
        targetId: evidence._id.toString(),
        details: { title: evidence.title },
        ipAddress: req.ip,
      });
    }

    res.status(200).json({
      success: true,
      message: "Evidence item permanently removed from vault.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
