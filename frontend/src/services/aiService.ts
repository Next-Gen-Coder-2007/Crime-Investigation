import { apiClient } from "./api";

export interface ExtractedEntity {
  name: string;
  type: string;
  confidence: number;
  context: string;
}

export interface ProposedRelationship {
  source: string;
  target: string;
  predicate: string;
  confidence: number;
  rationale: string;
}

export interface TimelineConflict {
  eventA: string;
  eventB: string;
  conflictType: string;
  severity: "HIGH" | "CRITICAL" | "MEDIUM";
  explanation: string;
}

export interface SemanticSearchResult {
  evidence: any;
  similarityScore: number;
}

export interface LLMProvider {
  name: string;
  type: string;
  status: string;
}

export interface LangGraphResult {
  caseId: string;
  rawText: string;
  extractedEntities: Array<{ name: string; type: string; confidence: number }>;
  proposedRelations: Array<{ source: string; target: string; predicate: string; confidence: number }>;
  anomalies: Array<{ type: string; severity: string; description: string }>;
  dossierSummary: string;
  agentLogs: string[];
}

export const aiService = {
  async summarizeEvidence(params: { text?: string; evidenceId?: string }): Promise<{ success: boolean; summary: string; confidence: number }> {
    return await apiClient("/ai/summarize", { method: "POST", data: params });
  },

  async extractEntities(text: string): Promise<{ success: boolean; count: number; entities: ExtractedEntity[] }> {
    return await apiClient("/ai/extract-entities", { method: "POST", data: { text } });
  },

  async proposeRelationships(entities: Array<{ name: string; type: string }>, evidenceText?: string): Promise<{ success: boolean; count: number; proposals: ProposedRelationship[] }> {
    return await apiClient("/ai/propose-relationships", { method: "POST", data: { entities, evidenceText } });
  },

  async detectConflicts(events?: any[]): Promise<{ success: boolean; count: number; conflicts: TimelineConflict[] }> {
    return await apiClient("/ai/detect-conflicts", { method: "POST", data: { events } });
  },

  async semanticSearch(query: string, caseId?: string): Promise<{ success: boolean; results: SemanticSearchResult[] }> {
    return await apiClient("/ai/semantic-search", { method: "POST", data: { query, caseId } });
  },

  async runLangGraph(caseId: string, rawText?: string): Promise<{ success: boolean; data: LangGraphResult }> {
    return await apiClient("/agents/investigate", { method: "POST", data: { caseId, rawText } });
  },

  async getProviders(): Promise<{ success: boolean; providers: LLMProvider[] }> {
    return await apiClient("/agents/llm/providers", { method: "GET" });
  },

  async queryChroma(query: string, caseId?: string): Promise<{ success: boolean; matches: any[] }> {
    return await apiClient("/agents/vector/query", { method: "POST", data: { query, caseId } });
  },
};
