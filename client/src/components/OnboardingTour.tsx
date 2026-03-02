/* ============================================================
   ONBOARDING TOUR – Prüfungsnavigator
   Erscheint beim ersten Besuch, 3-Schritt-Dialog
   ============================================================ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Rocket, Upload, Brain, FlaskConical, BookOpen, Sparkles, CheckCircle } from "lucide-react";

const STEPS = [
  {
    icon: Rocket,
    color: "cyan",
    title: "Willkommen im Prüfungsnavigator!",
    subtitle: "Dein KI-gestützter Autopilot für die Prüfungsvorbereitung",
    content: "Der Prüfungsnavigator führt dich und deine Lernpartnerin / deinen Lernpartner in 5 Phasen durch eine vollständige Prüfungsvorbereitung – mit kostenlosen KI-Tools, Probeprüfungen und Reflexion.",
    visual: (
      <div className="grid grid-cols-5 gap-2 mt-4">
        {[
          { n: 1, label: "Hochladen", icon: Upload, c: "cyan" },
          { n: 2, label: "KI-Analyse", icon: Brain, c: "emerald" },
          { n: 3, label: "Probeprüfung", icon: FlaskConical, c: "amber" },
          { n: 4, label: "Strategien", icon: BookOpen, c: "purple" },
          { n: 5, label: "Reflexion", icon: Sparkles, c: "rose" },
        ].map((s) => {
          const Icon = s.icon;
          const colorMap: Record<string, string> = {
            cyan: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
            emerald: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
            amber: "bg-amber-500/15 border-amber-500/30 text-amber-400",
            purple: "bg-purple-500/15 border-purple-500/30 text-purple-400",
            rose: "bg-rose-500/15 border-rose-500/30 text-rose-400",
          };
          return (
            <div key={s.n} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border ${colorMap[s.c]}`}>
              <Icon size={16} />
              <span className="text-white text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{s.n}</span>
              <span className="text-slate-400 text-xs text-center leading-tight">{s.label}</span>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    icon: Upload,
    color: "emerald",
    title: "So startest du",
    subtitle: "3 einfache Schritte",
    content: "Alles, was du brauchst, um loszulegen:",
    visual: (
      <div className="space-y-3 mt-4">
        {[
          { step: "1", title: "Fach & Thema wählen", desc: "Wähle dein Prüfungsfach und gib das Prüfungsthema ein. Das passt alle KI-Prompts automatisch an.", color: "cyan" },
          { step: "2", title: "Unterlagen hochladen", desc: "Lade deine Unterrichtsunterlagen und Modellprüfungen hoch. Nutze NotebookLM als KI-Wissensbasis.", color: "emerald" },
          { step: "3", title: "Phase für Phase vorgehen", desc: "Folge den 5 Phasen. Jede Phase hat klare Aufgaben, Zeitangaben und kopierfertige KI-Prompts.", color: "amber" },
        ].map((item) => {
          const colorMap: Record<string, string> = {
            cyan: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
            emerald: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
            amber: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          };
          return (
            <div key={item.step} className="flex gap-3">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorMap[item.color]}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                {item.step}
              </div>
              <div>
                <p className="text-white text-xs font-semibold mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{item.title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    icon: CheckCircle,
    color: "purple",
    title: "Alles kostenlos & datenschutzfreundlich",
    subtitle: "Keine Abos, keine Installation",
    content: "Alle verwendeten Tools sind gratis und erfordern keine Abonnements:",
    visual: (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          { name: "NotebookLM", desc: "KI-Wissensbasis", emoji: "📖", free: true },
          { name: "ChatGPT", desc: "Probeprüfungen & Prompts", emoji: "🤖", free: true },
          { name: "Fobizz", desc: "Schul-KI-Tools", emoji: "🏫", free: true },
          { name: "CryptPad", desc: "Kollaboration & Teilen", emoji: "🔒", free: true },
          { name: "Excalidraw", desc: "Mindmaps & Skizzen", emoji: "✏️", free: true },
          { name: "Quizlet", desc: "Lernkarten & Quiz", emoji: "🃏", free: true },
        ].map((tool) => (
          <div key={tool.name} className="flex items-center gap-2 p-2.5 rounded-xl border border-white/8 bg-white/3">
            <span className="text-base">{tool.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</p>
              <p className="text-slate-500 text-xs truncate">{tool.desc}</p>
            </div>
            <span className="text-emerald-400 text-xs font-bold flex-shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>✓</span>
          </div>
        ))}
      </div>
    ),
  },
];

const STORAGE_KEY = "pruefungsnavigator_onboarding_done";

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Kurze Verzögerung für bessere UX
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const current = STEPS[step];
  const Icon = current.icon;

  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
    emerald: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    purple: "text-purple-400 bg-purple-500/15 border-purple-500/30",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="w-full max-w-lg rounded-2xl border border-white/12 overflow-hidden shadow-2xl"
            style={{ background: "oklch(0.175 0.028 264.695)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colorMap[current.color]}`}>
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>{current.title}</p>
                  <p className="text-slate-400 text-xs">{current.subtitle}</p>
                </div>
              </div>
              <button
                onClick={close}
                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-slate-300 text-sm leading-relaxed mb-1">{current.content}</p>
              {current.visual}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
              {/* Dots */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`rounded-full transition-all duration-200 ${i === step ? "w-5 h-2 bg-cyan-400" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={prev}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 text-slate-400 hover:text-white text-xs font-semibold transition-all"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    <ArrowLeft size={12} /> Zurück
                  </button>
                )}
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm transition-all"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {step < STEPS.length - 1 ? (
                    <><span>Weiter</span><ArrowRight size={13} /></>
                  ) : (
                    <><span>Los geht's!</span><Rocket size={13} /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
