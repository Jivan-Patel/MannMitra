# MannMitra

**A whole-person mental wellness platform** — curated support (yoga, books, music, spiritual content, and humor) matched to how you're feeling, available through either a conversational chatbot or direct, no-chat access.

Built by **Team The Lone Wolf**.

> MannMitra is a peer-support tool, not a replacement for professional care. A crisis resource link is always visible, on every screen, regardless of how you're using the app.

---

## What it does

MannMitra offers two ways to get support, and both land on the same content:

1. **Manual path (guaranteed to work):** pick a mood — Anxious, Low, Stressed, Lonely, Want to laugh, or Just browsing — and get a curated content pack: one recommendation each from yoga, books, music, spiritual content, and humor.
2. **Chatbot path (enhancement layer):** have a short conversation; the bot classifies your mood and routes you to the exact same content screen as the manual picker.
3. **Browse-all mode:** skip mood selection entirely and browse all curated content, grouped by category.

A **crisis resource card** is always accessible and never depends on AI detection working correctly — it's a static fallback available at all times, plus a hard, keyword-based gate that intercepts risky chat messages before mood classification even runs.

---

## Why it's built this way

The core design principle behind MannMitra: **the app must work end-to-end even if the chatbot fails or is cut.** The chatbot is an optional enhancement on top of a fully working manual flow (mood picker → content) — never a dependency. If the chatbot proves unreliable, it gets cut without threatening the core experience.

---

## Features

### Core (must-have)
- Landing screen with honest framing and an always-visible crisis resource link
- Manual mood picker (6 moods)
- Content pack screen — one item per category (yoga, book, music, spiritual, humor), pulled from curated JSON
- Browse-all mode — same content screen, unfiltered, grouped by category
- Static crisis resource card

### Enhancement layer
- Conversational chatbot with mood detection, routing into the same content screen
- Crisis-detection keyword/intent gate that runs before mood classification
- Breathing exercise widget
- Save/favorite a content item
- Daily check-in streak counter
- Mood history chart
- Shareable content cards
- Dark/calm theme toggle
- Voice input for chat
- Personalized greeting/name

### Out of scope
Push notifications, real auth/persistent accounts, therapist matching or booking, social/community features, real recommendation ML, native mobile.

---

## Tech stack

- **Frontend:** web app (mood picker, content pack screen, browse-all view)
- **Backend:** Node.js API
- **Chatbot / mood classification:** LLM API, prompted to return exactly one of six fixed mood labels — never open-ended text
- **Data layer:** curated JSON (no database, no real ML recommendation engine)
- **Auth/session:** none — local/session state only, no long-term chat memory

---

## Mood → content data schema

All three entry points (manual picker, browse-all, chatbot) read from the same schema:

```json
{
  "moods": ["anxious", "low", "stressed", "lonely", "wants_humor", "neutral"],
  "content": {
    "anxious": {
      "yoga": [{ "title": "...", "url": "..." }],
      "book": [{ "title": "...", "author": "...", "note": "..." }],
      "music": [{ "title": "...", "url": "..." }],
      "spiritual": [{ "text": "...", "source": "..." }],
      "humor": [{ "title": "...", "url": "..." }]
    }
  }
}
```

Target coverage: 4–5 items per category per mood, across 6 moods and 5 categories (~100 curated entries). The chatbot's only job is to output one of the six mood labels — it never generates content directly.

---

## Chatbot behavior

- **Mood classification:** an LLM prompt constrained to return exactly one of the six fixed mood labels, compatible with the content schema above.
- **Crisis detection:** a separate, always-on keyword/intent check that runs *before* mood classification on every message. If triggered, it bypasses content recommendations entirely and shows the static crisis resource card instead. This check does not depend on the mood classifier — it's a hard gate.
- **Fallback:** if the chat API call fails or times out, the user sees an error state with a direct link to the manual mood picker. They are never left stuck in chat.

---

## Team & roles

| Member | Role | Focus |
|---|---|---|
| **A** | Frontend / UI | Landing screen, mood picker, content pack screen, browse-all view, UI polish |
| **B** | Backend / AI | Chatbot logic, mood classification, crisis-detection layer, API setup |
| **C** | Content / Data & Integration | Content curation, JSON schema, frontend↔backend wiring, testing, deployment, pitch deck |

---

## Project status

- ✅ Schema locked
- ✅ Landing screen, mood picker, content pack screen, browse-all view built
- ✅ Core flow (Landing → Picker → Content) tested end-to-end
- ✅ Content curated across all moods/categories
- ✅ Chatbot prototype built with mood classification
- ✅ Crisis-detection gate built and tested
- ✅ Chatbot integrated as an entry point into the content screen
- ✅ Pitch deck complete (`MannMitra_TheLoneWolf.pptx`)
- 🔜 Final QA pass, backup demo video, pitch rehearsal

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
5. Chatbot path converging on the same content screen (if stable)
6. Crisis-detection / safety design callout
7. What's next