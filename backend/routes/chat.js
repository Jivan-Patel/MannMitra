const express = require("express");
const { checkForCrisis } = require("../lib/crisisDetection");
const { getChatTurn } = require("../lib/geminiClient");
const { MOODS } = require("../lib/moods");

const router = express.Router();

/**
 * POST /api/chat
 *
 * LOCKED CONTRACT (Phase 1, Step 6) — share this with A and C.
 * Do not change field names without re-syncing with the team.
 *
 * Request body:
 * {
 *   "messages": [
 *     { "role": "user", "text": "I've been feeling really anxious lately" }
 *   ]
 * }
 *
 * Response body:
 * {
 *   "reply": "string — the chatbot's conversational reply",
 *   "mood": "anxious" | "stressed" | "lonely" | "wants_humor" | "neutral" | "depressed" | null,
 *   "confidence": 0.0-1.0,
 *   "ready_to_route": boolean,   // true => frontend should switch to content screen using `mood`
 *   "crisis": boolean            // true => frontend MUST show the static crisis card, ignore `reply`
 * }
 *
 * PHASE 2 STATUS: real. Client sends the FULL conversation so far each
 * turn (stateless backend — no session ids, no DB, matches the "single
 * session is enough" scope guardrail). Crisis check still runs first and
 * short-circuits before Gemini is ever called.
 */
router.post("/", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  // Crisis check runs first, always, regardless of what comes next.
  const { crisis } = checkForCrisis(lastUserMessage?.text || "");
  if (crisis) {
    return res.json({
      reply: "",
      mood: null,
      confidence: 0,
      ready_to_route: false,
      crisis: true,
    });
  }

  try {
    const { reply, mood, confidence, ready_to_route } = await getChatTurn(messages);
    res.json({ reply, mood, confidence, ready_to_route, crisis: false });
  } catch (err) {
    console.error("Gemini call failed:", err.message);
    res.status(502).json({
      reply: "Sorry, I'm having trouble connecting right now. Please try again.",
      mood: null,
      confidence: 0,
      ready_to_route: false,
      crisis: false,
      error: true,
    });
  }
});

module.exports = router;
