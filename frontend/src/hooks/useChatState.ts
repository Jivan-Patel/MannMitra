import { useState, useEffect, useCallback } from 'react';

let globalIsChatOpen = false;
const listeners = new Set<(isOpen: boolean) => void>();

export const openChat = () => {
  globalIsChatOpen = true;
  listeners.forEach((listener) => listener(globalIsChatOpen));
};

export const closeChat = () => {
  globalIsChatOpen = false;
  listeners.forEach((listener) => listener(globalIsChatOpen));
};

export const toggleChat = () => {
  globalIsChatOpen = !globalIsChatOpen;
  listeners.forEach((listener) => listener(globalIsChatOpen));
};

export const useChatState = () => {
  const [isOpen, setIsOpen] = useState(globalIsChatOpen);

  useEffect(() => {
    const handleChange = (val: boolean) => setIsOpen(val);
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const handleOpen = useCallback(() => {
    openChat();
  }, []);

  const handleClose = useCallback(() => {
    closeChat();
  }, []);

  const handleToggle = useCallback(() => {
    toggleChat();
  }, []);

  return {
    isOpen,
    openChat: handleOpen,
    closeChat: handleClose,
    toggleChat: handleToggle,
  };
};
