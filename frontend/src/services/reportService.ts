import { apiClient } from "./api";

export interface CaseReportData {
  caseNumber: string;
  title: string;
  classification: string;
  preparedBy: string;
  badgeNumber: string;
  department: string;
  generatedAt: string;
  executiveSummary: string;
  statistics: {
    totalEvidence: number;
    totalEntities: number;
    totalEvents: number;
    riskScore: number;
  };
  keyEntities: Array<{
    name: string;
    type: string;
    aliases: string[];
    verified: boolean;
  }>;
  evidenceCatalog: Array<{
    title: string;
    type: string;
    fileHash: string;
    location: string;
    status: string;
    aiSummary: string;
  }>;
  timelineSequencer: Array<{
    timestamp: string;
    title: string;
    location?: string;
    isConflict?: boolean;
  }>;
  recommendations: string[];
}

export const reportService = {
  async getCaseReport(caseId: string): Promise<{ success: boolean; report: CaseReportData }> {
    return await apiClient(`/reports/case/${caseId}`, { method: "GET" });
  },
};
