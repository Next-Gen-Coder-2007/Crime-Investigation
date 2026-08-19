import http from "http";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { SocketService } from "./src/services/socketService.js";
import authRoutes from "./src/routes/authRoutes.js";
import caseRoutes from "./src/routes/caseRoutes.js";
import evidenceRoutes from "./src/routes/evidenceRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import boardRoutes from "./src/routes/boardRoutes.js";
import entityRoutes from "./src/routes/entityRoutes.js";
import relationshipRoutes from "./src/routes/relationshipRoutes.js";
import timelineRoutes from "./src/routes/timelineRoutes.js";
import copilotRoutes from "./src/routes/copilotRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import auditRoutes from "./src/routes/auditRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import langgraphRoutes from "./src/routes/langgraphRoutes.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

SocketService.init(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    system: "IntelBoard AI",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/entities", entityRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/agents", langgraphRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "IntelBoard AI API",
    status: "active",
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();

export default app;
