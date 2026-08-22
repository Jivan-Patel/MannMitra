import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Mood } from '../types/content';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentMood: Mood | null;
  setCurrentMood: (mood: Mood | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  streak: number;
  lastVisit: string | null;
  checkInHistory: string[];
  checkIn: () => void;
  isCrisisModalOpen: boolean;
  openCrisisModal: () => void;
  closeCrisisModal: () => void;
  isStreakModalOpen: boolean;
  openStreakModal: () => void;
  closeStreakModal: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      currentMood: null,
      setCurrentMood: (mood) => set({ currentMood: mood }),
      favorites: [],
      toggleFavorite: (id) => set((state) => {
        const isFav = state.favorites.includes(id);
        return {
          favorites: isFav ? state.favorites.filter(fid => fid !== id) : [...state.favorites, id]
        };
      }),
      streak: 1,
      lastVisit: null,
      checkInHistory: [],
      checkIn: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastVisit, streak, checkInHistory } = get();

        const history = checkInHistory.includes(today)
          ? checkInHistory
          : [...checkInHistory, today];

        if (lastVisit !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastVisit === yesterdayStr) {
            set({ streak: Math.max(1, streak + 1), lastVisit: today, checkInHistory: history });
          } else {
            set({ streak: 1, lastVisit: today, checkInHistory: history });
          }
        } else {
          set({ checkInHistory: history, streak: Math.max(1, streak) });
        }
      },
      isCrisisModalOpen: false,
      openCrisisModal: () => set({ isCrisisModalOpen: true }),
      closeCrisisModal: () => set({ isCrisisModalOpen: false }),
      isStreakModalOpen: false,
      openStreakModal: () => set({ isStreakModalOpen: true }),
      closeStreakModal: () => set({ isStreakModalOpen: false }),
    }),
    {
      name: 'mannmitra-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        streak: state.streak,
        lastVisit: state.lastVisit,
        currentMood: state.currentMood,
        checkInHistory: state.checkInHistory,
      }),
    }
  )
);
