/**
 * Centralized Category & Mood Configurations for MannMitra
 *
 * Defines the 5 core content categories and the standardized mood options
 * with explicit modes ('mood' vs 'browse'), along with derived array helpers.
 * Ported from the hackathon prototype's moodConfig.js.
 */
import type { Category, Mood } from '../types/content';

export interface CategoryDefinition {
  id: Category;
  label: string;
  icon: string;
}

export interface MoodDefinition {
  id: Mood;
  label: string;
  description: string;
  mode: 'mood' | 'browse';
}

export const CONTENT_CATEGORIES: CategoryDefinition[] = [
  { id: 'yoga', label: 'Yoga & Breathing', icon: '🧘' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'spiritual', label: 'Spiritual', icon: '✨' },
  { id: 'humor', label: 'Humor', icon: '😄' },
];

export const MOOD_DEFINITIONS: MoodDefinition[] = [
  { id: 'anxious', label: 'Feeling Anxious', description: 'Take a moment to slow down and breathe.', mode: 'mood' },
  { id: 'low', label: 'Feeling Low', description: 'Gentle warmth and comforting thoughts.', mode: 'mood' },
  { id: 'depressed', label: 'Feeling Depressed', description: 'Gentle, zero-pressure space for when everything feels heavy.', mode: 'mood' },
  { id: 'stressed', label: 'Feeling Stressed', description: 'Release tension and find mental clarity.', mode: 'mood' },
  { id: 'lonely', label: 'Feeling Lonely', description: 'Reminders of connection and presence.', mode: 'mood' },
  { id: 'wants_humor', label: 'Want to Laugh', description: 'Lighthearted moments to lift your spirits.', mode: 'mood' },
  { id: 'neutral', label: 'Just Browsing', description: 'Explore all wellness resources unfiltered.', mode: 'browse' },
];

export const VALID_MOOD_IDS = MOOD_DEFINITIONS.map((mood) => mood.id);

export const CLASSIFIABLE_MOOD_IDS = MOOD_DEFINITIONS.filter((mood) => mood.mode === 'mood').map((mood) => mood.id);

export const VALID_CATEGORY_IDS = CONTENT_CATEGORIES.map((category) => category.id);
