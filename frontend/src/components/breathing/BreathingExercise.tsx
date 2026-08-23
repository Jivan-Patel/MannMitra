import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

/* ─── Configuration ───────────────────────────────────── */
interface PhaseConfig {
  key: string;
  label: string;
  subLabel: string;
  duration: number; // seconds
  targetScale: number;
  color: string;
  glowColor: string;
}

const PHASES: PhaseConfig[] = [
  {
    key: 'inhale',
    label: 'Inhale',
    subLabel: 'breathe in slowly',
    duration: 4,
    targetScale: 1,
    color: '#4FBDB6',
    glowColor: 'rgba(79,189,182,0.35)',
  },
  {
    key: 'hold-in',
    label: 'Hold',
    subLabel: 'gently hold',
    duration: 4,
    targetScale: 1,
    color: '#9AACA8',
    glowColor: 'rgba(154,172,168,0.3)',
  },
  {
    key: 'exhale',
    label: 'Exhale',
    subLabel: 'release slowly',
    duration: 6,
    targetScale: 0,
    color: '#E3A23C',
    glowColor: 'rgba(227,162,60,0.35)',
  },
  {
    key: 'hold-out',
    label: 'Rest',
    subLabel: 'stay empty',
    duration: 2,
    targetScale: 0,
    color: '#8C8ACF',
    glowColor: 'rgba(140,138,207,0.3)',
  },
];

const TOTAL_CYCLES = 5;
const BASE_SIZE = 160; // px — "empty lungs" diameter
const MAX_EXPAND = 100; // px added when fully inhaled

/* ─── Circumference for SVG progress ring ─────────────── */
const RING_R = 110;
const RING_CIRC = 2 * Math.PI * RING_R;

export const BreathingExercise = () => {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0); // 0..phaseDuration
  const [cycle, setCycle] = useState(0);
  const [done, setDone] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phase = PHASES[phaseIdx];

  /* ── Tick ── */
  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = +(prev + 0.05).toFixed(3);
        if (next >= phase.duration) {
          // Advance phase
          setPhaseIdx(pi => {
            const nextPi = (pi + 1) % PHASES.length;
            if (nextPi === 0) {
              setCycle(c => {
                const newC = c + 1;
                if (newC >= TOTAL_CYCLES) {
                  setRunning(false);
                  setDone(true);
                }
                return newC;
              });
            }
            return nextPi;
          });
          return 0;
        }
        return next;
      });
    }, 50);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, phase.duration]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setPhaseIdx(0);
    setElapsed(0);
    setCycle(0);
    setDone(false);
  }, []);

  /* ── Derived values ── */
  const progress = elapsed / phase.duration; // 0..1
  const secondsLeft = Math.ceil(phase.duration - elapsed);

  // Smooth circle diameter via CSS transition
  const circleDiam =
    phase.key === 'inhale'
      ? BASE_SIZE + MAX_EXPAND * progress
      : phase.key === 'hold-in'
      ? BASE_SIZE + MAX_EXPAND
      : phase.key === 'exhale'
      ? BASE_SIZE + MAX_EXPAND * (1 - progress)
      : BASE_SIZE; // hold-out

  // Overall session progress for the outer ring
  const totalSeconds = PHASES.reduce((s, p) => s + p.duration, 0) * TOTAL_CYCLES;
  const elapsedSeconds =
    cycle * PHASES.reduce((s, p) => s + p.duration, 0) +
    PHASES.slice(0, phaseIdx).reduce((s, p) => s + p.duration, 0) +
    elapsed;
  const sessionProgress = running || done ? elapsedSeconds / totalSeconds : 0;
  const dashOffset = RING_CIRC * (1 - sessionProgress);

  const canvasSize = (BASE_SIZE + MAX_EXPAND + 30) * 2; // SVG viewBox size

  return (
    <div className="flex flex-col items-center gap-6 select-none">

      {/* ── Main visual ── */}
      <div className="relative flex items-center justify-center" style={{ width: canvasSize, height: canvasSize }}>

        {/* SVG: outer progress ring */}
        <svg
          width={canvasSize}
          height={canvasSize}
          className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track ring */}
          <circle
            cx={canvasSize / 2}
            cy={canvasSize / 2}
            r={RING_R}
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
          />
          {/* Progress ring */}
          <circle
            cx={canvasSize / 2}
            cy={canvasSize / 2}
            r={RING_R}
            fill="none"
            stroke={phase.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.6s ease' }}
          />
        </svg>

        {/* Glow layer */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: circleDiam + 60,
            height: circleDiam + 60,
            background: `radial-gradient(circle, ${phase.glowColor} 0%, transparent 70%)`,
            transition: `width ${phase.duration}s linear, height ${phase.duration}s linear`,
          }}
        />

        {/* Breathing circle */}
        <div
          className="rounded-full flex flex-col items-center justify-center z-10 shadow-xl"
          style={{
            width: circleDiam,
            height: circleDiam,
            background: `radial-gradient(circle at 35% 30%, ${phase.color}EE 0%, ${phase.color}88 60%, ${phase.color}55 100%)`,
            boxShadow: `0 0 30px ${phase.glowColor}, 0 8px 32px rgba(0,0,0,0.15)`,
            transition: `width ${phase.duration}s linear, height ${phase.duration}s linear, background 0.6s ease, box-shadow 0.6s ease`,
          }}
        >
          {running && (
            <div className="text-white text-center px-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80 mb-0.5">
                {phase.subLabel}
              </p>
              <p className="font-display text-5xl font-bold leading-none">{secondsLeft}</p>
              <p className="text-sm font-bold mt-1 opacity-90">{phase.label}</p>
            </div>
          )}
          {!running && !done && (
            <div className="text-white/80 text-center px-3">
              <Wind className="w-8 h-8 mx-auto mb-1 opacity-70" />
              <p className="text-sm font-semibold">{cycle > 0 ? 'Paused' : 'Ready'}</p>
            </div>
          )}
          {done && (
            <div className="text-white text-center px-3">
              <p className="text-3xl mb-1">✓</p>
              <p className="text-sm font-bold">Well done!</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Phase pills ── */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {PHASES.map((p, i) => (
          <div
            key={p.key}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-400"
            style={{
              background: phaseIdx === i && running ? `${p.color}22` : 'var(--surface-alt)',
              border: `0.5px solid ${phaseIdx === i && running ? p.color : 'transparent'}`,
              color: phaseIdx === i && running ? p.color : 'var(--text-secondary)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: phaseIdx === i && running ? p.color : 'var(--border)' }}
            />
            {p.label} · {p.duration}s
          </div>
        ))}
      </div>

      {/* ── Cycle counter ── */}
      {(running || done || cycle > 0) && (
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background:
                  i < cycle
                    ? 'var(--brand-primary)'
                    : i === cycle && running
                    ? `${phase.color}`
                    : 'var(--border)',
                transform: i === cycle && running ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
          <span className="text-xs text-text-secondary ml-1 font-sans">
            Cycle {Math.min(cycle + (done ? 0 : 1), TOTAL_CYCLES)}/{TOTAL_CYCLES}
          </span>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="flex items-center gap-3">
        {!done ? (
          <button
            id="breathing-start-stop-btn"
            onClick={() => setRunning(r => !r)}
            className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--cat-music) 100%)',
              boxShadow: '0 4px 18px rgba(79,189,182,0.4)',
            }}
          >
            {running
              ? <><Pause className="w-4 h-4 fill-white" /> Pause</>
              : <><Play  className="w-4 h-4 fill-white" /> {cycle > 0 ? 'Resume' : 'Start'}</>
            }
          </button>
        ) : (
          <div className="px-6 py-3 rounded-full text-sm font-bold text-success bg-success/10 border border-success/30">
            ✓ Session complete
          </div>
        )}

        {(cycle > 0 || running || done) && (
          <button
            id="breathing-reset-btn"
            onClick={reset}
            className="flex items-center gap-1.5 px-4 py-3 rounded-full text-sm font-semibold text-text-secondary border border-border/40 hover:border-brand-primary hover:text-brand-primary transition-all duration-200 focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* ── Instructions (only before start) ── */}
      {!running && !done && cycle === 0 && (
        <p className="text-xs text-text-secondary text-center max-w-xs font-sans leading-relaxed">
          Box breathing: 4s inhale · 4s hold · 6s exhale · 2s rest — for {TOTAL_CYCLES} cycles (~{Math.round(PHASES.reduce((s,p)=>s+p.duration,0)*TOTAL_CYCLES/60)} min)
        </p>
      )}
    </div>
  );
};
