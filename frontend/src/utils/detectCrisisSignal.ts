/**
 * Demo-Grade Heuristic Crisis Detection Module for MannMitra
 *
 * IMPORTANT DISCLAIMER:
 * This is a demo-grade heuristic rule engine for safety screening in a peer-support prototype.
 * It is NOT a clinical assessment tool or diagnostic system.
 *
 * Policy: Errs toward false positives (never false negatives). Ambiguous or negated phrasing
 * near a crisis keyword (e.g., "I am not suicidal") intentionally triggers a crisis signal
 * so that human safety resources take priority.
 *
 * Ported from the hackathon prototype's detectCrisisSignal.js.
 */
import { CRISIS_KEYWORDS } from '../constants/appSafety';

export interface CrisisSignalResult {
  isCrisis: boolean;
  matchedTerm: string | null;
}

export function detectCrisisSignal(userText: string | null | undefined): CrisisSignalResult {
  if (typeof userText !== 'string' || !userText.trim()) {
    return { isCrisis: false, matchedTerm: null };
  }

  // Lowercase and normalize whitespace / basic punctuation
  const normalizedText = userText
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ');

  for (const keyword of CRISIS_KEYWORDS) {
    const normalizedKeyword = keyword.toLowerCase();
    if (normalizedText.includes(normalizedKeyword)) {
      return { isCrisis: true, matchedTerm: keyword };
    }
  }

  return { isCrisis: false, matchedTerm: null };
}
