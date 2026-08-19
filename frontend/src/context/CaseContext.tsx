import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { caseService } from "../services/caseService";
import type { Case } from "../types/case";

export interface ActiveCollaborator {
  id: string;
  name: string;
  badge: string;
  status: "active" | "idle" | "investigating";
  currentView: string;
}

interface CaseContextType {
  cases: Case[];
  activeCase: Case | null;
  activeCaseId: string;
  setActiveCaseId: (id: string) => void;
  collaborators: ActiveCollaborator[];
  refreshCases: () => Promise<void>;
  isLoading: boolean;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCaseId, setActiveCaseIdState] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await caseService.getCases();
      if (res.success && res.cases) {
        setCases(res.cases);
        if (res.cases.length > 0 && !activeCaseId) {
          setActiveCaseIdState(res.cases[0].caseNumber || res.cases[0]._id);
        }
      } else {
        setCases([]);
      }
    } catch {
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCaseId]);

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  const setActiveCaseId = (id: string) => {
    setActiveCaseIdState(id);
  };

  const activeCase = cases.find((c) => c.caseNumber === activeCaseId || c._id === activeCaseId) || cases[0] || null;

  const collaborators: ActiveCollaborator[] = activeCase?.collaborators?.map((c) => ({
    id: c.userId,
    name: c.name,
    badge: c.badgeNumber,
    status: "active",
    currentView: "Active Case Cockpit",
  })) || [];

  return (
    <CaseContext.Provider
      value={{
        cases,
        activeCase,
        activeCaseId: activeCase?.caseNumber || activeCaseId,
        setActiveCaseId,
        collaborators,
        refreshCases,
        isLoading,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useActiveCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error("useActiveCase must be used within a CaseProvider");
  }
  return context;
};
