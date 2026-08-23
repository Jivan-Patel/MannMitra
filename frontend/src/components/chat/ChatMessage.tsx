export interface ChatMessageProps {
  role: 'user' | 'assistant';
  text: string;
}

export const ChatMessage = ({ role, text }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl font-sans text-[15px] leading-relaxed break-words shadow-sm transition-all ${
          isUser
            ? 'bg-brand-primary text-white rounded-br-sm'
            : 'bg-surface-alt border border-border text-text-primary rounded-bl-sm'
        }`}
      >
        {text}
      </div>
    </div>
  );
};
