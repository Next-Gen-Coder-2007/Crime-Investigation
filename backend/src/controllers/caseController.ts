import { Response } from "express";
import mongoose from "mongoose";
import { Case } from "../models/Case.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { logAuditAction } from "../middleware/auditLogger.js";
import { Evidence } from "../models/Evidence.js";
import { Entity } from "../models/Entity.js";
import { TimelineEvent } from "../models/TimelineEvent.js";
import { Task } from "../models/Task.js";

const getCaseQuery = (paramId: string | string[]) => {
  const idStr = String(paramId);
  if (mongoose.isValidObjectId(idStr)) {
    return { $or: [{ _id: idStr }, { caseNumber: idStr }] };
  }
  return { caseNumber: idStr };
};

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
      .populate("leadInvestigator", "name email badgeNumber role avatar department")
      .populate("assignedMembers", "name email badgeNumber role avatar department")
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

export const getCaseById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const targetCase = await Case.findOne(getCaseQuery(req.params.id))
      .populate("leadInvestigator", "name email badgeNumber role avatar department")
      .populate("assignedMembers", "name email badgeNumber role avatar department");

    if (!targetCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

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

export const createCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority, category, location, deadline, tags, assignedMembers } =
      req.body;

    if (!title) {
      res.status(400).json({ success: false, message: "Case title is required." });
      return;
    }

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
      collaborators: [
        {
          userId: req.user!._id,
          name: req.user!.name,
          badgeNumber: req.user!.badgeNumber || "INV-0001",
          role: req.user!.role || "investigator",
          joinedAt: new Date(),
        },
      ],
      accessRequests: [],
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

export const updateCaseStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "active", "under_investigation", "review", "closed"];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid case status provided." });
      return;
    }

    const updatedCase = await Case.findOneAndUpdate(
      getCaseQuery(req.params.id),
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

export const requestCaseAccess = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { notes } = req.body;
    const targetCase = await Case.findOne(getCaseQuery(req.params.id));

    if (!targetCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    const isAlreadyMember =
      targetCase.leadInvestigator.toString() === req.user!._id.toString() ||
      targetCase.assignedMembers.some((m) => m.toString() === req.user!._id.toString()) ||
      targetCase.collaborators.some((c) => c.userId.toString() === req.user!._id.toString());

    if (isAlreadyMember) {
      res.status(400).json({ success: false, message: "You are already an authorized collaborator on this case." });
      return;
    }

    const pendingRequest = targetCase.accessRequests.find(
      (r) => r.userId.toString() === req.user!._id.toString() && r.status === "pending"
    );

    if (pendingRequest) {
      res.status(400).json({ success: false, message: "Your access clearance request is currently pending review." });
      return;
    }

    const newRequest = {
      userId: req.user!._id,
      userName: req.user!.name,
      userBadge: req.user!.badgeNumber || "INV-8402",
      userEmail: req.user!.email,
      requestedAt: new Date(),
      status: "pending" as const,
      notes: notes || "",
    };

    targetCase.accessRequests.push(newRequest as any);
    await targetCase.save();

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: targetCase._id,
        action: "CASE_ACCESS_REQUESTED",
        targetType: "CASE",
        targetId: targetCase._id.toString(),
        details: { requestedBy: req.user.name, badgeNumber: req.user.badgeNumber },
        ipAddress: req.ip,
      });
    }

    res.status(201).json({
      success: true,
      message: "Access clearance request submitted to the lead investigator.",
      accessRequest: newRequest,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewAccessRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;
    const { id, requestId } = req.params;

    if (status !== "approved" && status !== "rejected") {
      res.status(400).json({ success: false, message: "Invalid review decision. Must be 'approved' or 'rejected'." });
      return;
    }

    const targetCase = await Case.findOne(getCaseQuery(id));

    if (!targetCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    const requestIndex = targetCase.accessRequests.findIndex((r: any) => r._id?.toString() === requestId);
    if (requestIndex === -1) {
      res.status(404).json({ success: false, message: "Access request not found in history." });
      return;
    }

    const request = targetCase.accessRequests[requestIndex];
    request.status = status;
    request.reviewedBy = req.user!.name;
    request.reviewedAt = new Date();
    if (notes) request.notes = notes;

    if (status === "approved") {
      if (!targetCase.assignedMembers.some((m) => m.toString() === request.userId.toString())) {
        targetCase.assignedMembers.push(request.userId);
      }
      if (!targetCase.collaborators.some((c) => c.userId.toString() === request.userId.toString())) {
        targetCase.collaborators.push({
          userId: request.userId,
          name: request.userName,
          badgeNumber: request.userBadge,
          role: "investigator",
          joinedAt: new Date(),
        });
      }
    }

    await targetCase.save();

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId: targetCase._id,
        action: status === "approved" ? "CASE_ACCESS_APPROVED" : "CASE_ACCESS_REJECTED",
        targetType: "CASE",
        targetId: targetCase._id.toString(),
        details: {
          decision: status,
          targetUser: request.userName,
          reviewedBy: req.user.name,
        },
        ipAddress: req.ip,
      });
    }

    res.status(200).json({
      success: true,
      message: `Access clearance ${status} for ${request.userName}.`,
      case: targetCase,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAccessRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const targetCase = await Case.findOne(getCaseQuery(req.params.id));

    if (!targetCase) {
      res.status(404).json({ success: false, message: "Case not found." });
      return;
    }

    res.status(200).json({
      success: true,
      accessRequests: targetCase.accessRequests || [],
      collaborators: targetCase.collaborators || [],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const targetCase = await Case.findOneAndDelete(getCaseQuery(req.params.id));

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
