import { useState } from "react";
import { FiX, FiCheck, FiCheckSquare } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onTaskCreated: (taskData: any) => void;
}

export default function TaskModal({
  isOpen,
  onClose,
  caseId,
  onTaskCreated,
}: TaskModalProps) {
  const { theme, themeMode } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onTaskCreated({
      caseId,
      title,
      description,
      priority,
      dueDate,
    });

    onClose();
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          color: theme.text,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
              <FiCheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Assign Case Task</h2>
              <p className="text-[10px] text-zinc-400 font-mono">Investigative Delegation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
              Task Directive *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Subpoena telecom tower logs for Jan 14"
              className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
              style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              >
                <option value="urgent" className="bg-zinc-900 text-white">Urgent</option>
                <option value="high" className="bg-zinc-900 text-white">High</option>
                <option value="medium" className="bg-zinc-900 text-white">Medium</option>
                <option value="low" className="bg-zinc-900 text-white">Low</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
              Operational Notes / Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify warrants, targeted phone numbers, or coordination details..."
              className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
              style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
            />
          </div>

          <div
            className="pt-4 border-t flex items-center justify-end gap-3"
            style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <FiCheck className="w-4 h-4" />
              <span>Assign Directive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
