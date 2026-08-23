import { useState } from 'react';
import { X, Sparkles, Clock, Wind } from 'lucide-react';
import type { StartHere } from '../../types/content';
import { BreathingExercise } from '../breathing/BreathingExercise';

interface Props {
  startHere: StartHere;
}

export const StartHereCard = ({ startHere }: Props) => {
  const [dismissed, setDismissed] = useState(false);
  const [showExercise, setShowExercise] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-brand-primary/25 rounded-3xl p-6 md:p-8 mb-10 overflow-hidden shadow-sm">
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss start here card"
        className="absolute top-4 right-4 p-1.5 rounded-full text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors focus:outline-none"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 text-brand-primary font-semibold text-sm mb-3">
        <Sparkles className="w-4 h-4" />
        Start here
      </div>

      <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-2">
        {startHere.title}
      </h3>
      <p className="font-sans text-text-secondary text-[15px] md:text-base mb-4 max-w-2xl">
        {startHere.description}
      </p>

      <div className="bg-surface/70 border border-brand-primary/20 rounded-2xl p-4 md:p-5 max-w-2xl">
        <p className="font-sans text-text-primary text-[15px] leading-relaxed">
          {startHere.instruction}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-text-secondary text-sm font-sans">
          <Clock className="w-4 h-4" />
          {startHere.duration}
        </div>

        {/* Breathing exercise button available in ALL mood containers */}
        <button
          id="breathing-exercise-toggle"
          onClick={() => setShowExercise((s) => !s)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--cat-music) 100%)',
            boxShadow: '0 4px 15px rgba(31, 111, 107, 0.35)',
          }}
        >
          <Wind className="w-4 h-4 text-white stroke-[2.2]" />
          <span>{showExercise ? 'Hide Breathing Exercise' : 'Start Breathing Exercise'}</span>
        </button>
      </div>

      {/* Dedicated Breathing Exercise Card Box */}
      {showExercise && (
        <div
          className="mt-6 bg-surface/90 border-0 border-brand-primary/40 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md animate-fade-in-up"
          style={{
            boxShadow: '0 8px 30px rgba(31, 111, 107, 0.15)',
          }}
        >
          <BreathingExercise />
        </div>
      )}
    </div>
  );
};
