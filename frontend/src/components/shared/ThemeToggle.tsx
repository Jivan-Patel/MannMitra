import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-surface-alt transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5 text-text-secondary" /> : <Sun className="w-5 h-5 text-text-secondary" />}
    </button>
  );
};
