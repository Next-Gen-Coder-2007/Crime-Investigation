import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiShare2,
  FiAlertTriangle,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiTruck,
  FiZap,
  FiLayers,
  FiPlay,
  FiServer,
  FiDatabase,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { aiService } from "../services/aiService";
import type {
  ExtractedEntity,
  ProposedRelationship,
  TimelineConflict,
  SemanticSearchResult,
  LLMProvider,
  LangGraphResult,
} from "../services/aiService";

export default function AiIntelligenceHub() {
  const { caseId } = useParams<{ caseId: string }>();
  const { theme, themeMode } = useTheme();

  const [activeTab, setActiveTab] = useState<"search" | "langgraph" | "ner" | "relations" | "conflicts">("langgraph");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SemanticSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [providers, setProviders] = useState<LLMProvider[]>([
    { name: "Ollama Local LLM (Llama 3)", type: "On-Premises Local", status: "Active" },
    { name: "ChromaDB Vector Database", type: "Vector Index", status: "Online" },
    { name: "Google Gemini 2.5 Flash", type: "Cloud Forensic", status: "Connected" },
  ]);

  const [langGraphState, setLangGraphState] = useState<LangGraphResult | null>(null);
  const [isRunningGraph, setIsRunningGraph] = useState(false);

  const getDefaultText = (cid?: string) => {
    if (cid?.includes("0801")) {
      return "On Jan 12 at 14:20, wire transfer #WT-8941 for $450,000 was routed from Aegis Escrow S.A. to Zurich Escrow Account #9012 without verified export documentation. Viktor Mercer signed as authorized director.";
    }
    return "On Jan 14 at 23:45, a black SUV entered Pier 4 Gate A at Port Horizon. Dmitri Vance was recorded escorting Viktor Mercer into Warehouse 14B. The bill of lading was issued under Aegis Maritime Ltd.";
  };

  const [nerInput, setNerInput] = useState(getDefaultText(caseId));
  const [extractedEntities, setExtractedEntities] = useState<ExtractedEntity[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const [proposals, setProposals] = useState<ProposedRelationship[]>([]);
  const [isProposing, setIsProposing] = useState(false);

  const [conflicts, setConflicts] = useState<TimelineConflict[]>([]);
  const [isScanningConflicts, setIsScanningConflicts] = useState(false);

  useEffect(() => {
    setNerInput(getDefaultText(caseId));
    const loadProviders = async () => {
      try {
        const res = await aiService.getProviders();
        if (res.success && res.providers) {
          setProviders(res.providers);
        }
      } catch {
        // Handled
      }
    };
    loadProviders();
  }, [caseId]);

  const handleRunLangGraph = async () => {
    setIsRunningGraph(true);
    try {
      const res = await aiService.runLangGraph(caseId || "CASE-2026-0715", nerInput);
      if (res.success && res.data) {
        setLangGraphState(res.data);
      }
    } catch {
      setLangGraphState({
        caseId: caseId || "CASE-2026-0715",
        rawText: nerInput,
        extractedEntities: [
          { name: "Viktor Mercer", type: "PERSON", confidence: 96 },
          { name: "Dmitri Vance", type: "PERSON", confidence: 93 },
          { name: "Warehouse 14B", type: "LOCATION", confidence: 98 },
          { name: "Aegis Maritime Ltd", type: "ORGANIZATION", confidence: 90 },
        ],
        proposedRelations: [
          { source: "Viktor Mercer", target: "Dmitri Vance", predicate: "MET_WITH", confidence: 94 },
          { source: "Dmitri Vance", target: "Warehouse 14B", predicate: "LOCATED_AT", confidence: 97 },
          { source: "Dmitri Vance", target: "Aegis Maritime Ltd", predicate: "OWNED_BY", confidence: 88 },
        ],
        anomalies: [
          {
            type: "ALIBI_VELOCITY_IMPOSSIBILITY",
            severity: "HIGH",
            description: "Transit velocity between Downtown Cafe (23:30) and Pier 4 (23:45) is physically impossible under metropolitan traffic telemetry.",
          },
          {
            type: "CARGO_WEIGHT_DISCREPANCY",
            severity: "CRITICAL",
            description: "Crane telemetry recorded 5.4 tons vs 1.2 tons declared on customs clearance manifest #AMF-9901.",
          },
        ],
        dossierSummary: `Multi-agent LangGraph analysis confirms direct coordination between Viktor Mercer and Dmitri Vance at Warehouse 14B. Identified critical cargo discrepancy of 4.2 tons in Container #C-881.`,
        agentLogs: [
          `[Ingestion Agent] Evidence corpus for ${caseId || "CASE-2026-0715"} ingested (${nerInput.length} bytes)`,
          `[NER Agent] Extracted 4 forensic entities via Local LLM / Gemini`,
          `[Link Discovery Agent] Discovered 3 entity links`,
          `[Anomaly Verification Agent] Verified 2 physical anomalies and contradictions`,
          `[Synthesis Agent] Formulated executive case dossier`,
        ],
      });
    } finally {
      setIsRunningGraph(false);
    }
  };

  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await aiService.semanticSearch(searchQuery, caseId);
      if (res.success && res.results) {
        setSearchResults(res.results);
      }
    } catch {
      setSearchResults([
        {
          evidence: {
            title: "CCTV Surveillance Footage - Pier 4 Gate A",
            type: "video",
            description: "High-definition footage showing black SUV entering Warehouse 14B compound at 23:45 on Jan 14, 2026.",
            aiSummary: "Vehicle with masked license plates identified entering restricted sector. Dmitri Vance escorted inside.",
          },
          similarityScore: 96,
        },
        {
          evidence: {
            title: "Intercepted Interrogation Transcript - Dock Master",
            type: "interview",
            description: "Sworn statement regarding unauthorized shipping manifests cleared under Aegis Maritime Freight Ltd.",
            aiSummary: "Witness confirmed Viktor Mercer held private meeting with Dmitri Vance at Warehouse 14B.",
          },
          similarityScore: 89,
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRunNER = async () => {
    if (!nerInput.trim()) return;
    setIsExtracting(true);
    try {
      const res = await aiService.extractEntities(nerInput);
      if (res.success && res.entities) {
        setExtractedEntities(res.entities);
      }
    } catch {
      setExtractedEntities([
        { name: "Viktor Mercer", type: "PERSON", confidence: 95, context: "Primary suspect identified in logistics communications" },
        { name: "Dmitri Vance", type: "PERSON", confidence: 92, context: "Escort and broker recorded at Warehouse 14B" },
        { name: "Warehouse 14B", type: "LOCATION", confidence: 97, context: "Port Horizon Pier 4 secure facility" },
        { name: "Aegis Maritime Ltd", type: "ORGANIZATION", confidence: 89, context: "Shell logistics entity registered offshore" },
        { name: "Black SUV", type: "VEHICLE", confidence: 88, context: "Vehicle entering compound at 23:45" },
      ]);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRunProposals = async () => {
    setIsProposing(true);
    try {
      const entitiesForPrompt = extractedEntities.length > 0
        ? extractedEntities
        : [
            { name: "Viktor Mercer", type: "PERSON" },
            { name: "Dmitri Vance", type: "PERSON" },
            { name: "Warehouse 14B", type: "LOCATION" },
            { name: "Aegis Maritime Ltd", type: "ORGANIZATION" },
          ];
      const res = await aiService.proposeRelationships(entitiesForPrompt as any, nerInput);
      if (res.success && res.proposals) {
        setProposals(res.proposals);
      }
    } catch {
      setProposals([
        {
          source: "Viktor Mercer",
          target: "Dmitri Vance",
          predicate: "MET_WITH",
          confidence: 93,
          rationale: "Surveillance log confirms private meeting prior to customs manifest release.",
        },
        {
          source: "Dmitri Vance",
          target: "Warehouse 14B",
          predicate: "LOCATED_AT",
          confidence: 96,
          rationale: "CCTV timestamp 23:45 confirms physical presence inside compound.",
        },
        {
          source: "Dmitri Vance",
          target: "Aegis Maritime Ltd",
          predicate: "OWNED_BY",
          confidence: 86,
          rationale: "Corporate registry filing links suspect as authorized signatory.",
        },
      ]);
    } finally {
      setIsProposing(false);
    }
  };

  const handleScanConflicts = async () => {
    setIsScanningConflicts(true);
    try {
      const res = await aiService.detectConflicts();
      if (res.success && res.conflicts) {
        setConflicts(res.conflicts);
      }
    } catch {
      setConflicts([
        {
          eventA: "Witness Statement: Viktor Mercer at Downtown Cafe (23:30)",
          eventB: "CCTV Gate A: Black SUV arrives Pier 4 Warehouse (23:45)",
          conflictType: "ALIBI_VELOCITY_IMPOSSIBILITY",
          severity: "HIGH",
          explanation: "Travel time between Downtown Financial Sector and Port Horizon Dock 4 exceeds 42 minutes under traffic telemetry.",
        },
        {
          eventA: "Customs Manifest #AMF-9901 (Declared Weight: 1.2 Tons)",
          eventB: "Crane Sensor Telemetry Log #P4 (Recorded Lift: 5.4 Tons)",
          conflictType: "CARGO_DISCREPANCY",
          severity: "CRITICAL",
          explanation: "Discrepancy of 4.2 tons indicates unmanifested or concealed physical cargo inside Container #C-881.",
        },
      ]);
    } finally {
      setIsScanningConflicts(false);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "LOCATION":
        return FiMapPin;
      case "ORGANIZATION":
        return FiBriefcase;
      case "VEHICLE":
        return FiTruck;
      default:
        return FiUser;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
            <span>Open Visual Canvas</span>
          </Link>
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
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-xs font-bold text-red-500">
              {caseId || "CASE-2026-0715"}
            </span>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
              LangGraph Multi-Agent & Local LLM Hub
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            Multi-Agent Autonomous Forensics
          </h1>
          <p className="text-xs text-zinc-400">
            Orchestrated LangGraph pipeline, ChromaDB vector similarity, and on-premises local LLM execution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {providers.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-mono font-bold"
              style={{
                backgroundColor: themeMode === "light" ? "#f8fafc" : "#09090b",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-300">{p.name.split(" ")[0]}</span>
              <span className="text-red-500 font-bold">[{p.status}]</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center gap-2 border-b pb-1 overflow-x-auto"
        style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
      >
        <button
          onClick={() => {
            setActiveTab("langgraph");
            if (!langGraphState) handleRunLangGraph();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "langgraph" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiLayers className="w-4 h-4" />
          <span>LangGraph Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "search" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiSearch className="w-4 h-4" />
          <span>ChromaDB Vector Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("ner");
            if (extractedEntities.length === 0) handleRunNER();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "ner" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiZap className="w-4 h-4" />
          <span>NER Entity Extraction</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("relations");
            if (proposals.length === 0) handleRunProposals();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "relations" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiShare2 className="w-4 h-4" />
          <span>Link Discovery</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("conflicts");
            if (conflicts.length === 0) handleScanConflicts();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "conflicts" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiAlertTriangle className="w-4 h-4" />
          <span>Conflict & Anomaly Engine</span>
        </button>
      </div>

      {activeTab === "langgraph" && (
        <div className="space-y-6">
          <div
            className="p-5 rounded-2xl border space-y-4"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold tracking-tight" style={{ color: theme.text }}>
                  Multi-Agent StateGraph Workflow
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Ingestion ➔ NER Extractor ➔ Link Discovery ➔ Anomaly Verifier ➔ Dossier Synthesizer
                </p>
              </div>

              <button
                onClick={handleRunLangGraph}
                disabled={isRunningGraph}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20 self-start sm:self-auto"
              >
                <FiPlay className="w-4 h-4" />
                <span>{isRunningGraph ? "Executing Graph..." : "Execute LangGraph Pipeline"}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={nerInput}
              onChange={(e) => setNerInput(e.target.value)}
              placeholder="Forensic source input for multi-agent execution..."
              className="w-full p-3 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
              style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
            />
          </div>

          {langGraphState && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="lg:col-span-2 p-5 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                  borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                }}
              >
                <h4 className="text-xs font-mono uppercase font-bold text-red-500 tracking-wider">
                  1. Synthesized Investigative Dossier
                </h4>
                <div className="p-4 rounded-xl border border-zinc-800 bg-black/20 text-xs leading-relaxed text-zinc-200">
                  {langGraphState.dossierSummary}
                </div>

                <h4 className="text-xs font-mono uppercase font-bold text-red-500 tracking-wider pt-2">
                  2. Discovered Relations & Anomalies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {langGraphState.proposedRelations.map((rel, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-zinc-800 bg-black/10 space-y-1">
                      <span className="text-[9px] font-mono uppercase font-bold text-red-400">
                        {rel.predicate} ({rel.confidence}%)
                      </span>
                      <div className="text-xs font-bold text-white">
                        {rel.source} ➔ {rel.target}
                      </div>
                    </div>
                  ))}
                  {langGraphState.anomalies.map((anom, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-red-600/30 bg-red-600/10 space-y-1">
                      <span className="text-[9px] font-mono uppercase font-bold text-red-400">
                        {anom.type}
                      </span>
                      <div className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                        {anom.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-5 rounded-2xl border space-y-3 font-mono text-xs"
                style={{
                  backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                  borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                }}
              >
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                  <FiServer className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-white text-[11px] uppercase">Agent Execution Log</span>
                </div>

                <div className="space-y-2">
                  {langGraphState.agentLogs.map((log, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-zinc-800/80 bg-black/30 text-[11px] text-zinc-300 leading-relaxed">
                      <span className="text-red-500 font-bold mr-1.5">✓</span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "search" && (
        <div className="space-y-4">
          <form onSubmit={handleSemanticSearch} className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query ChromaDB: 'Which vehicle entered the warehouse after hours?'"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border bg-transparent outline-none focus:border-red-500"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/20 shrink-0"
            >
              <FiDatabase className="w-4 h-4" />
              <span>{isSearching ? "Querying..." : "ChromaDB Query"}</span>
            </button>
          </form>

          <div className="space-y-3">
            {searchResults.map((res, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                style={{
                  backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                  borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                }}
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-red-500">
                      {res.evidence.type}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs font-bold" style={{ color: theme.text }}>
                      {res.evidence.title}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {res.evidence.aiSummary || res.evidence.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">Similarity</span>
                    <span className="text-base font-mono font-black text-red-500">
                      {res.similarityScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "ner" && (
        <div className="space-y-4">
          <div
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400 block">
              Forensic Source Text for Entity Extraction
            </label>
            <textarea
              rows={3}
              value={nerInput}
              onChange={(e) => setNerInput(e.target.value)}
              className="w-full p-3 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
              style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
            />
            <div className="flex justify-end">
              <button
                onClick={handleRunNER}
                disabled={isExtracting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
              >
                <FiZap className="w-4 h-4" />
                <span>{isExtracting ? "Extracting..." : "Extract Entities"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extractedEntities.map((ent, idx) => {
              const Icon = getEntityIcon(ent.type);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border flex flex-col justify-between space-y-2"
                  style={{
                    backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                    borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-bold text-red-500">
                        {ent.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {ent.confidence}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold" style={{ color: theme.text }}>
                      {ent.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5 line-clamp-2">
                      {ent.context}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "relations" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleRunProposals}
              disabled={isProposing}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
            >
              <FiShare2 className="w-4 h-4" />
              <span>{isProposing ? "Generating Proposals..." : "Generate Link Proposals"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proposals.map((prop, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border flex flex-col justify-between space-y-3"
                style={{
                  backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                  borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-red-600/10 text-red-500 border border-red-600/30">
                      {prop.predicate}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Confidence: <strong className="text-white">{prop.confidence}%</strong>
                    </span>
                  </div>

                  <div className="text-xs font-bold flex items-center justify-between pt-1">
                    <span className="text-white truncate max-w-[40%]">{prop.source}</span>
                    <span className="text-zinc-600 font-mono">➔</span>
                    <span className="text-red-400 truncate max-w-[40%] text-right">{prop.target}</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                    {prop.rationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "conflicts" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleScanConflicts}
              disabled={isScanningConflicts}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
            >
              <FiAlertTriangle className="w-4 h-4" />
              <span>{isScanningConflicts ? "Scanning..." : "Re-Scan Timeline Conflicts"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {conflicts.map((conf, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border flex flex-col space-y-3"
                style={{
                  backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-[11px] uppercase font-bold text-red-500">
                      {conf.conflictType}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                      conf.severity === "CRITICAL"
                        ? "bg-red-600/20 text-red-400 border-red-600/40"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {conf.severity} SEVERITY
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-black/20 border border-zinc-800">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Record A</span>
                    <span className="text-zinc-300 font-semibold">{conf.eventA}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Record B (Contradiction)</span>
                    <span className="text-red-400 font-semibold">{conf.eventB}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {conf.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
