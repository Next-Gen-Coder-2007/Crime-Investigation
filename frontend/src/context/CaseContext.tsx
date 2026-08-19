import React, { createContext, useContext, useState, useEffect } from "react";
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
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCaseId, setActiveCaseIdState] = useState<string>("CASE-2026-0715");

  const [collaborators] = useState<ActiveCollaborator[]>([
    { id: "collab-1", name: "Det. Sarah Chen", badge: "INV-8402", status: "active", currentView: "Evidence Board" },
    { id: "collab-2", name: "Elena Rostova", badge: "ANL-4109", status: "investigating", currentView: "Timeline" },
    { id: "collab-3", name: "Marcus Vance", badge: "DIR-0001", status: "idle", currentView: "Cockpit" },
  ]);

  const refreshCases = async () => {
    try {
      const res = await caseService.getCases();
      if (res.success && res.cases && res.cases.length > 0) {
        setCases(res.cases);
      }
    } catch {
      setCases([
        {
          _id: "demo-case-1",
          caseNumber: "CASE-2026-0715",
          title: "Operation Nightfall: Port Horizon Syndicate",
          description: "Multi-agency investigation into cross-border illicit logistics, shell entities, and high-value cargo diversion at Port Horizon Terminal 4.",
          status: "under_investigation",
          priority: "high",
          category: "Organized Crime",
          leadInvestigator: "Det. Sarah Chen",
          assignedMembers: ["Det. Sarah Chen", "Elena Rostova"],
          tags: ["Port Horizon", "Smuggling", "Shell Corporation"],
          location: "Port Horizon Dock 4",
          metrics: { evidenceCount: 4, entityCount: 5, timelineCount: 4, taskCount: 3, riskScore: 78 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "demo-case-2",
          caseNumber: "CASE-2026-0801",
          title: "Operation Phantom Wire: Financial Laundering Network",
          description: "Tracing rapid layering transactions across offshore fintech accounts suspected of laundering contraband proceeds.",
          status: "active",
          priority: "critical",
          category: "Financial Fraud",
          leadInvestigator: "Det. Sarah Chen",
          assignedMembers: ["Det. Sarah Chen", "Marcus Vance"],
          tags: ["Wire Fraud", "Crypto Exchange", "Offshore"],
          location: "Metropolitan Financial District",
          metrics: { evidenceCount: 3, entityCount: 4, timelineCount: 3, taskCount: 2, riskScore: 85 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "demo-case-3",
          caseNumber: "CASE-2026-0640",
          title: "Cyber Infiltration: Aegis Defense Subnet Breach",
          description: "Unauthorized lateral movement and key exfiltration inside secure communications infrastructure.",
          status: "review",
          priority: "medium",
          category: "Cybercrime",
          leadInvestigator: "Elena Rostova",
          assignedMembers: ["Elena Rostova"],
          tags: ["Cyber", "Telecom", "Exfiltration"],
          location: "Aegis Data Center Sector 3",
          metrics: { evidenceCount: 2, entityCount: 3, timelineCount: 2, taskCount: 1, riskScore: 62 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    refreshCases();
  }, []);

  const setActiveCaseId = (id: string) => {
    setActiveCaseIdState(id);
  };

  const activeCase = cases.find((c) => c.caseNumber === activeCaseId || c._id === activeCaseId) || cases[0] || null;

  return (
    <CaseContext.Provider
      value={{
        cases,
        activeCase,
        activeCaseId: activeCase?.caseNumber || activeCaseId,
        setActiveCaseId,
        collaborators,
        refreshCases,
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
