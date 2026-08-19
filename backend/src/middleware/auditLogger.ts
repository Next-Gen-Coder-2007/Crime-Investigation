import { AuditLog } from "../models/AuditLog.js";
import { IUser } from "../models/User.js";

interface LogActionParams {
  user: IUser;
  action: string;
  targetType: string;
  targetId?: string;
  caseId?: any;
  details?: Record<string, any>;
  ipAddress?: string;
}

export const logAuditAction = async (params: LogActionParams): Promise<void> => {
  try {
    await AuditLog.create({
      caseId: params.caseId,
      userId: params.user._id,
      userName: params.user.name,
      userRole: params.user.role,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId || "",
      details: params.details || {},
      ipAddress: params.ipAddress || "",
      timestamp: new Date(),
    });
  } catch (err: any) {
    console.error("[Audit Logger Error]:", err.message);
  }
};
