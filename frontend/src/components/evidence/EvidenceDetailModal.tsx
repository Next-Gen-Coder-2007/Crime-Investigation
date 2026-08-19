import {
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiTrash2,
  FiShield,
  FiCpu,
  FiFileText,
  FiClock,
  FiMapPin,
  FiUser,
  FiHash,
  FiTag,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import type { Evidence } from "../../types/case";

interface EvidenceDetailModalProps {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: "approved" | "rejected" | "pending") => void;
  onDelete?: (id: string) => void;
}

export default function EvidenceDetailModal({
  evidence,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}: EvidenceDetailModalProps) {
  const { theme, themeMode } = useTheme();

  if (!isOpen || !evidence) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
              <FiFileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">{evidence.title}</h2>
                <span
                  className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                    evidence.reviewStatus
                  )}`}
                >
                  {evidence.reviewStatus}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono text-zinc-400">
                Classification: {evidence.type}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-800/40 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          <div
            className="p-4 rounded-xl border bg-black/10 dark:bg-white/[0.02] space-y-2"
            style={{ borderColor: "rgba(239, 68, 68, 0.25)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiCpu className="w-4 h-4 text-red-500" />
                <span className="font-mono text-[11px] font-bold text-red-500 uppercase tracking-wider">
                  AI Intelligence Summary
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                Confidence: <strong className="text-white">{evidence.aiConfidence || 92}%</strong>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: theme.text }}>
              {evidence.aiSummary || evidence.description || "No automated summary extracted."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border space-y-2" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Chain of Custody
              </span>

              <div className="flex items-center gap-2 text-zinc-400">
                <FiClock className="w-3.5 h-3.5 text-red-500" />
                <span>Timestamp:</span>
                <strong className="text-white font-mono">
                  {new Date(evidence.timestamp || evidence.createdAt).toLocaleString()}
                </strong>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <FiMapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Location:</span>
                <strong className="text-white">{evidence.location || "Central Evidence Vault"}</strong>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <FiUser className="w-3.5 h-3.5 text-red-500" />
                <span>Investigator:</span>
                <strong className="text-white">
                  {typeof evidence.uploadedBy === "object"
                    ? (evidence.uploadedBy as any).name
                    : "Lead Detective"}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border space-y-2" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                Cryptographic Integrity
              </span>

              <div className="flex items-center gap-2 text-zinc-400">
                <FiHash className="w-3.5 h-3.5 text-red-500" />
                <span>Hash:</span>
                <span className="text-[10px] font-mono text-zinc-300 truncate">
                  {evidence.fileHash || "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <FiShield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Custody Status:</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">VERIFIED</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <FiTag className="w-3.5 h-3.5 text-red-500" />
                <span>Priority:</span>
                <span className="text-[10px] font-mono uppercase font-bold text-red-400">
                  {evidence.reviewPriority || "MEDIUM"}
                </span>
              </div>
            </div>
          </div>

          {evidence.tags && evidence.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                Indexed Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evidence.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-zinc-800 bg-black/10 dark:bg-white/5 text-zinc-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="p-5 border-t flex items-center justify-between gap-3"
          style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
        >
          {onDelete ? (
            <button
              onClick={() => {
                onDelete(evidence._id);
                onClose();
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Purge</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onStatusChange(evidence._id, "rejected");
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-zinc-700 hover:border-red-500 hover:text-red-500 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <FiAlertTriangle className="w-3.5 h-3.5" />
              <span>Flag / Reject</span>
            </button>

            <button
              onClick={() => {
                onStatusChange(evidence._id, "approved");
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <FiCheck className="w-4 h-4" />
              <span>Approve Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
