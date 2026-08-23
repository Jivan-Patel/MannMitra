import { useState, useEffect } from 'react';
import { Headphones, Play, Pause, X } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  onEnableAudio: () => void;
}

export const HeadphonesToast = ({ isPlaying, onEnableAudio }: Props) => {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Smooth slide-in on page load
    const timerShow = setTimeout(() => {
      setVisible(true);
    }, 200);

    return () => clearTimeout(timerShow);
  }, []);

  // Auto-hide 4 seconds after music starts playing
  useEffect(() => {
    if (isPlaying) {
      const timerHide = setTimeout(() => setVisible(false), 4000);
      const timerUnmount = setTimeout(() => setShouldRender(false), 4700);
      return () => {
        clearTimeout(timerHide);
        clearTimeout(timerUnmount);
      };
    }
  }, [isPlaying]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-out transform ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
      role="status"
    >
      <div
        className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full shadow-2xl border border-border backdrop-blur-xl transition-all duration-300"
        style={{
          background: 'var(--surface)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 20px rgba(31, 111, 107, 0.15)',
        }}
      >
        {/* Headphone Icon with Website Theme Color */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
          style={{ background: 'var(--brand-primary)' }}
        >
          <Headphones className="w-4 h-4 text-white" />
        </div>

        {/* Text */}
        <span className="font-sans font-medium text-xs md:text-sm text-text-primary whitespace-nowrap">
          Use headphones for better experience
        </span>

        {/* Play Music Button in Website Theme */}
        <button
          onClick={onEnableAudio}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--cat-music) 100%)',
            boxShadow: '0 3px 10px rgba(31, 111, 107, 0.35)',
          }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Playing</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play Music</span>
            </>
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => setShouldRender(false), 700);
          }}
          className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors focus:outline-none ml-0.5"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
