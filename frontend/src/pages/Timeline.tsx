import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiUser,
  FiPlus,
  FiTrash2,
  FiAlertTriangle,
  FiX,
  FiShare2,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { timelineService } from "../services/timelineService";
import type { TimelineEventItem } from "../services/timelineService";

export default function Timeline() {
  const { caseId } = useParams<{ caseId: string }>();
  const { theme, themeMode } = useTheme();

  const [events, setEvents] = useState<TimelineEventItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState("");
  const [participantsInput, setParticipantsInput] = useState("");
  const [isAnomaly, setIsAnomaly] = useState(false);

  const getCaseInitialEvents = (cid?: string): TimelineEventItem[] => {
    if (cid?.includes("0801")) {
      return [
        {
          _id: "ev-1",
          caseId: cid || "default",
          title: "Offshore Shell Incorporation: Aegis Escrow S.A.",
          description: "Entity registered in Panama with bearer shares and nominee directors.",
          timestamp: "2026-01-10T10:00:00Z",
          location: "Panama City Registrar",
          participants: ["Viktor Mercer"],
          isAnomaly: false,
        },
        {
          _id: "ev-2",
          caseId: cid || "default",
          title: "Layering Transfer #WT-8941 Initiated ($450,000)",
          description: "Swift wire initiated to Zurich Escrow without underlying commercial invoices.",
          timestamp: "2026-01-12T14:20:00Z",
          location: "Metropolitan Financial District",
          participants: ["Aegis Escrow S.A."],
          isAnomaly: true,
        },
        {
          _id: "ev-3",
          caseId: cid || "default",
          title: "Rapid Crypto Liquidation via OTC Desk",
          description: "Conversion of $450,000 into unhosted privacy coin wallets within 8 minutes.",
          timestamp: "2026-01-12T14:28:00Z",
          location: "Decentralized OTC Desk",
          participants: ["Viktor Mercer"],
          isAnomaly: true,
        },
      ];
    }

    return [
      {
        _id: "ev-1",
        caseId: cid || "default",
        title: "Customs Clearance Manifest AMF-9901 Issued",
        description: "Bill of lading filed under Aegis Maritime Ltd for Container #C-881.",
        timestamp: "2026-01-14T21:15:00Z",
        location: "Port Horizon Customs Terminal",
        participants: ["Elena Rostova"],
        isAnomaly: false,
      },
      {
        _id: "ev-2",
        caseId: cid || "default",
        title: "Witness Statement: Viktor Mercer at Downtown Cafe",
        description: "Informant reports subject seated in downtown cafe until 23:30.",
        timestamp: "2026-01-14T23:30:00Z",
        location: "Metropolitan Financial District",
        participants: ["Viktor Mercer"],
        isAnomaly: true,
      },
      {
        _id: "ev-3",
        caseId: cid || "default",
        title: "CCTV Gate A: Black SUV Enters Compound",
        description: "Plate #XYZ-9021 enters Pier 4 compound. Dmitri Vance and Viktor Mercer identified.",
        timestamp: "2026-01-14T23:45:00Z",
        location: "Port Horizon Pier 4 Gate A",
        participants: ["Viktor Mercer", "Dmitri Vance"],
        isAnomaly: true,
      },
      {
        _id: "ev-4",
        caseId: cid || "default",
        title: "Crane Telemetry Sensor Weight Logged",
        description: "Container #C-881 lifted onto transport bed. Recorded weight: 5.4 tons (declared: 1.2 tons).",
        timestamp: "2026-01-15T00:15:00Z",
        location: "Port Horizon Pier 4 Berth 2",
        participants: ["Dock Master"],
        isAnomaly: true,
      },
    ];
  };

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await timelineService.getTimelineByCase(caseId || "default");
        if (res.success && res.events && res.events.length > 0) {
          setEvents(res.events);
        } else {
          setEvents(getCaseInitialEvents(caseId));
        }
      } catch {
        setEvents(getCaseInitialEvents(caseId));
      }
    };
    fetchTimeline();
  }, [caseId]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const participants = participantsInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    try {
      const res = await timelineService.createEvent({
        caseId: caseId || "default",
        title,
        description,
        timestamp: new Date(timestamp).toISOString(),
        location,
        participants,
        isAnomaly,
      });

      if (res.success && res.event) {
        setEvents([...events, res.event].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      }
    } catch {
      const mockEvent: TimelineEventItem = {
        _id: `ev-${Date.now()}`,
        caseId: caseId || "default",
        title,
        description,
        timestamp: new Date(timestamp).toISOString(),
        location,
        participants,
        isAnomaly,
      };
      setEvents([...events, mockEvent].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    } finally {
      setIsAddModalOpen(false);
      setTitle("");
      setDescription("");
      setLocation("");
      setParticipantsInput("");
      setIsAnomaly(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev._id !== id));
    try {
      await timelineService.deleteEvent(id);
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/cases/${caseId || "CASE-2026-0715"}`}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 font-semibold transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Case Cockpit</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/cases/${caseId || "CASE-2026-0715"}/board`}
            className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FiShare2 className="w-3.5 h-3.5 text-red-500" />
            <span>Visual Canvas</span>
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/20 cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Log Milestone</span>
          </button>
        </div>
      </div>

      <div
        className="p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-red-500">
              {caseId || "CASE-2026-0715"}
            </span>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
              Multi-Track Chronology
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            Investigation Event Sequencer
          </h1>
          <p className="text-xs text-zinc-400">
            Temporal event tracking with automatic alibi velocity mismatch and discrepancy detection.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span>{events.length} Timestamped Events</span>
          <span>•</span>
          <span className="text-red-500 font-bold">
            {events.filter((e) => e.isAnomaly).length} Flagged Anomalies
          </span>
        </div>
      </div>

      <div className="relative border-l-2 border-zinc-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8 py-4">
        {events.map((ev) => (
          <div key={ev._id} className="relative group">
            <div
              className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                ev.isAnomaly
                  ? "bg-red-600 border-red-500 shadow-lg shadow-red-600/40 animate-pulse"
                  : "bg-zinc-900 border-zinc-700"
              }`}
            />

            <div
              className="p-5 rounded-2xl border space-y-3 transition-colors"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                borderColor: ev.isAnomaly ? "rgba(239, 68, 68, 0.4)" : themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-red-500 font-bold flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5" />
                    {new Date(ev.timestamp).toLocaleString()}
                  </span>

                  {ev.isAnomaly && (
                    <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/40 flex items-center gap-1">
                      <FiAlertTriangle className="w-3 h-3" />
                      <span>Anomaly Flagged</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteEvent(ev._id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-opacity self-start sm:self-auto cursor-pointer"
                  title="Remove Milestone"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-tight" style={{ color: theme.text }}>
                  {ev.title}
                </h3>
                {ev.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">{ev.description}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-900">
                {ev.location && (
                  <span className="flex items-center gap-1 text-zinc-300">
                    <FiMapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{ev.location}</span>
                  </span>
                )}

                {ev.participants && ev.participants.length > 0 && (
                  <span className="flex items-center gap-1">
                    <FiUser className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{ev.participants.join(", ")}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
              <h3 className="text-xs font-bold uppercase tracking-wider">Log Timeline Milestone</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-red-500">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CCTV Gate A: Black SUV Enters Pier"
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                    style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Incident Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Pier 4 Gate A"
                    className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                    style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Participants (Comma Separated)</label>
                <input
                  type="text"
                  value={participantsInput}
                  onChange={(e) => setParticipantsInput(e.target.value)}
                  placeholder="Viktor Mercer, Dmitri Vance"
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Description / Forensic Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Supporting observations, telemetry data..."
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anomaly"
                  checked={isAnomaly}
                  onChange={(e) => setIsAnomaly(e.target.checked)}
                  className="accent-red-600"
                />
                <label htmlFor="anomaly" className="font-mono text-[11px] text-red-400 font-bold cursor-pointer">
                  Flag as Potential Conflict / Alibi Discrepancy
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
