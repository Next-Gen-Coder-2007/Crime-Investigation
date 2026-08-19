import { apiClient } from "./api";
import type { Case, AuditLogItem } from "../types/case";

export const caseService = {
  // Get all cases with optional filters
  async getCases(params: { status?: string; priority?: string; search?: string } = {}): Promise<{
    success: boolean;
    count: number;
    cases: Case[];
  }> {
    const query = new URLSearchParams();
    if (params.status) query.append("status", params.status);
    if (params.priority) query.append("priority", params.priority);
    if (params.search) query.append("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await apiClient(`/cases${queryString}`, { method: "GET" });
  },

  // Get single case details
  async getCaseById(id: string): Promise<{ success: boolean; case: Case }> {
    return await apiClient(`/cases/${id}`, { method: "GET" });
  },

  // Create new investigation case
  async createCase(data: Partial<Case>): Promise<{ success: boolean; case: Case }> {
    return await apiClient("/cases", {
      method: "POST",
      data,
    });
  },

  // Update case status
  async updateStatus(id: string, status: string): Promise<{ success: boolean; case: Case }> {
    return await apiClient(`/cases/${id}/status`, {
      method: "PATCH",
      data: { status },
    });
  },

  // Delete case
  async deleteCase(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient(`/cases/${id}`, {
      method: "DELETE",
    });
  },

  // Get audit logs
  async getAuditLogs(caseId?: string): Promise<{ success: boolean; logs: AuditLogItem[] }> {
    const endpoint = caseId ? `/audit-logs?caseId=${caseId}` : "/audit-logs";
    return await apiClient(endpoint, { method: "GET" });
  },
};
