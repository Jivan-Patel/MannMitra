# MannMitra

**A whole-person mental wellness platform** — curated support (yoga, books, music, spiritual content, and humor) matched to how you're feeling, available through either a conversational chatbot or direct, no-chat access.

Built by **Team The Lone Wolf**.

> MannMitra is a peer-support tool, not a replacement for professional care. A crisis resource link is always visible, on every screen, regardless of how you're using the app.

---

## Live Links

- **Frontend (Vercel):** https://mann-mitra-pi.vercel.app/
- **Backend API (Render):** https://mannmitra-mgjn.onrender.com/
  - Health check: `GET /api/health`
  - Note: hosted on Render's free tier, which spins down when idle — the first request after inactivity may be slow or briefly fail while it cold-starts. Retry once before assuming it's down.
- **Full technical documentation:** [`DOCUMENTATION.md`](./DOCUMENTATION.md) — setup instructions, full API reference, architecture, and current known gaps

---

## What it does

MannMitra offers two ways to get support, and both land on the same content:

1. **Manual path (guaranteed to work):** pick a mood — Anxious, Low, Depressed, Stressed, Lonely, Want to laugh, or Just browsing — and get a curated content pack: one recommendation each from yoga, books, music, spiritual content, and humor.
2. **Chatbot path (enhancement layer):** have a short conversation; the bot classifies your mood via an LLM and routes you to the exact same content screen as the manual picker.
3. **Browse-all mode:** skip mood selection entirely and browse all curated content, grouped by category.

A **crisis resource card** is always accessible and never depends on AI detection working correctly — it's a static fallback available at all times, plus a hard, regex-based gate that intercepts risky chat messages before mood classification even runs.

---

## Why it's built this way

The core design principle behind MannMitra: **the app must work end-to-end even if the chatbot fails or is cut.** The chatbot is an optional enhancement on top of a fully working manual flow (mood picker → content) — never a dependency. Content is bundled directly with the frontend, so the manual and browse-all paths don't even require the backend to be online.

---

## Features

### Core (must-have)

- Landing screen with honest framing and an always-visible crisis resource link
- Manual mood picker (7 options, including browse-all)
- Content pack screen — one item per category (yoga, book, music, spiritual, humor), pulled from curated data
- Browse-all mode — same content screen, unfiltered, grouped by category
- Static crisis resource card, backed by verified, dated helpline data (India-specific: emergency services, Tele-MANAS, Vandrevala Foundation, iCALL)

### Enhancement layer (built)

- Conversational chatbot with LLM-based mood detection, routing into the same content screen
- Crisis-detection regex gate that runs before mood classification, on every message
- Graceful fallback if the chatbot API is unreachable — heuristic keyword-based classification instead of a hard failure
- Breathing exercise widget
- Save/favorite a content item
- Daily check-in streak counter
- Dark/light theme toggle
- Ambient music player

### Not yet built

- Mood history chart
- Shareable content cards
- Voice input for chat
- Personalized greeting/name
- Backend-served content (`/api/content` exists but is currently a stub — see [`DOCUMENTATION.md`](./DOCUMENTATION.md#6-content-data))

### Out of scope

Push notifications, real auth/persistent accounts, therapist matching or booking, social/community features, real recommendation ML, native mobile.

---

## Tech stack

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, Zustand (persisted state), react-router-dom, framer-motion
- **Backend:** Node.js + Express
- **Chatbot / mood classification:** Google Gemini API, prompted with a structured JSON schema to return exactly one of seven fixed mood labels — never open-ended text
- **Data layer:** static curated JSON (no database, no real ML recommendation engine)
- **Auth/session:** none — local/session state only, no long-term chat memory

Full setup instructions (env vars, install, run) are in [`DOCUMENTATION.md`](./DOCUMENTATION.md#4-local-setup--run-instructions).

---

## Mood → content data schema

The manual picker, browse-all view, and chatbot all resolve to the same six curated moods (`neutral`/browse has no dedicated pack — it shows everything unfiltered):

```json
{
  "moods": {
    "anxious": {
      "label": "Feeling Anxious",
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

Coverage: **6 moods × 5 categories × 4 items** — fully curated, not placeholder data. Full schema details and where each piece of data actually lives (frontend-bundled vs. backend) are in [`DOCUMENTATION.md`](./DOCUMENTATION.md#6-content-data).

---

## Chatbot behavior

- **Mood classification:** an LLM prompt constrained to return exactly one of seven fixed mood labels, compatible with the content schema above.
- **Crisis detection:** a separate, always-on regex-based check that runs *before* mood classification on every message. If triggered, it bypasses content recommendations entirely and shows the static crisis resource card instead. This check does not depend on the LLM — it's a hard, deterministic gate.
- **Fallback:** if the chat API call fails, times out, or no API key is configured, the backend falls back to heuristic keyword-based mood detection rather than failing outright; the frontend also surfaces a direct link to the manual mood picker so users are never stuck in chat.

Full request/response contracts for `/api/chat`, `/api/content`, and `/api/health` are documented in [`DOCUMENTATION.md`](./DOCUMENTATION.md#5-api-reference-backend).

---

## Team & roles

| Member | Role                         | Focus                                                                                   |
| ------ | ---------------------------- | --------------------------------------------------------------------------------------- |
| **A**  | Frontend / UI                | Landing screen, mood picker, content pack screen, browse-all view, UI polish            |
| **B**  | Backend / AI                 | Chatbot logic, mood classification, crisis-detection layer, API setup                   |
| **C**  | Content / Data & Integration | Content curation, JSON schema, frontend↔backend wiring, testing, deployment, pitch deck |

---

## Project status

- ✅ Schema locked
- ✅ Landing screen, mood picker, content pack screen, browse-all view built
- ✅ Core flow (Landing → Picker → Content) tested end-to-end
- ✅ Content curated across all moods/categories (6 moods × 5 categories × 4 items)
- ✅ Chatbot built with LLM-based mood classification + heuristic fallback
- ✅ Crisis-detection gate built and tested (`backend/scripts/test-crisis.js`)
- ✅ Chatbot integrated as an entry point into the content screen
- ✅ Enhancement features live: theme toggle, favorites, streak counter, breathing exercise
- ✅ Frontend deployed (Vercel)
- ✅ Backend deployed (Render)
- ✅ Pitch deck complete (`MannMitra_TheLoneWolf.pptx`)
- 🔜 `/api/content` currently a stub — frontend uses bundled data instead, not yet backend-served
- 🔜 Final cross-device QA pass

---

## Scope guardrails

- No login/auth — local/session state only
- No real ML recommendation engine — curated JSON is faster and just as effective for a demo
- No long-term chat memory — a single session is enough
- Web app only — no native mobile
- If the chatbot isn't reliably working, it gets cut — it never threatens the core flow

---

## Demo flow

1. Problem statement
2. Landing screen + framing/disclaimer
3. Manual picker → content pack (safest, guaranteed-to-work path)
4. Browse-all mode
5. Chatbot path converging on the same content screen
6. Crisis-detection / safety design callout
7. What's next
