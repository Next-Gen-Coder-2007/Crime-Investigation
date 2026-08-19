import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CaseProvider } from "./context/CaseContext";
import { SocketProvider } from "./context/SocketContext";
import useLenis from "./hooks/useLenis";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetails from "./pages/CaseDetails";
import EvidenceBoard from "./pages/EvidenceBoard";
import RelationshipGraph from "./pages/RelationshipGraph";
import AiIntelligenceHub from "./pages/AiIntelligenceHub";
import Timeline from "./pages/Timeline";
import Copilot from "./pages/Copilot";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Unauthorized from "./pages/Unauthorized";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  useLenis();

  return (
    <ThemeProvider>
      <AuthProvider>
        <CaseProvider>
          <SocketProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Cases />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases/:caseId"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CaseDetails />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases/:caseId/board"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <EvidenceBoard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases/:caseId/graph"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <RelationshipGraph />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases/:caseId/timeline"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Timeline />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases/:caseId/copilot"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Copilot />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases/:caseId/ai-hub"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AiIntelligenceHub />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/cases/:caseId/reports"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Reports />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/audit-logs"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AuditLogs />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </SocketProvider>
        </CaseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
