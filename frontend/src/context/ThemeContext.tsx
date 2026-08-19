import React, { createContext, useContext, useState, useEffect } from "react";

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
    border: "#E4E4E7",
    primary: "#EF4444",
    primaryHover: "#DC2626",
    secondary: "#64748B",
    text: "#09090B",
    mutedText: "#52525B",
    accent: "#DC2626",
    gradientBg: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
    cardShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
    glassBg: "rgba(255, 255, 255, 0.92)",
    navBg: "rgba(255, 255, 255, 0.95)",
    badgeBg: "rgba(239, 68, 68, 0.1)",
    boardBg: "rgba(0, 0, 0, 0.03)",
    hoverOverlay: "rgba(0, 0, 0, 0.04)",
    amberBg: "#FEF3C7",
    amberBorder: "#FCD34D",
    amberText: "#78350F",
    progressBg: "rgba(0, 0, 0, 0.08)",
  },
  dark: {
    background: "#000000",
    surface: "#09090B",
    card: "#0A0A0A",
    cardHover: "#18181B",
    border: "#27272A",
    primary: "#EF4444",
    primaryHover: "#F87171",
    secondary: "#A1A1AA",
    text: "#FAFAFA",
    mutedText: "#A1A1AA",
    accent: "#EF4444",
    gradientBg: "linear-gradient(135deg, #09090B 0%, #000000 100%)",
    cardShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
    glassBg: "rgba(9, 9, 11, 0.9)",
    navBg: "rgba(0, 0, 0, 0.95)",
    badgeBg: "rgba(239, 68, 68, 0.15)",
    boardBg: "rgba(0, 0, 0, 0.6)",
    hoverOverlay: "rgba(255, 255, 255, 0.05)",
    amberBg: "rgba(69, 26, 3, 0.8)",
    amberBorder: "#92400E",
    amberText: "#FDE68A",
    progressBg: "rgba(255, 255, 255, 0.1)",
  },
};

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("intelboard_theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("intelboard_theme", themeMode);
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = themes[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, theme, toggleTheme }}>
      {children}
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