# Research Co-Pilot

Multi-agent intelligent research assistant powered by LangGraph, FastAPI, and Next.js 15.

## Architecture

```
User Query → Supervisor → Researcher (Tavily Search)
                       → Analyst (RAG + Analysis)
                       → Writer (Markdown Report)
                       → END
```

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, LangGraph, ChromaDB
- **Frontend**: Next.js 15, Tailwind CSS, Zustand, React Markdown
- **LLM**: DeepSeek-V3 (OpenAI-compatible API)
- **Search**: Tavily Search API
- **Vector DB**: ChromaDB (local)

## Quick Start

### 1. Backend

```bash
cd apps/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys:
#   DEEPSEEK_API_KEY=sk-...
#   TAVILY_API_KEY=tvly-...

# Run server
uvicorn src.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd apps/frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open http://localhost:3000

### 3. Docker (optional)

```bash
# From project root
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your API keys
docker-compose up
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/chat/stream` | SSE streaming chat |
| POST | `/api/v1/upload` | Upload PDF for RAG |

## Project Structure

```
research-copilot/
├── apps/
│   ├── backend/           # FastAPI + LangGraph
│   │   ├── src/
│   │   │   ├── agents/    # Supervisor, Researcher, Analyst, Writer
│   │   │   ├── api/v1/    # Chat & Upload endpoints
│   │   │   ├── core/      # Config
│   │   │   ├── services/  # LLM, RAG, Search
│   │   │   └── models/    # Database
│   │   └── requirements.txt
│   └── frontend/          # Next.js 15
│       └── src/
│           ├── app/       # Pages
│           ├── components/# Chat UI
│           └── hooks/     # useChat, Zustand store
├── docker-compose.yml
└── README.md
```

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `DEEPSEEK_API_KEY` | DeepSeek API key |
| `DEEPSEEK_BASE_URL` | API base URL (default: https://api.deepseek.com) |
| `DEEPSEEK_MODEL` | Model name (default: deepseek-chat) |
| `TAVILY_API_KEY` | Tavily Search API key |
| `CHROMA_PERSIST_DIR` | ChromaDB storage path |
