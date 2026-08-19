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
  const [roster, setRoster] = useState<ActiveCollaborator[]>([]);
  const [chatMessages, setChatMessages] = useState<CaseChatMessage[]>([]);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleRosterUpdate = (updatedRoster: ActiveCollaborator[]) => {
      setRoster(updatedRoster || []);
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
    if (!caseId) return;
    socket.emit("join_case", { caseId, user });
  }, [socket]);

  const sendCaseMessage = useCallback((caseId: string, message: string, user: { name: string; badgeNumber?: string }) => {
    if (!caseId || !message) return;
    socket.emit("case_chat_message", { caseId, message, user });
  }, [socket]);

  const broadcastBoardUpdate = useCallback((caseId: string, nodes: any[], edges: any[], updatedBy: string) => {
    if (!caseId) return;
    socket.emit("board_update", { caseId, nodes, edges, updatedBy });
  }, [socket]);

  const broadcastEvidenceAdded = useCallback((caseId: string, evidence: any, ingestedBy: string) => {
    if (!caseId) return;
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
