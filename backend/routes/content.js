const express = require("express");
const { MOODS } = require("../lib/moods");

const router = express.Router();

/**
 * GET /api/content?mood=anxious
 *
 * Team decision: content is served via the backend (not a static file
 * fetched directly by the frontend). C owns the actual JSON content;
 * this route just exposes it.
 *
 * PHASE 1 STATUS: stub — returns empty categories so A can wire the
 * content-pack screen against the real shape now. C fills in
 * data/content.json during Phase 1/2 curation; this route will read
 * from that file once it exists.
 *
 * Response body:
 * {
 *   "mood": "anxious",
 *   "content": {
 *     "yoga": [],
 *     "book": [],
 *     "music": [],
 *     "spiritual": [],
 *     "humor": []
 *   }
 * }
 */
router.get("/", (req, res) => {
  const { mood } = req.query;

  if (!mood) {
    return res.status(400).json({ error: "mood query param is required" });
  }
  if (!MOODS.includes(mood)) {
    return res.status(400).json({ error: `unknown mood: ${mood}`, validMoods: MOODS });
  }

  // TODO (Phase 2, with C): read from data/content.json instead of stubbing.
  res.json({
    mood,
    content: {
      yoga: [],
      book: [],
      music: [],
      spiritual: [],
      humor: [],
    },
  });
});

module.exports = router;
