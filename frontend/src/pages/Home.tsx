import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FiShield,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiArrowRight,
  FiCpu,
  FiLock,
  FiEye,
  FiActivity,
  FiLayers,
  FiShare2,
  FiFileText,
  FiGrid,
  FiCompass,
  FiFolder,
  FiClock,
  FiSearch,
  FiUsers,
  FiBarChart2,
  FiUser,
  FiTruck,
  FiAlertCircle,
  FiPlusCircle,
  FiUploadCloud,
  FiCheckCircle,
  FiTrendingUp,
  FiSend,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiCrosshair,
} from "react-icons/fi";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const overviewPoints = [
  {
    icon: FiLayers,
    title: "Unified Evidence Vault",
    description:
      "Centralize digital forensics, witness statements, CCTV media, and financial logs.",
  },
  {
    icon: FiShare2,
    title: "Relationship Mapping",
    description:
      "Automatically connect suspects, vehicles, organizations, and timelines.",
  },
  {
    icon: FiCpu,
    title: "Autonomous AI Analysis",
    description:
      "Let state-of-the-art AI detect contradictions and synthesize complex evidence.",
  },
  {
    icon: FiFileText,
    title: "Instant Court Reports",
    description:
      "Generate comprehensive, legally robust investigation summaries instantly.",
  },
];

const featuresList = [
  {
    icon: FiGrid,
    title: "Interactive Evidence Board",
    description:
      "Pin evidence, photos, and sticky notes onto a dynamic digital canvas.",
  },
  {
    icon: FiCompass,
    title: "Relationship Visualization",
    description:
      "Uncover hidden links and associative clusters with vector maps.",
  },
  {
    icon: FiFolder,
    title: "Case Management",
    description:
      "Organize hundreds of active dossiers with automated classification.",
  },
  {
    icon: FiClock,
    title: "Investigation Timeline",
    description: "Reconstruct exact sequences of events second-by-second.",
  },
  {
    icon: FiCpu,
    title: "AI Investigation Assistant",
    description:
      "Ask complex queries and get instant operational recommendations.",
  },
  {
    icon: FiFileText,
    title: "AI Report Generator",
    description: "Produce prosecution-ready case summaries instantly.",
  },
  {
    icon: FiSearch,
    title: "Semantic Evidence Search",
    description: "Search transcripts and documents using natural language.",
  },
  {
    icon: FiShield,
    title: "Secure Authentication",
    description:
      "Enterprise-grade multi-factor security and quantum encryption.",
  },
  {
    icon: FiBarChart2,
    title: "Dashboard Analytics",
    description:
      "Monitor active case velocities, lead conversions, and outputs.",
  },
];

const steps = [
  {
    step: "01",
    icon: FiPlusCircle,
    title: "Create Investigation Case",
    description: "Initialize case dossier with classification and parameters.",
  },
  {
    step: "02",
    icon: FiUploadCloud,
    title: "Upload Evidence",
    description: "Ingest multi-format files including CCTV and wiretaps.",
  },
  {
    step: "03",
    icon: FiShare2,
    title: "Connect Relationships",
    description: "Map suspects, aliases, locations, and vehicles.",
  },
  {
    step: "04",
    icon: FiCpu,
    title: "Analyze with AI",
    description: "Deploy autonomous AI agents to parse anomalies and motives.",
  },
  {
    step: "05",
    icon: FiFileText,
    title: "Generate Report",
    description: "Compile court-ready indictments and intelligence briefs.",
  },
  {
    step: "06",
    icon: FiCheckCircle,
    title: "Close Investigation",
    description: "Archive secure dossier with immutable quantum trails.",
  },
];

const stats = [
  {
    label: "Active Cases",
    value: "34",
    change: "+12% this month",
    icon: FiFolder,
  },
  {
    label: "Evidence Count",
    value: "1,428",
    change: "99.8% indexed",
    icon: FiShield,
  },
  {
    label: "Open Tasks",
    value: "18",
    change: "4 urgent priority",
    icon: FiActivity,
  },
  {
    label: "Connected Relationships",
    value: "542",
    change: "Auto-synced",
    icon: FiUsers,
  },
];

const samplePrompts = [
  "Summarize today's investigation.",
  "Generate an investigation report.",
  "Find everyone connected to this suspect.",
  "Show all evidence collected yesterday.",
  "Detect contradictions between witness statements.",
];

export default function Home() {
  const { themeMode, theme, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const illustrationY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const illustrationScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Intelligence Assistant online. How can I assist with case #9021 today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAiSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    if (!textToSend) setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Analysis complete for query: "${query}". Cross-referencing 14 dossier records. Identified 2 high-probability leads and flagged 1 conflicting statement in witness interview #3.`,
        },
      ]);
    }, 1200);
  };

  return (
    <div
      className="relative overflow-hidden selection:bg-red-500 selection:text-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* ================= NAVBAR ================= */}
      <header
        style={{
          backgroundColor: scrolled ? theme.navBg : "transparent",
          borderColor: scrolled ? theme.border : "transparent",
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl border-b py-3 shadow-lg shadow-black/5"
            : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform duration-300">
              <FiCrosshair className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-lg tracking-tight leading-none"
                style={{ color: theme.text }}
              >
                CIS
              </span>
              <span
                className="text-[10px] tracking-widest uppercase font-semibold"
                style={{ color: theme.primary }}
              >
                Crime Investigation System
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-sm"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={themeMode}
                  initial={{ y: -10, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {themeMode === "dark" ? (
                    <FiSun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <FiMoon className="w-4 h-4 text-slate-700" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <a
              href="#login"
              className="text-sm font-medium px-4 py-2 rounded-full transition-colors"
              style={{ color: theme.text }}
            >
              Login
            </a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#get-started"
              className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full text-white bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/25 transition-all"
            >
              <span>Register</span>
              <FiArrowRight className="w-4 h-4" />
            </motion.a>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border flex items-center justify-center"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              {themeMode === "dark" ? (
                <FiSun className="w-4 h-4 text-amber-400" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              {mobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
              className="lg:hidden border-b px-6 py-6 space-y-4 shadow-xl overflow-hidden"
            >
              <div
                className="pt-4 border-t flex flex-col gap-3"
                style={{ borderColor: theme.border }}
              >
                <a
                  href="#login"
                  className="w-full text-center py-3 rounded-xl border font-medium"
                  style={{ borderColor: theme.border, color: theme.text }}
                >
                  Login
                </a>
                <a
                  href="#get-started"
                  className="w-full text-center py-3 rounded-xl text-white font-medium bg-red-600 shadow-lg shadow-red-500/30"
                >
                  Register Case System
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ================= HERO SECTION ================= */}
        <section
          id="home"
          ref={heroRef}
          className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden"
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-10 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <div className="lg:col-span-6 space-y-8 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    color: theme.primary,
                  }}
                >
                  <FiCpu className="w-3.5 h-3.5 animate-pulse" />
                  <span>Next-Gen AI Crime Intelligence</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
                  style={{ color: theme.text }}
                >
                  Uncover the Truth with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-amber-600">
                    AI-Powered
                  </span>{" "}
                  Investigation
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg leading-relaxed font-normal max-w-xl"
                  style={{ color: theme.mutedText }}
                >
                  Organize evidence, visualize complex relationships, manage
                  criminal investigations, collaborate securely with
                  investigators, and leverage Artificial Intelligence to uncover
                  hidden insights faster than ever.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >
                  <a
                    href="#get-started"
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-red-600 to-red-500 shadow-xl shadow-red-600/30 hover:scale-[1.02] transition-all"
                  >
                    <span>Get Started Now</span>
                    <FiArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="#board"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border transition-all hover:bg-black/5"
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <FiEye className="w-5 h-5 text-red-500" />
                    <span>Explore Board</span>
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="pt-6 border-t grid grid-cols-3 gap-6"
                  style={{ borderColor: theme.border }}
                >
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: theme.text }}
                    >
                      99.8%
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: theme.mutedText }}
                    >
                      Pattern Accuracy
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: theme.text }}
                    >
                      10x
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: theme.mutedText }}
                    >
                      Faster Resolution
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: theme.text }}
                    >
                      256-bit
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: theme.mutedText }}
                    >
                      Encrypted Vault
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                style={{ y: illustrationY, scale: illustrationScale }}
                className="lg:col-span-6 relative"
              >
                <div
                  className="relative rounded-3xl p-6 border shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    boxShadow: theme.cardShadow,
                  }}
                >
                  <div
                    className="flex items-center justify-between pb-4 mb-6 border-b"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span
                        className="ml-2 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: theme.mutedText }}
                      >
                        Case #9021-X: Syndicate Trace
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 font-semibold flex items-center gap-1.5">
                      <FiActivity className="w-3 h-3 animate-spin" /> Live AI
                      Link
                    </span>
                  </div>

                  <div
                    className="relative h-[380px] rounded-2xl bg-black/5 border border-dashed flex items-center justify-center overflow-hidden"
                    style={{ borderColor: theme.border }}
                  >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.path
                        d="M 120 100 Q 200 60 300 140 T 420 260"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.path
                        d="M 160 280 Q 250 320 380 120"
                        fill="none"
                        stroke="#991B1B"
                        strokeWidth="2"
                      />
                    </svg>

                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute top-8 left-10 p-3 rounded-xl border shadow-lg w-44 backdrop-blur-md"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">
                          S1
                        </div>
                        <div>
                          <div
                            className="text-xs font-bold"
                            style={{ color: theme.text }}
                          >
                            Marcus Vance
                          </div>
                          <div
                            className="text-[10px]"
                            style={{ color: theme.primary }}
                          >
                            Prime Suspect
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] bg-red-500/10 text-red-600 px-2 py-0.5 rounded font-medium">
                        Match: 98.4%
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                      className="absolute bottom-12 left-20 p-3 rounded-xl border shadow-lg w-48 backdrop-blur-md"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs">
                          EV
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{ color: theme.text }}
                        >
                          CCTV Footage #4
                        </span>
                      </div>
                      <p
                        className="text-[10px]"
                        style={{ color: theme.mutedText }}
                      >
                        Dockside warehouse exit at 02:14 AM.
                      </p>
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                      className="absolute top-16 right-10 p-3 rounded-xl border shadow-lg w-44 backdrop-blur-md"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                          LOC
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{ color: theme.text }}
                        >
                          Sector 7 Harbor
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-semibold">
                        ● 3 Assets Flagged
                      </span>
                    </motion.div>

                    <motion.div
                      animate={{ rotate: [-1, 1, -1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-10 right-8 p-3 rounded-xl shadow-lg w-40 border text-amber-900 text-xs font-medium"
                      style={{
                        backgroundColor:
                          themeMode === "light" ? "#FEF3C7" : "#451A03",
                        borderColor:
                          themeMode === "light" ? "#FCD34D" : "#92400E",
                        color: themeMode === "light" ? "#78350F" : "#FDE68A",
                      }}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1">
                        <FiCpu className="w-3 h-3 text-red-600" /> AI Note:
                      </div>
                      Financial records match offshore shell company.
                    </motion.div>
                  </div>

                  <div
                    className="mt-4 flex items-center justify-between text-xs"
                    style={{ color: theme.mutedText }}
                  >
                    <span className="flex items-center gap-1.5">
                      <FiLock className="w-3.5 h-3.5 text-red-500" /> Secure
                      Quantum Encryption
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: theme.text }}
                    >
                      Active Nodes: 24
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= OVERVIEW SECTION ================= */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-500/10"
              >
                System Architecture
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: theme.text }}
              >
                Designed for Modern Law Enforcement & Detective Agencies
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base"
                style={{ color: theme.mutedText }}
              >
                Crime Investigation System modernizes criminal investigation by
                eliminating friction between data silos and empowering
                investigators with AI intelligence.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {overviewPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      boxShadow: theme.cardShadow,
                    }}
                    className="p-8 rounded-3xl border relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:bg-red-500/10 transition-colors" />
                    <div className="w-14 h-14 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center text-2xl mb-6 shadow-inner">
                      <Icon />
                    </div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: theme.text }}
                    >
                      {point.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.mutedText }}
                    >
                      {point.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section id="features" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-500/10"
              >
                Powerful Capabilities
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: theme.text }}
              >
                Engineered for Precision & Speed
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base"
                style={{ color: theme.mutedText }}
              >
                Explore the comprehensive toolset designed to give law
                enforcement agents absolute superiority in complex
                investigations.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresList.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                    whileHover={{
                      y: -6,
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      boxShadow: theme.cardShadow,
                    }}
                    className="p-8 rounded-3xl border relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center text-xl mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <Icon />
                    </div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: theme.text }}
                    >
                      {feat.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.mutedText }}
                    >
                      {feat.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= INVESTIGATION BOARD SHOWCASE ================= */}
        <section id="board" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-500/10"
              >
                Live Evidence Canvas
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: theme.text }}
              >
                The Interactive Detective Board
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base"
                style={{ color: theme.mutedText }}
              >
                Assemble suspects, witnesses, vehicles, and forensic evidence in
                real time with synchronized relationship threads.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                boxShadow: theme.cardShadow,
              }}
              className="rounded-3xl border p-8 relative overflow-hidden min-h-[550px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line
                  x1="20%"
                  y1="30%"
                  x2="50%"
                  y2="50%"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                />
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2="80%"
                  y2="30%"
                  stroke="#DC2626"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2="30%"
                  y2="75%"
                  stroke="#B91C1C"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>

              <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="p-5 rounded-2xl border backdrop-blur-md shadow-lg"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center font-bold">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <h4
                        className="font-bold text-sm"
                        style={{ color: theme.text }}
                      >
                        Viktor Sterling
                      </h4>
                      <span className="text-[10px] text-red-500 font-semibold uppercase">
                        Prime Suspect #01
                      </span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: theme.mutedText }}>
                    Linked to offshore accounts and harbor contraband transfers.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="p-6 rounded-3xl border backdrop-blur-md shadow-2xl text-center flex flex-col items-center justify-center bg-gradient-to-b from-red-600/10 to-transparent"
                  style={{ borderColor: theme.primary }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl mb-4 shadow-lg shadow-red-500/40">
                    <FiAlertCircle />
                  </div>
                  <h3
                    className="font-extrabold text-base mb-1"
                    style={{ color: theme.text }}
                  >
                    Case Nexus #9021
                  </h3>
                  <p
                    className="text-xs mb-4"
                    style={{ color: theme.mutedText }}
                  >
                    Autonomous AI Synthesis Active
                  </p>
                  <span className="text-xs px-3 py-1 rounded-full bg-red-500 text-white font-semibold">
                    14 Evidence Nodes Connected
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="p-5 rounded-2xl border backdrop-blur-md shadow-lg"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                      <FiTruck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4
                        className="font-bold text-sm"
                        style={{ color: theme.text }}
                      >
                        Black Sedan (Plate X7)
                      </h4>
                      <span className="text-[10px] text-amber-500 font-semibold uppercase">
                        Surveillance Asset
                      </span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: theme.mutedText }}>
                    Spotted exiting dock perimeter at 03:22 AM on October 14.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= WORKFLOW SECTION ================= */}
        <section id="workflow" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-500/10"
              >
                Operational Pipeline
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: theme.text }}
              >
                Investigation Workflow
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base"
                style={{ color: theme.mutedText }}
              >
                A seamless, structured pipeline designed to guide cases from
                initial intake to final prosecution with absolute compliance.
              </motion.p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-red-500/50 to-transparent -translate-x-1/2 hidden md:block" />

              <div className="space-y-12">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row-reverse" : ""}`}
                    >
                      <div className="w-full md:w-1/2">
                        <div
                          style={{
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            boxShadow: theme.cardShadow,
                          }}
                          className="p-8 rounded-3xl border relative group hover:border-red-500/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center text-xl font-bold">
                              <Icon />
                            </div>
                            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-red-500/10 text-red-500">
                              Phase {item.step}
                            </span>
                          </div>
                          <h3
                            className="text-xl font-bold mb-2"
                            style={{ color: theme.text }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: theme.mutedText }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 bg-red-600 text-white items-center justify-center font-bold text-xs shadow-lg shadow-red-500/50 z-10"
                        style={{ borderColor: theme.background }}
                      >
                        {item.step}
                      </div>
                      <div className="w-full md:w-1/2 hidden md:block" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= DASHBOARD PREVIEW ================= */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-500/10"
              >
                Real-time Command Center
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: theme.text }}
              >
                Investigation Dashboard Preview
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base"
                style={{ color: theme.mutedText }}
              >
                Monitor case velocities, evidence indexing, and squad
                assignments from a single high-performance interface.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      boxShadow: theme.cardShadow,
                    }}
                    className="p-6 rounded-3xl border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.mutedText }}
                      >
                        {stat.label}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center">
                        <Icon />
                      </div>
                    </div>
                    <div
                      className="text-3xl font-extrabold mb-1"
                      style={{ color: theme.text }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                      <FiTrendingUp className="w-3.5 h-3.5" /> {stat.change}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                boxShadow: theme.cardShadow,
              }}
              className="rounded-3xl border p-8"
            >
              <div
                className="flex flex-col md:flex-row items-center justify-between pb-6 mb-6 border-b gap-4"
                style={{ borderColor: theme.border }}
              >
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: theme.text }}
                  >
                    Active Syndicate Case Flow
                  </h3>
                  <p className="text-xs" style={{ color: theme.mutedText }}>
                    Updated 2 minutes ago • Secure Encryption Active
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                    style={{ borderColor: theme.border, color: theme.text }}
                  >
                    Export Dossier
                  </span>
                  <span className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-lg shadow-red-500/30">
                    Live Telemetry
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <h4
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: theme.mutedText }}
                  >
                    Recent Case Activity Feed
                  </h4>
                  {[
                    {
                      time: "14:22",
                      title: "New CCTV footage ingested",
                      desc: "Dockside camera #4 processed by AI OCR.",
                      status: "Verified",
                    },
                    {
                      time: "12:05",
                      title: "Suspect match detected",
                      desc: "Viktor Sterling linked to offshore shell company.",
                      status: "High Priority",
                    },
                    {
                      time: "09:40",
                      title: "Witness statement transcribed",
                      desc: "Audio recording #89 converted & analyzed.",
                      status: "Completed",
                    },
                  ].map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl border"
                      style={{
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-red-500">
                          {act.time}
                        </span>
                        <div>
                          <h5
                            className="text-sm font-bold"
                            style={{ color: theme.text }}
                          >
                            {act.title}
                          </h5>
                          <p
                            className="text-xs"
                            style={{ color: theme.mutedText }}
                          >
                            {act.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-500">
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="p-6 rounded-2xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  <div>
                    <h4
                      className="text-sm font-bold mb-4"
                      style={{ color: theme.text }}
                    >
                      Investigation Progress
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div
                          className="flex justify-between text-xs mb-1 font-semibold"
                          style={{ color: theme.text }}
                        >
                          <span>Evidence Verification</span>
                          <span>88%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                          <div className="w-[88%] h-full bg-red-600 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div
                          className="flex justify-between text-xs mb-1 font-semibold"
                          style={{ color: theme.text }}
                        >
                          <span>Suspect Profiling</span>
                          <span>94%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                          <div className="w-[94%] h-full bg-red-600 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div
                          className="flex justify-between text-xs mb-1 font-semibold"
                          style={{ color: theme.text }}
                        >
                          <span>Report Compilation</span>
                          <span>72%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                          <div className="w-[72%] h-full bg-red-600 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-6 pt-4 border-t text-xs font-medium text-emerald-500 flex items-center gap-1.5"
                    style={{ borderColor: theme.border }}
                  >
                    <FiCheckCircle className="w-4 h-4" /> All quantum nodes
                    operational
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= AI ASSISTANT SECTION ================= */}
        <section id="ai-assistant" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-500/10 flex items-center justify-center gap-1.5 w-fit mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5" /> Autonomous Intelligence
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: theme.text }}
              >
                AI Investigation Assistant
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base"
                style={{ color: theme.mutedText }}
              >
                Interact directly with our advanced neural investigator to parse
                clues, synthesize leads, and detect anomalies instantly.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                boxShadow: theme.cardShadow,
              }}
              className="max-w-4xl mx-auto rounded-3xl border overflow-hidden flex flex-col h-[520px]"
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 text-white flex items-center justify-center shadow-md">
                    <FiCpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-sm"
                      style={{ color: theme.text }}
                    >
                      CIS Neural Investigator v4.2
                    </h4>
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      ● Active & Secure
                    </span>
                  </div>
                </div>
                <span
                  className="text-xs px-3 py-1 rounded-full border font-medium"
                  style={{ borderColor: theme.border, color: theme.mutedText }}
                >
                  Case #9021 Context Loaded
                </span>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 max-w-xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${msg.role === "user" ? "bg-slate-700 text-white" : "bg-red-600 text-white"}`}
                    >
                      {msg.role === "user" ? <FiUser /> : <FiCpu />}
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-red-600 text-white rounded-tr-none" : "border rounded-tl-none"}`}
                      style={
                        msg.role === "ai"
                          ? {
                              backgroundColor: theme.surface,
                              borderColor: theme.border,
                              color: theme.text,
                            }
                          : {}
                      }
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {typing && (
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-xs">
                      <FiCpu className="animate-spin" />
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl border text-xs flex items-center gap-1.5"
                      style={{
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        color: theme.mutedText,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-2">
                        Synthesizing investigation data...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="px-6 py-2 border-t flex gap-2 overflow-x-auto scrollbar-none"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
              >
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAiSend(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors hover:border-red-500"
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      color: theme.mutedText,
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div
                className="p-4 border-t flex items-center gap-3"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
                  placeholder="Ask AI investigator anything about the case..."
                  className="flex-1 bg-transparent border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                  style={{ borderColor: theme.border, color: theme.text }}
                />
                <button
                  onClick={() => handleAiSend()}
                  className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-500/30"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= ABOUT SECTION ================= */}
        <section id="about" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-xs font-bold uppercase tracking-widest text-red-600 px-3 py-1 rounded-full bg-red-500/10"
                >
                  The Modern Standard
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                  style={{ color: theme.text }}
                >
                  Modernizing Criminal Investigations Through Artificial
                  Intelligence
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-base leading-relaxed"
                  style={{ color: theme.mutedText }}
                >
                  Traditional detective work has long been hindered by
                  fragmented paperwork, siloed databases, and slow evidence
                  cross-referencing. Crime Investigation System unifies
                  relationship visualization, semantic search, automated
                  reporting, and secure collaborative workflows into one
                  comprehensive enterprise platform.
                </motion.p>
                <div className="space-y-3 pt-2">
                  {[
                    "Autonomous relationship graph mapping",
                    "Natural language semantic evidence search",
                    "Instant court-ready indictment generation",
                    "Quantum-grade encrypted collaboration vault",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 font-medium text-sm"
                      style={{ color: theme.text }}
                    >
                      <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    boxShadow: theme.cardShadow,
                  }}
                  className="p-8 rounded-3xl border relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-bl-full pointer-events-none" />
                  <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl mb-6 shadow-lg shadow-red-500/30">
                    <FiShield />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: theme.text }}
                  >
                    Born from an Innovative Idea, Built for Enterprise
                    Deployment
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: theme.mutedText }}
                  >
                    Engineered with React 19, TypeScript, and Framer Motion, CIS
                    delivers lightning-fast performance, cinematic visual
                    storytelling, and an immaculate UI/UX designed to empower
                    modern investigators and intelligence agencies.
                  </p>
                  <a
                    href="#get-started"
                    className="inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-500 transition-colors"
                  >
                    <span>Explore Technical Documentation</span>
                    <FiArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section id="get-started" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl p-12 lg:p-20 overflow-hidden text-center border shadow-2xl bg-gradient-to-tr from-red-950 via-red-900 to-red-600 text-white"
              style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/30 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-3xl mx-auto shadow-inner border border-white/20">
                  <FiShield />
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Ready to Modernize Criminal Investigations?
                </h2>
                <p className="text-base sm:text-lg text-red-100 max-w-xl mx-auto">
                  Deploy Crime Investigation System in your agency today.
                  Experience the future of AI-powered detective work with
                  enterprise-grade capabilities.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <a
                    href="#register"
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-red-950 font-bold bg-white shadow-xl hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Register Now</span>
                    <FiArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="#login"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border border-white/30 text-white hover:bg-white/10 transition-all"
                  >
                    <span>Login to Portal</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        className="border-t py-16"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                  <FiCrosshair className="w-5 h-5" />
                </div>
                <span
                  className="font-bold text-lg"
                  style={{ color: theme.text }}
                >
                  CIS
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: theme.mutedText }}
              >
                Next-generation AI-powered criminal investigation system
                designed for elite law enforcement and unmatched operational
                efficiency.
              </p>
            </div>
            <div>
              <h4
                className="font-bold text-sm mb-4"
                style={{ color: theme.text }}
              >
                Navigation
              </h4>
              <ul
                className="space-y-2 text-xs"
                style={{ color: theme.mutedText }}
              >
                <li>
                  <a
                    href="#home"
                    className="hover:text-red-500 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-red-500 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#workflow"
                    className="hover:text-red-500 transition-colors"
                  >
                    Workflow
                  </a>
                </li>
                <li>
                  <a
                    href="#board"
                    className="hover:text-red-500 transition-colors"
                  >
                    Investigation Board
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="font-bold text-sm mb-4"
                style={{ color: theme.text }}
              >
                Legal & Security
              </h4>
              <ul
                className="space-y-2 text-xs"
                style={{ color: theme.mutedText }}
              >
                <li>
                  <a
                    href="#privacy"
                    className="hover:text-red-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="hover:text-red-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="hover:text-red-500 transition-colors"
                  >
                    Quantum Encryption
                  </a>
                </li>
                <li>
                  <a
                    href="#compliance"
                    className="hover:text-red-500 transition-colors"
                  >
                    CJIS Compliance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="font-bold text-sm mb-4"
                style={{ color: theme.text }}
              >
                Connect
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors hover:border-red-500"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <FiGithub className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors hover:border-red-500"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <FiTwitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors hover:border-red-500"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <FiLinkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div
            className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4"
            style={{ borderColor: theme.border, color: theme.mutedText }}
          >
            <p>
              © {new Date().getFullYear()} Crime Investigation System. All
              rights reserved.
            </p>
            <p>
              Born from a visionary idea, built for Law Enforcement
              Professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}