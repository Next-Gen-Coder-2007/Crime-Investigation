import { Link } from "react-router-dom";
import {
  FiShield,
  FiArrowRight,
  FiSun,
  FiMoon,
  FiLayers,
  FiActivity,
  FiLock,
  FiServer,
  FiDatabase,
  FiFileText,
  FiShare2,
  FiUsers,
  FiCheck,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{
        backgroundColor: themeMode === "light" ? "#f8fafc" : "#000000",
        color: themeMode === "light" ? "#09090b" : "#ffffff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md px-4 sm:px-8 py-3.5 transition-colors"
        style={{
          backgroundColor: themeMode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#1f1f23",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="IntelBoard AI"
              className="w-8 h-8 rounded-xl object-cover border border-red-600/40 shadow-lg shadow-red-600/30"
            />
            <div className="flex items-center gap-1.5 font-black text-base tracking-tight">
              <span style={{ color: themeMode === "light" ? "#09090b" : "#ffffff" }}>IntelBoard</span>
              <span className="text-[10px] font-mono font-bold text-red-500 bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/30">
                AI SAAS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
            <a href="#capabilities" className="hover:text-red-500 transition-colors">Capabilities</a>
            <a href="#security" className="hover:text-red-500 transition-colors">Air-Gapped Privacy</a>
            <a href="#architecture" className="hover:text-red-500 transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
              title="Toggle Light/Dark Mode"
            >
              {themeMode === "light" ? (
                <FiMoon className="w-3.5 h-3.5 text-zinc-800" />
              ) : (
                <FiSun className="w-3.5 h-3.5 text-red-500" />
              )}
            </button>

            <Link
              to="/login"
              className="px-3.5 py-2 rounded-xl border border-zinc-800 hover:border-red-600 text-xs font-bold transition-all text-zinc-300 hover:text-white"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
            >
              Enlist Agency
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-24 py-12 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-600/30 bg-red-600/10 text-red-500 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>INTELLIGENCE INVESTIGATION OPERATING SYSTEM // V2.5</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
            style={{ color: themeMode === "light" ? "#09090b" : "#ffffff" }}
          >
            Intelligent Crime Investigation & Evidence Pinboard
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Correlate multimodal forensic evidence, detect alibi velocity anomalies, build interactive red-string canvas networks, and orchestrate autonomous LangGraph AI agents in real-time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-red-600/25 transition-all cursor-pointer"
            >
              <span>Launch Command Station</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/cases"
              className="px-6 py-3.5 rounded-2xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-bold transition-all"
            >
              <span>Explore Active Operations</span>
            </Link>
          </div>

          <div
            className="mt-12 p-4 sm:p-6 rounded-3xl border shadow-2xl relative overflow-hidden text-left font-mono"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-400 font-bold ml-2">CASE-2026-0715 // OPERATION NIGHTFALL</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>3 Detectives Collaborating Live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="p-4 rounded-2xl border border-zinc-800 bg-black/40 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-red-500 font-bold">
                  <span>TARGET SUSPECT</span>
                  <span>CONFIDENCE 96%</span>
                </div>
                <div className="font-sans font-bold text-white text-sm">Viktor Mercer</div>
                <div className="text-[11px] text-zinc-400 font-mono">Presence verified at Pier 4 Gate A inside black SUV at 23:45.</div>
              </div>

              <div className="p-4 rounded-2xl border border-red-600/30 bg-red-600/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-red-400 font-bold">
                  <span>TIMELINE CONFLICT</span>
                  <span>CRITICAL</span>
                </div>
                <div className="font-sans font-bold text-white text-sm">Alibi Velocity Discrepancy</div>
                <div className="text-[11px] text-zinc-300 font-mono">42-minute travel distance between Downtown Cafe and Dock 4 contradicted.</div>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-800 bg-black/40 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                  <span>FORENSIC EVIDENCE</span>
                  <span>SHA-256 SEALED</span>
                </div>
                <div className="font-sans font-bold text-white text-sm">Manifest #AMF-9901</div>
                <div className="text-[11px] text-zinc-400 font-mono">Tare weight disparity: 5.4 tons logged vs 1.2 tons declared.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-6 rounded-3xl border border-zinc-800 bg-black/20 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-red-500">99.98%</div>
            <div className="text-xs font-mono uppercase text-zinc-400">Cryptographic Integrity</div>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-800 bg-black/20 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">&lt; 12ms</div>
            <div className="text-xs font-mono uppercase text-zinc-400">WebSocket Sync Latency</div>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-800 bg-black/20 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-red-500">4.2x</div>
            <div className="text-xs font-mono uppercase text-zinc-400">Faster Dossier Assembly</div>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-800 bg-black/20 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">CJIS & SOC2</div>
            <div className="text-xs font-mono uppercase text-zinc-400">Forensic Compliance Ready</div>
          </div>
        </section>

        <section id="capabilities" className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono uppercase font-bold text-red-500 tracking-wider">
              Modular Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight" style={{ color: theme.text }}>
              Built for Modern Digital Forensics & Task Forces
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-3xl border space-y-3"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <FiFileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>
                Multimodal Evidence Vault
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                SHA-256 digital fingerprinting, chain of custody logging, and automatic forensic OCR ingestion across surveillance footage, bank records, and transcripts.
              </p>
            </div>

            <div
              className="p-6 rounded-3xl border space-y-3"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <FiShare2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>
                Interactive Visual Pinboard
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect suspects, vehicles, shell organizations, and physical evidence on an infinite canvas with red-string connectors and instant link verification.
              </p>
            </div>

            <div
              className="p-6 rounded-3xl border space-y-3"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <FiActivity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>
                Temporal Anomaly & Velocity Engine
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automated temporal sequencing that flags alibi contradictions, travel velocity impossibilities, and physical cargo weight anomalies.
              </p>
            </div>

            <div
              className="p-6 rounded-3xl border space-y-3"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <FiLayers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>
                LangGraph Multi-Agent Workflows
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Orchestrate sequential Ingestion, NER, Link Discovery, Anomaly Verifier, and Synthesis agents on a unified stategraph with full provenance.
              </p>
            </div>

            <div
              className="p-6 rounded-3xl border space-y-3"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <FiUsers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>
                Real-Time Precinct Collaboration
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Live WebSocket synchronization for detective presence, canvas updates, case memos, and simultaneous multi-investigator reviews.
              </p>
            </div>

            <div
              className="p-6 rounded-3xl border space-y-3"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <FiLock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>
                Immutable Audit Forensics
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cryptographic audit trail capturing every evidence touch, role operation, IP address, and report generation for courtroom admissibility.
              </p>
            </div>
          </div>
        </section>

        <section id="security" className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-black/40 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase font-bold text-red-500 tracking-wider">
                AIR-GAPPED & PRIVACY FIRST
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Run Local LLMs & ChromaDB On-Premises
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Deploy IntelBoard AI directly into air-gapped precinct servers with Ollama (Llama 3, Mistral, DeepSeek-R1) and ChromaDB vector indexing. Maintain 100% data sovereignty without external cloud exposure.
              </p>
              <div className="space-y-2 pt-2 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-red-500" />
                  <span>On-Premises Docker Compose Deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-red-500" />
                  <span>ChromaDB Local Vector Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-red-500" />
                  <span>Zero-Data-Retention Forensic Protocol</span>
                </div>
              </div>
            </div>

            <div id="architecture" className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-500 uppercase">
                <span>Docker Orchestration</span>
                <span className="text-emerald-400">HEALTHY</span>
              </div>
              <div className="space-y-1.5 text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FiServer className="text-red-500" /> backend:5000</span>
                  <span className="text-emerald-400">RUNNING</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FiDatabase className="text-red-500" /> chromadb:8000</span>
                  <span className="text-emerald-400">ONLINE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FiActivity className="text-red-500" /> ollama:11434</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FiShield className="text-red-500" /> mongo:27017</span>
                  <span className="text-emerald-400">CONNECTED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-8 sm:p-12 rounded-3xl border border-red-600/30 bg-gradient-to-br from-red-950/20 via-black to-zinc-950 text-center space-y-6">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono uppercase font-bold text-red-500 tracking-wider">
              PRECINCT ENLISTMENT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Deploy IntelBoard AI to Your Investigation Squad
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Accelerate forensic timeline discovery, automate entity linking, and collaborate securely in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/25 cursor-pointer"
            >
              Enlist Agency Profile
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-bold transition-all"
            >
              Sign In to Command Cockpit
            </Link>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-12 px-4 sm:px-8 mt-16 text-xs text-zinc-500 font-mono"
        style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#1f1f23" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="IntelBoard AI"
              className="w-7 h-7 rounded-lg object-cover border border-red-600/40"
            />
            <span className="font-bold text-white font-sans">IntelBoard AI</span>
          </div>
          <div>CRIMINAL INVESTIGATION DIVISION • IMMUTABLE AUDIT TRAIL</div>
          <div>© 2026 INTELBOARD AI PLATFORM. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
}