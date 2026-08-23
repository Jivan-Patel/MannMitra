import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, MessageCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { sendChatMessage, type ChatMessage as ChatMessageType } from '../../services/chatService';
import { useAppStore } from '../../store/useAppStore';
import type { Mood } from '../../types/content';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot = ({ isOpen, onClose }: ChatBotProps) => {
  const navigate = useNavigate();
  const { setCurrentMood, openCrisisModal } = useAppStore();

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMoodRoute = (mood: Mood | null) => {
    if (!mood || mood === 'neutral') {
      navigate('/browse');
    } else {
      setCurrentMood(mood);
      navigate('/content');
    }
    onClose();
  };

  const handleFallbackToPicker = () => {
    onClose();
    // Scroll smoothly to mood picker if on landing page
    const moodSection = document.getElementById('mood-picker-section');
    if (moodSection) {
      moodSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputText.trim();
    if (!trimmedInput || isSending) return;

    const userMessage: ChatMessageType = { role: 'user', text: trimmedInput };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputText('');
    setIsSending(true);
    setHasError(false);

    try {
      const response = await sendChatMessage(updatedMessages);

      // Priority 1: Immediate Crisis Signal Handling
      if (response.crisis === true) {
        onClose();
        openCrisisModal();
        return;
      }

      // Priority 2: Ready to Route to Curated Content Pack
      if (response.ready_to_route === true) {
        handleMoodRoute(response.mood);
        return;
      }

      // Priority 3: Conversational Turn Continuance
      if (response.reply) {
        setMessages([...updatedMessages, { role: 'assistant', text: response.reply }]);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-dialog-title"
      className="fixed inset-x-4 bottom-24 sm:inset-x-auto sm:right-6 sm:bottom-24 z-50 w-auto sm:w-[400px] h-[520px] max-h-[85vh] bg-surface border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up transition-all"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-alt border-b border-border px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-primary/15 flex items-center justify-center text-brand-primary">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 id="chatbot-dialog-title" className="font-display font-bold text-sm text-text-primary">
              Chat with MannMitra
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-sans text-text-secondary">Peer Companion</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat panel"
          className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Disclaimer for empty chat state */}
        {messages.length === 0 && (
          <div className="text-center py-4 px-3 bg-surface-alt/60 border border-border/80 rounded-2xl mb-4">
            <p className="text-xs font-sans text-text-secondary leading-relaxed">
              This is a peer-support companion, not a therapist.
            </p>
            <p className="text-xs font-sans text-text-primary font-medium mt-1">
              How are you feeling right now? Tell me what's on your mind.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} text={msg.text} />
        ))}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex justify-start mb-2">
            <div className="bg-surface-alt border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-slow"></div>
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-slow delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-slow delay-300"></div>
            </div>
          </div>
        )}

        {/* Inline error state */}
        {hasError && (
          <div className="flex flex-col items-start gap-2 mb-2 animate-fade-in-up">
            <div className="bg-surface-alt border border-border text-text-primary rounded-2xl rounded-bl-sm px-4 py-2.5 font-sans text-[15px] shadow-sm">
              Sorry, I'm having trouble connecting right now.
            </div>
            <button
              type="button"
              onClick={handleFallbackToPicker}
              className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors ml-1"
            >
              Use the mood picker instead &rarr;
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-surface flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share what's on your mind..."
          disabled={isSending}
          className="flex-1 bg-surface-alt border border-border rounded-xl px-4 py-2.5 text-text-primary font-sans text-sm outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all disabled:opacity-60 placeholder:text-text-secondary/60"
        />
        <button
          type="submit"
          disabled={isSending || !inputText.trim()}
          aria-label="Send message"
          className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-primary-hover active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
