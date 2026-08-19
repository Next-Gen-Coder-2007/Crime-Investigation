import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPrinter,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUser,
  FiHash,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { reportService } from "../services/reportService";
import type { CaseReportData } from "../services/reportService";

export default function Reports() {
  const { caseId } = useParams<{ caseId: string }>();
  const { themeMode } = useTheme();

  const [report, setReport] = useState<CaseReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCaseInitialReport = (cid?: string): CaseReportData => {
    if (cid?.includes("0801")) {
      return {
        caseNumber: cid || "CASE-2026-0801",
        title: "Operation Phantom Wire: Financial Laundering Network",
        classification: "LAW ENFORCEMENT SENSITIVE // REL TO FINANCIAL INTELLIGENCE",
        preparedBy: "Det. Sarah Chen",
        badgeNumber: "INV-8402",
        department: "Financial Crimes & Asset Recovery Unit",
        generatedAt: new Date().toISOString(),
        executiveSummary:
          "Multi-jurisdictional financial investigation into layering of illicit contraband revenues through Panama shell corporation Aegis Escrow S.A. and subsequent rapid conversion into unhosted privacy cryptocurrency tokens.",
        statistics: {
          totalEvidence: 3,
          totalEntities: 4,
          totalEvents: 3,
          riskScore: 85,
        },
        keyEntities: [
          { name: "Viktor Mercer", type: "PERSON", aliases: ["The Architect"], verified: true },
          { name: "Aegis Escrow S.A.", type: "ORGANIZATION", aliases: ["Panama Shell Co"], verified: true },
          { name: "Zurich Escrow Account #9012", type: "ORGANIZATION", aliases: ["Intermediary Node"], verified: true },
          { name: "Wire Transfer #WT-8941", type: "EVIDENCE", aliases: ["$450,000 Transfer"], verified: true },
        ],
        evidenceCatalog: [
          {
            title: "Subpoenaed Bank Records #AMF-8941 - Swiss Intermediary",
            type: "financial",
            fileHash: "SHA256:8a1b2c3d4e5f67890abcdef1234567890abcdef1",
            location: "Metropolitan Financial District",
            status: "approved",
            aiSummary: "Director resolution filing links Viktor Mercer as sole signing beneficiary for $450,000 outbound wire.",
          },
          {
            title: "Blockchain OTC Telemetry Ledger",
            type: "document",
            fileHash: "SHA256:1234567890abcdef1234567890abcdef12345678",
            location: "Decentralized OTC Desk",
            status: "approved",
            aiSummary: "Instantaneous liquidation into privacy tokens executed within 8 minutes of wire settlement.",
          },
        ],
        timelineSequencer: [
          { timestamp: "2026-01-10T10:00:00Z", title: "Offshore Shell Incorporation: Aegis Escrow S.A.", location: "Panama City Registrar" },
          { timestamp: "2026-01-12T14:20:00Z", title: "Layering Transfer #WT-8941 Initiated ($450,000)", location: "Metropolitan Financial District", isConflict: true },
          { timestamp: "2026-01-12T14:28:00Z", title: "Rapid Crypto Liquidation via OTC Desk", location: "Decentralized OTC Desk", isConflict: true },
        ],
        recommendations: [
          "Submit Mutual Legal Assistance Treaty (MLAT) requests to Panamanian financial intelligence unit.",
          "Freeze corresponding Swiss correspondent banking channels under anti-money laundering warrants.",
          "Issue seizure warrants for identified cold storage hardware wallets linked to OTC deposit pings.",
        ],
      };
    }

    return {
      caseNumber: cid || "CASE-2026-0715",
      title: "Operation Nightfall: Port Horizon Syndicate",
      classification: "LAW ENFORCEMENT SENSITIVE // REL TO LAW ENFORCEMENT",
      preparedBy: "Det. Sarah Chen",
      badgeNumber: "INV-8402",
      department: "Major Crimes & Intelligence Division",
      generatedAt: new Date().toISOString(),
      executiveSummary:
        "Multi-agency investigation into cross-border illicit logistics, shell entities, and high-value cargo diversion at Port Horizon Terminal 4. Telemetry and CCTV records corroborate physical presence of primary suspect Viktor Mercer inside Warehouse 14B alongside cargo weight discrepancy of 4.2 tons.",
      statistics: {
        totalEvidence: 4,
        totalEntities: 5,
        totalEvents: 4,
        riskScore: 78,
      },
      keyEntities: [
        { name: "Viktor Mercer", type: "PERSON", aliases: ["The Architect"], verified: true },
        { name: "Dmitri Vance", type: "PERSON", aliases: ["Broker D"], verified: true },
        { name: "Warehouse 14B", type: "LOCATION", aliases: ["Dock 4 Facility"], verified: true },
        { name: "Aegis Maritime Ltd", type: "ORGANIZATION", aliases: ["AMF Logistics"], verified: true },
        { name: "Black SUV [Plate #XYZ-9021]", type: "VEHICLE", aliases: ["Transport A"], verified: true },
      ],
      evidenceCatalog: [
        {
          title: "CCTV Surveillance Footage - Pier 4 Gate A",
          type: "video",
          fileHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f",
          location: "Pier 4 Gate A",
          status: "approved",
          aiSummary: "Vehicle with masked license plates identified entering restricted sector. Dmitri Vance escorted inside.",
        },
        {
          title: "Intercepted Interrogation Transcript - Dock Master",
          type: "interview",
          fileHash: "SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3",
          location: "Central Precinct Room 3",
          status: "approved",
          aiSummary: "Witness confirmed Viktor Mercer held private meeting with Dmitri Vance at Warehouse 14B prior to manifest clearance.",
        },
        {
          title: "Customs Clearance Manifest #AMF-9901",
          type: "document",
          fileHash: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4",
          location: "Port Horizon Customs Terminal",
          status: "approved",
          aiSummary: "Declared weight contradicts crane telemetry logs by 4.2 tons. Suggests concealed cargo.",
        },
      ],
      timelineSequencer: [
        { timestamp: "2026-01-14T21:15:00Z", title: "Customs Clearance Manifest AMF-9901 Issued", location: "Port Horizon Customs Terminal" },
        { timestamp: "2026-01-14T23:30:00Z", title: "Witness Statement: Viktor Mercer at Downtown Cafe", location: "Metropolitan Financial District", isConflict: true },
        { timestamp: "2026-01-14T23:45:00Z", title: "CCTV Gate A: Black SUV Enters Compound", location: "Port Horizon Pier 4 Gate A", isConflict: true },
        { timestamp: "2026-01-15T00:15:00Z", title: "Crane Telemetry Sensor Weight Discrepancy Logged", location: "Port Horizon Pier 4 Berth 2", isConflict: true },
      ],
      recommendations: [
        "Issue formal arrest warrants for suspect Viktor Mercer based on corroborating CCTV telemetry and dock manifests.",
        "Freeze offshore escrow accounts tied to Aegis Maritime Ltd under AML statutes.",
        "Schedule secondary forensic examination of Container #C-881 cargo discrepancy (4.2 tons unmanifested).",
      ],
    };
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await reportService.getCaseReport(caseId || "default");
        if (res.success && res.report) {
          setReport(res.report);
        } else {
          setReport(getCaseInitialReport(caseId));
        }
      } catch {
        setReport(getCaseInitialReport(caseId));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [caseId]);

  if (isLoading || !report) {
    return (
      <div className="p-8 text-center text-xs font-mono text-zinc-400">
        Assembling formal case dossier...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-xs pb-16" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          to={`/cases/${caseId || "CASE-2026-0715"}`}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 font-semibold transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Case Cockpit</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer"
        >
          <FiPrinter className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      <div
        className="p-8 sm:p-10 rounded-3xl border space-y-8 print:border-none print:shadow-none print:p-0"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
          color: themeMode === "light" ? "#09090b" : "#ffffff",
        }}
      >
        <div className="border-b pb-6 space-y-3" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="IntelBoard AI Seal"
                className="w-10 h-10 rounded-xl object-cover border border-red-600/40 shadow-sm"
              />
              <div>
                <span className="font-extrabold text-sm tracking-tight block">INTELBOARD AI</span>
                <span className="text-[9px] font-mono text-zinc-400 uppercase">Criminal Investigation Division</span>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="px-2.5 py-1 rounded bg-red-600/10 text-red-500 font-bold text-[10px] border border-red-600/30">
                {report.classification}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <div className="font-mono text-red-500 font-bold text-xs">{report.caseNumber}</div>
            <h1 className="text-2xl font-black tracking-tight mt-0.5">
              {report.title}
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-[11px] font-mono text-zinc-400">
            <div>
              <span className="block text-[9px] uppercase text-zinc-500">Lead Investigator</span>
              <strong className="text-red-500">{report.preparedBy}</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-zinc-500">Badge Identifier</span>
              <strong className="text-zinc-300">[{report.badgeNumber}]</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-zinc-500">Department</span>
              <span className="truncate block text-zinc-300">{report.department}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-zinc-500">Date Generated</span>
              <span className="text-zinc-300">{new Date(report.generatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase font-bold text-red-500 tracking-wider">
            1. Executive Investigation Summary
          </h2>
          <p className="text-xs leading-relaxed text-zinc-300">
            {report.executiveSummary}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/20 text-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Evidence Corpus</span>
            <span className="text-xl font-black text-white block mt-1">{report.statistics.totalEvidence}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/20 text-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Target Entities</span>
            <span className="text-xl font-black text-red-500 block mt-1">{report.statistics.totalEntities}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/20 text-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Sequenced Events</span>
            <span className="text-xl font-black text-white block mt-1">{report.statistics.totalEvents}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/20 text-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Risk Evaluation</span>
            <span className="text-xl font-black text-red-500 block mt-1">{report.statistics.riskScore}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase font-bold text-red-500 tracking-wider">
            2. Identified Key Entities & Targets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {report.keyEntities.map((ent, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-zinc-800 bg-black/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiUser className="w-3.5 h-3.5 text-red-500" />
                  <div>
                    <span className="font-bold text-xs block text-white">{ent.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{ent.aliases.join(", ") || ent.type}</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {ent.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase font-bold text-red-500 tracking-wider">
            3. Forensic Evidence Chain of Custody
          </h2>
          <div className="space-y-2">
            {report.evidenceCatalog.map((ev, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-zinc-800 bg-black/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiFileText className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-bold text-xs text-white">{ev.title}</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold">VERIFIED</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{ev.aiSummary}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 pt-1">
                  <FiHash className="w-3 h-3 text-red-500" />
                  <span>{ev.fileHash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase font-bold text-red-500 tracking-wider">
            4. Chronological Event Sequence
          </h2>
          <div className="border border-zinc-800 rounded-xl overflow-hidden font-mono text-[11px]">
            <table className="w-full text-left">
              <thead className="bg-black/30 border-b border-zinc-800 text-[10px] text-zinc-400 uppercase">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Milestone Event</th>
                  <th className="p-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {report.timelineSequencer.map((seq, idx) => (
                  <tr key={idx} className={seq.isConflict ? "bg-red-600/5 text-red-300" : ""}>
                    <td className="p-3 whitespace-nowrap text-red-400 font-bold">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-red-500" />
                        {new Date(seq.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3 font-sans font-medium text-white">{seq.title}</td>
                    <td className="p-3 text-zinc-400">{seq.location || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-mono uppercase font-bold text-red-500 tracking-wider">
            5. Recommended Prosecutorial Action
          </h2>
          <div className="space-y-2">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <FiCheckCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>INTELBOARD AI FORENSIC AUTOMATION SYSTEM</span>
          <span>PAGE 1 OF 1 • OFFICIAL RECORD</span>
        </div>
      </div>
    </div>
  );
}
