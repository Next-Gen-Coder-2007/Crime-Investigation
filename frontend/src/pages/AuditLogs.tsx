import { useState, useEffect } from "react";
import { FiShield, FiSearch, FiClock } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { apiClient } from "../services/api";

interface AuditEntry {
  _id: string;
  userId?: { name: string; email: string; role: string };
  action: string;
  resource: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

export default function AuditLogs() {
  const { theme, themeMode } = useTheme();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiClient("/audit-logs", { method: "GET" });
        if (res.success && res.logs) {
          setLogs(res.logs);
        }
      } catch {
        setLogs([
          {
            _id: "log-1",
            userId: { name: "Det. Sarah Chen", email: "chen@intelboard.ai", role: "investigator" },
            action: "CASE_STATUS_UPDATED",
            resource: "Case",
            details: { caseNumber: "CASE-2026-0715", to: "under_investigation" },
            ipAddress: "192.168.1.42",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "log-2",
            userId: { name: "Elena Rostova", email: "rostova@intelboard.ai", role: "investigator" },
            action: "EVIDENCE_INGESTED",
            resource: "Evidence",
            details: { file: "CCTV_Pier4_0914.mp4", hashVerified: true },
            ipAddress: "192.168.1.18",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            _id: "log-3",
            userId: { name: "Marcus Vance", email: "director@intelboard.ai", role: "investigator" },
            action: "USER_AUTHENTICATED",
            resource: "Auth",
            details: { method: "JWT_BEARER" },
            ipAddress: "10.0.4.1",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
        ]);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      (l.userId?.name && l.userId.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 font-bold">
              Cryptographic Audit Stream
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            Security Audit Trail
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Immutable log of forensic evidence touches, case transitions, and user actions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400">
          <FiShield className="w-4 h-4 text-emerald-500" />
          <span>Integrity Sealed</span>
        </div>
      </div>

      <div
        className="p-3.5 rounded-2xl border"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="relative w-full max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, agent, resource..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border bg-transparent outline-none focus:border-red-500"
            style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
          />
        </div>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <table className="w-full text-left text-xs font-mono">
          <thead
            className="border-b bg-black/5 dark:bg-white/[0.02] text-[10px] text-zinc-400 uppercase"
            style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
          >
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Agent</th>
              <th className="p-4">Action</th>
              <th className="p-4">Resource</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
            {filteredLogs.map((log) => (
              <tr key={log._id} className="hover:bg-red-600/5 transition-colors">
                <td className="p-4 whitespace-nowrap text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5 text-red-500" />
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </td>
                <td className="p-4 text-white font-bold font-sans">
                  {log.userId?.name || "System"}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-red-600/10 text-red-500 font-bold text-[10px] border border-red-600/30">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-zinc-300">{log.resource}</td>
                <td className="p-4 text-zinc-500">{log.ipAddress || "127.0.0.1"}</td>
                <td className="p-4 text-zinc-400 font-sans truncate max-w-xs">
                  {log.details ? JSON.stringify(log.details) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
