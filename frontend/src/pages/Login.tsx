import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { theme, themeMode } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<"idle" | "authenticating" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus("authenticating");
    setErrorMsg("");

    try {
      await login({ email, password });
      setAuthStatus("success");
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err: any) {
      setAuthStatus("idle");
      setErrorMsg(err.message || "Invalid credentials. Please verify your badge identifier or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6 font-sans"
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: themeMode === "light" ? "#f8fafc" : "#000000",
        color: themeMode === "light" ? "#09090b" : "#ffffff",
      }}
    >
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold transition-colors hover:text-red-500 z-20 group text-zinc-400"
      >
        <div
          className="w-8 h-8 rounded-xl border flex items-center justify-center group-hover:border-red-500 transition-colors"
          style={{
            borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          }}
        >
          <FiArrowLeft className="w-4 h-4" />
        </div>
        <span>Return to Overview</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl border overflow-hidden shadow-2xl z-10"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div
          className="p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r"
          style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="IntelBoard AI Logo"
                className="w-11 h-11 rounded-2xl object-cover border border-red-600/40 shadow-xl shadow-red-600/30"
              />
              <div>
                <span className="font-black text-lg tracking-tight block" style={{ color: theme.text }}>
                  IntelBoard AI
                </span>
                <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-red-500">
                  Forensic Investigation Suite
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
                Agency Gateway
              </h2>
              <p className="text-xs leading-relaxed text-zinc-400">
                Sign in with authorized precinct credentials to access multimodal evidence vaults, interactive canvas pinboards, and grounded AI copilots.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-800 bg-black/20 space-y-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-red-500" />
                <span>SHA-256 Chain of Custody</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-red-500" />
                <span>Cryptographic Audit Stream</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-4 h-4 text-red-500" />
                <span>CJIS-Compliant Access Control</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t flex items-center justify-between text-[10px] font-mono text-zinc-500" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
            <span>SECURE PRECINCT GATEWAY</span>
            <span className="text-emerald-500 font-bold">ONLINE</span>
          </div>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto space-y-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                Authentication
              </h3>
              <p className="text-xs text-zinc-400">
                Enter your authorized officer credentials.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center gap-2 text-red-500 text-xs font-semibold">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Officer Email or Badge ID
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.chen@intelboard.ai or INV-8402"
                    className="w-full border rounded-xl pl-10 pr-3.5 py-2.5 text-xs outline-none focus:border-red-500 bg-transparent"
                    style={{
                      borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                      color: theme.text,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Officer Passcode
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none focus:border-red-500 bg-transparent"
                    style={{
                      borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
                      color: theme.text,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl text-white font-bold text-xs bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {authStatus === "idle" && <span>Enter Investigation Station</span>}
                  {authStatus === "authenticating" && (
                    <span className="flex items-center justify-center gap-2">
                      <FiActivity className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </span>
                  )}
                  {authStatus === "success" && (
                    <span className="flex items-center justify-center gap-2">
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Access Authorized</span>
                    </span>
                  )}
                </AnimatePresence>
              </button>
            </form>

            <div className="pt-4 border-t text-center text-xs text-zinc-400" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
              <span>New investigator? </span>
              <Link to="/register" className="text-red-500 font-bold hover:underline">
                Enlist Agency Profile
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}