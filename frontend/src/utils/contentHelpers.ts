/**
 * Data-Access Layer for MannMitra Content and Resources
 *
 * Provides stable, read-only helper functions to access moods, categories,
 * content recommendations, and crisis resources.
 *
 * Ported from the hackathon prototype's contentHelpers.js.
 */
import { CONTENT_CATEGORIES, MOOD_DEFINITIONS, VALID_CATEGORY_IDS, CLASSIFIABLE_MOOD_IDS } from '../data/moodConfig';
import crisisData from '../data/crisisResources.json';
import contentData from '../data/content.json';
import type { CategoryDefinition, MoodDefinition } from '../data/moodConfig';
import type { ContentDataset, ContentItem, Category, CrisisResourcesData, MoodEntry } from '../types/content';

const typedContentData = contentData as unknown as ContentDataset;
const typedCrisisData = crisisData as unknown as CrisisResourcesData;

/**
 * Returns emotional mood definitions (excluding 'neutral' / 'browse' modes).
 */
export function getMoodsList(): Pick<MoodDefinition, 'id' | 'label' | 'description'>[] {
  return MOOD_DEFINITIONS.filter((mood) => mood.mode === 'mood').map((mood) => ({
    id: mood.id,
    label: mood.label,
    description: mood.description,
  }));
}

/**
 * Returns category metadata from centralized configuration.
 */
export function getCategoriesList(): CategoryDefinition[] {
  return CONTENT_CATEGORIES.map((category) => ({ ...category }));
}

/**
 * Returns the full mood entry (label, description, startHere, content) for a valid
 * emotional mood. Returns null for missing, non-string, 'neutral', or unknown moods.
 */
export function getContentByMood(moodKey: string): MoodEntry | null {
  if (typeof moodKey !== 'string') return null;

  const normalizedKey = moodKey.trim().toLowerCase();
  if (!normalizedKey || !(CLASSIFIABLE_MOOD_IDS as string[]).includes(normalizedKey)) return null;

  const moodsObj = typedContentData?.moods ?? {};
  const moodEntry = moodsObj[normalizedKey];

  if (!moodEntry) return null;

  return moodEntry;
}

/**
 * Returns all content items grouped by category with duplicate items removed.
 */
export function getAllContent(): Record<Category, ContentItem[]> {
  const result = {} as Record<Category, ContentItem[]>;
  VALID_CATEGORY_IDS.forEach((catId) => {
    result[catId] = [];
  });

  const moodsObj = typedContentData?.moods ?? {};

  Object.values(moodsObj).forEach((moodEntry) => {
    if (!moodEntry || !moodEntry.content || typeof moodEntry.content !== 'object') return;

    VALID_CATEGORY_IDS.forEach((catId) => {
      const items = Array.isArray(moodEntry.content[catId]) ? (moodEntry.content[catId] as ContentItem[]) : [];
      items.forEach((item) => {
        if (item && item.id) {
          const exists = result[catId].some((existingItem) => existingItem.id === item.id);
          if (!exists) {
            result[catId].push({ ...item });
          }
        }
      });
    });
  });

  return result;
}

/**
 * Returns complete crisis resources dataset.
 */
export function getCrisisResources(): CrisisResourcesData {
  return typedCrisisData;
}
