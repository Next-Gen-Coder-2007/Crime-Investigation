import { apiClient } from "./api";
import type { Case, AuditLogItem, AccessRequest, Collaborator } from "../types/case";

export const caseService = {
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

  async getCaseById(id: string): Promise<{ success: boolean; case: Case }> {
    return await apiClient(`/cases/${id}`, { method: "GET" });
  },

  async createCase(data: Partial<Case>): Promise<{ success: boolean; case: Case }> {
    return await apiClient("/cases", {
      method: "POST",
      data,
    });
  },

  async updateStatus(id: string, status: string): Promise<{ success: boolean; case: Case }> {
    return await apiClient(`/cases/${id}/status`, {
      method: "PATCH",
      data: { status },
    });
  },

  async requestAccess(id: string, notes?: string): Promise<{ success: boolean; message: string; accessRequest: AccessRequest }> {
    return await apiClient(`/cases/${id}/request-access`, {
      method: "POST",
      data: { notes },
    });
  },

  async reviewAccessRequest(
    id: string,
    requestId: string,
    status: "approved" | "rejected",
    notes?: string
  ): Promise<{ success: boolean; message: string; case: Case }> {
    return await apiClient(`/cases/${id}/access-requests/${requestId}`, {
      method: "PUT",
      data: { status, notes },
    });
  },

  async getAccessRequests(id: string): Promise<{
    success: boolean;
    accessRequests: AccessRequest[];
    collaborators: Collaborator[];
  }> {
    return await apiClient(`/cases/${id}/access-requests`, { method: "GET" });
  },

  async deleteCase(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient(`/cases/${id}`, {
      method: "DELETE",
    });
  },

  async getAuditLogs(caseId?: string): Promise<{ success: boolean; logs: AuditLogItem[] }> {
    const endpoint = caseId ? `/audit-logs?caseId=${caseId}` : "/audit-logs";
    return await apiClient(endpoint, { method: "GET" });
  },
};
