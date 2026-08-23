import { useAppStore } from '../../store/useAppStore';

export const AppFooter = () => {
  const { openCrisisModal } = useAppStore();

  return (
    <footer className="w-full border-t border-border mt-auto relative z-10 bg-bg/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-3 text-center">
        <span className="font-display font-bold text-lg text-text-primary">MannMitra</span>
        <p className="text-sm font-sans text-text-secondary">
          Peer support, not a substitute for professional care.
        </p>

        <div className="mt-2 pt-5 border-t border-border w-full max-w-md flex flex-col items-center gap-3">
          <p className="text-xs font-sans text-text-secondary">
            In immediate distress or danger? Help is available 24/7.
          </p>
          <button
            onClick={openCrisisModal}
            className="text-xs font-bold text-brand-accent border border-brand-accent/40 rounded-full px-4 py-1.5 hover:bg-brand-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            View Emergency Helplines
          </button>
        </div>

        <p className="text-xs font-sans text-text-secondary/70 mt-2">
          &copy; {new Date().getFullYear()} The Lone Wolf
        </p>
      </div>
    </footer>
  );
};
