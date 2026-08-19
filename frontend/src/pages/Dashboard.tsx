import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  FiFolder,
  FiUsers,
  FiCpu,
  FiPlus,
  FiArrowRight,
  FiLayers,
  FiCrosshair,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { caseService } from "../services/caseService";
import type { Case } from "../types/case";

export default function Dashboard() {
  const { user } = useAuth();
  const { theme, themeMode } = useTheme();

  const [cases, setCases] = useState<Case[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseCategory, setNewCaseCategory] = useState("Organized Crime");
  const [newCasePriority, setNewCasePriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [newCaseDescription, setNewCaseDescription] = useState("");

  useEffect(() => {
    const loadCases = async () => {
      try {
        const response = await caseService.getCases();
        if (response.success && response.cases) {
          setCases(response.cases);
        }
      } catch {
        setCases([
          {
            _id: "case-demo-1",
            caseNumber: "CASE-2026-0715",
            title: "Operation Nightfall: Port Horizon Syndicate",
            description:
              "Multi-agency investigation into cross-border illicit logistics, shell entities, and high-value cargo diversion at Port Horizon Terminal 4.",
            status: "under_investigation",
            priority: "high",
            category: "Organized Crime & Smuggling",
            leadInvestigator: user?.name || "Det. Sarah Chen",
            assignedMembers: ["Det. Sarah Chen", "Analyst Elena Rostova"],
            tags: ["Port Horizon", "Smuggling", "Shell Corporation"],
            location: "Port Horizon Dock 4, Sector 7",
            metrics: {
              evidenceCount: 4,
              entityCount: 5,
              timelineCount: 4,
              taskCount: 3,
              riskScore: 78,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "case-demo-2",
            caseNumber: "CASE-2026-0801",
            title: "Operation Phantom Wire: Financial Laundering Network",
            description:
              "Tracing rapid layering transactions across offshore fintech accounts suspected of laundering contraband proceeds.",
            status: "active",
            priority: "critical",
            category: "Financial Fraud",
            leadInvestigator: user?.name || "Det. Sarah Chen",
            assignedMembers: ["Det. Sarah Chen", "Director Marcus Vance"],
            tags: ["Wire Fraud", "Crypto Exchange", "Offshore"],
            location: "Metropolitan Financial District",
            metrics: {
              evidenceCount: 2,
              entityCount: 3,
              timelineCount: 2,
              taskCount: 2,
              riskScore: 85,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    };

    loadCases();
  }, [user]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim()) return;

    try {
      const response = await caseService.createCase({
        title: newCaseTitle,
        category: newCaseCategory,
        priority: newCasePriority,
        description: newCaseDescription,
      });

      if (response.success && response.case) {
        setCases([response.case, ...cases]);
      }
    } catch {
      const mockNewCase: Case = {
        _id: `case-${Date.now()}`,
        caseNumber: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: newCaseTitle,
        description: newCaseDescription,
        status: "new",
        priority: newCasePriority,
        category: newCaseCategory,
        leadInvestigator: user?.name || "Investigator",
        assignedMembers: [user?.name || "Investigator"],
        tags: [newCaseCategory],
        metrics: {
          evidenceCount: 0,
          entityCount: 0,
          timelineCount: 0,
          taskCount: 0,
          riskScore: 50,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCases([mockNewCase, ...cases]);
    } finally {
      setIsCreateModalOpen(false);
      setNewCaseTitle("");
      setNewCaseDescription("");
    }
  };

  const getPriorityStyle = (priority: string) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "under_investigation":
        return "Under Investigation";
      case "active":
        return "Active Operations";
      case "review":
        return "Review Stage";
      case "closed":
        return "Closed & Filed";
      default:
        return "New Intake";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
              Surveillance Stream Active
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: theme.text }}>
            Command Cockpit
          </h1>
          <p className="text-xs mt-0.5 text-zinc-400">
            Agent: <strong style={{ color: theme.text }}>{user?.name}</strong> • Division:{" "}
            <span className="font-semibold text-red-500">{user?.department || "Major Crimes"}</span>{" "}
            • Badge <span className="font-mono" style={{ color: theme.text }}>[{user?.badgeNumber || "INV-0000"}]</span>
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Initiate New Case</span>
        </button>
      </div>

      <div
        className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
          borderColor: "rgba(239, 68, 68, 0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 shrink-0">
            <FiCpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-red-500 uppercase tracking-wider">
                AI Intelligence Stream
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-600/20 text-red-400 font-bold">
                Action Required
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Detected <strong style={{ color: theme.text }}>3 candidate entity links</strong> and <strong style={{ color: theme.text }}>1 timeline anomaly</strong> awaiting detective sign-off in{" "}
              <span className="font-mono text-red-500 font-bold">#CASE-2026-0715</span>.
            </p>
          </div>
        </div>

        <Link
          to="/cases/CASE-2026-0715"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-red-600/20"
        >
          <span>Inspect Case</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              Active Cases
            </span>
            <FiFolder className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black" style={{ color: theme.text }}>{cases.length}</span>
            <span className="text-[10px] text-zinc-400 font-mono">2 High Priority</span>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              Evidence Vault
            </span>
            <FiLayers className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black" style={{ color: theme.text }}>6</span>
            <span className="text-[10px] text-zinc-400 font-mono">Verified Hash</span>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              Mapped Entities
            </span>
            <FiUsers className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black" style={{ color: theme.text }}>8</span>
            <span className="text-[10px] text-zinc-400 font-mono">5 Cross-Linked</span>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              AI Confidence Index
            </span>
            <FiCpu className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-500">92.4%</span>
            <span className="text-[10px] text-zinc-400 font-mono">Calibrated</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCrosshair className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text }}>
              Active Case Operations
            </h2>
          </div>
          <Link
            to="/cases"
            className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <span>Open Kanban Operations</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c) => (
            <div
              key={c._id}
              className="p-5 rounded-2xl border flex flex-col justify-between"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-500">
                      {c.caseNumber}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${getPriorityStyle(
                        c.priority
                      )}`}
                    >
                      {c.priority}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold font-mono" style={{ color: theme.text }}>
                    {getStatusLabel(c.status)}
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1.5" style={{ color: theme.text }}>
                  {c.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {c.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {c.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-mono px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: themeMode === "light" ? "#f1f5f9" : "#18181b",
                        borderColor: themeMode === "light" ? "#e2e8f0" : "#27272a",
                        color: theme.mutedText,
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="pt-3 border-t flex items-center justify-between text-xs font-mono text-zinc-400"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FiLayers className="w-3 h-3 text-red-500" />
                    <strong style={{ color: theme.text }}>{c.metrics?.evidenceCount || 0}</strong> Evidence
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUsers className="w-3 h-3 text-red-500" />
                    <strong style={{ color: theme.text }}>{c.metrics?.entityCount || 0}</strong> Entities
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/cases/${c.caseNumber}`}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md shadow-red-600/20"
                  >
                    <span>Inspect</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                    value={newCaseTitle}
                    onChange={(e) => setNewCaseTitle(e.target.value)}
                    placeholder="e.g. Operation Deep Current"
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
                      value={newCaseCategory}
                      onChange={(e) => setNewCaseCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                      style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
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
                      value={newCasePriority}
                      onChange={(e) => setNewCasePriority(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                      style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
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
                    value={newCaseDescription}
                    onChange={(e) => setNewCaseDescription(e.target.value)}
                    placeholder="Brief description of the suspect, incident location, and objective..."
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
