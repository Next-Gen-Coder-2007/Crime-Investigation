import { apiClient } from "./api";

export interface TaskItem {
  _id: string;
  caseId: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: any;
  dueDate?: string;
  createdAt: string;
}

export const taskService = {
  // Get tasks by case ID
  async getTasksByCase(caseId: string): Promise<{ success: boolean; count: number; tasks: TaskItem[] }> {
    return await apiClient(`/tasks/case/${caseId}`, { method: "GET" });
  },

  // Create new task
  async createTask(data: {
    caseId: string;
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }): Promise<{ success: boolean; task: TaskItem }> {
    return await apiClient("/tasks", {
      method: "POST",
      data,
    });
  },

  // Update task status
  async updateStatus(
    id: string,
    status: "pending" | "in_progress" | "completed"
  ): Promise<{ success: boolean; task: TaskItem }> {
    return await apiClient(`/tasks/${id}/status`, {
      method: "PATCH",
      data: { status },
    });
  },

  // Delete task
  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
