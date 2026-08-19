import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSocket } from "../services/socketClient";
import type { Socket } from "socket.io-client";

export interface ActiveCollaborator {
  socketId: string;
  userId?: string;
  name: string;
  badgeNumber?: string;
  activeCaseId?: string;
}

export interface CaseChatMessage {
  id: string;
  caseId: string;
  user: { name: string; badgeNumber?: string };
  message: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket;
  connected: boolean;
  roster: ActiveCollaborator[];
  chatMessages: CaseChatMessage[];
  joinCase: (caseId: string, user: { id?: string; name: string; badgeNumber?: string }) => void;
  sendCaseMessage: (caseId: string, message: string, user: { name: string; badgeNumber?: string }) => void;
  broadcastBoardUpdate: (caseId: string, nodes: any[], edges: any[], updatedBy: string) => void;
  broadcastEvidenceAdded: (caseId: string, evidence: any, ingestedBy: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket] = useState<Socket>(() => getSocket());
  const [connected, setConnected] = useState(socket.connected);
  const [roster, setRoster] = useState<ActiveCollaborator[]>([
    { socketId: "mock-1", name: "Det. Sarah Chen", badgeNumber: "INV-8402" },
    { socketId: "mock-2", name: "Elena Rostova", badgeNumber: "ANL-3109" },
  ]);
  const [chatMessages, setChatMessages] = useState<CaseChatMessage[]>([
    {
      id: "init-1",
      caseId: "CASE-2026-0715",
      user: { name: "Det. Sarah Chen", badgeNumber: "INV-8402" },
      message: "Subpoenaed container manifest #AMF-9901 logged. Weight variance flag active.",
      timestamp: "23:40",
    },
  ]);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleRosterUpdate = (updatedRoster: ActiveCollaborator[]) => {
      if (updatedRoster && updatedRoster.length > 0) {
        setRoster(updatedRoster);
      }
    };

    const handleIncomingMessage = (msg: CaseChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("case_roster_update", handleRosterUpdate);
    socket.on("remote_case_message", handleIncomingMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("case_roster_update", handleRosterUpdate);
      socket.off("remote_case_message", handleIncomingMessage);
    };
  }, [socket]);

  const joinCase = useCallback((caseId: string, user: { id?: string; name: string; badgeNumber?: string }) => {
    socket.emit("join_case", { caseId, user });
  }, [socket]);

  const sendCaseMessage = useCallback((caseId: string, message: string, user: { name: string; badgeNumber?: string }) => {
    socket.emit("case_chat_message", { caseId, message, user });
  }, [socket]);

  const broadcastBoardUpdate = useCallback((caseId: string, nodes: any[], edges: any[], updatedBy: string) => {
    socket.emit("board_update", { caseId, nodes, edges, updatedBy });
  }, [socket]);

  const broadcastEvidenceAdded = useCallback((caseId: string, evidence: any, ingestedBy: string) => {
    socket.emit("evidence_ingested", { caseId, evidence, ingestedBy });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        roster,
        chatMessages,
        joinCase,
        sendCaseMessage,
        broadcastBoardUpdate,
        broadcastEvidenceAdded,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
