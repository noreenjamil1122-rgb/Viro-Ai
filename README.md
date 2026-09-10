# 🚀 ViroAI — Multi-Agent AI Social Media Intelligence Platform

ViroAI is an AI-powered social media intelligence and automation platform. It empowers content creators, marketing teams, and enterprises to draft multi-platform posts, research viral hashtags, generate reel storyboards, benchmark competitors with automated SWOT analysis, and track cross-network analytics.

---

## 🌟 Key Features

- **Multi-Platform Content Generator:** Generate tailor-made captions, hooks, and call-to-actions for Instagram, LinkedIn, Twitter/X, Facebook, TikTok, and YouTube.
- **AI Competitor Intelligence:** Benchmark industry rivals with strategic SWOT breakdowns and engagement scoring.
- **Reel & Video Storyboarding:** Draft multi-scene video scripts complete with visual cues, camera directions, voiceover scripts, and audio recommendations.
- **AI Hashtag & Trend Engine:** Intelligent niche hashtag discovery with competition analysis and estimated reach.
- **Unified Social Calendar:** Schedule, draft, approve, and manage posts across multiple social channels in one centralized view.
- **Real-Time Analytics Synthesis:** Track follower growth, engagement rates, click-through rates, and audience sentiment.
- **Dual Persistence Architecture:** Standalone Node.js/Express backend connected to **MongoDB Atlas Cloud** with instant local mirror fallback for seamless offline capability.

---

## 🏗️ System Architecture & Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/) with automated `/api` reverse proxying
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism UI
- **Icons & Visuals:** [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/), Canvas Confetti
- **State Management:** React Context API (`AuthContext`, `AppContext`)

### Backend (`backend/`)
- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express](https://expressjs.com/) with TypeScript (`tsx watch`)
- **Database Engine:** [MongoDB Atlas Cloud](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/) ODM
- **Authentication:** JSON Web Tokens (JWT) + Bcrypt password hashing
- **AI Engine:** [Google Gemini Gen AI SDK](https://www.npmjs.com/package/@google/genai) (`gemini-2.5-flash` / `gemini-3.6-flash`)

---

## 📁 Repository Structure

```plaintext
Viro-Ai-main/
├── backend/                       # Standalone Backend Service
│   ├── src/
│   │   ├── config/                # Database connection (MongoDB Atlas)
│   │   ├── controllers/           # REST endpoint logic (Auth, Posts, AI, etc.)
│   │   ├── middleware/            # JWT authentication middleware
│   │   ├── models/                # 9 Mongoose data schemas
│   │   ├── routes/                # Express API routes
│   │   ├── services/              # Google Gemini AI services
│   │   └── server.ts              # Express application bootstrap (Port 5000)
│   ├── .env                       # Backend environment credentials
│   ├── package.json               # Backend dependencies
│   └── tsconfig.json              # Backend TypeScript config
│
├── src/                           # Frontend React Application
│   ├── components/                # Modular UI components (Layout, Modals, Feed, etc.)
│   ├── context/                   # Global React State (Auth & App Context)
│   ├── pages/                     # Application views (Dashboard, Studio, Analytics, Settings)
│   ├── services/                  # API client & DB persistence service
│   ├── types/                     # TypeScript shared domain interfaces
│   ├── App.tsx                    # Root UI router & view orchestration
│   ├── index.css                  # Global styles & custom scrollbar utilities
│   └── main.tsx                   # React DOM entry point
│
├── .env.example                   # Template environment configuration
├── package.json                   # Root frontend dependencies & dev scripts
├── tsconfig.json                  # Root TypeScript config
└── vite.config.ts                 # Vite bundler & API proxy configuration (Port 3000)
```

---

## ⚙️ Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB Atlas:** A free or dedicated cluster URI (e.g. `mongodb+srv://...`)
- **Google Gemini API Key:** An API key from [Google AI Studio](https://aistudio.google.com/)

---

## 🚀 Getting Started

### 1. Clone & Setup Repository

```bash
git clone <repository-url>
cd Viro-Ai-main
```

### 2. Configure Environment Variables

Create `.env` in `backend/` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Atlas Connection URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/viroai?retryWrites=true&w=majority

# Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Optional) Create `.env` in the root folder if you need custom frontend keys:*
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Dependencies

Install root (frontend) dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
npm --prefix backend install
```

---

## 💻 Running the Application Locally

Run the backend and frontend simultaneously in two separate terminals:

### Terminal 1: Start Backend Server
```powershell
# Windows PowerShell
npm.cmd run dev:backend

# Or standard bash:
npm run dev:backend
```
> Server will boot on `http://localhost:5000` and automatically connect to MongoDB Atlas.

### Terminal 2: Start Frontend Application
```powershell
# Windows PowerShell
npm.cmd run dev:frontend

# Or standard bash:
npm run dev:frontend
```
> Vite dev server will launch on `http://localhost:3000` with hot-module reloading and automatic `/api` proxying to port 5000.

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 📡 Backend API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Health check & MongoDB connectivity | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes |
| `PUT` | `/api/auth/profile` | Update profile settings | Yes |
| `GET` | `/api/posts` | Get user posts & drafts | Yes |
| `POST` | `/api/posts` | Create new post | Yes |
| `PUT` | `/api/posts/:id` | Update existing post | Yes |
| `DELETE` | `/api/posts/:id` | Delete post | Yes |
| `GET` | `/api/brand` | Retrieve brand settings & voice guidelines | Yes |
| `PUT` | `/api/brand` | Update brand settings | Yes |
| `GET` | `/api/competitors` | List tracked competitors | Yes |
| `POST` | `/api/competitors` | Add competitor & generate SWOT | Yes |
| `DELETE` | `/api/competitors/:id` | Remove tracked competitor | Yes |
| `GET` | `/api/social/accounts` | List connected social network accounts | Yes |
| `POST` | `/api/social/connect` | Connect / Disconnect social accounts | Yes |
| `GET` | `/api/templates` | Retrieve post creation templates | Yes |
| `GET` | `/api/notifications` | Fetch workspace notifications | Yes |
| `PUT` | `/api/notifications/read-all`| Mark all notifications as read | Yes |
| `POST` | `/api/ai/generate-caption` | Generate multi-platform captions with Gemini | Yes |
| `POST` | `/api/ai/hashtags` | Generate hashtag recommendations | Yes |
| `POST` | `/api/ai/storyboard` | Generate video/reel storyboard breakdown | Yes |

---

## 🛠️ Verification & Building

### Type Checking
```bash
# Frontend
npm run lint

# Backend
npm --prefix backend run build
```

### Production Build
```bash
# Build frontend bundle
npm run build

# Preview production build locally
npm run start
```

---

## 📄 License

This project is licensed under the MIT License.
