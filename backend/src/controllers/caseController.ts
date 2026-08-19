import { Response } from "express";
import { Case } from "../models/Case.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { logAuditAction } from "../middleware/auditLogger.js";
import { Evidence } from "../models/Evidence.js";
import { Entity } from "../models/Entity.js";
import { TimelineEvent } from "../models/TimelineEvent.js";
import { Task } from "../models/Task.js";

// @desc    Get all accessible cases
// @route   GET /api/cases
// @access  Private
export const getCases = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, search } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { caseNumber: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(String(search), "i")] } },
      ];
    }

    const cases = await Case.find(query)
      .populate("leadInvestigator", "name email badgeNumber role avatar")
      .populate("assignedMembers", "name email badgeNumber role avatar")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single case by ID with complete metrics
// @route   GET /api/cases/:id
// @access  Private
export const getCaseById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const targetCase = await Case.findById(req.params.id)
      .populate("leadInvestigator", "name email badgeNumber role avatar department")
      .populate("assignedMembers", "name email badgeNumber role avatar department");

    if (!targetCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    // Refresh live metrics
    const [evidenceCount, entityCount, timelineCount, taskCount] = await Promise.all([
      Evidence.countDocuments({ caseId: targetCase._id }),
      Entity.countDocuments({ caseId: targetCase._id }),
      TimelineEvent.countDocuments({ caseId: targetCase._id }),
      Task.countDocuments({ caseId: targetCase._id }),
    ]);

    targetCase.metrics = {
      evidenceCount,
      entityCount,
      timelineCount,
      taskCount,
      riskScore: targetCase.metrics?.riskScore || 75,
    };

    res.status(200).json({
      success: true,
      case: targetCase,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new case
// @route   POST /api/cases
// @access  Private (Admin, Investigator)
export const createCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority, category, location, deadline, tags, assignedMembers } =
      req.body;

    if (!title) {
      res.status(400).json({ success: false, message: "Case title is required." });
      return;
    }

    // Auto-generate case number
    const count = await Case.countDocuments();
    const caseNumber = `CASE-${new Date().getFullYear()}-${String(count + 101).padStart(4, "0")}`;

    const newCase = await Case.create({
      caseNumber,
      title,
      description: description || "",
      priority: priority || "medium",
      category: category || "General Crime",
      location: location || "",
      deadline: deadline ? new Date(deadline) : undefined,
      tags: tags || [],
      leadInvestigator: req.user!._id,
      assignedMembers: assignedMembers || [req.user!._id],
    });

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: newCase._id,
        action: "CASE_CREATED",
        targetType: "CASE",
        targetId: newCase._id.toString(),
        details: { caseNumber: newCase.caseNumber, title: newCase.title },
        ipAddress: req.ip,
      });
    }

    res.status(201).json({
      success: true,
      message: "Investigation case initiated successfully.",
      case: newCase,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update case status
// @route   PATCH /api/cases/:id/status
// @access  Private (Admin, Investigator)
export const updateCaseStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "active", "under_investigation", "review", "closed"];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid case status provided." });
      return;
    }

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: updatedCase._id,
        action: "CASE_STATUS_UPDATED",
        targetType: "CASE",
        targetId: updatedCase._id.toString(),
        details: { status },
        ipAddress: req.ip,
      });
    }

    res.status(200).json({
      success: true,
      message: `Case status updated to ${status}.`,
      case: updatedCase,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / Archive a case
// @route   DELETE /api/cases/:id
// @access  Private (Admin Only)
export const deleteCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const targetCase = await Case.findByIdAndDelete(req.params.id);

    if (!targetCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: targetCase._id,
        action: "CASE_DELETED",
        targetType: "CASE",
        targetId: targetCase._id.toString(),
        details: { caseNumber: targetCase.caseNumber },
        ipAddress: req.ip,
      });
    }

    res.status(200).json({
      success: true,
      message: "Case permanently purged from registry.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
