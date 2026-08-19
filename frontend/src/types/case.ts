import type { User } from "./auth";

export type CaseStatus = "new" | "active" | "under_investigation" | "review" | "closed";
export type CasePriority = "low" | "medium" | "high" | "critical";

export interface CaseMetrics {
  evidenceCount: number;
  entityCount: number;
  timelineCount: number;
  taskCount: number;
  riskScore: number;
}

export interface Case {
  _id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  category: string;
  leadInvestigator: User | string;
  assignedMembers: (User | string)[];
  tags: string[];
  location?: string;
  deadline?: string;
  metrics: CaseMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  _id: string;
  caseId: string;
  title: string;
  description: string;
  type: "document" | "image" | "audio" | "video" | "financial" | "interview" | "location" | "note";
  fileUrl?: string;
  fileHash?: string;
  uploadedBy: User | string;
  timestamp: string;
  location?: string;
  tags: string[];
  aiSummary?: string;
  aiConfidence?: number;
  reviewPriority: "low" | "medium" | "high";
  reviewStatus: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AuditLogItem {
  _id: string;
  caseId?: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}
