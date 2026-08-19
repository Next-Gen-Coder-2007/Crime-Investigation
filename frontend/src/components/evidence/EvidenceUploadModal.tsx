import { useState } from "react";
import {
  FiX,
  FiUploadCloud,
  FiFileText,
  FiVideo,
  FiMic,
  FiImage,
  FiDollarSign,
  FiMapPin,
  FiTag,
  FiCalendar,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onUploadSuccess: (evidenceData: any) => void;
}

const EVIDENCE_CATEGORIES = [
  { id: "document", label: "Document", icon: FiFileText },
  { id: "video", label: "CCTV / Video", icon: FiVideo },
  { id: "interview", label: "Audio / Transcript", icon: FiMic },
  { id: "image", label: "Photo / Forensics", icon: FiImage },
  { id: "financial", label: "Financial / Wire", icon: FiDollarSign },
  { id: "location", label: "Geo Location", icon: FiMapPin },
];

export default function EvidenceUploadModal({
  isOpen,
  onClose,
  caseId,
  onUploadSuccess,
}: EvidenceUploadModalProps) {
  const { theme, themeMode } = useTheme();

  const [type, setType] = useState("document");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString().split("T")[0]);
  const [reviewPriority, setReviewPriority] = useState<"low" | "medium" | "high">("high");
  const [extractedText, setExtractedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newEvidencePayload = {
      caseId,
      title,
      type,
      description,
      location,
      tags,
      timestamp: new Date(timestamp).toISOString(),
      reviewPriority,
      aiSummary: extractedText
        ? `Automated Extraction: ${extractedText.slice(0, 140)}...`
        : `Forensic item cataloged: ${title}`,
      aiConfidence: Math.floor(88 + Math.random() * 10),
    };

    onUploadSuccess(newEvidencePayload);
    setIsSubmitting(false);
    onClose();

    setTitle("");
    setDescription("");
    setLocation("");
    setTagsInput("");
    setExtractedText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
              <FiUploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Ingest Evidence Item</h2>
              <p className="text-[10px] text-zinc-400 font-mono">Chain of Custody Intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-800/40 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
              Evidence Classification *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {EVIDENCE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = type === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setType(cat.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-red-600 border-red-600 text-white font-bold"
                        : "border-zinc-800 bg-black/10 dark:bg-white/[0.02] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-mono uppercase">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
              Evidence Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CCTV Surveillance Footage - Pier 4 Gate A"
              className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
              style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                <FiMapPin className="w-3 h-3 text-red-500" />
                <span>Acquisition Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pier 4 Gate A, Terminal 7"
                className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                <FiCalendar className="w-3 h-3 text-red-500" />
                <span>Date & Time of Recovery</span>
              </label>
              <input
                type="date"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                <FiTag className="w-3 h-3 text-red-500" />
                <span>Index Tags (Comma Separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="CCTV, SUV, Cargo, Pier4"
                className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                Review Priority
              </label>
              <select
                value={reviewPriority}
                onChange={(e) => setReviewPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              >
                <option value="high" className="bg-zinc-900 text-white">High Priority</option>
                <option value="medium" className="bg-zinc-900 text-white">Medium Priority</option>
                <option value="low" className="bg-zinc-900 text-white">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
              Detailed Evidence Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify recovery context, handling officer, and relevant physical observations..."
              className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
              style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">
              Raw Text / Transcript for AI Entity Extraction
            </label>
            <textarea
              rows={3}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Paste raw transcript, OCR dump, or witness audio logs for automated entity linking..."
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <FiUploadCloud className="w-4 h-4" />
              <span>{isSubmitting ? "Ingesting..." : "Ingest & Index"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
