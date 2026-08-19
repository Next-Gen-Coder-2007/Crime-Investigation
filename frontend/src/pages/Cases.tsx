import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiArrowRight,
  FiLayers,
  FiUsers,
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiCheck,
  FiFolder,
  FiInbox,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { caseService } from "../services/caseService";
import type { Case, CaseStatus } from "../types/case";

const KANBAN_COLUMNS: { id: CaseStatus; label: string; description: string }[] = [
  { id: "new", label: "New Intake", description: "Initial incident reports" },
  { id: "active", label: "Active", description: "Operations ongoing" },
  { id: "under_investigation", label: "Under Investigation", description: "Forensics & surveillance" },
  { id: "review", label: "Review", description: "Prosecutorial & supervisor review" },
  { id: "closed", label: "Closed / Archived", description: "Adjudicated cases" },
];

export default function Cases() {
  const { theme, themeMode } = useTheme();

  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [draggedCaseId, setDraggedCaseId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Organized Crime");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [newDescription, setNewDescription] = useState("");

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await caseService.getCases();
      if (response.success && response.cases) {
        setCases(response.cases);
      } else {
        setCases([]);
      }
    } catch {
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === "all" || c.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const handleDragStart = (e: React.DragEvent, caseId: string) => {
    e.dataTransfer.setData("text/plain", caseId);
    setDraggedCaseId(caseId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: CaseStatus) => {
    e.preventDefault();
    const caseId = e.dataTransfer.getData("text/plain") || draggedCaseId;
    if (!caseId) return;

    const originalCases = [...cases];
    setCases((prev) =>
      prev.map((c) => (c._id === caseId || c.caseNumber === caseId ? { ...c, status: targetStatus } : c))
    );

    try {
      const targetCase = cases.find((c) => c._id === caseId || c.caseNumber === caseId);
      if (targetCase) {
        await caseService.updateStatus(targetCase._id, targetStatus);
      }
    } catch {
      setCases(originalCases);
    } finally {
      setDraggedCaseId(null);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await caseService.createCase({
        title: newTitle,
        category: newCategory,
        priority: newPriority,
        description: newDescription,
      });

      if (response.success && response.case) {
        setCases([response.case, ...cases]);
      }
    } catch {
      // Handled
    } finally {
      setIsCreateModalOpen(false);
      setNewTitle("");
      setNewDescription("");
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600/10 text-red-500 border-red-600/30";
      case "high":
        return "bg-red-600/10 text-red-400 border-red-600/30";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
              Case Operations Hub
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            Investigation Case Management
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Drag and drop cases across tactical operational phases or switch to registry list view.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center p-1 rounded-xl border"
            style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
          >
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-red-600 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <FiGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-red-600 text-white font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <FiList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Case Intake</span>
          </button>
        </div>
      </div>

      <div
        className="p-3.5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case #, keyword, or tag..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border bg-transparent outline-none focus:border-red-500"
            style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold mr-1 flex items-center gap-1">
            <FiFilter className="w-3.5 h-3.5 text-red-500" /> Priority:
          </span>
          {["all", "critical", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase font-bold transition-all cursor-pointer ${
                selectedPriority === p
                  ? "bg-red-600 text-white font-bold"
                  : "border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-xs font-mono text-zinc-400">
          Syncing case registry...
        </div>
      ) : cases.length === 0 ? (
        <div
          className="p-16 rounded-3xl border text-center space-y-4"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 mx-auto">
            <FiInbox className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold" style={{ color: theme.text }}>
              No Investigation Cases Found
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No active or historical cases exist in your precinct registry. Click below to initiate your first operation.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-red-600/20"
          >
            <FiPlus className="w-4 h-4" />
            <span>Initiate New Case</span>
          </button>
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start min-h-[600px] overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => {
            const columnCases = filteredCases.filter((c) => c.status === column.id);

            return (
              <div
                key={column.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className="rounded-2xl border flex flex-col min-w-[240px] transition-colors"
                style={{
                  backgroundColor: themeMode === "light" ? "#fafafa" : "#09090b",
                  borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                }}
              >
                <div
                  className="p-3.5 border-b flex items-center justify-between"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                      {column.label}
                    </h3>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: themeMode === "light" ? "#f1f5f9" : "#18181b",
                      borderColor: themeMode === "light" ? "#e2e8f0" : "#27272a",
                      color: theme.text,
                    }}
                  >
                    {columnCases.length}
                  </span>
                </div>

                <div className="p-3 space-y-3 min-h-[500px]">
                  {columnCases.map((c) => (
                    <motion.div
                      key={c._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, c._id)}
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:border-red-600/50 transition-all flex flex-col justify-between"
                      style={{
                        backgroundColor: themeMode === "light" ? "#ffffff" : "#121215",
                        borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-[10px] font-mono font-bold text-red-500">
                            {c.caseNumber}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${getPriorityBadge(
                              c.priority
                            )}`}
                          >
                            {c.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold leading-snug mb-1.5" style={{ color: theme.text }}>
                          {c.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                          {c.description}
                        </p>
                      </div>

                      <div
                        className="pt-3 border-t flex items-center justify-between text-[10px] font-mono text-zinc-400"
                        style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <FiLayers className="w-3 h-3 text-red-500" />
                            <strong style={{ color: theme.text }}>{c.metrics?.evidenceCount || 0}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3 text-red-500" />
                            <strong style={{ color: theme.text }}>{c.metrics?.entityCount || 0}</strong>
                          </span>
                        </div>

                        <Link
                          to={`/cases/${c.caseNumber}`}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <span>Inspect</span>
                          <FiArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}

                  {columnCases.length === 0 && (
                    <div className="h-32 border-2 border-dashed rounded-xl border-zinc-800 flex items-center justify-center text-[11px] text-zinc-500 font-mono">
                      Drop case here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <table className="w-full text-left text-xs font-sans">
            <thead
              className="border-b uppercase font-mono text-[10px] text-zinc-400"
              style={{
                backgroundColor: themeMode === "light" ? "#f8fafc" : "#121215",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <tr>
                <th className="p-4">Case #</th>
                <th className="p-4">Operation Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Evidence</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
              {filteredCases.map((c) => (
                <tr key={c._id} className="hover:bg-red-600/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-red-500">{c.caseNumber}</td>
                  <td className="p-4 font-bold" style={{ color: theme.text }}>
                    {c.title}
                  </td>
                  <td className="p-4 text-zinc-400">{c.category}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${getPriorityBadge(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-400 uppercase text-[11px]">
                    {c.status.replace("_", " ")}
                  </td>
                  <td className="p-4 font-mono text-zinc-400">
                    {c.metrics?.evidenceCount || 0} Records
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/cases/${c.caseNumber}`}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1"
                    >
                      <span>Open Case</span>
                      <FiArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
              className="w-full max-w-lg p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                color: theme.text,
              }}
            >
              <div
                className="flex items-center justify-between pb-4 border-b mb-5"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                    <FiFolder className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Initiate Investigation Case</h3>
                    <p className="text-[10px] text-zinc-400 font-mono">Formal Case Intake Form</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-zinc-400 hover:text-red-500 cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                    Case Operation Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Operation Horizon Strike"
                    className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                    style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                      Crime Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                      style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                    >
                      <option value="Organized Crime" className="bg-zinc-900 text-white">Organized Crime</option>
                      <option value="Financial Fraud" className="bg-zinc-900 text-white">Financial Fraud</option>
                      <option value="Cyber Infiltration" className="bg-zinc-900 text-white">Cyber Infiltration</option>
                      <option value="Cargo Smuggling" className="bg-zinc-900 text-white">Cargo Smuggling</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                      Priority Level
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                      style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                    >
                      <option value="low" className="bg-zinc-900 text-white">Low Priority</option>
                      <option value="medium" className="bg-zinc-900 text-white">Medium Priority</option>
                      <option value="high" className="bg-zinc-900 text-white">High Priority</option>
                      <option value="critical" className="bg-zinc-900 text-white">Critical Threat</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                    Case Scope & Objective
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Brief summary of suspect, incident location, and objective..."
                    className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
                    style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
                  />
                </div>

                <div
                  className="pt-4 border-t flex justify-end gap-2.5"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                >
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>Create Operation</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
