import { Response } from "express";
import { AuditLog } from "../models/AuditLog.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

// @desc    Get audit logs with filtering
// @route   GET /api/audit-logs
// @access  Private (Admin, Investigator)
export const getAuditLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId, limit = 50 } = req.query;

    const query: any = {};
    if (caseId) query.caseId = caseId;

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
