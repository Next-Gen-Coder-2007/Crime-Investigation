# IntelBoard AI — Enterprise Criminal Intelligence & Digital Forensics Operating System

IntelBoard AI is an enterprise-grade digital forensic investigation platform, autonomous multi-agent reasoning engine, and real-time collaborative evidentiary canvas. Designed for law enforcement agencies, cyber defense units, and intelligence analysts, IntelBoard AI bridges multimodal evidentiary ingestion, LangGraph multi-agent autonomous reasoning, on-premises air-gapped local LLM inferencing, ChromaDB vector search, temporal anomaly detection, real-time WebSocket state synchronization, and court-admissible dossier compilation.

---

## 1. System Mission & Core Architectural Pillars

### Multimodal Evidence Vault & Cryptographic Chain of Custody
* **SHA-256 Evidentiary Hashing**: Every ingested artifact (surveillance video, wiretap intercepts, forensic drive images, scanned manifests, and bank ledgers) receives an immutable cryptographic fingerprint at the moment of intake to guarantee non-repudiation.
* **Optical Character Recognition (OCR) & Structured Extraction**: Ingested documents and logs are converted into searchable, vector-indexed text corpora for rapid semantic retrieval.
* **Granular Chain of Custody Logging**: Every touch, tag addition, review approval, or hash verification is recorded in the immutable audit ledger with timestamps, officer identities, and network metadata.

### Autonomous LangGraph Multi-Agent Pipeline
The system integrates an autonomous multi-agent stategraph (`@langchain/langgraph`) that executes five specialized forensic agents in sequential and cyclic topologies:
1. **Ingestion & Normalization Agent**: Parses unstructured raw dockets, transcripts, and evidence logs into structured state payloads.
2. **Named Entity Recognition (NER) Agent**: Discovers and classifies named entities including Suspects, Organizations, Shell Companies, Financial Accounts, Phone Numbers, Vehicles, and Geo-Locations.
3. **Link Discovery & Correlation Agent**: Computes relationship edges and cross-docket associations across disparate cases in the vector repository.
4. **Temporal Anomaly & Velocity Verifier**: Evaluates suspect alibis and timestamped appearances against spatial velocity models, flagging physical and logical contradictions.
5. **Dossier Synthesis Agent**: Generates executive briefs, risk indices, and actionable investigative leads supported by evidentiary citations.

### Air-Gapped Local LLM Inference & ChromaDB Vector Store
* **Zero-Exfiltration Air-Gapped Operation**: Native support for on-premises Local Large Language Models (`llama3`, `mistral`, `deepseek-r1`, `qwen2.5`) hosted via local Ollama instances, ensuring sensitive records never traverse third-party cloud infrastructure.
* **Cloud Fallback Mode**: Configurable integration with Google Gemini 2.5 Flash API for cloud-hosted deployments.
* **High-Density Vector Storage**: ChromaDB embeddings engine indexing evidentiary documents for real-time Retrieval-Augmented Generation (RAG) and semantic similarity discovery.

### Real-Time Precinct Collaboration & Access Clearance Gate
* **Case Clearance Request & Approval Gate**: Sealed case operations require investigators to submit formal access requests. Case Creators and Lead Officers review, approve, or reject access requests with an immutable audit trail.
* **Precision Pinboard State Sync**: Visual evidence boards synchronize in real-time across connected investigators using WebSocket data streams (`@xyflow/react` and Socket.io).
* **Live Forensic Memos**: Instantaneous precinct chat and memo stream broadcasted strictly within active case rooms.

---

## 2. High-Level System Architecture

```
                                      [ Client Web Applications ]
                                 (React 19 + TypeScript + Vite + Tailwind)
                                                     |
                                   +-----------------+-----------------+
                                   |                                   |
                             (REST API HTTPS)                  (WebSockets WSS)
                                   |                                   |
                                   v                                   v
                          [ Express REST Router ]             [ Socket.io Server ]
                                   |                                   |
                        +----------+----------+                        |
                        |                     |                        |
                        v                     v                        v
                [ Security & RBAC ]   [ Audit Engine ]        [ Real-Time Sync ]
                (JWT / Bcrypt / CORS) (SHA-256 Ledger)        (Rooms / Presence)
                        |                     |                        |
    +-------------------+---------------------+------------------------+-------------------+
    |                   |                     |                        |                   |
    v                   v                     v                        v                   v
[ MongoDB Atlas ] [ ChromaDB Vector ] [ Ollama Local LLMs ] [ LangGraph Engine ] [ File Vault ]
 (Primary State)   (768d Embeddings)   (Llama3 / Deepseek)   (StateGraph Agents) (SHA-256 Signed)
```

---

## 3. Technology Stack Matrix

| Domain | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 19.2.0 | High-performance reactive UI rendering |
| **Language (Fullstack)** | TypeScript | 5.x | Strict domain type safety |
| **Build & Bundler** | Vite | 8.2.0 | Instant HMR and optimized production bundling |
| **Styling & Design** | Vanilla CSS / Tailwind | 4.x | High-contrast law enforcement Red/White/Black theme |
| **Graph & Canvas** | @xyflow/react | 12.x | Infinite visual node-edge evidence pinboard |
| **Motion & Micro-UI** | Framer Motion | 12.x | Smooth tactical transition states |
| **Icons** | React Icons (Feather) | 5.x | Minimalist interface iconography |
| **Backend Runtime** | Node.js | 20.x | Scalable asynchronous runtime |
| **Web Framework** | Express | 4.21.x | REST API endpoint routing and middleware |
| **Real-Time Engine** | Socket.io | 4.8.x | Low-latency bi-directional WebSocket syncing |
| **Agentic Framework** | LangGraph / LangChain | 0.2.x | Autonomous cyclic multi-agent stategraph engine |
| **Vector Database** | ChromaDB | Latest | Document embeddings and semantic similarity |
| **Local LLM Engine** | Ollama | Latest | Air-gapped on-premise model execution |
| **Primary Database** | MongoDB & Mongoose | 8.x | Document schema storage with relational refs |
| **Authentication** | JWT & BcryptJS | Latest | Cryptographic stateless sessions & password hashing |
| **Web Server / Reverse Proxy** | Nginx | Alpine | Static asset hosting, SSL termination, and proxy |
| **Containerization** | Docker & Compose | Latest | Multi-container unified deployment |

---

## 4. Multi-Agent StateGraph Architecture

```
                    +-----------------------------+
                    |        START: Raw Input     |
                    +-----------------------------+
                                   |
                                   v
                    +-----------------------------+
                    |    Ingestion & Clean Agent  |
                    +-----------------------------+
                                   |
                                   v
                    +-----------------------------+
                    |   NER & Entity Extractor    |
                    +-----------------------------+
                                   |
                                   v
                    +-----------------------------+
                    |    Link Discovery Agent     |
                    +-----------------------------+
                                   |
                                   v
                    +-----------------------------+
                    |  Temporal Anomaly Verifier  |
                    +-----------------------------+
                                   |
                                   v
                    +-----------------------------+
                    |   Synthesis Dossier Agent   |
                    +-----------------------------+
                                   |
                                   v
                    +-----------------------------+
                    |      END: Final Dossier     |
                    +-----------------------------+
```

---

## 5. Repository Directory Layout

```
.
├── backend/
│   ├── Dockerfile                   # Multi-stage Node.js container
│   ├── index.ts                     # Express application & Socket.io server
│   ├── package.json                 # Backend dependencies & build scripts
│   ├── tsconfig.json                # TypeScript compiler configuration
│   └── src/
│       ├── config/
│       │   └── db.ts                # MongoDB connection lifecycle manager
│       ├── controllers/
│       │   ├── aiController.ts      # Vector search & RAG endpoints
│       │   ├── authController.ts    # Authentication & officer profile
│       │   ├── boardController.ts   # Visual pinboard persistence
│       │   ├── caseController.ts    # Case CRUD, status, and clearance approval
│       │   ├── entityController.ts  # Suspects, locations, and vehicles
│       │   ├── evidenceController.ts# Evidence intake & SHA-256 stamping
│       │   ├── langgraphController.ts# Multi-agent stategraph execution
│       │   ├── relationshipController.ts# Directed graph associations
│       │   ├── reportController.ts  # Court dossier compilation
│       │   ├── taskController.ts    # Tactical assignment tracking
│       │   └── timelineController.ts# Chronological event sequencing
│       ├── middleware/
│       │   ├── auditLogger.ts       # Cryptographic audit trailing
│       │   └── auth.ts              # JWT extraction & RBAC verification
│       ├── models/
│       │   ├── AuditLog.ts          # Immutable audit ledger schema
│       │   ├── Board.ts             # Pinboard nodes & edges schema
│       │   ├── Case.ts              # Case schema with access requests
│       │   ├── Entity.ts            # Mapped forensic entity schema
│       │   ├── Evidence.ts          # Multimodal evidence schema
│       │   ├── Relationship.ts      # Inter-entity connection schema
│       │   ├── Report.ts            # Official case report schema
│       │   ├── Task.ts              # Tactical task schema
│       │   ├── TimelineEvent.ts     # Chronological incident schema
│       │   └── User.ts              # Officer credentials & clearance tier
│       ├── routes/                  # Express REST route definitions
│       ├── services/
│       │   ├── aiService.ts         # LLM abstraction (Ollama / Gemini)
│       │   ├── chromaService.ts     # ChromaDB vector collection manager
│       │   ├── investigationGraph.ts# LangGraph stategraph implementation
│       │   └── socketService.ts     # Socket.io event orchestration
│       └── utils/
│           ├── jwt.ts               # Token signing & verification utilities
│           └── seed.ts              # Production database initialization
├── frontend/
│   ├── Dockerfile                   # Multi-stage production Nginx container
│   ├── index.html                   # HTML5 entry with logo & SEO meta
│   ├── nginx.conf                   # Production Nginx reverse proxy configuration
│   ├── package.json                 # Frontend dependencies & build scripts
│   ├── tsconfig.json                # TypeScript project configuration
│   ├── vercel.json                  # Single-page application SPA rewrite rule
│   ├── vite.config.ts               # Vite bundler & proxy configuration
│   ├── public/
│   │   ├── favicon.ico              # Forensic emblem favicon
│   │   └── logo.png                 # Generated cyber intelligence emblem
│   └── src/
│       ├── App.tsx                  # Client router & protective route boundary
│       ├── index.css                # Base theme CSS variables & fonts
│       ├── main.tsx                 # React DOM mount entry
│       ├── assets/                  # Brand assets & icons
│       ├── components/
│       │   ├── auth/                # Guarded authentication wrapper
│       │   └── layout/              # Responsive AppLayout with mobile drawer
│       ├── context/
│       │   ├── AuthContext.tsx      # User session lifecycle manager
│       │   ├── CaseContext.tsx      # Active case state & database loader
│       │   ├── SocketContext.tsx    # Live WebSocket connection & roster
│       │   └── ThemeContext.tsx     # High-contrast Light/Dark mode provider
│       ├── pages/
│       │   ├── AiIntelligenceHub.tsx# Multi-agent execution cockpit
│       │   ├── AuditLogs.tsx        # Forensic audit trail explorer
│       │   ├── CaseDetails.tsx      # Case station & clearance approval tab
│       │   ├── Cases.tsx            # Kanban operational matrix & table
│       │   ├── Copilot.tsx          # Real-time RAG conversational analyst
│       │   ├── Dashboard.tsx        # Command cockpit & metric aggregate
│       │   ├── EvidenceBoard.tsx    # Collaborative ReactFlow pinboard
│       │   ├── Home.tsx             # SaaS landing page with enlistment CTA
│       │   ├── Login.tsx            # Officer credentials authentication
│       │   ├── Register.tsx         # Agency profile creation
│       │   ├── RelationshipGraph.tsx# Interactive entity network graph
│       │   ├── Reports.tsx          # Formal case dossier export & print
│       │   └── Timeline.tsx         # Temporal anomaly & velocity engine
│       ├── services/                # Axios API client & typed endpoint calls
│       └── types/                   # TypeScript interfaces & domain models
├── docker-compose.yml               # Unified 5-container production deployment
├── DEPLOYMENT.md                    # Cloud (Vercel/Render) & VPS deployment guide
└── README.md
```

---

## 6. REST API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Enlists a new agency profile and creates an officer account |
| `POST` | `/api/auth/login` | Public | Authenticates officer credentials and issues signed JWT |
| `GET` | `/api/auth/me` | Private | Retrieves current authenticated officer profile |
| `POST` | `/api/auth/logout` | Private | Clears session cookie and invalidates client session |

### Case Operations Endpoints (`/api/cases`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cases` | Private | Retrieves all accessible investigation cases with filters |
| `GET` | `/api/cases/:id` | Private | Retrieves single case with computed live metrics |
| `POST` | `/api/cases` | Investigator | Initiates a new investigation case operation |
| `PATCH` | `/api/cases/:id/status` | Investigator | Transitions case through Kanban operational phases |
| `POST` | `/api/cases/:id/request-access` | Private | Submits a clearance request to collaborate on a case |
| `PUT` | `/api/cases/:id/access-requests/:requestId` | Lead / Admin | Approves or rejects an access clearance request |
| `GET` | `/api/cases/:id/access-requests` | Private | Retrieves full access request history and authorized roster |
| `DELETE` | `/api/cases/:id` | Admin | Permanently archives and deletes a case record |

### Evidence Vault Endpoints (`/api/evidence`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/evidence/case/:caseId` | Private | Retrieves all evidence records for a specific case |
| `POST` | `/api/evidence` | Investigator | Ingests new evidence record with SHA-256 digital stamp |
| `PATCH` | `/api/evidence/:id/review` | Supervisor | Approves, rejects, or flags evidence review status |
| `DELETE` | `/api/evidence/:id` | Admin | Purges evidence artifact from the registry |

### Artificial Intelligence Endpoints (`/api/ai` & `/api/agents`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/query` | Private | Queries RAG system grounded in case evidence embeddings |
| `POST` | `/api/ai/summarize-evidence` | Private | Generates forensic summary for ingested artifact |
| `POST` | `/api/agents/langgraph/run` | Private | Triggers autonomous 5-agent LangGraph stategraph analysis |

---

## 7. Real-Time WebSocket Protocols (Socket.io)

### Client ➔ Server Events
| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `join_case` | `{ caseId, user }` | Joins a secure room for real-time collaboration |
| `case_chat_message` | `{ caseId, message, user }` | Broadcasts an investigative memo to the case room |
| `board_update` | `{ caseId, nodes, edges, updatedBy }` | Syncs pinboard node movements and edge links |
| `evidence_ingested` | `{ caseId, evidence, ingestedBy }` | Notifies active detectives of new evidence intake |

### Server ➔ Client Broadcasts
| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `case_roster_update` | `ActiveCollaborator[]` | Broadcasts live connected detective roster |
| `remote_case_message` | `CaseChatMessage` | Delivers real-time memo to all detectives in room |
| `remote_board_update` | `{ caseId, nodes, edges }` | Updates canvas positions across peer viewports |
| `remote_evidence_added`| `{ caseId, evidence }` | Renders incoming evidence in the live vault |

---

## 8. Local Setup & Quickstart

### Prerequisites
* Node.js `20.x` or later
* MongoDB running locally or MongoDB Atlas connection string
* (Optional) Ollama running locally on port `11434`
* (Optional) ChromaDB running locally on port `8000`

### Step 1: Clone Repository
```bash
git clone https://github.com/Next-Gen-Coder-2007/Crime-Investigation.git
cd Crime-Investigation
```

### Step 2: Backend Configuration & Start
```bash
cd backend
npm install
npm run build
npm start
```
The backend server and WebSocket listener will initialize on `http://localhost:5000`.

### Step 3: Frontend Client Start
```bash
cd ../frontend
npm install
npm run dev
```
The frontend web application will start on `http://localhost:5173`.

---

## 9. One-Command Docker Multi-Container Deployment

To deploy the unified five-container platform (Frontend, Backend, MongoDB, ChromaDB, Ollama) on any server or workstation:

```bash
docker compose up --build -d
```

### Container Port Mapping
* **Frontend Web Application (Nginx)**: `http://localhost:80`
* **Backend API & WebSockets**: `http://localhost:5000`
* **ChromaDB Vector Database**: `http://localhost:8000`
* **Ollama Local LLM Endpoint**: `http://localhost:11434`
* **MongoDB Database**: `mongodb://localhost:27017`

---

## 10. Production Cloud Deployment

For production deployments on cloud infrastructure:
1. **Frontend (Vercel / Netlify)**: Deploy `frontend/` directory with `VITE_API_URL` set to the backend production URL.
2. **Backend (Render / Railway / Koyeb)**: Deploy `backend/` as a Node.js web service with persistent WebSocket support.
3. **Database (MongoDB Atlas)**: Connect via `MONGO_URI` connection string.
4. **Detailed Step-by-Step Instructions**: Refer to [`DEPLOYMENT.md`](file:///e:/Crime%20Investigation/DEPLOYMENT.md) for full cloud configuration guides and environment variable templates.

---

## 11. Security, Non-Repudiation & Standards

* **Stateless Security**: Cryptographic JSON Web Tokens (JWT) with HTTP-only cookies and Bearer token headers.
* **Role-Based Clearance**: Enforces compartmentalized clearance tiers across investigators, supervisors, and administrative personnel.
* **Audit Non-Repudiation**: Immutable tracking of every case access, status change, evidence intake, and export action.
* **Air-Gapped Privacy**: Zero data leakage when operating with on-premises Local LLM instances.

---

## 12. Intellectual Property & Rights

IntelBoard AI — Forensic Criminal Intelligence & Digital Investigation Platform. Proprietary Software. All Rights Reserved.