/* ============================================================
   POMODORO TIMER – Prüfungsnavigator
   Design: Functional Futurism
   25/5-Minuten-Intervalle mit Audio-Feedback
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

type TimerMode = "work" | "break";

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

function playBeep(type: "start" | "end") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    if (type === "end") {
      // Drei absteigende Töne
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } else {
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // AudioContext not available
  }
}

export default function PomodoroTimer({ collapsed }: { collapsed: boolean }) {
  const [mode, setMode] = useState<TimerMode>("work");
  const [seconds, setSeconds] = useState(WORK_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = mode === "work" ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  const handleEnd = useCallback(() => {
    setRunning(false);
    playBeep("end");
    if (mode === "work") {
      setSessions((s) => s + 1);
      setMode("break");
      setSeconds(BREAK_MINUTES * 60);
    } else {
      setMode("work");
      setSeconds(WORK_MINUTES * 60);
    }
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            handleEnd();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, handleEnd]);

  const toggle = () => {
    if (!running) playBeep("start");
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setSeconds(mode === "work" ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
  };

  const switchMode = (m: TimerMode) => {
    setRunning(false);
    setMode(m);
    setSeconds(m === "work" ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDash = circumference - (progress / 100) * circumference;

  if (collapsed) {
    // Kompakte Ansicht wenn Sidebar eingeklappt
    return (
      <div className="flex flex-col items-center gap-1 px-2 py-3 border-t border-white/8">
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="20" fill="none"
              stroke={mode === "work" ? "#06b6d4" : "#10b981"}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center"
          >
            {running
              ? <Pause size={12} className="text-white" />
              : <Play size={12} className={mode === "work" ? "text-cyan-400" : "text-emerald-400"} />
            }
          </button>
        </div>
        <span className="text-slate-500 text-xs font-mono">{mins}:{secs}</span>
      </div>
    );
  }

  return (
    <div className="mx-3 mb-3 rounded-xl border border-white/8 overflow-hidden" style={{ background: "oklch(0.155 0.028 264.695)" }}>
      {/* Mode tabs */}
      <div className="flex border-b border-white/8">
        <button
          onClick={() => switchMode("work")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${mode === "work" ? "text-cyan-300 bg-cyan-500/10" : "text-slate-500 hover:text-slate-300"}`}
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <Brain size={11} />
          Lernen
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${mode === "break" ? "text-emerald-300 bg-emerald-500/10" : "text-slate-500 hover:text-slate-300"}`}
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <Coffee size={11} />
          Pause
        </button>
      </div>

      <div className="p-3 flex items-center gap-3">
        {/* Circular progress */}
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
            <circle
              cx="28" cy="28" r="24" fill="none"
              stroke={mode === "work" ? "#06b6d4" : "#10b981"}
              strokeWidth="3.5"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={(2 * Math.PI * 24) - (progress / 100) * (2 * Math.PI * 24)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-sm font-black ${mode === "work" ? "text-cyan-300" : "text-emerald-300"}`}
              style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.7rem" }}
            >
              {mins}:{secs}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1">
          <p className={`text-xs font-semibold mb-2 ${mode === "work" ? "text-cyan-300" : "text-emerald-300"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
            {mode === "work" ? "Lernphase" : "Pause"} · {sessions > 0 && <span className="text-slate-400">{sessions}× ✓</span>}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={toggle}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                running
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25"
                  : mode === "work"
                    ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25"
                    : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
              }`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {running ? <><Pause size={11} />Stop</> : <><Play size={11} />Start</>}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-white/10 text-slate-500 hover:text-white text-xs transition-colors"
            >
              <RotateCcw size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-3 pb-3">
        <div className="h-1 bg-white/6 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              background: mode === "work" ? "#06b6d4" : "#10b981",
            }}
          />
        </div>
        <p className="text-slate-600 text-xs mt-1.5 text-center" style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.6rem" }}>
          {mode === "work" ? `${WORK_MINUTES} Min. Lernen → ${BREAK_MINUTES} Min. Pause` : `${BREAK_MINUTES} Min. Pause → ${WORK_MINUTES} Min. Lernen`}
        </p>
      </div>
    </div>
  );
}
