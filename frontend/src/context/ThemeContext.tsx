import React, { createContext, useContext, useState } from "react";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  cardHover: string;
  border: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  text: string;
  mutedText: string;
  accent: string;
  gradientBg: string;
  cardShadow: string;
  glassBg: string;
  navBg: string;
  badgeBg: string;
  boardBg: string;
  hoverOverlay: string;
  amberBg: string;
  amberBorder: string;
  amberText: string;
  progressBg: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    cardHover: "#F1F5F9",
    border: "#E2E8F0",
    primary: "#EF4444",
    primaryHover: "#DC2626",
    secondary: "#64748B",
    text: "#0F172A",
    mutedText: "#475569",
    accent: "#991B1B",
    gradientBg: "linear-gradient(135deg, #FEF2F2 0%, #F8FAFC 100%)",
    cardShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    glassBg: "rgba(255, 255, 255, 0.8)",
    navBg: "rgba(255, 255, 255, 0.85)",
    badgeBg: "rgba(239, 68, 68, 0.1)",
    boardBg: "rgba(0, 0, 0, 0.05)",
    hoverOverlay: "rgba(0, 0, 0, 0.05)",
    amberBg: "#FEF3C7", // amber-100
    amberBorder: "#FCD34D", // amber-300
    amberText: "#78350F", // amber-900
    progressBg: "rgba(0, 0, 0, 0.1)"
  },
  dark: {
    background: "#090A0F",
    surface: "#11131A",
    card: "#161922",
    cardHover: "#1E222D",
    border: "#262B3D",
    primary: "#EF4444",
    primaryHover: "#F87171",
    secondary: "#94A3B8",
    text: "#F8FAFC",
    mutedText: "#94A3B8",
    accent: "#FCA5A5",
    gradientBg: "linear-gradient(135deg, #11131A 0%, #090A0F 100%)",
    cardShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
    glassBg: "rgba(17, 19, 26, 0.8)",
    navBg: "rgba(9, 10, 15, 0.85)",
    badgeBg: "rgba(239, 68, 68, 0.15)",
    boardBg: "rgba(0, 0, 0, 0.4)",
    hoverOverlay: "rgba(255, 255, 255, 0.05)",
    amberBg: "rgba(69, 26, 3, 0.8)", // amber-950/80
    amberBorder: "#92400E", // amber-800
    amberText: "#FDE68A", // amber-200
    progressBg: "rgba(255, 255, 255, 0.1)"
  }
};

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = themes[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, theme, toggleTheme }}>
      <div 
        style={{ backgroundColor: theme.background, color: theme.text }} 
        className="min-h-screen font-['Poppins'] transition-colors duration-500 selection:bg-red-500 selection:text-white"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};