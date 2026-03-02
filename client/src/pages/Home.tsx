/* ============================================================
   HOME / DASHBOARD – Prüfungsnavigator
   Design: Functional Futurism – Cockpit Overview
   Erweiterungen: Fortschrittsbalken, Fach-Selektor, localStorage
   ============================================================ */
import { Link } from "wouter";
import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import FachSelector from "@/components/FachSelector";
import { useApp } from "@/contexts/AppContext";
import { Upload, Brain, FlaskConical, BookOpen, Sparkles, ArrowRight, Users, Clock, Target, Zap, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const phases = [
  {
    num: 1,
    href: "/phase/1",
    title: "Unterlagen hochladen",
    subtitle: "Lernmaterial & Modellprüfungen",
    desc: "Lade deine Unterrichtsunterlagen und Modellprüfungen hoch. Die KI analysiert den Stoff und bereitet ihn für dich auf.",
    icon: Upload,
    color: "cyan",
    tools: ["NotebookLM", "Google Drive"],
    duration: "10–15 Min.",
    borderColor: "border-cyan-500/30",
    bgColor: "bg-cyan-500/8",
    iconColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/20",
    badgeText: "text-cyan-300",
    glowClass: "glow-cyan",
  },
  {
    num: 2,
    href: "/phase/2",
    title: "KI-gestützte Analyse",
    subtitle: "Stoff strukturieren & verstehen",
    desc: "Nutze NotebookLM, ChatGPT und Fobizz, um den Prüfungsstoff zu strukturieren, Zusammenfassungen zu erstellen und Wissenslücken zu finden.",
    icon: Brain,
    color: "emerald",
    tools: ["NotebookLM", "ChatGPT", "Fobizz"],
    duration: "20–30 Min.",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/8",
    iconColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-300",
    glowClass: "glow-emerald",
  },
  {
    num: 3,
    href: "/phase/3",
    title: "Probeprüfung generieren",
    subtitle: "Lernstand ermitteln",
    desc: "Lass dir eine massgeschneiderte Probeprüfung generieren. Erkenne Defizite und fokussiere dein Lernen gezielt auf Schwachstellen.",
    icon: FlaskConical,
    color: "amber",
    tools: ["ChatGPT", "Quizlet", "Revisely"],
    duration: "30–45 Min.",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/8",
    iconColor: "text-amber-400",
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-300",
    glowClass: "glow-amber",
  },
  {
    num: 4,
    href: "/phase/4",
    title: "Lernstrategien",
    subtitle: "Effizient & nachhaltig lernen",
    desc: "Wähle die richtigen Lernstrategien: Feynman-Methode, verteiltes Lernen, aktives Abrufen. Plane deine Lernzeit mit dem Wenn-Dann-System.",
    icon: BookOpen,
    color: "purple",
    tools: ["CryptPad", "Miro", "Excalidraw"],
    duration: "15–20 Min.",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/8",
    iconColor: "text-purple-400",
    badgeBg: "bg-purple-500/20",
    badgeText: "text-purple-300",
    glowClass: "",
  },
  {
    num: 5,
    href: "/phase/5",
    title: "Reflexion & Feedback",
    subtitle: "Lernverhalten analysieren",
    desc: "Reflektiere deinen Lernprozess, hol dir KI-Feedback zu deinen Antworten und dokumentiere deinen Fortschritt im digitalen Lernjournal.",
    icon: Sparkles,
    color: "rose",
    tools: ["ChatGPT", "CryptPad", "Fobizz"],
    duration: "15–20 Min.",
    borderColor: "border-rose-500/30",
    bgColor: "bg-rose-500/8",
    iconColor: "text-rose-400",
    badgeBg: "bg-rose-500/20",
    badgeText: "text-rose-300",
    glowClass: "",
  },
];

const stats = [
  { label: "Phasen", value: "5", icon: Target, color: "text-cyan-400" },
  { label: "Gratis-Tools", value: "12+", icon: Zap, color: "text-emerald-400" },
  { label: "Lernzeit", value: "90–130 Min.", icon: Clock, color: "text-amber-400" },
  { label: "Teamgrösse", value: "2 Personen", icon: Users, color: "text-purple-400" },
];

export default function Home() {
  const { state, resetAll } = useApp();

  const handleReset = () => {
    if (window.confirm("Möchtest du wirklich den gesamten Fortschritt zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      resetAll();
      toast.success("Fortschritt zurückgesetzt");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, oklch(0.141 0.028 264.695) 0%, oklch(0.175 0.028 264.695) 100%)`,
            minHeight: "380px",
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663307694374/URDq2ayACB7zYogudfMCm3/hero-navigator-9vouRZarEJcCF6KQfqXgQD.webp)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.141 0.028 264.695) 30%, transparent 70%)" }} />

          <div className="relative container py-12 lg:py-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-300" style={{ fontFamily: "Outfit, sans-serif" }}>FMS Pädagogik · Prüfungsvorbereitung</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                Prüfungs<span className="text-gradient-cyan">navigator</span>
              </h1>
              <p className="text-lg text-slate-300 mb-2 font-medium">
                Dein KI-gestützter Autopilot für die Prüfungsvorbereitung
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-lg">
                Lade deine Unterlagen hoch, lass die KI den Stoff analysieren, generiere Probeprüfungen und reflektiere deinen Lernfortschritt – alles mit kostenlosen Tools, in Zweiergruppen, Schritt für Schritt.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/phase/1">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm transition-all duration-200 glow-cyan" style={{ fontFamily: "Outfit, sans-serif" }}>
                    <Zap size={16} />
                    Jetzt starten
                    <ArrowRight size={14} />
                  </button>
                </Link>
                <Link href="/lehrer">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 hover:border-white/30 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-200 bg-white/5" style={{ fontFamily: "Outfit, sans-serif" }}>
                    Lehrperson-Ansicht
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-y border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3 px-6 py-4">
                    <Icon size={18} className={stat.color} />
                    <div>
                      <p className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{stat.value}</p>
                      <p className="text-slate-400 text-xs">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-10">

          {/* ── Fach-Selektor ── */}
          <div className="mb-2">
            <h2 className="text-white font-bold text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
              Prüfungsfach & Thema
            </h2>
            <FachSelector />
          </div>

          {/* ── Fortschrittsbalken ── */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                Lernfortschritt
              </h2>
              {state.completedPhases.length > 0 && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition-colors"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  <RotateCcw size={11} />
                  Zurücksetzen
                </button>
              )}
            </div>
            <ProgressBar />
          </div>

          {/* ── Phasen-Grid ── */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              Die 5 Phasen deiner Prüfungsvorbereitung
            </h2>
            <p className="text-slate-400 text-sm mb-6">Folge dem Navigator Schritt für Schritt – oder springe direkt zur Phase, die du brauchst.</p>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {phases.map((phase, idx) => {
                const Icon = phase.icon;
                const done = state.completedPhases.includes(phase.num);
                return (
                  <Link key={phase.num} href={phase.href}>
                    <div
                      className={`
                        group relative border rounded-xl p-5 cursor-pointer
                        transition-all duration-300 hover:scale-[1.02]
                        ${phase.borderColor} ${phase.bgColor}
                        border-gradient
                        ${done ? "opacity-75" : ""}
                      `}
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {done && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                          <span className="text-emerald-400 text-xs">✓</span>
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`phase-badge ${phase.badgeBg} border ${phase.borderColor} ${phase.iconColor} flex-shrink-0`}>
                          {phase.num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={14} className={phase.iconColor} />
                            <span className={`text-xs font-semibold ${phase.badgeText}`} style={{ fontFamily: "Outfit, sans-serif" }}>{phase.subtitle}</span>
                          </div>
                          <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{phase.title}</h3>
                          <p className="text-slate-400 text-xs leading-relaxed mb-3">{phase.desc}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {phase.tools.map((tool) => (
                              <span key={tool} className={`tool-chip ${phase.badgeBg} ${phase.badgeText} ${phase.borderColor}`}>
                                {tool}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs flex items-center gap-1">
                              <Clock size={10} />
                              {phase.duration}
                            </span>
                            <span className={`text-xs font-semibold flex items-center gap-1 ${phase.iconColor} group-hover:gap-2 transition-all`} style={{ fontFamily: "Outfit, sans-serif" }}>
                              {done ? "Wiederholen" : "Öffnen"} <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Info box */}
          <div className="p-5 rounded-xl border border-white/8 bg-white/3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap size={14} className="text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Alle Tools sind 100% kostenlos</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Dieser Navigator verwendet ausschliesslich gratis Ressourcen: <strong className="text-slate-300">Google NotebookLM</strong> (Google-Konto nötig), <strong className="text-slate-300">ChatGPT</strong> (kostenlose Version), <strong className="text-slate-300">Fobizz</strong> (Basis-Lizenz), <strong className="text-slate-300">Quizlet</strong>, <strong className="text-slate-300">CryptPad</strong>, <strong className="text-slate-300">Excalidraw</strong>, <strong className="text-slate-300">Miro</strong> (Gratis-Plan) und weitere. Kein Abo erforderlich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
