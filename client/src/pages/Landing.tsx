/* ============================================================
   LANDING PAGE – Prüfungsnavigator
   Design: Functional Futurism – Dark Cockpit
   Einstiegsseite mit Hero, Features, Tools und CTA
   ============================================================ */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Rocket, Upload, Brain, FlaskConical, BookOpen, Sparkles,
  ArrowRight, Users, Clock, CheckCircle, GraduationCap,
  Zap, Shield, Star, ChevronDown, ExternalLink
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" as const }
  }),
};

const phases = [
  { num: 1, title: "Unterlagen hochladen", desc: "Unterrichtsunterlagen & Modellprüfungen einlesen", icon: Upload, color: "cyan", time: "20–30 Min." },
  { num: 2, title: "KI-Analyse", desc: "Stoff strukturieren mit NotebookLM, ChatGPT & Fobizz", icon: Brain, color: "emerald", time: "40–60 Min." },
  { num: 3, title: "Probeprüfung", desc: "Lernstand ermitteln & Defizite sichtbar machen", icon: FlaskConical, color: "amber", time: "30–40 Min." },
  { num: 4, title: "Lernstrategien", desc: "Feynman, Retrieval, Spacing & mehr anwenden", icon: BookOpen, color: "purple", time: "40–50 Min." },
  { num: 5, title: "Reflexion", desc: "Lernjournal, KI-Feedback & Peer-Reflexion", icon: Sparkles, color: "rose", time: "30–40 Min." },
];

const tools = [
  { name: "NotebookLM", tag: "Google", desc: "KI-Notizbuch für deine Unterlagen", url: "https://notebooklm.google.com", color: "cyan" },
  { name: "ChatGPT", tag: "OpenAI", desc: "Probeprüfungen & Erklärungen generieren", url: "https://chat.openai.com", color: "emerald" },
  { name: "Fobizz", tag: "Schul-KI", desc: "DSGVO-konforme KI für Schulen", url: "https://app.fobizz.com", color: "amber" },
  { name: "CryptPad", tag: "Kollaboration", desc: "Verschlüsseltes Teilen von Dokumenten", url: "https://cryptpad.fr", color: "purple" },
  { name: "Excalidraw", tag: "Mindmaps", desc: "Kollaborative Mindmaps & Skizzen", url: "https://excalidraw.com", color: "teal" },
  { name: "Quizlet", tag: "Karteikarten", desc: "Lernkarten & Übungstests", url: "https://quizlet.com", color: "rose" },
];

const features = [
  { icon: Zap, title: "Autopilot-Funktionen", desc: "Schritt-für-Schritt-Anleitungen führen dich automatisch durch alle Phasen der Prüfungsvorbereitung.", color: "cyan" },
  { icon: Users, title: "Zwei-Personen-Modus", desc: "Lerne gemeinsam mit deiner Lernpartnerin oder deinem Lernpartner – mit getrennten Journalen und Feedback.", color: "emerald" },
  { icon: Clock, title: "180–240 Minuten", desc: "Eine vollständige Prüfungsvorbereitung in einer strukturierten Lernsession – von der Analyse bis zur Reflexion.", color: "amber" },
  { icon: Shield, title: "100% kostenlos", desc: "Alle integrierten Tools sind gratis und erfordern kein Abo. Deine Daten bleiben lokal in deinem Browser.", color: "purple" },
  { icon: GraduationCap, title: "FMS Pädagogik", desc: "Speziell konzipiert für das pädagogische Profil der Fachmittelschule – mit Fokus auf überfachliche Kompetenzen.", color: "rose" },
  { icon: Star, title: "Lernstrategien", desc: "7 evidenzbasierte Strategien: Feynman, Retrieval Practice, Spacing, Interleaving, Elaboration und mehr.", color: "teal" },
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  cyan:    { border: "border-cyan-500/30",    bg: "bg-cyan-500/10",    text: "text-cyan-400",    glow: "shadow-cyan-500/20" },
  emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  amber:   { border: "border-amber-500/30",   bg: "bg-amber-500/10",   text: "text-amber-400",   glow: "shadow-amber-500/20" },
  purple:  { border: "border-purple-500/30",  bg: "bg-purple-500/10",  text: "text-purple-400",  glow: "shadow-purple-500/20" },
  rose:    { border: "border-rose-500/30",     bg: "bg-rose-500/10",    text: "text-rose-400",    glow: "shadow-rose-500/20" },
  teal:    { border: "border-teal-500/30",     bg: "bg-teal-500/10",    text: "text-teal-400",    glow: "shadow-teal-500/20" },
};

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.141 0.005 285.823)", fontFamily: "Nunito, sans-serif" }}>

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 backdrop-blur-xl"
        style={{ background: "oklch(0.141 0.005 285.823 / 0.85)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Rocket size={14} className="text-cyan-400" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Prüfungsnavigator
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">· Future Skills Lab</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/lehrer"
              className="text-slate-400 hover:text-white text-xs transition-colors hidden sm:inline"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              Lehrperson
            </Link>
            <Link href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 text-xs font-semibold transition-all"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              <Zap size={11} /> Starten
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Hintergrund-Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, oklch(0.7 0.2 200) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-6"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              <Rocket size={11} /> FMS Pädagogisches Profil · Klasse 17+
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
            style={{ fontFamily: "Outfit, sans-serif" }}>
            Dein KI-Autopilot
            <br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, oklch(0.7 0.2 200), oklch(0.75 0.18 160))" }}>
              für jede Prüfung
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
            className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Lade deine Unterlagen hoch, lass die KI den Stoff strukturieren,
            generiere Probeprüfungen und reflektiere dein Lernverhalten –
            alles kostenlos, in 180–240 Minuten.
          </motion.p>

          {/* CTAs */}
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-900 text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
              style={{ background: "linear-gradient(135deg, oklch(0.7 0.2 200), oklch(0.75 0.18 160))", fontFamily: "Outfit, sans-serif" }}>
              <Rocket size={15} /> Jetzt starten
              <ArrowRight size={14} />
            </Link>
            <Link href="/lehrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:border-white/30 text-sm font-semibold transition-all"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              <GraduationCap size={15} /> Lehrperson-Ansicht
            </Link>
          </motion.div>

          {/* Scroll-Hint */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-16 flex justify-center">
            <ChevronDown size={18} className="text-slate-600 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ─── 5 PHASEN ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-center mb-12">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Der Weg zur Prüfung</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>5 Phasen. Ein Ziel.</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {phases.map((phase, i) => {
              const c = colorMap[phase.color];
              const Icon = phase.icon;
              return (
                <motion.div key={phase.num} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                  <Link href="/dashboard"
                    className={`block p-5 rounded-2xl border ${c.border} ${c.bg} hover:shadow-lg ${c.glow} transition-all group cursor-pointer`}>
                    <div className={`w-9 h-9 rounded-xl border ${c.border} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      style={{ background: "oklch(0.208 0.028 264.364)" }}>
                      <Icon size={16} className={c.text} />
                    </div>
                    <div className={`text-xs font-bold ${c.text} mb-1`} style={{ fontFamily: "Outfit, sans-serif" }}>Phase {phase.num}</div>
                    <p className="text-white font-bold text-sm leading-tight mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>{phase.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed mb-3">{phase.desc}</p>
                    <span className={`inline-flex items-center gap-1 text-xs ${c.text} font-semibold`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      <Clock size={10} /> {phase.time}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-6" style={{ background: "oklch(0.165 0.01 285.823)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-center mb-12">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Was dich erwartet</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Alles, was du brauchst</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className={`p-6 rounded-2xl border ${c.border} hover:shadow-lg ${c.glow} transition-all`}
                  style={{ background: "oklch(0.208 0.028 264.364)" }}>
                  <div className={`w-10 h-10 rounded-xl border ${c.border} ${c.bg} flex items-center justify-center mb-4`}>
                    <Icon size={18} className={c.text} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TOOLS ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-center mb-12">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Integrierte Tools</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Alle gratis. Kein Abo.</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Alle integrierten KI-Tools sind kostenlos nutzbar und erfordern keine Registrierung oder Kreditkarte.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => {
              const c = colorMap[tool.color];
              return (
                <motion.a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${c.border} hover:shadow-md ${c.glow} transition-all group`}
                  style={{ background: "oklch(0.208 0.028 264.364)" }}>
                  <div className={`w-10 h-10 rounded-xl border ${c.border} ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs font-black ${c.text}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      {tool.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${c.border} ${c.bg} ${c.text} font-semibold`}
                        style={{ fontFamily: "Outfit, sans-serif" }}>{tool.tag}</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{tool.desc}</p>
                  </div>
                  <ExternalLink size={13} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6" style={{ background: "oklch(0.165 0.01 285.823)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
              <Rocket size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
              Bereit für die Prüfung?
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Starte jetzt mit Phase 1 – lade deine Unterlagen hoch und lass den Prüfungsnavigator die Arbeit übernehmen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-900 text-base transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
                style={{ background: "linear-gradient(135deg, oklch(0.7 0.2 200), oklch(0.75 0.18 160))", fontFamily: "Outfit, sans-serif" }}>
                <Rocket size={17} /> Prüfungsnavigator starten
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 text-slate-500 text-xs">
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-500" /> Kostenlos</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-500" /> Kein Abo</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-500" /> Daten bleiben lokal</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Rocket size={11} className="text-cyan-400" />
            </div>
            <span className="text-slate-400 text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>
              Prüfungsnavigator · Future Skills Lab · FMS Pädagogisches Profil
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
            <Link href="/lehrer" className="hover:text-slate-300 transition-colors">Lehrperson</Link>
            <Link href="/print" className="hover:text-slate-300 transition-colors">Druckansicht</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
