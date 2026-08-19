import { apiClient } from "./api";
import type { Evidence } from "../types/case";

export const evidenceService = {
  // Get all evidence items for a case
  async getEvidenceByCase(
    caseId: string,
    params: { type?: string; reviewStatus?: string; search?: string } = {}
  ): Promise<{ success: boolean; count: number; evidence: Evidence[] }> {
    const query = new URLSearchParams();
    if (params.type && params.type !== "all") query.append("type", params.type);
    if (params.reviewStatus && params.reviewStatus !== "all")
      query.append("reviewStatus", params.reviewStatus);
    if (params.search) query.append("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await apiClient(`/evidence/case/${caseId}${queryString}`, { method: "GET" });
  },

  // Get single evidence details
  async getEvidenceById(id: string): Promise<{ success: boolean; evidence: Evidence }> {
    return await apiClient(`/evidence/${id}`, { method: "GET" });
  },

  // Upload/Ingest new evidence
  async uploadEvidence(data: {
    caseId: string;
    title: string;
    description?: string;
    type: string;
    location?: string;
    tags?: string[];
    aiSummary?: string;
    reviewPriority?: string;
  }): Promise<{ success: boolean; message: string; evidence: Evidence }> {
    return await apiClient("/evidence/upload", {
      method: "POST",
      data,
    });
  },

  // Update evidence review status (Approve / Reject)
  async updateStatus(
    id: string,
    reviewStatus: "approved" | "rejected" | "pending"
  ): Promise<{ success: boolean; evidence: Evidence }> {
    return await apiClient(`/evidence/${id}/status`, {
      method: "PATCH",
      data: { reviewStatus },
    });
  },

  // Delete evidence
  async deleteEvidence(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient(`/evidence/${id}`, {
      method: "DELETE",
    });
  },
};
