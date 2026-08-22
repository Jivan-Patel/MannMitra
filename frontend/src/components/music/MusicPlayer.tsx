import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { HeadphonesToast } from './HeadphonesToast';

const TRACKS = [
  {
    id: 'rain',
    name: 'Minecraft Rain',
    artist: 'Relaxing Ambience',
    emoji: '🌧️',
    url: '/music-rain.mp3',
    color: '#5B8C6C',
    gradient: 'linear-gradient(135deg, #5B8C6C, #2E8C9A)',
  },
  {
    id: 'relaxing',
    name: 'Slow & Relaxing',
    artist: 'No Copyright Music',
    emoji: '🎵',
    url: '/music-relaxing.mp3',
    color: '#B08A2E',
    gradient: 'linear-gradient(135deg, #B08A2E, #C2685A)',
  },
  {
    id: 'moog',
    name: 'Moog City 2',
    artist: 'C418 · Minecraft OST',
    emoji: '🎹',
    url: '/music-moog-city.mp3',
    color: '#5B5A8C',
    gradient: 'linear-gradient(135deg, #5B5A8C, #2E8C9A)',
  },
];

// Rotating Vinyl Record Component for the floating corner button
const VinylDisc = ({ isPlaying, emoji, color }: { isPlaying: boolean; emoji: string; color: string }) => (
  <div
    className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
      isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
    }`}
    style={{
      background: 'radial-gradient(circle, #2A2A2A 0%, #151515 60%, #080808 100%)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    }}
  >
    {/* Concentric vinyl groove rings */}
    <div className="absolute inset-[3px] rounded-full border border-white/10" />
    <div className="absolute inset-[7px] rounded-full border border-white/10" />

    {/* Center record label with track emoji */}
    <div
      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] shadow-sm z-10"
      style={{ background: color }}
    >
      {emoji}
    </div>

    {/* Center spindle hole */}
    <div className="absolute w-1 h-1 rounded-full bg-black border border-white/40 z-20" />
  </div>
);

// Animated waveform bars shown when playing
const WaveformBars = ({ color }: { color: string }) => (
  <div className="flex items-end gap-[2px] h-4">
    {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
      <div
        key={i}
        className="w-[3px] rounded-full"
        style={{
          background: color,
          height: `${h * 16}px`,
          animation: `waveBar 0.9s ease-in-out ${i * 0.12}s infinite alternate`,
        }}
      />
    ))}
  </div>
);

export const MusicPlayer = () => {
  // Closed by default on first render
  const [isOpen, setIsOpen] = useState(false);
  // Default to Moog City 2 (index 2)
  const [trackIndex, setTrackIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const track = TRACKS[trackIndex];

  // Enable audio function called on user click anywhere
  const enableAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = volume;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [volume]);

  // 1. Click-outside handler to close music box
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // 2. Initialize audio and listen for any user click/touch anywhere on website to start music
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audio.src = TRACKS[2].url; // Moog City 2
    audioRef.current = audio;

    const userEvents = ['click', 'pointerdown', 'touchstart', 'keydown'];

    const handleFirstUserInteraction = () => {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          cleanupListeners();
        })
        .catch(() => {});
    };

    const cleanupListeners = () => {
      userEvents.forEach((evt) =>
        document.removeEventListener(evt, handleFirstUserInteraction)
      );
    };

    // Try playing immediately
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // If browser blocks unmuted autoplay, attach global listener to play on user's first click anywhere on screen
        userEvents.forEach((evt) =>
          document.addEventListener(evt, handleFirstUserInteraction, { once: true })
        );
      });

    return () => {
      cleanupListeners();
      audio.pause();
      audio.src = '';
    };
  }, []);

  // 3. Track changes: swap src and play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = isPlaying;
    audio.pause();
    audio.src = TRACKS[trackIndex].url;
    audio.load();
    if (wasPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [trackIndex]);

  // 4. Volume / mute sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      if (!audio.src || audio.src === window.location.href) {
        audio.src = track.url;
        audio.load();
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, track.url]);

  const selectTrack = (index: number) => {
    if (index === trackIndex) {
      togglePlay();
      return;
    }
    setTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <>
      {/* Smooth Headphones notification toast & interactive sound starter */}
      <HeadphonesToast isPlaying={isPlaying} onEnableAudio={enableAudio} />

      {/* Waveform keyframes injected inline */}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        role="region"
        aria-label="Background music player"
      >
        {/* ── Expanded panel ── */}
        {isOpen && (
          <div
            className="rounded-2xl border border-border shadow-2xl overflow-hidden animate-fade-in-up"
            style={{ width: 290, background: 'var(--surface)' }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between border-b border-border transition-colors duration-300"
              style={{ background: `${track.color}18` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{track.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-text-primary leading-none">{track.name}</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">{track.artist}</p>
                </div>
              </div>
              {isPlaying && <WaveformBars color={track.color} />}
            </div>

            {/* Track list */}
            <div className="p-3 space-y-1">
              {TRACKS.map((t, i) => (
                <button
                  key={t.id}
                  id={`music-track-${t.id}`}
                  onClick={() => selectTrack(i)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-left group"
                  style={{
                    background: trackIndex === i ? `${t.color}18` : 'transparent',
                    border: `1.5px solid ${trackIndex === i ? t.color + '55' : 'transparent'}`,
                  }}
                >
                  {/* Logo circle */}
                  <div
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-base shadow-sm"
                    style={{ background: t.gradient }}
                  >
                    {t.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: trackIndex === i ? t.color : 'var(--text-primary)' }}
                    >
                      {t.name}
                    </p>
                    <p className="text-[11px] text-text-secondary truncate">{t.artist}</p>
                  </div>
                  {trackIndex === i && isPlaying && <WaveformBars color={t.color} />}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
              {/* Volume row */}
              <div className="flex items-center gap-2.5 pt-3">
                <button
                  id="music-mute-btn"
                  onClick={() => setIsMuted((m) => !m)}
                  className="text-text-secondary hover:text-text-primary transition-colors flex-shrink-0 focus:outline-none p-1 rounded-lg hover:bg-surface-alt"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex-1 relative flex items-center py-2">
                  <input
                    id="music-volume-slider"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${track.color} 0%, ${track.color} ${(isMuted ? 0 : volume) * 100}%, var(--border) ${(isMuted ? 0 : volume) * 100}%, var(--border) 100%)`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono font-medium text-text-secondary w-7 text-right flex-shrink-0">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* Play / Pause */}
              <button
                id="music-play-btn"
                onClick={togglePlay}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2"
                style={{ background: track.gradient, boxShadow: `0 4px 14px ${track.color}44` }}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Play Music
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Floating toggle button with Rotating Vinyl Music Disc ── */}
        <button
          id="music-player-toggle"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Close music player' : 'Open music player'}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
          style={{
            background: isPlaying ? track.gradient : 'var(--surface)',
            border: `2px solid ${isPlaying ? track.color : 'var(--border)'}`,
            boxShadow: isPlaying ? `0 4px 20px ${track.color}55` : undefined,
          }}
        >
          {/* Rotating Vinyl Music Disc */}
          <VinylDisc isPlaying={isPlaying} emoji={track.emoji} color={track.color} />

          {/* Pulsing glow ring when playing */}
          {isPlaying && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
              style={{ background: track.color }}
            />
          )}

          {/* Chevron badge */}
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: 'var(--brand-primary)' }}
          >
            {isOpen ? (
              <ChevronDown className="w-3 h-3 text-white" />
            ) : (
              <ChevronUp className="w-3 h-3 text-white" />
            )}
          </span>
        </button>
      </div>
    </>
  );
};
