import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserRole, LoginCredentials, RegisterData } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo accounts for rapid testing & evaluation
const DEMO_ACCOUNTS: Record<UserRole, LoginCredentials> = {
  admin: {
    email: "admin@intelboard.ai",
    password: "Admin@12345",
  },
  investigator: {
    email: "investigator@intelboard.ai",
    password: "Investigator@12345",
  },
  viewer: {
    email: "viewer@intelboard.ai",
    password: "Viewer@12345",
  },
};

const FALLBACK_USERS: Record<UserRole, User> = {
  admin: {
    id: "demo-admin-01",
    name: "Director Marcus Vance",
    email: "admin@intelboard.ai",
    badgeNumber: "DIR-001",
    role: "admin",
    department: "Special Operations Command",
    status: "active",
  },
  investigator: {
    id: "demo-inv-02",
    name: "Det. Sarah Chen",
    email: "investigator@intelboard.ai",
    badgeNumber: "INV-8402",
    role: "investigator",
    department: "Major Crimes & Intelligence",
    status: "active",
  },
  viewer: {
    id: "demo-view-03",
    name: "Analyst Elena Rostova",
    email: "viewer@intelboard.ai",
    badgeNumber: "ANA-3190",
    role: "viewer",
    department: "Cyber Forensics & Digital Vault",
    status: "active",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("intelboard_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authenticated session on initial mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await authService.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem("intelboard_user", JSON.stringify(response.user));
        }
      } catch {
        const saved = localStorage.getItem("intelboard_user");
        if (!saved) {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem("intelboard_user", JSON.stringify(response.user));
      }
    } catch (error: any) {
      // Offline fallback: check if credentials match demo accounts
      const matchedRole = (Object.keys(DEMO_ACCOUNTS) as UserRole[]).find(
        (r) =>
          DEMO_ACCOUNTS[r].email.toLowerCase() === credentials.email.toLowerCase() &&
          DEMO_ACCOUNTS[r].password === credentials.password
      );

      if (matchedRole) {
        const fallbackUser = FALLBACK_USERS[matchedRole];
        setUser(fallbackUser);
        localStorage.setItem("intelboard_user", JSON.stringify(fallbackUser));
        return;
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem("intelboard_user", JSON.stringify(response.user));
      }
    } catch {
      // Fallback register
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        badgeNumber: data.badgeNumber,
        role: data.role || "investigator",
        department: data.department || "Forensics & Intelligence Unit",
        status: "active",
      };
      setUser(newUser);
      localStorage.setItem("intelboard_user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    const creds = DEMO_ACCOUNTS[role];
    try {
      await login(creds);
    } catch {
      const fallbackUser = FALLBACK_USERS[role];
      setUser(fallbackUser);
      localStorage.setItem("intelboard_user", JSON.stringify(fallbackUser));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue client cleanup regardless
    } finally {
      setUser(null);
      localStorage.removeItem("intelboard_user");
    }
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        demoLogin,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
