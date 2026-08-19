import { Link } from "react-router-dom";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Unauthorized() {
  const { theme, themeMode } = useTheme();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center font-sans"
      style={{
        backgroundColor: themeMode === "light" ? "#ffffff" : "#000000",
        color: theme.text,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="max-w-md w-full p-8 rounded-3xl border shadow-2xl space-y-4"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 mx-auto">
          <FiShield className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-black tracking-tight">Access Restricted</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your current badge clearance does not authorize access to this tactical sector. Contact the Director to request elevated permissions.
        </p>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
