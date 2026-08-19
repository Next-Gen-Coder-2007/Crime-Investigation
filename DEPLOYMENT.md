# IntelBoard AI — Production Deployment Guide

This guide outlines deployment options for IntelBoard AI: Docker containerization, Cloud PaaS (Vercel + Render/Railway), and VPS On-Premises.

---

## 1. One-Command Docker Deployment (Recommended)

The platform includes full multi-container orchestration for the Frontend (Nginx), Backend (Express + Socket.io), MongoDB, ChromaDB (Vector Store), and Ollama (Local LLM).

### Prerequisites
* Docker Engine 24.0+ & Docker Compose v2.0+

### Steps
```bash
# 1. Clone or navigate to the project root
cd "Crime Investigation"

# 2. Build and launch all services in detached mode
docker compose up --build -d

# 3. Verify running containers
docker compose ps
```

### Endpoints
* **Frontend Web App**: `http://localhost` (Port 80)
* **Backend API & WebSockets**: `http://localhost:5000` (Port 5000)
* **ChromaDB Vector Store**: `http://localhost:8000` (Port 8000)
* **Ollama Local LLM**: `http://localhost:11434` (Port 11434)
* **MongoDB Database**: `mongodb://localhost:27017` (Port 27017)

---

## 2. Cloud PaaS Deployment (Vercel + Render / Railway + MongoDB Atlas)

### A. Database (MongoDB Atlas)
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create database user and obtain connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/intelboard?retryWrites=true&w=majority`

### B. Backend Deployment (Render or Railway)
1. Create a new Web Service pointing to the `/backend` directory.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Set Environment Variables:
   * `PORT`: `5000`
   * `MONGO_URI`: `<Your MongoDB Atlas URI>`
   * `JWT_SECRET`: `<A strong random 64-character secret>`
   * `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
   * `GEMINI_API_KEY`: `<Your Google Gemini API Key>`
   * `NODE_ENV`: `production`

### C. Frontend Deployment (Vercel)
1. Connect your repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Framework Preset: `Vite`.
4. Set Environment Variables:
   * `VITE_API_URL`: `https://your-backend-service.onrender.com`
5. Deploy. The `vercel.json` file handles all client-side routing rewrites automatically.

---

## 3. Ubuntu VPS / Air-Gapped On-Premises Deployment

### Prerequisites
* Ubuntu 22.04 LTS / Debian 12
* Node.js 20.x, Nginx, PM2

### Step-by-Step
```bash
# 1. Install Node.js 20 & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# 2. Build Backend
cd backend
npm install
npm run build
pm2 start dist/index.js --name "intelboard-api"

# 3. Build Frontend
cd ../frontend
npm install
npm run build

# 4. Copy Frontend build to Nginx root
sudo cp -r dist/* /var/www/html/

# 5. Enable PM2 on system boot
pm2 startup
pm2 save
```

---

## 4. Environment Variables Reference

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Express HTTP / Socket.io server port | `5000` |
| `MONGO_URI` | Backend | MongoDB database connection URI | `mongodb://localhost:27017/intelboard` |
| `JWT_SECRET` | Backend | Signing key for authentication tokens | `secret_jwt_key_2026` |
| `CLIENT_URL` | Backend | Allowed CORS client origin | `http://localhost:5173` |
| `GEMINI_API_KEY` | Backend | Cloud LLM integration key | `AIzaSy...` |
| `OLLAMA_BASE_URL` | Backend | Local LLM host endpoint | `http://localhost:11434` |
| `CHROMA_URL` | Backend | ChromaDB vector store endpoint | `http://localhost:8000` |
| `VITE_API_URL` | Frontend | Backend API & Socket endpoint | `http://localhost:5000` |
