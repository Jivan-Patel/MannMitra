import { MessageCircle, X } from 'lucide-react';

interface ChatLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatLauncher = ({ isOpen, onToggle }: ChatLauncherProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Close chat with peer companion' : 'Open chat with peer companion'}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-brand-primary text-white font-bold text-sm px-4 py-3.5 rounded-full shadow-2xl hover:bg-brand-primary-hover hover:brightness-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-brand-primary/40"
    >
      {isOpen ? (
        <>
          <X className="w-4 h-4" />
          <span>Close chat</span>
        </>
      ) : (
        <>
          <MessageCircle className="w-4 h-4" />
          <span>Chat with us</span>
        </>
      )}
    </button>
  );
};
