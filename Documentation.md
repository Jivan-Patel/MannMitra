# MannMitra — Project Documentation

**Team:** The Lone Wolf
**Repository:** https://github.com/Jivan-Patel/MannMitra
**Live frontend:** https://mann-mitra-pi.vercel.app/
**Live backend:** https://mannmitra-mgjn.onrender.com/

This document covers what the README doesn't: setup instructions, the real API
contracts, architecture, and an honest account of what's built vs. stubbed —
all verified directly against the source code in this repository.

---

## 1. Overview

MannMitra is a mental wellness web app offering curated support — yoga, books,
music, spiritual content, and humor — matched to how a user feels. Two entry
points converge on the same content: a manual mood picker, or a conversational
chatbot that classifies mood via an LLM. A crisis-resource layer is always
available and does not depend on the AI working correctly.

---

## 2. Architecture

```
┌─────────────────────────┐         ┌──────────────────────────┐
│   Frontend (Vercel)      │         │   Backend (Render)         │
│   React + TypeScript     │  HTTP   │   Node.js + Express        │
│   Vite + Tailwind         │ ──────► │                             │
│                           │         │  /api/health                │
│  - Landing / Mood Picker │         │  /api/chat  → Gemini LLM   │
│  - Content Pack screen   │         │  /api/content (stub)       │
│  - Browse-all screen     │         │                             │
│  - Chatbot widget        │         └──────────────────────────┘
│  - Reads content.json    │
│    directly (local data) │
└─────────────────────────┘
```

**Important architectural note:** the frontend does **not** call
`/api/content` for its recommendations. It reads `frontend/src/data/content.json`
directly, bundled with the app. The backend's `/api/content` route exists but
is still a stub (see Section 6). The only real network call the frontend makes
to the backend is `POST /api/chat`, used solely by the chatbot widget.

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend framework | React 19 + TypeScript | Vite 8 build tooling |
| Styling | Tailwind CSS 3 | `tailwind.config.ts` |
| Routing | react-router-dom 7 | 3 routes: `/`, `/content`, `/browse` |
| State management | Zustand 5 (with `persist` middleware) | Theme, favorites, streak, mood — persisted to `localStorage` under key `mannmitra-storage` |
| Animation | framer-motion | |
| Icons | lucide-react | |
| Backend framework | Express 5 | `server.js` |
| LLM provider | Google Gemini (`@google/generative-ai`) | Model configurable via `GEMINI_MODEL` env var, defaults to `gemini-3.6-flash` |
| Content data | Static JSON (`content.json`, `crisisResources.json`) | No database |
| Backend hosting | Render | Free tier — cold starts after inactivity |
| Frontend hosting | Vercel | |

---

## 4. Local Setup & Run Instructions

### Prerequisites
- Node.js (LTS recommended)
- A Google Gemini API key (optional — the backend has a heuristic fallback if omitted)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set GEMINI_API_KEY if you have one
npm run dev
```

`.env` variables (from `backend/.env.example`):
```
PORT=3001
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
```

The server starts on `http://localhost:3001` and logs its available routes on boot.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env to point at your backend
npm run dev
```

`.env` variable (from `frontend/.env.example`):
```
VITE_API_BASE_URL=http://localhost:3001
```

The Vite dev server starts on its default port (typically `http://localhost:5173`).

### Running both together
Start the backend first, then the frontend, in separate terminals. The frontend's
`VITE_API_BASE_URL` must point at wherever the backend is running (local or deployed)
for the chatbot to function — everything else (mood picker, content pack, browse-all)
works with the frontend alone, since content is bundled locally.

---

## 5. API Reference (Backend)

All three routes are defined in `backend/server.js`, `backend/routes/chat.js`,
and `backend/routes/content.js`.

### `GET /api/health`
Health check. No parameters.

**Response:**
```json
{ "status": "ok" }
```

---

### `POST /api/chat`
The chatbot's conversational + mood-classification endpoint. **Stateless** — the
client sends the full conversation on every call; the backend keeps no session
or database record (matches the "single session is enough" scope decision).

**Request:**
```json
{
  "messages": [
    { "role": "user", "text": "I've been feeling really anxious lately" }
  ]
}
```

**Response (locked contract — do not change field names without re-syncing across the team):**
```json
{
  "reply": "string — the chatbot's conversational reply",
  "mood": "anxious | low | depressed | stressed | lonely | wants_humor | neutral | null",
  "confidence": 0.0,
  "ready_to_route": true,
  "crisis": false
}
```

**Behavior:**
1. The **crisis check runs first, unconditionally**, on the latest user message —
   before the LLM is ever called. If it matches, the endpoint immediately returns
   `{ crisis: true, reply: "", mood: null, confidence: 0, ready_to_route: false }`
   and the frontend is expected to show the static crisis card, ignoring `reply`.
2. If no crisis is detected, the message history is sent to Gemini with a
   structured JSON response schema (see Section 7) constrained to the fixed mood
   list.
3. If the Gemini call fails (missing key, network error, timeout), the backend
   returns HTTP 502 with a safe fallback reply and `error: true` — the frontend's
   `chatService.ts` throws a `ChatServiceError` in this case, which the UI is
   expected to catch and surface a "try the mood picker instead" path.

---

### `GET /api/content?mood={mood}`
**Status: stub.** Validates the `mood` query param against the locked mood list
and returns the correct response shape, but with **empty arrays** for every
category — it does not yet read from a real content source.

**Response:**
```json
{
  "mood": "anxious",
  "content": {
    "yoga": [],
    "book": [],
    "music": [],
    "spiritual": [],
    "humor": []
  }
}
```

⚠️ **This route is not currently used by the deployed frontend.** The frontend
reads content directly from its bundled `content.json` instead (see Section 6).
This endpoint exists for a planned future state where content is served from
the backend rather than bundled with the client — not yet wired up.

---

## 6. Content Data

### Where it actually lives
`frontend/src/data/content.json` — bundled with the frontend build, accessed via
`contentService.ts` → `contentHelpers.ts`. This is the real source of truth for
what users see; it is **not** fetched over the network.

### Shape (verified against the actual file)
```json
{
  "moods": {
    "anxious": {
      "id": "anxious",
      "label": "Feeling Anxious",
      "description": "Take a moment to slow down and breathe.",
      "startHere": {
        "title": "Take One Slow Minute",
        "description": "...",
        "instruction": "..."
      },
      "content": {
        "yoga": [ /* 4 items */ ],
        "books": [ /* 4 items */ ],
        "music": [ /* 4 items */ ],
        "spiritual": [ /* 4 items */ ],
        "humor": [ /* 4 items */ ]
      }
    }
  }
}
```

### Coverage (confirmed)
6 moods curated — `anxious`, `low`, `depressed`, `stressed`, `lonely`,
`wants_humor` — each with 4 items across all 5 categories (yoga, books, music,
spiritual, humor). `neutral` has no dedicated content because it maps to
**browse mode**, not a mood pack (see `moodConfig.ts` — `neutral` is the only
entry with `mode: 'browse'`).

### Crisis resources
`frontend/src/data/crisisResources.json` — a static, always-available list.
Verified contents include India-specific, dated/verified helplines: the
national emergency number (112), Tele-MANAS (Govt. of India, 14416), the
Vandrevala Foundation Helpline, and the iCALL Psychosocial Helpline (TISS).
Each entry carries a `lastVerified` date, contact number, and source URL — this
is not placeholder data.

---

## 7. Chatbot Behavior (Backend Detail)

Implemented in `backend/lib/geminiClient.js`.

- **System prompt** instructs the model to act as a warm, non-clinical peer-support
  companion — explicitly told it is *not* a therapist and must not make clinical
  diagnoses.
- **Structured output**: uses Gemini's `responseSchema` (JSON mode) to force the
  model to return `reply`, `mood`, `confidence`, and `ready_to_route` in a fixed
  shape — not free text that needs separate parsing.
- **Mood normalization**: even with structured output, `normalizeMood()` runs a
  second pass — mapping loose/synonym mood words (e.g. "exhausted", "burnout",
  "panic") back onto the seven locked mood values, and falling back to keyword
  scanning of the reply/user text if the model's raw output doesn't cleanly match.
- **Heuristic fallback**: if `GEMINI_API_KEY` is missing or the API call throws,
  `heuristicFallback()` provides keyword-based mood detection and canned empathetic
  replies — so the chatbot degrades gracefully instead of breaking entirely.

---

## 8. Crisis Detection (Hard Gate)

Implemented in `backend/lib/crisisDetection.js`. This is a **deterministic
regex-based check**, not an LLM call — by design, since it must never depend on
the AI being right.

- Runs on every incoming chat message, before mood classification or any Gemini
  call.
- Pattern categories: direct statements of suicidal intent, self-harm language,
  planning/means language, and indirect/euphemistic phrasing (e.g. "can't take
  this anymore", "what's the point of living").
- Includes a **false-positive guard list** for idioms that contain a trigger
  word but aren't crisis statements (e.g. "this traffic is killing me", "dying
  of laughter") — checked after a pattern match, so these are correctly excluded.
- A test suite exists at `backend/scripts/test-crisis.js` for validating phrasing
  coverage.
- On the frontend, `frontend/src/utils/detectCrisisSignal.ts` provides a
  client-side mirror of this concept for the same defense-in-depth reasoning
  (never rely on a single layer for safety-critical behavior).

---

## 9. Frontend Structure

### Routes (`App.tsx`)
| Path | Page | Purpose |
|---|---|---|
| `/` | `LandingPage` | Framing, mood picker entry point |
| `/content` | `ContentPackPage` | Mood-filtered content pack |
| `/browse` | `BrowseAllPage` | Unfiltered, all categories |

### Global UI (always mounted, regardless of route)
`AppHeader`, `AppFooter`, `CrisisButton` + `CrisisModal` (always-accessible
safety layer), `StreakModal`, `MusicPlayer`, `ChatLauncher` + `ChatBot`.

### State (`useAppStore.ts` — Zustand, persisted to `localStorage`)
- `theme` — light/dark toggle
- `currentMood` — active mood selection
- `favorites` — array of saved content-item ids
- `streak` / `lastVisit` / `checkInHistory` — daily check-in streak logic,
  increments only on a genuinely new day, resets if a day is missed
- Crisis modal and streak modal open/close state

**Note:** several items listed as "enhancement layer / stretch goals" in the
original plan are fully implemented here, not just planned: theme toggle,
favorites, streak counter, and a breathing exercise component
(`components/breathing/BreathingExercise.tsx`) all exist in the codebase.

### Key components
- `mood-picker/MoodPicker.tsx` — manual mood selection UI
- `chat/ChatBot.tsx`, `chat/ChatLauncher.tsx`, `chat/ChatMessage.tsx`,
  `chat-input/ChatInputBox.tsx` — chatbot widget
- `crisis/CrisisButton.tsx`, `crisis/CrisisModal.tsx` — always-on safety layer
- `music/MusicPlayer.tsx`, `music/HeadphonesToast.tsx` — ambient audio player
- `shared/ContentCard.tsx`, `shared/SkeletonCard.tsx`, `shared/EmptyState.tsx` —
  loading/empty states for the content pack screen

---

## 10. Frontend ↔ Backend Contract Summary

| Concern | Where it's decided |
|---|---|
| API base URL | `VITE_API_BASE_URL` env var, read in `chatService.ts` (defaults to `http://localhost:3001`) |
| Chat request/response shape | Locked contract documented in `chat.js` — see Section 5 |
| Mood values | Locked list, duplicated in `backend/lib/moods.js` and `frontend/src/types/content.ts` / `moodConfig.ts` — must stay in sync manually, no shared package |
| Content source | Frontend-local `content.json`, not the backend `/api/content` stub |

---

## 11. Known Gaps / Honest Current State

- `GET /api/content` is a stub returning empty arrays — real content is served
  from the frontend's bundled JSON instead. If a future goal is to centralize
  content on the backend (e.g. to update content without a frontend redeploy),
  this route needs to be wired to read from a real data source.
- Mood value lists are duplicated by hand across frontend and backend files
  rather than shared from one source of truth — a drift risk if either side is
  edited without updating the other.
- The backend is deployed on Render's free tier, which spins down after
  inactivity; the first chat request after idle time may be slow or briefly
  fail while it cold-starts.
- No automated end-to-end test suite; testing present is limited to targeted
  scripts (`test-crisis.js`, `test-llm-call.js`, `test-phase2.js`) for backend
  logic, not full user flows.

---

## 12. Scope Guardrails (unchanged from planning)

- No login/auth — local/session state only
- No real ML recommendation engine — curated JSON, not live recommendations
- No long-term chat memory — conversation state lives only in the current
  browser session
- Web app only — no native mobile
