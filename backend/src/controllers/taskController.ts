import { Response } from "express";
import { Task, TaskStatus } from "../models/Task.js";
import { Case } from "../models/Case.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { logAuditAction } from "../middleware/auditLogger.js";

// @desc    Get all tasks for a case
// @route   GET /api/tasks/case/:caseId
// @access  Private
export const getTasksByCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId } = req.params;
    const tasks = await Task.find({ caseId })
      .populate("assigneeId", "name email badgeNumber role avatar")
      .populate("createdById", "name badgeNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new investigation task
// @route   POST /api/tasks
// @access  Private (Admin, Investigator)
export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { caseId, title, description, priority = "medium", assigneeId, dueDate } = req.body;

    if (!caseId || !title) {
      res.status(400).json({ success: false, message: "Case ID and Task Title are required." });
      return;
    }

    const newTask = await Task.create({
      caseId,
      title,
      description: description || "",
      priority,
      status: "pending",
      assigneeId: assigneeId || req.user!._id,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdById: req.user!._id,
    });

    await Case.findByIdAndUpdate(caseId, {
      $inc: { "metrics.taskCount": 1 },
    });

    if (req.user) {
      await logAuditAction({
        user: req.user,
        caseId,
        action: "TASK_CREATED",
        targetType: "TASK",
        targetId: newTask._id.toString(),
        details: { title: newTask.title, priority: newTask.priority },
        ipAddress: req.ip,
      });
    }

    res.status(201).json({
      success: true,
      message: "Investigation task assigned.",
      task: newTask,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses: TaskStatus[] = ["pending", "in_progress", "completed"];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid task status." });
      return;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Task updated to ${status}.`,
      task,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found." });
      return;
    }

    await Case.findByIdAndUpdate(task.caseId, {
      $inc: { "metrics.taskCount": -1 },
    });

    res.status(200).json({
      success: true,
      message: "Task removed.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
