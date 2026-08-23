import { useEffect } from 'react';
import { X, Flame, CheckCircle2, Award, Calendar, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const StreakModal = () => {
  const { streak, isStreakModalOpen, closeStreakModal, checkIn, checkInHistory, lastVisit } = useAppStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const isCheckedInToday = lastVisit === todayStr;

  useEffect(() => {
    if (!isStreakModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStreakModal();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isStreakModalOpen, closeStreakModal]);

  if (!isStreakModalOpen) return null;

  // Calculate dates for past 7 days ending today
  const today = new Date();
  const pastSevenDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const dayName = DAYS_OF_WEEK[(d.getDay() + 6) % 7];
    const isToday = iso === todayStr;
    const isCheckedIn = checkInHistory.includes(iso) || (isToday && isCheckedInToday);
    return { iso, dayName, isToday, isCheckedIn };
  });

  const handleManualCheckIn = () => {
    checkIn();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
      onClick={closeStreakModal}
    >
      <div
        className="bg-surface border border-border/60 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner with Brand Flame Gradient */}
        <div
          className="relative p-6 md:p-8 text-white flex flex-col items-center text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary) 0%, #E3A23C 100%)',
          }}
        >
          <button
            onClick={closeStreakModal}
            aria-label="Close streak modal"
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Animated Flame Badge */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-lg animate-bounce">
            <Flame className="w-10 h-10 text-amber-300 fill-amber-300 stroke-[1.5]" />
          </div>

          <h2 id="streak-modal-title" className="font-display text-3xl font-extrabold tracking-tight">
            {streak} Day{streak !== 1 ? 's' : ''} Streak!
          </h2>
          <p className="font-sans text-sm text-amber-100/90 mt-1">
            {isCheckedInToday
              ? "You've checked in today! Keep the flame burning 🔥"
              : 'Tap check-in to log your daily check-in'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* 1. Weekly Tracker Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-primary" />
                This Week's Activity
              </span>
              <span className="text-xs text-text-secondary font-semibold">
                {checkInHistory.length} Total Check-ins
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {pastSevenDays.map((day) => (
                <div key={day.iso} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-sans font-bold text-text-secondary">
                    {day.dayName}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      day.isCheckedIn
                        ? 'bg-brand-primary text-white shadow-md scale-105'
                        : day.isToday
                        ? 'bg-brand-primary/20 border-2 border-brand-primary text-brand-primary'
                        : 'bg-surface-alt text-text-secondary/60'
                    }`}
                  >
                    {day.isCheckedIn ? (
                      <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                    ) : (
                      <span className="text-xs">•</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Streak Milestones */}
          <div className="space-y-2.5">
            <span className="font-display text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-accent" />
              Streak Milestones
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <div
                className={`p-3 rounded-2xl border text-center transition-all ${
                  streak >= 3
                    ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                    : 'bg-surface-alt/50 border-border/40 text-text-secondary/60'
                }`}
              >
                <div className="text-lg font-bold">🌱 3 Days</div>
                <div className="text-[10px] font-semibold mt-0.5">
                  {streak >= 3 ? 'Unlocked ✓' : `${streak}/3 Days`}
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center transition-all ${
                  streak >= 7
                    ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                    : 'bg-surface-alt/50 border-border/40 text-text-secondary/60'
                }`}
              >
                <div className="text-lg font-bold">🔥 7 Days</div>
                <div className="text-[10px] font-semibold mt-0.5">
                  {streak >= 7 ? 'Unlocked ✓' : `${streak}/7 Days`}
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center transition-all ${
                  streak >= 30
                    ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                    : 'bg-surface-alt/50 border-border/40 text-text-secondary/60'
                }`}
              >
                <div className="text-lg font-bold">👑 30 Days</div>
                <div className="text-[10px] font-semibold mt-0.5">
                  {streak >= 30 ? 'Unlocked ✓' : `${streak}/30 Days`}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Check-In Button Action */}
          <div className="pt-2">
            {!isCheckedInToday ? (
              <button
                onClick={handleManualCheckIn}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--cat-music) 100%)',
                  boxShadow: '0 4px 15px rgba(31, 111, 107, 0.35)',
                }}
              >
                <Sparkles className="w-4 h-4 fill-white" />
                Check In for Today
              </button>
            ) : (
              <div className="w-full py-3 rounded-2xl bg-success/15 border border-success/30 text-success text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Checked in for Today!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
