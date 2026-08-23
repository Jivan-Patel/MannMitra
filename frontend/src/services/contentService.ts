/**
 * Service/API Layer for MannMitra Content and Resources
 *
 * Acts as the single interface for the frontend to access content recommendations,
 * mood definitions, category metadata, and crisis resources.
 *
 * Ported from the hackathon prototype's contentService.js.
 */
import { getMoodsList, getCategoriesList, getContentByMood, getAllContent, getCrisisResources } from '../utils/contentHelpers';

function safeCopy<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof structuredClone === 'function') return structuredClone(data);
  return JSON.parse(JSON.stringify(data));
}

export function fetchMoods() {
  return safeCopy(getMoodsList());
}

export function fetchCategories() {
  return safeCopy(getCategoriesList());
}

export function fetchContentByMood(mood: string) {
  if (typeof mood !== 'string') return null;
  const normalizedMood = mood.trim().toLowerCase();
  if (!normalizedMood) return null;
  return safeCopy(getContentByMood(normalizedMood));
}

export function fetchAllContent() {
  return safeCopy(getAllContent());
}

export function fetchCrisisResources() {
  return safeCopy(getCrisisResources());
}
