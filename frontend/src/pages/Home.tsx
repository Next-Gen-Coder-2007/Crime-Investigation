import React, { useState, useRef, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence 
} from "framer-motion";
import { 
  FiSearch, FiShield, FiActivity, FiDatabase, FiMapPin, 
  FiClock, FiCpu, FiGlobe, FiLayers, FiCheckCircle,
  FiServer, FiKey, FiTerminal, FiCrosshair, FiMaximize, FiLink
} from "react-icons/fi";

// ==========================================
// ENTERPRISE DATA ONTOLOGY & CONFIGURATION
// ==========================================

const ARCHITECTURE_MODULES = [
  {
    title: "Federated Ingestion Pipeline",
    description: "Connect disparate data silos (SQL, NoSQL, REST, S3) into a unified, queryable intelligence lake without altering underlying schemas.",
    icon: <FiDatabase />,
    metrics: "50M+ Nodes / Sec"
  },
  {
    title: "Deterministic Entity Resolution",
    description: "Advanced heuristics and probabilistic ML models automatically fuse duplicate profiles across conflicting datasets.",
    icon: <FiCpu />,
    metrics: "99.8% Accuracy"
  },
  {
    title: "Geospatial Corroboration",
    description: "Map cell tower pings, EXIF data, and financial transactions on a multi-layer tactical map to destroy alibis.",
    icon: <FiMapPin />,
    metrics: "Sub-meter Precision"
  }
];

const COMPLIANCE_PROTOCOLS = [
  "SOC 2 Type II / ISO 27001",
  "FIPS 140-2 Validated Encryption",
  "CJIS & IL6 Ready Infrastructure",
  "Zero-Trust Network Access (ZTNA)",
  "Immutable Cryptographic Audit Logs",
  "Role & Attribute-Based Access (RBAC/ABAC)"
];

// ==========================================
// CUSTOM CURSOR COMPONENT
// ==========================================
const CustomCursor = () => {
  const mouse = { x: useMotionValue(-100), y: useMotionValue(-100) };
  const smoothOptions = { damping: 30, stiffness: 400, mass: 0.1 };
  const smoothX = useSpring(mouse.x, smoothOptions);
  const smoothY = useSpring(mouse.y, smoothOptions);

  useEffect(() => {
    const manageMouseMove = (e: MouseEvent) => {
      mouse.x.set(e.clientX - 8); // Offset by half width
      mouse.y.set(e.clientY - 8);
    };
    window.addEventListener("mousemove", manageMouseMove);
    return () => window.removeEventListener("mousemove", manageMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-red-600 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ x: smoothX, y: smoothY }}
    />
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-900 py-4 shadow-sm" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-[100rem] mx-auto px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-shadow relative overflow-hidden">
             {/* Scanning line effect */}
             <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-50 animate-[scan_2s_ease-in-out_infinite]" />
             <FiCrosshair className="text-white text-xl" />
          </div>
          <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white font-mono uppercase">
            Nexus<span className="text-red-600">Intel</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-12">
          {["Ontology", "Link Analysis", "Geospatial", "Security"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-500 transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-500 transition-colors">
            <FiTerminal className="text-lg" /> Agency Login
          </button>
          <button className="relative px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-sm overflow-hidden group">
            <span className="relative z-10">Request Clearance</span>
            <div className="absolute inset-0 bg-red-600 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 hidden">Request Clearance</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const MultiLayerHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Layer 1: Background grid scales up and fades out
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.8], [0.3, 0]);

  // Layer 2: Midground graphic elements move up slightly faster
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  
  // Layer 3: Foreground text moves up rapidly
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "80%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 pt-20">
      
      {/* Background Layer */}
      <motion.div 
        className="absolute inset-0 z-0 origin-top"
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </motion.div>

      {/* Midground Layer (Abstract Nodes) */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center" style={{ y: midY }}>
        <div className="absolute w-[800px] h-[800px] border border-red-600/10 dark:border-red-500/10 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[600px] h-[600px] border border-zinc-200 dark:border-zinc-800 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        
        {/* Dynamic Nodes */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-red-600 rounded-full shadow-[0_0_30px_10px_rgba(220,38,38,0.3)] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-zinc-900 dark:bg-white rounded-full shadow-[0_0_30px_10px_rgba(255,255,255,0.1)]" />
        
        {/* SVG Connecting Line */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <path d="M 25vw 33vh L 75vw 66vh" stroke="currentColor" className="text-red-600" strokeWidth="1" strokeDasharray="4,4" />
        </svg>
      </motion.div>

      {/* Foreground Text Layer */}
      <motion.div 
        className="relative z-20 max-w-7xl mx-auto px-6 text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          
          <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-mono">
              System Ontology v3.1.0 Online
            </span>
          </div>
          
          <h1 className="text-7xl sm:text-8xl md:text-[7rem] font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9] mb-8 uppercase">
            Resolve <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 dark:from-red-500 dark:to-red-700">
              The Unknown.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
            The apex platform for signal intelligence and operational visualization. Synthesize billions of nodes into actionable, evidentiary truth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <button className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 group rounded-sm">
              Initialize Workspace 
              <motion.span className="inline-block" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                &rarr;
              </motion.span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ==========================================
// ADVANCED PINNED HORIZONTAL SCROLL SECTION
// ==========================================
// This creates a highly professional "Apple-style" effect where scrolling down 
// temporarily pins the screen and moves content horizontally.

const HorizontalInvestigationFlow = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Transform scroll progress into horizontal movement
  const x = useTransform(smoothProgress, [0, 1], ["10%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-zinc-50 dark:bg-zinc-900">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Background Typography for depth */}
        <div className="absolute top-1/2 -translate-y-1/2 left-8 text-[15rem] font-black text-zinc-200 dark:text-zinc-800/50 pointer-events-none select-none z-0 tracking-tighter">
          WORKFLOW
        </div>

        <motion.div style={{ x }} className="flex gap-16 px-32 relative z-10 items-center">
          
          {/* Node 1 */}
          <div className="w-[600px] h-[400px] shrink-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors" />
            <div>
              <div className="text-red-600 font-mono text-sm font-bold mb-4 uppercase tracking-widest">Phase 01</div>
              <h3 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">Ingestion & Triage</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                Stream terabytes of unstructured OSINT, financial ledgers, and intercepted communications directly into the hyper-graph. The NLP engine instantly triages and tags entities.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 rounded-sm">SQL / NoSQL</div>
              <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 rounded-sm">REST API</div>
              <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 rounded-sm">S3 Buckets</div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="w-32 h-[2px] bg-red-600 shrink-0 relative">
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 bg-red-600 rotate-45" />
          </div>

          {/* Node 2 */}
          <div className="w-[600px] h-[400px] shrink-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors" />
            <div>
              <div className="text-red-600 font-mono text-sm font-bold mb-4 uppercase tracking-widest">Phase 02</div>
              <h3 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">Link Analysis</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                The visual canvas forces hidden relationships to the surface. Drag nodes to establish manual links, while the system automatically suggests probabilistic connections based on shared attributes.
              </p>
            </div>
            <div className="h-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:10px_10px] border border-zinc-200 dark:border-zinc-800 relative flex items-center justify-center">
                <FiLink className="text-red-600 text-2xl" />
            </div>
          </div>

          {/* Connection Line */}
          <div className="w-32 h-[2px] bg-red-600 shrink-0 relative">
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 bg-red-600 rotate-45" />
          </div>

          {/* Node 3 */}
          <div className="w-[600px] h-[400px] shrink-0 bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 rounded-sm p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-red-600/5" />
            <div className="relative z-10">
              <div className="text-red-500 font-mono text-sm font-bold mb-4 uppercase tracking-widest">Phase 03</div>
              <h3 className="text-4xl font-black mb-4">Evidentiary Export</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Generate courtroom-ready, cryptographically signed dossiers. Every node and connection is backed by an immutable chain of custody log, proving provenance beyond a reasonable doubt.
              </p>
            </div>
            <button className="relative z-10 w-full py-4 border border-zinc-700 hover:bg-white hover:text-zinc-900 transition-colors font-bold uppercase tracking-widest text-xs">
              Generate Briefing Report
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

const AnalyticalArchitecture = () => {
  return (
    <div className="py-40 bg-white dark:bg-zinc-950 relative z-20">
      <div className="max-w-[100rem] mx-auto px-8">
        <div className="mb-24 md:w-2/3">
          <div className="inline-block px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border border-red-100 dark:border-red-900/30 text-xs font-mono font-bold uppercase tracking-widest mb-6">
            Architecture
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white mb-8 tracking-tighter uppercase leading-none">
            Computational <br />
            <span className="text-red-600">Superiority.</span>
          </h2>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            Designed for environments where analytical failure is not an option. Our graph database operates at a scale unmatched by traditional relational systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ARCHITECTURE_MODULES.map((mod, idx) => (
            <div key={idx} className="group p-10 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-red-600 dark:hover:border-red-500 transition-colors duration-300 rounded-sm">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-3xl text-zinc-900 dark:text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {mod.icon}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Throughput</div>
                  <div className="font-mono text-sm text-red-600 dark:text-red-500 font-bold">{mod.metrics}</div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">{mod.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {mod.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StrictCompliance = () => {
  return (
    <div className="py-40 bg-zinc-900 dark:bg-black text-white relative overflow-hidden border-y border-zinc-800">
      {/* Tactical Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      
      <div className="max-w-[100rem] mx-auto px-8 relative z-10 flex flex-col lg:flex-row gap-20 items-center">
        <div className="lg:w-1/2">
          <FiShield className="text-red-600 text-6xl mb-8" />
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-none">
            Zero-Trust <br />
            Compartmentalization.
          </h2>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
            In multi-agency task forces, data sovereignty is critical. Implement granular Attribute-Based Access Control (ABAC) down to the individual node property level.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMPLIANCE_PROTOCOLS.map((protocol, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-sm">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wide">{protocol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Abstract Data Vault Graphic */}
        <div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center perspective-1000">
          <motion.div 
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative w-64 h-64 transform-style-3d"
          >
            {/* Front */}
            <div className="absolute inset-0 border-2 border-red-600 bg-black/80 backdrop-blur-md flex items-center justify-center transform translate-z-32">
              <FiKey className="text-red-600 text-4xl" />
            </div>
            {/* Back */}
            <div className="absolute inset-0 border-2 border-zinc-700 bg-zinc-900/80 backdrop-blur-md transform -translate-z-32 rotate-y-180" />
            {/* Wireframe outer box */}
            <div className="absolute -inset-8 border border-zinc-800 rotate-45 transform-style-3d" />
            <div className="absolute -inset-16 border border-zinc-800/50 rotate-12 transform-style-3d" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-950 pt-32 pb-16 border-t border-zinc-200 dark:border-zinc-900">
      <div className="max-w-[100rem] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <FiCrosshair className="text-red-600 text-3xl" />
              <span className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white font-mono uppercase">
                Nexus<span className="text-red-600">Intel</span>
              </span>
            </div>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 max-w-md leading-relaxed">
              Providing operational superiority through advanced link analysis and deterministic entity resolution.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase">Sys_Status: Nominal</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white mb-6 text-sm uppercase tracking-widest">Capabilities</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-red-600 transition-colors">Hyper-Graph Engine</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">NLP Ingestion</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Geospatial Mapping</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Automated Redaction</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white mb-6 text-sm uppercase tracking-widest">Deployment</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-red-600 transition-colors">On-Premise (Air-Gapped)</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">GovCloud</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Hybrid Architecture</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Clearance Docs</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} NexusIntel Systems LLC.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-red-600">Privacy</a>
             <a href="#" className="hover:text-red-600">Terms</a>
             <a href="#" className="hover:text-red-600">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// MAIN PAGE EXPORT
// ==========================================

export default function Home() {
  return (
    <div className="font-sans text-zinc-900 dark:text-zinc-50 selection:bg-red-600 selection:text-white bg-white dark:bg-zinc-950 min-h-screen cursor-none">
      <CustomCursor />
      <Header />
      <main>
        <MultiLayerHero />
        <HorizontalInvestigationFlow />
        <AnalyticalArchitecture />
        <StrictCompliance />
      </main>
      <Footer />
    </div>
  );
}