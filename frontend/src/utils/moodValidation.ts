/**
 * Chatbot Response Validation and Mood Normalization Layer
 *
 * Validates a raw classification payload, enforcing priority crisis handling,
 * mood normalization against CLASSIFIABLE_MOOD_IDS, and safe fallback for
 * unknown or unclassifiable inputs.
 *
 * Ported from the hackathon prototype's moodValidation.js.
 */
import { CLASSIFIABLE_MOOD_IDS } from '../data/moodConfig';
import type { Mood } from '../types/content';

export interface ChatbotPayload {
  isCrisis?: boolean;
  mood?: string | null;
  rawText?: string;
}

export interface ValidationResult {
  isCrisis: boolean;
  mood: Mood | null;
  isValid: boolean;
  fallback: boolean;
}

export function validateChatbotResponse(payload: ChatbotPayload | null | undefined): ValidationResult {
  // 1. Crisis takes absolute priority regardless of any mood value
  if (payload && typeof payload === 'object' && payload.isCrisis === true) {
    return { isCrisis: true, mood: null, isValid: true, fallback: false };
  }

  // 2. Validate payload structure
  if (!payload || typeof payload !== 'object') {
    return { isCrisis: false, mood: 'neutral', isValid: false, fallback: true };
  }

  // 3. Normalize mood string
  const rawMood = typeof payload.mood === 'string' ? payload.mood.toLowerCase().trim() : null;

  // 4. Match against CLASSIFIABLE_MOOD_IDS (excludes 'neutral')
  if (rawMood && (CLASSIFIABLE_MOOD_IDS as string[]).includes(rawMood)) {
    return { isCrisis: false, mood: rawMood as Mood, isValid: true, fallback: false };
  }

  // 5. Safe non-crisis fallback for 'neutral' or unmapped/unknown moods
  return { isCrisis: false, mood: 'neutral', isValid: false, fallback: true };
}
