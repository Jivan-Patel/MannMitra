import { useState, useEffect } from 'react';
import type { Mood, MoodContent, StartHere } from '../types/content';
import { fetchContentByMood, fetchAllContent } from '../services/contentService';

// Simulated network delay preserves the existing skeleton-loader UX.
const SIMULATED_DELAY_MS = 500;

export const useContent = (mood?: Mood | null) => {
  const [content, setContent] = useState<MoodContent | null>(null);
  const [startHere, setStartHere] = useState<StartHere | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mood) {
      setContent(null);
      setStartHere(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        const moodEntry = fetchContentByMood(mood);
        if (moodEntry) {
          setContent(moodEntry.content);
          setStartHere(moodEntry.startHere ?? null);
        } else {
          setContent({});
          setStartHere(null);
        }
      } catch (err) {
        setError('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    }, SIMULATED_DELAY_MS);

    return () => clearTimeout(timer);
  }, [mood]);

  return { content, startHere, isLoading, error };
};

export const useAllContent = () => {
  const [content, setContent] = useState<MoodContent>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContent(fetchAllContent());
      setIsLoading(false);
    }, SIMULATED_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return { content, isLoading };
};
