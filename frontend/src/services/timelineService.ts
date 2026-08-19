import { apiClient } from "./api";

export interface TimelineEventItem {
  _id: string;
  caseId: string;
  title: string;
  description?: string;
  timestamp: string;
  location?: string;
  participants?: string[];
  evidenceId?: string;
  source?: string;
  isAnomaly?: boolean;
}

export const timelineService = {
  async getTimelineByCase(caseId: string): Promise<{ success: boolean; count: number; events: TimelineEventItem[] }> {
    return await apiClient(`/timeline/case/${caseId}`, { method: "GET" });
  },

  async createEvent(data: {
    caseId: string;
    title: string;
    description?: string;
    timestamp: string;
    location?: string;
    participants?: string[];
    isAnomaly?: boolean;
  }): Promise<{ success: boolean; event: TimelineEventItem }> {
    return await apiClient("/timeline", { method: "POST", data });
  },

  async deleteEvent(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient(`/timeline/${id}`, { method: "DELETE" });
  },
};
