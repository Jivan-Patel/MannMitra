import { Phone } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const CrisisButton = () => {
  const { openCrisisModal } = useAppStore();

  return (
    <button
      type="button"
      onClick={openCrisisModal}
      aria-label="Open emergency crisis resources"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-danger text-white font-bold text-sm px-4 py-3.5 rounded-full shadow-2xl hover:brightness-110 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-danger/40"
    >
      <Phone className="w-4 h-4 animate-pulse-slow" />
      Need help now?
    </button>
  );
};
