import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiGrid,
  FiFolder,
  FiShare2,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiLayers,
  FiActivity,
  FiCpu,
  FiClock,
  FiMessageSquare,
  FiFileText,
  FiUsers,
  FiChevronDown,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useActiveCase } from "../../context/CaseContext";
import { useSocketContext } from "../../context/SocketContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, themeMode, toggleTheme } = useTheme();
  const { cases, activeCaseId, setActiveCaseId } = useActiveCase();
  const { roster } = useSocketContext();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ caseId?: string }>();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);

  const effectiveCaseId = params.caseId || activeCaseId || cases[0]?.caseNumber || "";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCaseSelect = (caseNumber: string) => {
    setActiveCaseId(caseNumber);
    setIsCaseDropdownOpen(false);

    if (location.pathname.includes("/board")) {
      navigate(`/cases/${caseNumber}/board`);
    } else if (location.pathname.includes("/graph")) {
      navigate(`/cases/${caseNumber}/graph`);
    } else if (location.pathname.includes("/timeline")) {
      navigate(`/cases/${caseNumber}/timeline`);
    } else if (location.pathname.includes("/copilot")) {
      navigate(`/cases/${caseNumber}/copilot`);
    } else if (location.pathname.includes("/ai-hub")) {
      navigate(`/cases/${caseNumber}/ai-hub`);
    } else if (location.pathname.includes("/reports")) {
      navigate(`/cases/${caseNumber}/reports`);
    } else if (location.pathname.startsWith("/cases/")) {
      navigate(`/cases/${caseNumber}`);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
    },
    {
      label: "Cases Kanban",
      path: "/cases",
      icon: FiFolder,
    },
    ...(effectiveCaseId
      ? [
          {
            label: "Evidence Pinboard",
            path: `/cases/${effectiveCaseId}/board`,
            icon: FiShare2,
          },
          {
            label: "Relationship Graph",
            path: `/cases/${effectiveCaseId}/graph`,
            icon: FiLayers,
          },
          {
            label: "Crime Timeline",
            path: `/cases/${effectiveCaseId}/timeline`,
            icon: FiClock,
          },
          {
            label: "AI Copilot & RAG",
            path: `/cases/${effectiveCaseId}/copilot`,
            icon: FiMessageSquare,
          },
          {
            label: "AI Intelligence Hub",
            path: `/cases/${effectiveCaseId}/ai-hub`,
            icon: FiCpu,
          },
          {
            label: "Formal Dossier Reports",
            path: `/cases/${effectiveCaseId}/reports`,
            icon: FiFileText,
          },
        ]
      : []),
    {
      label: "Audit Forensics",
      path: "/audit-logs",
      icon: FiActivity,
    },
  ];

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
        className="h-14 border-b sticky top-0 z-40 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between"
        style={{
          backgroundColor: themeMode === "light" ? "rgba(255, 255, 255, 0.95)" : "rgba(10, 10, 10, 0.95)",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#1f1f23",
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className="p-1.5 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMobileMenuOpen || (isSidebarOpen && window.innerWidth >= 1024) ? (
              <FiX className="w-4 h-4" />
            ) : (
              <FiMenu className="w-4 h-4" />
            )}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="IntelBoard AI Logo"
              className="w-7 h-7 rounded-lg object-cover border border-red-600/40 shadow-sm"
            />
            <div className="flex items-center gap-1.5 font-black text-sm tracking-tight">
              <span className="hidden sm:inline" style={{ color: themeMode === "light" ? "#09090b" : "#ffffff" }}>
                IntelBoard
              </span>
              <span className="text-[10px] font-mono font-bold text-red-500 bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/30">
                AI
              </span>
            </div>
          </Link>
        </div>

        {effectiveCaseId && (
          <div className="relative flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
                  borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                  color: themeMode === "light" ? "#09090b" : "#ffffff",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-red-500 font-extrabold truncate max-w-[110px] sm:max-w-none">
                  {effectiveCaseId}
                </span>
                <FiChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {isCaseDropdownOpen && cases.length > 0 && (
                <div
                  className="absolute left-0 mt-2 w-72 rounded-2xl border shadow-2xl p-2 z-50 space-y-1"
                  style={{
                    backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                    borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                  }}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold text-zinc-400 border-b border-zinc-800">
                    Switch Active Operation
                  </div>
                  {cases.map((c) => (
                    <button
                      key={c.caseNumber}
                      onClick={() => handleCaseSelect(c.caseNumber)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex flex-col cursor-pointer ${
                        c.caseNumber === effectiveCaseId
                          ? "bg-red-600 text-white font-bold"
                          : "hover:bg-zinc-800/40 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold">{c.caseNumber}</span>
                        <span className="text-[9px] uppercase font-mono">{c.status.replace("_", " ")}</span>
                      </div>
                      <span className="text-[11px] truncate mt-0.5 opacity-90">{c.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl border border-zinc-800 bg-black/20 text-[10px] font-mono text-zinc-400">
            <FiUsers className="w-3.5 h-3.5 text-red-500" />
            <span>Online:</span>
            {roster.length > 0 ? (
              <div className="flex items-center gap-1.5">
                {roster.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[9px] font-bold flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{c.name?.split(" ")[1] || c.name || "Detective"}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-zinc-500">1 Detective (Local)</span>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {themeMode === "light" ? (
              <FiMoon className="w-3.5 h-3.5 text-zinc-800" />
            ) : (
              <FiSun className="w-3.5 h-3.5 text-red-500" />
            )}
          </button>

          <div
            className="flex items-center gap-2 pl-2 sm:pl-2.5 pr-1.5 py-1 rounded-xl border"
            style={{
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
            }}
          >
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight truncate max-w-[80px] sm:max-w-[120px]" style={{ color: theme.text }}>
                {user?.name || "Investigator"}
              </span>
              <span className="text-[9px] font-mono uppercase font-bold text-red-500 hidden sm:inline">
                [{user?.badgeNumber || "ACTIVE"}]
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Logout"
            >
              <FiLogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`border-r transition-all duration-200 flex flex-col justify-between shrink-0 z-30 fixed lg:static top-14 bottom-0 left-0 ${
            isMobileMenuOpen
              ? "w-64 translate-x-0"
              : isSidebarOpen
              ? "w-56 translate-x-0"
              : "w-0 lg:w-16 -translate-x-full lg:translate-x-0 overflow-hidden"
          }`}
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#050505",
            borderColor: themeMode === "light" ? "#e4e4e7" : "#1f1f23",
          }}
        >
          <div className="p-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-600 text-white font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {(isSidebarOpen || isMobileMenuOpen) && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {(isSidebarOpen || isMobileMenuOpen) && effectiveCaseId && (
            <div className="p-3 m-2 rounded-xl border border-zinc-800 bg-black/40 text-[10px] font-mono text-zinc-400 space-y-1">
              <div className="text-red-500 font-bold uppercase">Precinct Sync Online</div>
              <div className="truncate">Case: {effectiveCaseId}</div>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-3.5rem)] p-3 sm:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
