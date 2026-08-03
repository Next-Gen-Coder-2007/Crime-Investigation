import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCrosshair,
  FiShield,
  FiArrowLeft,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const { theme, themeMode } = useTheme();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<"idle" | "authenticating" | "success" | "google-authenticating">("idle");

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus("authenticating");

    // Simulate secure authentication delay
    setTimeout(() => {
      setAuthStatus("success");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    }, 2000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setAuthStatus("google-authenticating");

    // Simulate Google SSO authentication delay
    setTimeout(() => {
      setAuthStatus("success");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    }, 2000);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden selection:bg-red-500 selection:text-white p-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      {/* ================= BACK BUTTON ================= */}
      <a
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium transition-colors hover:text-red-500 z-20 group"
        style={{ color: theme.mutedText }}
      >
        <div 
          className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:border-red-500 transition-colors"
          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
        >
          <FiArrowLeft className="w-4 h-4" />
        </div>
        Return to Home
      </a>

      {/* ================= MAIN LOGIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-[2rem] border overflow-hidden shadow-2xl z-10"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          boxShadow: theme.cardShadow,
        }}
      >
        {/* === LEFT PANEL: BRANDING & INFO === */}
        <div 
          className="relative p-10 lg:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r overflow-hidden"
          style={{ borderColor: theme.border }}
        >
          {/* Subtle grid animation inside left panel */}
          <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                <FiCrosshair className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-bold text-xl tracking-tight leading-none"
                  style={{ color: theme.text }}
                >
                  CIS Platform
                </span>
                <span
                  className="text-[11px] tracking-widest uppercase font-semibold text-red-500"
                >
                  Secure Authentication
                </span>
              </div>
            </div>

            <h2 
              className="text-3xl font-extrabold tracking-tight mb-4"
              style={{ color: theme.text }}
            >
              Welcome Back
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: theme.mutedText }}>
              Sign in to securely access the Crime Investigation System. Manage your cases, analyze evidence, and collaborate within a protected digital environment.
            </p>
          </div>

          <div className="relative z-10">
            <div 
              className="p-4 rounded-2xl border bg-black/5 backdrop-blur-sm"
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-center gap-3 mb-2">
                <FiShield className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold" style={{ color: theme.text }}>
                  System Status: Online
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mt-3 text-[11px] font-medium uppercase tracking-wider" style={{ color: theme.mutedText }}>
                <div className="flex justify-between">
                  <span>Data Encryption</span>
                  <span className="text-emerald-500">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Connection</span>
                  <span className="text-emerald-500">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT PANEL: LOGIN FORM === */}
        <div className="p-10 lg:p-14 flex flex-col justify-center relative bg-gradient-to-b from-transparent to-black/[0.02]">
          <div className="max-w-sm w-full mx-auto">
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                Sign In
              </h3>
              <p className="text-sm" style={{ color: theme.mutedText }}>
                Enter your account details to continue.
              </p>
            </div>

            <form onSubmit={handleStandardLogin} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="w-4 h-4 text-red-500" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    className="w-full bg-transparent border rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    style={{ 
                      borderColor: theme.border, 
                      color: theme.text,
                      backgroundColor: themeMode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)' 
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                    Password
                  </label>
                  <a href="#forgot" className="text-[11px] font-medium text-red-500 hover:text-red-400 transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="w-4 h-4 text-red-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-transparent border rounded-xl pl-11 pr-12 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    style={{ 
                      borderColor: theme.border, 
                      color: theme.text,
                      backgroundColor: themeMode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Standard Login */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-red-600 to-red-500 shadow-xl shadow-red-500/25 transition-all overflow-hidden relative"
              >
                <AnimatePresence mode="wait">
                  {authStatus === "idle" && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      Sign In
                    </motion.span>
                  )}
                  {authStatus === "authenticating" && (
                    <motion.div
                      key="auth"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <FiActivity className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </motion.div>
                  )}
                  {authStatus === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-white"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Success</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            {/* ================= DIVIDER ================= */}
            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t" style={{ borderColor: theme.border }}></div>
              <span 
                className="flex-shrink-0 mx-4 text-[10px] font-bold uppercase tracking-widest" 
                style={{ color: theme.mutedText }}
              >
                Or Continue With
              </span>
              <div className="flex-grow border-t" style={{ borderColor: theme.border }}></div>
            </div>

            {/* ================= GOOGLE LOGIN BUTTON ================= */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold border transition-all hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                backgroundColor: themeMode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              {authStatus === "google-authenticating" ? (
                <FiActivity className="w-5 h-5 animate-spin text-red-500" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>{authStatus === "google-authenticating" ? "Connecting..." : "Google Account"}</span>
            </motion.button>

            <div 
              className="mt-8 pt-6 border-t text-center text-xs flex flex-col gap-2" 
              style={{ borderColor: theme.border, color: theme.mutedText }}
            >
              <p>Access is restricted to authorized personnel only.</p>
              <p>Don't have an account? <a href="#contact" className="text-red-500 font-semibold hover:underline">Contact Administrator</a></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}