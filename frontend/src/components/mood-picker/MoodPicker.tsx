import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { Mood } from '../../types/content';
import { MOOD_DEFINITIONS } from '../../data/moodConfig';
import {
  CloudRain,
  BatteryLow,
  CloudFog,
  ZapOff,
  UserMinus,
  Smile,
  Compass
} from 'lucide-react';

const MOOD_ICONS: Record<Mood, React.FC<any>> = {
  anxious: CloudRain,
  low: BatteryLow,
  depressed: CloudFog,
  stressed: ZapOff,
  lonely: UserMinus,
  wants_humor: Smile,
  neutral: Compass,
};

export const MoodPicker = () => {
  const navigate = useNavigate();
  const { currentMood, setCurrentMood } = useAppStore();

  const handleSelect = (id: Mood, mode: 'mood' | 'browse') => {
    if (mode === 'browse') {
      navigate('/browse');
    } else {
      setCurrentMood(id);
      setTimeout(() => {
        navigate('/content');
      }, 300);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
      {MOOD_DEFINITIONS.map(({ id, label, description, mode }) => {
        const Icon = MOOD_ICONS[id];
        const isActive = currentMood === id;
        return (
          <button
            key={id}
            onClick={() => handleSelect(id, mode)}
            className={`flex flex-col items-start text-left p-6 rounded-3xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-primary min-h-[160px] ${
              isActive
                ? 'bg-brand-primary border-brand-primary text-white scale-[1.02] shadow-md'
                : 'bg-surface border-border hover:border-brand-primary hover:shadow-sm'
            }`}
            aria-pressed={isActive}
          >
            <div className="flex flex-col items-start gap-4 mb-2 w-full">
              <div className={`p-3.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white/20' : 'bg-surface-alt'} ${!isActive ? 'animate-pulse-slow' : ''}`}>
                <Icon className={`w-7 h-7 ${isActive ? 'text-white' : 'text-brand-primary'}`} />
              </div>
              <span className={`font-display text-2xl font-bold ${isActive ? 'text-white' : 'text-text-primary'}`}>
                {label.replace('Feeling ', '')}
              </span>
            </div>
            <span className={`font-sans text-[15px] mt-auto leading-snug ${isActive ? 'text-white/90' : 'text-text-secondary'}`}>
              {description}
            </span>
          </button>
        );
      })}
    </div>
  );
};
