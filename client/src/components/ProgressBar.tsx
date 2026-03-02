/* ============================================================
   PROGRESS BAR – Prüfungsnavigator
   Visueller Gesamtfortschritt über alle 5 Phasen
   ============================================================ */
import { useApp } from "@/contexts/AppContext";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const PHASE_LABELS = [
  { n: 1, label: "Unterlagen", href: "/phase/1", color: "cyan" },
  { n: 2, label: "KI-Analyse", href: "/phase/2", color: "emerald" },
  { n: 3, label: "Probeprüfung", href: "/phase/3", color: "amber" },
  { n: 4, label: "Strategien", href: "/phase/4", color: "purple" },
  { n: 5, label: "Reflexion", href: "/phase/5", color: "rose" },
];

const colorMap: Record<string, { text: string; bg: string; border: string; bar: string }> = {
  cyan:    { text: "text-cyan-300",    bg: "bg-cyan-500/15",    border: "border-cyan-500/40",    bar: "bg-cyan-500" },
  emerald: { text: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/40", bar: "bg-emerald-500" },
  amber:   { text: "text-amber-300",   bg: "bg-amber-500/15",   border: "border-amber-500/40",   bar: "bg-amber-500" },
  purple:  { text: "text-purple-300",  bg: "bg-purple-500/15",  border: "border-purple-500/40",  bar: "bg-purple-500" },
  rose:    { text: "text-rose-300",    bg: "bg-rose-500/15",    border: "border-rose-500/40",    bar: "bg-rose-500" },
};

export default function ProgressBar() {
  const { state, progressPercent, completePhase, uncompletePhase } = useApp();

  const nextPhase = PHASE_LABELS.find((p) => !state.completedPhases.includes(p.n));

  return (
    <div className="border border-white/8 rounded-xl p-5 mb-6" style={{ background: "oklch(0.208 0.028 264.364)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
            Dein Fortschritt
          </h3>
          <p className="text-slate-400 text-xs">
            {state.completedPhases.length} von 5 Phasen abgeschlossen
          </p>
        </div>
        <div className="text-right">
          <span
            className={`text-2xl font-black ${
              progressPercent === 100 ? "text-emerald-400" :
              progressPercent >= 60 ? "text-amber-400" : "text-cyan-400"
            }`}
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Gesamtbalken */}
      <div className="h-2 bg-white/8 rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: progressPercent === 100
              ? "oklch(0.696 0.17 162.48)"
              : "linear-gradient(to right, oklch(0.715 0.143 215.221), oklch(0.696 0.17 162.48))",
          }}
        />
      </div>

      {/* Phasen-Schritte */}
      <div className="flex gap-2">
        {PHASE_LABELS.map((phase) => {
          const done = state.completedPhases.includes(phase.n);
          const c = colorMap[phase.color];
          return (
            <div key={phase.n} className="flex-1 min-w-0">
              <button
                onClick={() => done ? uncompletePhase(phase.n) : completePhase(phase.n)}
                className={`
                  w-full flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-200
                  ${done ? `${c.bg} ${c.border}` : "border-white/8 hover:border-white/20 bg-white/2"}
                `}
                title={done ? "Als nicht abgeschlossen markieren" : "Als abgeschlossen markieren"}
              >
                {done
                  ? <CheckCircle size={16} className={c.text} />
                  : <Circle size={16} className="text-slate-500" />
                }
                <span
                  className={`text-xs font-semibold truncate w-full text-center ${done ? c.text : "text-slate-500"}`}
                  style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.65rem" }}
                >
                  {phase.n}. {phase.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Nächste Phase CTA */}
      {nextPhase && progressPercent < 100 && (
        <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
          <span className="text-slate-400 text-xs">
            Nächste Phase:
            <span className="text-white font-semibold ml-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              {nextPhase.n}. {nextPhase.label}
            </span>
          </span>
          <Link href={nextPhase.href}>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Weiter
              <ArrowRight size={11} />
            </button>
          </Link>
        </div>
      )}

      {/* Abgeschlossen */}
      {progressPercent === 100 && (
        <div className="mt-4 pt-4 border-t border-emerald-500/20 flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-400" />
          <span className="text-emerald-300 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
            Alle Phasen abgeschlossen! Viel Erfolg bei der Prüfung 🎉
          </span>
        </div>
      )}
    </div>
  );
}
