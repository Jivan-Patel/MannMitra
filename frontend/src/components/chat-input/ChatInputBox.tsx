import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2 } from 'lucide-react';
import { detectCrisisSignal } from '../../utils/detectCrisisSignal';
import { validateChatbotResponse } from '../../utils/moodValidation';
import { useAppStore } from '../../store/useAppStore';
import type { Mood } from '../../types/content';

/**
 * Demo-grade helper mapping common input keywords to classifiable moods.
 * Ported from the hackathon prototype's ChatInputBox.jsx.
 */
const inferMoodFromText = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.includes('anxious') || lower.includes('worry') || lower.includes('panic') || lower.includes('nervous')) return 'anxious';
  if (lower.includes('low') || lower.includes('sad') || lower.includes('down') || lower.includes('heavy')) return 'low';
  if (lower.includes('stress') || lower.includes('overwhelmed') || lower.includes('busy') || lower.includes('tired')) return 'stressed';
  if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated') || lower.includes('miss')) return 'lonely';
  if (lower.includes('laugh') || lower.includes('humor') || lower.includes('funny') || lower.includes('joke')) return 'wants_humor';
  return 'neutral';
};

export const ChatInputBox = () => {
  const navigate = useNavigate();
  const { setCurrentMood, openCrisisModal } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMoodClassified = (mood: string, isBrowsing: boolean) => {
    if (isBrowsing || mood === 'neutral') {
      navigate('/browse');
      return;
    }
    setCurrentMood(mood as Mood);
    navigate('/content');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Check for immediate crisis signals
      const crisisSignal = detectCrisisSignal(inputText);

      // 2. Build classification payload (simulating a backend classifier response)
      const mockPayload = {
        isCrisis: crisisSignal.isCrisis,
        mood: crisisSignal.isCrisis ? null : inferMoodFromText(inputText),
        rawText: inputText,
      };

      // 3. Validate payload
      const validation = validateChatbotResponse(mockPayload);

      // Simulate subtle network latency
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (validation.isCrisis) {
        openCrisisModal();
      } else if (validation.isValid && validation.mood) {
        handleMoodClassified(validation.mood, false);
      } else {
        handleMoodClassified('neutral', true);
      }
    } catch (err) {
      setErrorMessage('Service busy. Falling back to browse view.');
      handleMoodClassified('neutral', true);
    } finally {
      setIsSubmitting(false);
      setInputText('');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tell us how you're feeling right now..."
          disabled={isSubmitting}
          className="flex-1 bg-surface border border-border rounded-2xl px-5 py-3.5 text-text-primary text-[15px] font-sans placeholder:text-text-secondary/70 outline-none focus:ring-4 focus:ring-brand-primary/30 focus:border-brand-primary transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSubmitting || !inputText.trim()}
          className="flex items-center gap-2 bg-brand-primary text-white font-bold text-sm rounded-2xl px-5 py-3.5 hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-brand-primary/30"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">{isSubmitting ? 'Listening…' : 'Share'}</span>
        </button>
      </form>

      {errorMessage && (
        <p className="text-xs text-brand-accent mt-2.5 text-center font-sans">{errorMessage}</p>
      )}
    </div>
  );
};
