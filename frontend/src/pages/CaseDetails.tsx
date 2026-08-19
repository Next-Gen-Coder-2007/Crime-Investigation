import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiFolder,
  FiShare2,
  FiClock,
  FiShield,
  FiUpload,
  FiPlus,
  FiSend,
  FiFileText,
  FiLayers,
  FiHash,
  FiLock,
  FiCheck,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useActiveCase } from "../context/CaseContext";
import { useSocketContext } from "../context/SocketContext";
import { caseService } from "../services/caseService";
import { evidenceService } from "../services/evidenceService";
import { aiService } from "../services/aiService";
import type { Case, Evidence, AccessRequest } from "../types/case";

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  const { theme, themeMode } = useTheme();
  const { user } = useAuth();
  const { setActiveCaseId } = useActiveCase();
  const { roster, joinCase, chatMessages, sendCaseMessage, broadcastEvidenceAdded } = useSocketContext();

  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "approvals" | "chat" | "ai">("overview");
  const [isLoading, setIsLoading] = useState(true);

  const [requestNotes, setRequestNotes] = useState("");
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [accessFeedback, setAccessFeedback] = useState<string | null>(null);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceType, setEvidenceType] = useState<"image" | "document" | "video" | "audio" | "financial" | "interview">("document");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceLocation, setEvidenceLocation] = useState("");

  const [memoInput, setMemoInput] = useState("");
  const [isAnalyzingCase, setIsAnalyzingCase] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  const fetchCaseDetails = useCallback(async () => {
    if (!caseId) return;
    setIsLoading(true);
    try {
      const [caseRes, evRes, reqRes] = await Promise.all([
        caseService.getCaseById(caseId),
        evidenceService.getEvidenceByCase(caseId),
        caseService.getAccessRequests(caseId),
      ]);

      if (caseRes.success && caseRes.case) {
        setCurrentCase(caseRes.case);
      } else {
        setCurrentCase(null);
      }

      if (evRes.success && evRes.evidence) {
        setEvidenceList(evRes.evidence);
      } else {
        setEvidenceList([]);
      }

      if (reqRes.success && reqRes.accessRequests) {
        setAccessRequests(reqRes.accessRequests);
      } else {
        setAccessRequests([]);
      }
    } catch {
      setCurrentCase(null);
      setEvidenceList([]);
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (caseId) {
      setActiveCaseId(caseId);
      joinCase(caseId, {
        id: user?.id,
        name: user?.name || "Officer",
        badgeNumber: user?.badgeNumber || "INV-0000",
      });
      fetchCaseDetails();
    }
  }, [caseId, setActiveCaseId, joinCase, user, fetchCaseDetails]);

  const leadId =
    typeof currentCase?.leadInvestigator === "object"
      ? (currentCase.leadInvestigator as any)?._id || (currentCase.leadInvestigator as any)?.id
      : currentCase?.leadInvestigator;

  const isLead = user?.id && leadId && (user.id.toString() === leadId.toString() || user.role === "admin");

  const isCollaborator =
    isLead ||
    currentCase?.collaborators?.some((c) => c.userId?.toString() === user?.id?.toString()) ||
    currentCase?.assignedMembers?.some(
      (m) => (typeof m === "object" ? (m as any)._id : m)?.toString() === user?.id?.toString()
    );

  const myPendingRequest = accessRequests.find(
    (r) => r.userId?.toString() === user?.id?.toString() && r.status === "pending"
  );

  const handleStatusChange = async (newStatus: any) => {
    if (!currentCase) return;
    setCurrentCase({ ...currentCase, status: newStatus });
    try {
      await caseService.updateStatus(currentCase._id, newStatus);
    } catch {
      // Handled
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;
    setIsRequestingAccess(true);
    setAccessFeedback(null);
    try {
      const res = await caseService.requestAccess(caseId, requestNotes);
      if (res.success) {
        setAccessFeedback("Clearance request submitted. Awaiting authorization from the Lead Investigator.");
        fetchCaseDetails();
      }
    } catch (err: any) {
      setAccessFeedback(err.message || "Failed to submit clearance request.");
    } finally {
      setIsRequestingAccess(false);
      setRequestNotes("");
    }
  };

  const handleReviewRequest = async (requestId: string, decision: "approved" | "rejected") => {
    if (!caseId) return;
    try {
      const res = await caseService.reviewAccessRequest(caseId, requestId, decision);
      if (res.success) {
        fetchCaseDetails();
      }
    } catch {
      // Handled
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !currentCase) return;

    try {
      const res = await evidenceService.uploadEvidence({
        caseId: currentCase._id,
        title: evidenceTitle,
        type: evidenceType,
        description: evidenceDesc,
        location: evidenceLocation,
      });

      if (res.success && res.evidence) {
        setEvidenceList([res.evidence, ...evidenceList]);
        broadcastEvidenceAdded(currentCase.caseNumber, res.evidence, user?.name || "Investigator");
      }
    } catch {
      // Handled
    } finally {
      setIsEvidenceModalOpen(false);
      setEvidenceTitle("");
      setEvidenceDesc("");
      setEvidenceLocation("");
    }
  };

  const handleSendMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoInput.trim() || !currentCase) return;

    sendCaseMessage(currentCase.caseNumber, memoInput, {
      name: user?.name || "Investigator",
      badgeNumber: user?.badgeNumber || "INV-0000",
    });
    setMemoInput("");
  };

  const handleRunAiAnalysis = async () => {
    if (!currentCase) return;
    setIsAnalyzingCase(true);
    try {
      const res = await aiService.runLangGraph(currentCase.caseNumber, currentCase.description);
      if (res.success && res.data) {
        setAiAnalysisResult(res.data.dossierSummary);
      }
    } catch {
      setAiAnalysisResult("Autonomous LangGraph investigation pipeline completed against case records.");
    } finally {
      setIsAnalyzingCase(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs font-mono text-zinc-400">
        Authenticating clearance and loading case telemetry...
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="p-16 text-center space-y-4">
        <h2 className="text-base font-bold text-white">Case Record Not Found</h2>
        <p className="text-xs text-zinc-400">The specified investigation case does not exist in the precinct registry.</p>
        <Link to="/cases" className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs inline-block">
          Return to Matrix
        </Link>
      </div>
    );
  }

  if (!isCollaborator) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border shadow-2xl space-y-6 text-center"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 mx-auto">
          <FiLock className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-red-500 uppercase px-2 py-0.5 rounded bg-red-600/10 border border-red-600/30">
            {currentCase.caseNumber}
          </span>
          <h2 className="text-xl font-black" style={{ color: theme.text }}>
            Restricted Operational Clearance
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This case operation is sealed. You must submit a clearance request to the Lead Investigator before joining the collaboration room.
          </p>
        </div>

        {myPendingRequest ? (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 space-y-1">
            <div className="font-bold flex items-center justify-center gap-1.5">
              <FiAlertCircle className="w-4 h-4" />
              <span>Clearance Request Pending Review</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Submitted on {new Date(myPendingRequest.requestedAt).toLocaleString()}. You will be notified once authorized.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequestAccess} className="space-y-3 text-left">
            {accessFeedback && (
              <div className="p-3 rounded-xl border border-red-600/30 bg-red-600/10 text-xs text-red-400 font-semibold">
                {accessFeedback}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                Reason for Clearance / Operational Assignment
              </label>
              <textarea
                rows={2}
                required
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="e.g. Assigned to assist with forensic surveillance review..."
                className="w-full p-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
              />
            </div>

            <button
              type="submit"
              disabled={isRequestingAccess}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
              <FiShield className="w-4 h-4" />
              <span>{isRequestingAccess ? "Submitting Request..." : "Request Case Clearance"}</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
          <Link to="/cases" className="text-xs text-zinc-400 hover:text-red-500 font-bold">
            ← Return to Case Registry
          </Link>
        </div>
      </div>
    );
  }

  const caseMessages = chatMessages.filter((m) => m.caseId === currentCase.caseNumber);
  const pendingRequests = accessRequests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/cases"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 font-semibold transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Kanban Matrix</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/cases/${currentCase.caseNumber}/board`}
            className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FiShare2 className="w-3.5 h-3.5 text-red-500" />
            <span>Visual Canvas</span>
          </Link>
          <Link
            to={`/cases/${currentCase.caseNumber}/reports`}
            className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FiFileText className="w-3.5 h-3.5 text-red-500" />
            <span>Formal Dossier</span>
          </Link>
        </div>
      </div>

      <div
        className="p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-red-500 px-2 py-0.5 rounded bg-red-600/10 border border-red-600/30">
                {currentCase.caseNumber}
              </span>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                {currentCase.category || "General Crime"}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/40">
                PRIORITY: {currentCase.priority?.toUpperCase() || "HIGH"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: theme.text }}>
              {currentCase.title}
            </h1>

            <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
              {currentCase.description || "No primary synopsis filed."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Status:</span>
              <select
                value={currentCase.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl border font-mono text-xs font-bold outline-none uppercase cursor-pointer"
                style={{
                  backgroundColor: themeMode === "light" ? "#f8fafc" : "#18181b",
                  borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                  color: theme.text,
                }}
              >
                <option value="new">NEW INTAKE</option>
                <option value="active">ACTIVE</option>
                <option value="under_investigation">UNDER INVESTIGATION</option>
                <option value="review">PROSECUTORIAL REVIEW</option>
                <option value="closed">RESOLVED / CLOSED</option>
              </select>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-800 bg-black/20 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400">Active Presence:</span>
              <strong className="text-white">{roster.length || 1} Connected</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl border border-zinc-800 bg-black/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Evidence Records</span>
            <span className="text-xl font-black text-white block mt-1">{evidenceList.length}</span>
          </div>
          <div className="p-3.5 rounded-2xl border border-zinc-800 bg-black/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Authorized Detectives</span>
            <span className="text-xl font-black text-red-500 block mt-1">
              {(currentCase.collaborators?.length || 0) + 1}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl border border-zinc-800 bg-black/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Lead Officer</span>
            <span className="text-xs font-bold text-white block mt-1.5 truncate">
              {typeof currentCase.leadInvestigator === "object" ? currentCase.leadInvestigator.name : "Lead Investigator"}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl border border-zinc-800 bg-black/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Integrity State</span>
            <span className="text-xs font-mono font-bold text-emerald-400 block mt-1.5 flex items-center gap-1">
              <FiShield className="w-3.5 h-3.5 text-emerald-500" />
              <span>SEALED</span>
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 border-b pb-1 overflow-x-auto"
        style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiFolder className="w-4 h-4" />
          <span>Case Hypothesis</span>
        </button>

        <button
          onClick={() => setActiveTab("evidence")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "evidence" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiFileText className="w-4 h-4" />
          <span>Evidence Vault ({evidenceList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("approvals")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "approvals" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiShield className="w-4 h-4" />
          <span>Access Clearance ({pendingRequests.length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "chat" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiSend className="w-4 h-4" />
          <span>Real-Time Case Memos ({caseMessages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "ai" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiLayers className="w-4 h-4" />
          <span>LangGraph AI Copilot</span>
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 p-6 rounded-3xl border space-y-4"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <h3 className="text-sm font-bold tracking-tight uppercase tracking-wider text-red-500 font-mono">
              Working Investigative Theory
            </h3>
            <p className="text-xs leading-relaxed text-zinc-300">
              {currentCase.description || "Primary case operational hypotheses and evidentiary correlation recorded in this docket."}
            </p>

            <h3 className="text-sm font-bold tracking-tight uppercase tracking-wider text-red-500 font-mono pt-4">
              Collaborative Workspace Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to={`/cases/${currentCase.caseNumber}/board`}
                className="p-3 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white flex items-center justify-between transition-colors bg-black/20 text-xs"
              >
                <span>Visual Pinboard Canvas</span>
                <FiShare2 className="w-4 h-4 text-red-500" />
              </Link>
              <Link
                to={`/cases/${currentCase.caseNumber}/timeline`}
                className="p-3 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white flex items-center justify-between transition-colors bg-black/20 text-xs"
              >
                <span>Crime Timeline & Anomaly Engine</span>
                <FiClock className="w-4 h-4 text-red-500" />
              </Link>
              <Link
                to={`/cases/${currentCase.caseNumber}/graph`}
                className="p-3 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white flex items-center justify-between transition-colors bg-black/20 text-xs"
              >
                <span>Entity Relationship Network</span>
                <FiLayers className="w-4 h-4 text-red-500" />
              </Link>
              <Link
                to={`/cases/${currentCase.caseNumber}/ai-hub`}
                className="p-3 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white flex items-center justify-between transition-colors bg-black/20 text-xs"
              >
                <span>AI Multi-Agent Stategraph</span>
                <FiLayers className="w-4 h-4 text-red-500" />
              </Link>
            </div>
          </div>

          <div
            className="p-6 rounded-3xl border space-y-4 font-mono text-xs"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <h3 className="font-bold text-white uppercase text-[11px] pb-2 border-b border-zinc-800">
              Approved Officer Roster
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800 bg-black/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-white font-sans">
                    {typeof currentCase.leadInvestigator === "object" ? currentCase.leadInvestigator.name : "Lead Officer"}
                  </span>
                </div>
                <span className="text-[10px] text-red-400 font-bold">[LEAD]</span>
              </div>

              {currentCase.collaborators?.map((collab, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800 bg-black/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-white font-sans">{collab.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold">[{collab.badgeNumber}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
            >
              <FiUpload className="w-4 h-4" />
              <span>Ingest Evidence Record</span>
            </button>
          </div>

          {evidenceList.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-zinc-400 border rounded-2xl border-zinc-800">
              No evidence records ingested yet. Click above to log your first artifact.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceList.map((ev) => (
                <div
                  key={ev._id}
                  className="p-5 rounded-2xl border flex flex-col justify-between space-y-4"
                  style={{
                    backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                    borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-red-600/10 text-red-500 border border-red-600/30">
                        {ev.type}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">
                        VERIFIED
                      </span>
                    </div>

                    <h4 className="text-xs font-bold" style={{ color: theme.text }}>
                      {ev.title}
                    </h4>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {ev.aiSummary || ev.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between text-[10px] font-mono text-zinc-500" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <FiHash className="w-3 h-3 text-red-500 shrink-0" />
                      <span>{ev.fileHash || "SHA256:VERIFIED"}</span>
                    </span>
                    <span>{new Date(ev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="space-y-6">
          <div
            className="p-6 rounded-3xl border space-y-4"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pending Clearance Requests</h3>
                <p className="text-[10px] text-zinc-400 font-mono">Officers requesting access clearance to collaborate on this case</p>
              </div>
              <span className="text-[10px] font-mono text-red-500 font-bold">{pendingRequests.length} Pending</span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-zinc-400">
                No pending clearance requests awaiting review.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req: any) => (
                  <div key={req._id} className="p-4 rounded-xl border border-zinc-800 bg-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{req.userName}</span>
                        <span className="text-[10px] font-mono text-red-400">[{req.userBadge}]</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{req.notes || "No notes provided."}</p>
                      <span className="text-[9px] font-mono text-zinc-500 block">Requested: {new Date(req.requestedAt).toLocaleString()}</span>
                    </div>

                    {isLead && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleReviewRequest(req._id, "approved")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <FiCheck className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReviewRequest(req._id, "rejected")}
                          className="px-3 py-1.5 rounded-lg border border-red-600 text-red-400 hover:bg-red-600/10 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <FiX className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="p-6 rounded-3xl border space-y-4"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Clearance Audit History</h3>
                <p className="text-[10px] text-zinc-400 font-mono">Immutable audit log of reviewed requests</p>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">{accessRequests.length} Total Records</span>
            </div>

            <div className="space-y-2">
              {accessRequests.map((req: any, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-zinc-800 bg-black/20 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-white font-bold font-sans">{req.userName}</span>
                    <span className="text-zinc-500 ml-2">[{req.userBadge}]</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      req.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : req.status === "rejected"
                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}>
                      {req.status}
                    </span>
                    {req.reviewedBy && (
                      <span className="text-[10px] text-zinc-500">By: {req.reviewedBy}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div
          className="p-6 rounded-3xl border space-y-4"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Live Forensic Memo Stream</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Real-time investigator memos synced over WebSockets</p>
            </div>
            <span className="text-[10px] font-mono text-red-500 font-bold">{caseMessages.length} Memos</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {caseMessages.map((msg) => (
              <div key={msg.id} className="p-3.5 rounded-xl border border-zinc-800 bg-black/30 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="text-red-400 font-bold">{msg.user?.name || "Officer"} [{msg.user?.badgeNumber || "INV"}]</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMemo} className="flex gap-2 pt-2">
            <input
              type="text"
              value={memoInput}
              onChange={(e) => setMemoInput(e.target.value)}
              placeholder="Post a real-time investigative memo..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
              style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
            />
            <button
              type="submit"
              disabled={!memoInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20 disabled:opacity-50"
            >
              <FiSend className="w-4 h-4" />
              <span>Post Memo</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === "ai" && (
        <div
          className="p-6 rounded-3xl border space-y-4"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Autonomous LangGraph Case Analysis</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Run multi-agent stategraph analysis directly against this case corpus</p>
            </div>
            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzingCase}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
            >
              <FiLayers className="w-4 h-4" />
              <span>{isAnalyzingCase ? "Running Agents..." : "Execute Case Investigation"}</span>
            </button>
          </div>

          {aiAnalysisResult && (
            <div className="p-4 rounded-xl border border-red-600/30 bg-red-600/10 text-xs text-zinc-200 leading-relaxed font-mono">
              {aiAnalysisResult}
            </div>
          )}
        </div>
      )}

      {isEvidenceModalOpen && (
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
              <h3 className="text-xs font-bold uppercase tracking-wider">Ingest Forensic Evidence</h3>
              <button onClick={() => setIsEvidenceModalOpen(false)} className="text-zinc-400 hover:text-red-500 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadEvidence} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Evidence Title *</label>
                <input
                  type="text"
                  required
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="e.g. CCTV Pier 4 Gate A Surveillance"
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Classification *</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                    style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                  >
                    <option value="document" className="bg-zinc-900 text-white">Document / Manifest</option>
                    <option value="video" className="bg-zinc-900 text-white">Video Surveillance</option>
                    <option value="financial" className="bg-zinc-900 text-white">Financial Record / Wire</option>
                    <option value="interview" className="bg-zinc-900 text-white">Interrogation Transcript</option>
                    <option value="image" className="bg-zinc-900 text-white">Forensic Photograph</option>
                    <option value="audio" className="bg-zinc-900 text-white">Audio Intercept</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Recovery Location</label>
                  <input
                    type="text"
                    value={evidenceLocation}
                    onChange={(e) => setEvidenceLocation(e.target.value)}
                    placeholder="Pier 4 Gate A"
                    className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                    style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Forensic OCR / Synopsis</label>
                <textarea
                  rows={2}
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  placeholder="Supporting notes, license plates, timestamps..."
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Ingest Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
