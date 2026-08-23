import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ContentPackPage } from './pages/ContentPackPage';
import { BrowseAllPage } from './pages/BrowseAllPage';
import { CrisisButton } from './components/crisis/CrisisButton';
import { CrisisModal } from './components/crisis/CrisisModal';
import { AppHeader } from './components/shared/AppHeader';
import { AppFooter } from './components/shared/AppFooter';
import { MusicPlayer } from './components/music/MusicPlayer';
import { StreakModal } from './components/streak/StreakModal';
import { ChatLauncher } from './components/chat/ChatLauncher';
import { ChatBot } from './components/chat/ChatBot';
import { useChatState } from './hooks/useChatState';
import { useAppStore } from './store/useAppStore';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
};

const App = () => {
  const { theme } = useAppStore();
  const { isOpen, closeChat, toggleChat } = useChatState();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-bg text-text-primary font-sans transition-colors duration-300 flex flex-col relative overflow-x-hidden">
        {/* Ambient Background blobs */}
        <div className="ambient-blob-1"></div>
        <div className="ambient-blob-2"></div>

        <AppHeader />

        <main className="flex-1 w-full relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/content" element={<ContentPackPage />} />
            <Route path="/browse" element={<BrowseAllPage />} />
          </Routes>
        </main>

        <AppFooter />
        <CrisisButton />
        <CrisisModal />
        <StreakModal />
        <MusicPlayer />
        <ChatLauncher isOpen={isOpen} onToggle={toggleChat} />
        <ChatBot isOpen={isOpen} onClose={closeChat} />
      </div>
    </BrowserRouter>
  );
};

export default App;
