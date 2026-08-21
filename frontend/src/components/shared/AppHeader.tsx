import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAppStore } from '../../store/useAppStore';

// Custom logo mark matching the site theme: Heart/Mind lotus badge with soft ambient glow
const LogoIcon = () => (
  <div className="relative flex items-center justify-center w-9 h-9 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
    style={{
      background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--cat-music) 100%)',
      boxShadow: '0 4px 14px rgba(31, 111, 107, 0.35)',
    }}
  >
    {/* Stylized Mindful Heart Emblem */}
    <svg
      className="w-5 h-5 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(255,255,255,0.25)" />
      <circle cx="12" cy="11" r="2.5" fill="white" stroke="none" />
    </svg>

    {/* Sparkle accent */}
    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-accent flex items-center justify-center text-[8px] text-white shadow-sm font-bold">
      ✨
    </span>
  </div>
);

export const AppHeader = () => {
  const { streak, openStreakModal } = useAppStore();

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link
          to="/"
          className="group flex items-center gap-3 focus:outline-none rounded-xl px-2 py-1 -ml-2 transition-all"
        >
          <LogoIcon />
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-text-primary leading-none">
              Mann<span className="text-brand-primary">Mitra</span>
            </span>
            <span className="text-[10px] font-sans font-semibold text-text-secondary/70 tracking-widest uppercase mt-0.5">
              Mind & Peer Support
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={openStreakModal}
            className="flex items-center gap-1.5 bg-surface-alt/80 px-3.5 py-1.5 rounded-full shadow-sm transition-all hover:scale-105 hover:bg-surface-alt active:scale-95 focus:outline-none"
            title="Click to view Streak & Daily Check-in details"
          >
            <Flame className="w-4 h-4 text-brand-accent animate-pulse fill-brand-accent/20" />
            <span className="text-xs md:text-sm font-bold text-text-primary">
              {streak} Day{streak !== 1 ? 's' : ''}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
