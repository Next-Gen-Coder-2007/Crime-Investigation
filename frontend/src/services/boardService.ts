import { apiClient } from "./api";

export interface BoardNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface BoardEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  data?: Record<string, any>;
}

export interface BoardData {
  _id?: string;
  caseId: string;
  nodes: BoardNode[];
  edges: BoardEdge[];
}

export const boardService = {
  async getBoardByCase(caseId: string): Promise<{ success: boolean; board: BoardData }> {
    return await apiClient(`/boards/case/${caseId}`, { method: "GET" });
  },

  async saveBoard(
    caseId: string,
    nodes: BoardNode[],
    edges: BoardEdge[]
  ): Promise<{ success: boolean; message: string; board: BoardData }> {
    return await apiClient(`/boards/case/${caseId}`, {
      method: "PUT",
      data: { nodes, edges },
    });
  },
};
