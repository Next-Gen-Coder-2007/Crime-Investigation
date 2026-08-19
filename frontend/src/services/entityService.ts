import { apiClient } from "./api";

export interface EntityItem {
  _id: string;
  caseId: string;
  name: string;
  type: string;
  aliases?: string[];
  photoUrl?: string;
  metadata?: Record<string, any>;
  isVerified: boolean;
}

export interface RelationshipItem {
  _id: string;
  caseId: string;
  sourceEntityId: any;
  targetEntityId: any;
  predicate: string;
  confidence: number;
  notes?: string;
  reviewStatus: "pending" | "accepted" | "rejected";
}

export const entityService = {
  async getEntitiesByCase(caseId: string): Promise<{ success: boolean; count: number; entities: EntityItem[] }> {
    return await apiClient(`/entities/case/${caseId}`, { method: "GET" });
  },

  async createEntity(data: {
    caseId: string;
    name: string;
    type: string;
    aliases?: string[];
    metadata?: Record<string, any>;
  }): Promise<{ success: boolean; entity: EntityItem }> {
    return await apiClient("/entities", { method: "POST", data });
  },

  async getRelationshipsByCase(caseId: string): Promise<{ success: boolean; count: number; relationships: RelationshipItem[] }> {
    return await apiClient(`/relationships/case/${caseId}`, { method: "GET" });
  },

  async createRelationship(data: {
    caseId: string;
    sourceEntityId: string;
    targetEntityId: string;
    predicate: string;
    confidence?: number;
    notes?: string;
  }): Promise<{ success: boolean; relationship: RelationshipItem }> {
    return await apiClient("/relationships", { method: "POST", data });
  },

  async updateRelationshipStatus(
    id: string,
    reviewStatus: "accepted" | "rejected" | "pending"
  ): Promise<{ success: boolean; relationship: RelationshipItem }> {
    return await apiClient(`/relationships/${id}/status`, {
      method: "PATCH",
      data: { reviewStatus },
    });
  },
};
