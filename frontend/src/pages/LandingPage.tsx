import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoodPicker } from '../components/mood-picker/MoodPicker';
import { useAppStore } from '../store/useAppStore';
import { useChatState } from '../hooks/useChatState';
import { 
  Heart, 
  Sparkles, 
  PackageOpen,
  Activity,
  BookOpen,
  Music,
  Feather,
  SmilePlus,
  MessageCircle
} from 'lucide-react';

export const LandingPage = () => {
  const { checkIn } = useAppStore();
  const { openChat } = useChatState();
  const navigate = useNavigate();

  useEffect(() => {
    checkIn();
  }, [checkIn]);

  return (
    <div className="flex flex-col items-center w-full mx-auto animate-fade-in-up pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="w-full px-4 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center justify-between gap-12 border-b border-border max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
            MannMitra
          </h1>
          <p className="font-sans text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg mx-auto md:mx-0">
            MannMitra is a peer-support companion, not a substitute for professional care.
          </p>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative h-64 md:h-80">
          <div className="relative w-64 h-64 md:w-80 md:h-80 opacity-95">
            <button
              type="button"
              onClick={() => navigate('/browse?category=yoga')}
              aria-label="Explore Yoga resources"
              className="absolute top-0 right-10 w-24 h-24 rounded-[2rem] bg-[var(--cat-yoga)] shadow-sm flex items-center justify-center transform rotate-12 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none"
            >
              <Activity className="w-10 h-10 text-white opacity-90" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=books')}
              aria-label="Explore Reading resources"
              className="absolute top-1/4 left-0 w-28 h-28 rounded-full bg-[var(--cat-book)] shadow-sm flex items-center justify-center transform -rotate-12 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer focus:outline-none"
            >
              <BookOpen className="w-12 h-12 text-white opacity-90" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=music')}
              aria-label="Explore Music resources"
              className="absolute bottom-10 right-4 w-32 h-32 rounded-3xl bg-[var(--cat-music)] shadow-sm flex items-center justify-center transform rotate-6 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none"
            >
              <Music className="w-14 h-14 text-white opacity-90" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=spiritual')}
              aria-label="Explore Spiritual resources"
              className="absolute bottom-0 left-12 w-20 h-20 rounded-full bg-[var(--cat-spiritual)] shadow-sm flex items-center justify-center transform -rotate-6 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none"
            >
              <Feather className="w-8 h-8 text-white opacity-90" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=humor')}
              aria-label="Explore Humor resources"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-[1.5rem] bg-[var(--cat-humor)] shadow-sm flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer focus:outline-none"
            >
              <SmilePlus className="w-8 h-8 text-white opacity-90" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. MOOD PICKER SECTION */}
      <section id="mood-picker-section" className="w-full px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <h2 className="text-center font-display text-3xl font-semibold text-text-primary mb-4">
          How are you feeling right now?
        </h2>
        <p className="text-center font-sans text-text-secondary mb-8 max-w-lg mx-auto">
          Pick a feeling below, or talk through what's on your mind with our peer companion.
        </p>
        
        {/* Chatbot Entry Prompt Card */}
        <div className="mb-10 max-w-xl mx-auto flex justify-center">
          <button
            type="button"
            onClick={openChat}
            className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-brand-primary hover:shadow-md transition-all group text-left focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-[15px] text-text-primary group-hover:text-brand-primary transition-colors">
                  Prefer to talk it through?
                </p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">
                  Chat with our supportive peer companion in your own words
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center text-xs font-bold text-brand-primary group-hover:translate-x-1 transition-transform flex-shrink-0">
              Chat with us &rarr;
            </span>
          </button>
        </div>

        <MoodPicker />
      </section>

      {/* 3. HOW IT WORKS STRIP */}
      <section className="w-full px-4 py-20 bg-surface-alt border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center font-display text-2xl font-semibold text-text-primary mb-12">
            How MannMitra helps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-brand-primary/20 transition-colors">
                <Heart className="w-7 h-7 text-brand-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-text-primary">1. Tell us how you feel</h3>
              <p className="text-text-secondary font-sans text-[15px] leading-relaxed">Pick the mood that fits best right now.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-brand-primary/20 transition-colors">
                <PackageOpen className="w-7 h-7 text-brand-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-text-primary">2. Get a curated pack</h3>
              <p className="text-text-secondary font-sans text-[15px] leading-relaxed">Receive targeted peer-support content.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-brand-primary/20 transition-colors">
                <Sparkles className="w-7 h-7 text-brand-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-text-primary">3. Take what helps</h3>
              <p className="text-text-secondary font-sans text-[15px] leading-relaxed">Save your favorites, skip the rest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY PREVIEW STRIP */}
      <section className="w-full px-4 py-20 max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-display text-2xl font-semibold text-text-primary">
              Explore by category
            </h2>
            <button 
              onClick={() => navigate('/browse')}
              className="text-brand-primary font-bold hover:text-brand-primary-hover hover:underline transition-all"
            >
              Browse all &rarr;
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              type="button"
              onClick={() => navigate('/browse?category=yoga')}
              className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border hover:border-[var(--cat-yoga)] hover:shadow-sm transition-all group focus:outline-none focus:ring-2 focus:ring-[var(--cat-yoga)]"
            >
              <Activity className="w-8 h-8 text-[var(--cat-yoga)] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-sans font-semibold text-text-primary text-[15px]">Yoga</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=books')}
              className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border hover:border-[var(--cat-book)] hover:shadow-sm transition-all group focus:outline-none focus:ring-2 focus:ring-[var(--cat-book)]"
            >
              <BookOpen className="w-8 h-8 text-[var(--cat-book)] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-sans font-semibold text-text-primary text-[15px]">Reading</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=music')}
              className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border hover:border-[var(--cat-music)] hover:shadow-sm transition-all group focus:outline-none focus:ring-2 focus:ring-[var(--cat-music)]"
            >
              <Music className="w-8 h-8 text-[var(--cat-music)] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-sans font-semibold text-text-primary text-[15px]">Music</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=spiritual')}
              className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border hover:border-[var(--cat-spiritual)] hover:shadow-sm transition-all group focus:outline-none focus:ring-2 focus:ring-[var(--cat-spiritual)]"
            >
              <Feather className="w-8 h-8 text-[var(--cat-spiritual)] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-sans font-semibold text-text-primary text-[15px]">Spiritual</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse?category=humor')}
              className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border hover:border-[var(--cat-humor)] hover:shadow-sm transition-all group col-span-2 md:col-span-1 focus:outline-none focus:ring-2 focus:ring-[var(--cat-humor)]"
            >
              <SmilePlus className="w-8 h-8 text-[var(--cat-humor)] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-sans font-semibold text-text-primary text-[15px]">Humor</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
