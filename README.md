# IntelBoard AI — Forensic Criminal Intelligence & Pinboard Operating System

IntelBoard AI is an enterprise-grade digital forensic investigation platform and real-time collaborative evidence canvas. It bridges multimodal evidentiary ingestion, LangGraph multi-agent autonomous reasoning, on-premise local LLM inferencing, ChromaDB vector search, temporal anomaly detection, and court-admissible dossier generation.

---

## 1. Core Architectural Pillars

### Multimodal Evidence Vault & Chain of Custody
* **Cryptographic Hashing**: Ingested evidence files (documents, CCTV footage, wiretaps, phone extractions, and financial ledgers) are stamped with SHA-256 digital signatures to ensure evidentiary non-repudiation.
* **Optical Character Recognition (OCR) & Synopsis**: Automatically processes document scans, financial wires, and interrogation transcripts into searchable forensic representations.

### Autonomous LangGraph Multi-Agent Workflows
* **Ingestion Agent**: Ingests raw police reports, transcripts, and witness filings.
* **NER & Entity Extractor**: Extracts Named Entities (Suspects, Vehicles, Shell Corporations, Accounts, Locations).
* **Link Discovery Agent**: Identifies latent correlations across disparate case histories.
* **Anomaly & Contradiction Verifier**: Cross-references alibis against spatial and temporal telemetries to flag velocity and timeline impossibilities.
* **Synthesis Dossier Agent**: Compiles executive forensic dossiers with provenance and evidence citations.

### Air-Gapped Local LLM & ChromaDB Vector Store
* **On-Premises Privacy**: Out-of-the-box integration with Ollama (`llama3`, `mistral`, `deepseek-r1`) ensuring sensitive evidentiary records remain on secure precinct networks.
* **Semantic Vector Retrieval**: Document chunking and similarity search powered by ChromaDB.

### Real-Time WebSocket Collaboration
* **Precision Canvas Sync**: Live red-string pinboard synchronization across open detective sessions powered by `@xyflow/react` and Socket.io.
* **Roster Presence & Live Memos**: Instantaneous detective room roster tracking and peer-to-peer case memo broadcasts.

---

## 2. Platform Architecture

```
                                 [ Client Web Application ]
                                (React 19 + Vite + Tailwind)
                                             |
                                  (HTTP / WebSocket API)
                                             |
                                [ Express + Socket.io Server ]
                                             |
    +-------------------+--------------------+-------------------+-------------------+
    |                   |                    |                   |                   |
[ MongoDB ]      [ ChromaDB ]         [ Ollama / LLM ]    [ LangGraph Engine ] [ Audit Logger ]
 (Database)     (Vector Store)       (Local / Gemini)     (Multi-Agent Graph)  (Immutable Logs)
```

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Vite, TailwindCSS, `@xyflow/react`, `framer-motion`, `react-icons` |
| **Backend Services** | Node.js, Express, TypeScript, Socket.io, `@langchain/langgraph`, `@langchain/core` |
| **Databases** | MongoDB (Primary Store), ChromaDB (Vector Store) |
| **AI Inference** | Ollama Local LLMs (`llama3`, `mistral`, `deepseek-r1`), Google Gemini 2.5 Flash API |
| **Containerization** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 4. Repository Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── index.ts                     # Main Express server & Socket.io attachment
│   ├── src/
│   │   ├── config/                  # Database connections (MongoDB, ChromaDB)
│   │   ├── controllers/             # Case, Evidence, Graph, AI, and LangGraph controllers
│   │   ├── models/                  # Mongoose schemas (User, Case, Evidence, Audit, Graph)
│   │   ├── routes/                  # REST API routes
│   │   └── services/                # LLM Engine, ChromaDB, LangGraph, Socket.io
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf                   # Multi-stage production Nginx configuration
│   ├── vercel.json                  # Single-page application cloud routing configuration
│   ├── public/                      # Static assets & generated logo
│   ├── src/
│   │   ├── components/layout/       # App layout, mobile navigation drawer, header
│   │   ├── context/                 # AuthContext, ThemeContext, CaseContext, SocketContext
│   │   ├── pages/                   # SaaS Landing, Dashboard, Cases Kanban, Pinboard, Graph, etc.
│   │   ├── services/                # API client, WebSocket client, caseService, aiService
│   │   └── types/                   # TypeScript interfaces and entity types
│   └── package.json
├── docker-compose.yml               # Multi-container orchestration (5 core services)
├── DEPLOYMENT.md                    # Cloud, VPS, and Docker production deployment guide
└── README.md
```

---

## 5. Quick Start (Local Development)

### Prerequisites
* Node.js 20.x or later
* MongoDB running locally (`mongodb://localhost:27017`)
* (Optional) Ollama running locally (`http://localhost:11434`)
* (Optional) ChromaDB running locally (`http://localhost:8000`)

### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```
The backend server and WebSocket listener will initialize on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The client application will start on `http://localhost:5173`.

---

## 6. One-Command Docker Deployment

Deploy the entire five-container architecture (Frontend, Backend, MongoDB, ChromaDB, Ollama) with a single command:

```bash
docker compose up --build -d
```

### Deployed Services & Ports
* **Frontend Web Application**: `http://localhost` (Port 80)
* **Backend API & WebSockets**: `http://localhost:5000` (Port 5000)
* **ChromaDB Vector Database**: `http://localhost:8000` (Port 8000)
* **Ollama Local LLM Endpoint**: `http://localhost:11434` (Port 11434)
* **MongoDB Database**: `mongodb://localhost:27017` (Port 27017)

---

## 7. Operational Pages & Features

1. **SaaS Landing Page (`/`)**: Overview of the platform, modular capabilities, air-gapped security, and agency enlistment gateway.
2. **Investigation Dashboard (`/dashboard`)**: Tactical cockpit displaying active surveillance streams, AI risk indicators, and priority case summaries.
3. **Cases Kanban Matrix (`/cases`)**: Interactive drag-and-drop board tracking cases through investigation stages (`New Intake` ➔ `Active` ➔ `Under Investigation` ➔ `Review` ➔ `Closed`).
4. **Case Details Cockpit (`/cases/:caseId`)**: Multi-tab investigation station with Working Hypotheses, Evidence Vault, Suspect Profiles, Real-Time Socket Memos, and LangGraph Copilot.
5. **Collaborative Evidence Pinboard (`/cases/:caseId/board`)**: Infinite visual canvas with red-string node links and real-time WebSocket state broadcasting.
6. **Entity Relationship Graph (`/cases/:caseId/graph`)**: Directed graph depicting suspect hierarchies, shell corporations, and asset transfers.
7. **Crime Timeline & Velocity Engine (`/cases/:caseId/timeline`)**: Chronological event sequencing with automated alibi travel contradiction alerts.
8. **AI Intelligence Hub (`/cases/:caseId/ai-hub`)**: Autonomous multi-agent LangGraph workflow execution with ChromaDB semantic vector search.
9. **Formal Dossier Reports (`/cases/:caseId/reports`)**: Formatted case dossier and chain-of-custody report with 1-click print and PDF export.
10. **Forensic Audit Stream (`/audit-logs`)**: Immutable logging of every evidence touch, status transition, and user action.

---

## 8. Security & Standards Compliance

* **Cryptographic Integrity**: SHA-256 evidence hashing for proof of non-tampering.
* **Role-Based Access Control (RBAC)**: Enforces access tiers across investigators, supervisors, and administrative officers.
* **Audit Trail**: Every access, report download, and board modification is logged with IP address and officer badge number.
* **Air-Gapped Privacy**: Zero telemetry leakage when operated with local Ollama instances.

---

## 9. License

Proprietary Software — Criminal Investigation Division. All Rights Reserved.