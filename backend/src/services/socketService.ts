import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

export interface Collaborator {
  socketId: string;
  userId?: string;
  name: string;
  badgeNumber?: string;
  color?: string;
  currentTab?: string;
  activeCaseId?: string;
}

export class SocketService {
  private static io: Server | null = null;
  private static caseCollaborators: Map<string, Map<string, Collaborator>> = new Map();

  static init(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost", "*"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      let activeCase: string | null = null;
      let currentUser: Collaborator | null = null;

      socket.on("join_case", (data: { caseId: string; user: { id?: string; name: string; badgeNumber?: string } }) => {
        if (activeCase) {
          socket.leave(`case_${activeCase}`);
          if (this.caseCollaborators.has(activeCase)) {
            this.caseCollaborators.get(activeCase)?.delete(socket.id);
            this.broadcastRoster(activeCase);
          }
        }

        activeCase = data.caseId;
        currentUser = {
          socketId: socket.id,
          userId: data.user?.id || socket.id,
          name: data.user?.name || "Detective",
          badgeNumber: data.user?.badgeNumber || "INV-9000",
          activeCaseId: data.caseId,
        };

        socket.join(`case_${data.caseId}`);

        if (!this.caseCollaborators.has(data.caseId)) {
          this.caseCollaborators.set(data.caseId, new Map());
        }
        this.caseCollaborators.get(data.caseId)?.set(socket.id, currentUser);

        this.broadcastRoster(data.caseId);
      });

      socket.on("cursor_move", (data: { caseId: string; x: number; y: number; name: string }) => {
        socket.to(`case_${data.caseId}`).emit("collaborator_cursor", {
          socketId: socket.id,
          name: data.name,
          x: data.x,
          y: data.y,
        });
      });

      socket.on("board_update", (data: { caseId: string; nodes: any[]; edges: any[]; updatedBy: string }) => {
        socket.to(`case_${data.caseId}`).emit("remote_board_update", data);
      });

      socket.on("evidence_ingested", (data: { caseId: string; evidence: any; ingestedBy: string }) => {
        this.io?.to(`case_${data.caseId}`).emit("remote_evidence_added", data);
      });

      socket.on("timeline_milestone_added", (data: { caseId: string; event: any; createdBy: string }) => {
        this.io?.to(`case_${data.caseId}`).emit("remote_timeline_added", data);
      });

      socket.on("case_chat_message", (data: { caseId: string; message: string; user: { name: string; badgeNumber?: string } }) => {
        const payload = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          caseId: data.caseId,
          user: data.user,
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        this.io?.to(`case_${data.caseId}`).emit("remote_case_message", payload);
      });

      socket.on("disconnect", () => {
        if (activeCase && this.caseCollaborators.has(activeCase)) {
          this.caseCollaborators.get(activeCase)?.delete(socket.id);
          this.broadcastRoster(activeCase);
        }
      });
    });
  }

  private static broadcastRoster(caseId: string) {
    if (!this.io) return;
    const roster = Array.from(this.caseCollaborators.get(caseId)?.values() || []);
    this.io.to(`case_${caseId}`).emit("case_roster_update", roster);
  }

  static getIO(): Server | null {
    return this.io;
  }
}
