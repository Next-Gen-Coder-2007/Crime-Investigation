import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiLock,
  FiUser,
  FiMail,
  FiBriefcase,
  FiShield,
  FiArrowLeft,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { theme, themeMode } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [department, setDepartment] = useState("Major Crimes & Intelligence");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await register({
        name,
        email,
        password,
        badgeNumber: badgeNumber || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        department,
        role: "investigator",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative font-sans"
      style={{
        backgroundColor: themeMode === "light" ? "#f8fafc" : "#000000",
        color: themeMode === "light" ? "#09090b" : "#ffffff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-zinc-400 hover:text-red-500 font-semibold transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div
        className="w-full max-w-lg p-8 rounded-3xl border shadow-2xl space-y-6"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="text-center space-y-1">
          <img
            src="/logo.png"
            alt="IntelBoard AI Logo"
            className="w-12 h-12 rounded-2xl object-cover border border-red-600/40 mx-auto mb-3 shadow-xl shadow-red-600/30"
          />
          <h2 className="text-xl font-black tracking-tight" style={{ color: theme.text }}>
            Enlist Investigator Profile
          </h2>
          <p className="text-xs text-zinc-400">
            Register your authorized credentials to join the precinct investigation workspace.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center gap-2 text-red-500 text-xs font-semibold">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Det. Sarah Chen"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Agency Email *</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@intelboard.ai"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Badge ID</label>
              <div className="relative">
                <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="INV-8402"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Department / Division</label>
            <div className="relative">
              <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Major Crimes & Intelligence Division"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Passcode *</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
          >
            <FiCheck className="w-4 h-4" />
            <span>{isLoading ? "Enlisting..." : "Create Investigator Profile"}</span>
          </button>
        </form>

        <div className="pt-4 border-t text-center text-xs text-zinc-400" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
          <span>Already authorized? </span>
          <Link to="/login" className="text-red-500 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
