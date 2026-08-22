// Deterministic crisis check — runs on every incoming message BEFORE the
// LLM is ever called. This must never depend on the AI being right.
//
// Phase 3: real keyword set, organized by category, plus a short allowlist
// of common false-positive phrasings (idioms that contain a trigger word
// but aren't crisis statements). Not exhaustive — no keyword list ever is —
// but broader and more deliberately tested than the Phase 1 placeholder.
// See scripts/test-crisis.js for the phrasing test suite this was tuned
// against.

const CRISIS_PATTERNS = [
  // Direct statements of suicidal intent
  /\bkill myself\b/,
  /\bkilling myself\b/,
  /\bwant(ed)? to die\b/,
  /\bwish i (was|were) dead\b/,
  /\bend my life\b/,
  /\bending my life\b/,
  /\btake my (own )?life\b/,
  /\bsuicide\b/,
  /\bsuicidal\b/,
  /\bnot (be alive|want to be alive|worth living)\b/,
  /\bbetter off dead\b/,
  /\bdon'?t want to (be here|exist|live) anymore\b/,
  /\bno reason to (live|go on)\b/,
  /\bcan'?t (go on|do this anymore|keep living)\b/,

  // Self-harm (non-lethal but urgent)
  /\bhurt myself\b/,
  /\bharming myself\b/,
  /\bself[\s-]?harm\b/,
  /\bcutting myself\b/,
  /\bwant to cut\b/,
  /\bharm myself\b/,

  // Planning / means language
  /\bhow to (kill myself|end it all|end my life)\b/,
  /\bwrote a (suicide )?note\b/,
  /\bsaying goodbye\b.*\b(forever|last time)\b/,

  // Indirect / euphemistic phrasing
  /\bend it all\b/,
  /\bcan'?t take (it|this) anymore\b/,
  /\bwhat'?s the point (of|in) (living|anything)\b/,
  /\beveryone('| i)?d be better off without me\b/,
];

// Deliberately allowed phrasings that contain a trigger fragment but are
// idiomatic, not crisis statements. Checked AFTER a pattern match — if the
// message also matches one of these, treat it as a false-positive guard.
const FALSE_POSITIVE_GUARDS = [
  /\b(this (movie|show|game|traffic|homework|song)) is killing me\b/,
  /\bkilling it\b/, // "you're killing it" (positive idiom)
  /\bdying (of laughter|laughing)\b/,
];

function checkForCrisis(message) {
  const lower = (message || "").toLowerCase();

  const isFalsePositiveGuard = FALSE_POSITIVE_GUARDS.some((re) => re.test(lower));
  if (isFalsePositiveGuard) {
    return { crisis: false };
  }

  const matched = CRISIS_PATTERNS.some((re) => re.test(lower));
  return { crisis: matched };
}

function detectCrisis(message) {
  const { crisis } = checkForCrisis(message);
  return { isCrisis: crisis, matchedTerm: null };
}

module.exports = {
  CRISIS_PATTERNS,
  checkForCrisis,
  detectCrisis,
};
