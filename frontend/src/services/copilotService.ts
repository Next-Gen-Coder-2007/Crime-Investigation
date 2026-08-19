import { apiClient } from "./api";

export interface CopilotQueryResponse {
  success: boolean;
  answer: string;
  citations: string[];
  timestamp: string;
}

export interface InvestigationGap {
  id: string;
  title: string;
  category: string;
  impact: "CRITICAL" | "HIGH" | "MEDIUM";
  directive: string;
}

export const copilotService = {
  async queryCopilot(caseId: string, message: string): Promise<CopilotQueryResponse> {
    return await apiClient("/copilot/query", {
      method: "POST",
      data: { caseId, message },
    });
  },

  async getGapAnalysis(caseId?: string): Promise<{ success: boolean; count: number; gaps: InvestigationGap[] }> {
    const endpoint = caseId ? `/copilot/gap-analysis?caseId=${caseId}` : "/copilot/gap-analysis";
    return await apiClient(endpoint, {
      method: "GET",
    });
  },
};
