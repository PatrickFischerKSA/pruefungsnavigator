/* ============================================================
   PHASE 4 – LERNSTRATEGIEN
   Design: Functional Futurism
   Basiert auf: Selbstlernheft_Lernstrategien.docx
   Erweiterungen: localStorage via AppContext, Fortschritt-Tracking
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, ExternalLink, Zap, Brain, Clock, Users, Target } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const strategies = [
  {
    id: "retrieval",
    title: "Aktives Abrufen",
    subtitle: "Retrieval Practice",
    icon: Brain,
    color: "cyan",
    badge: "Sehr wirksam",
    badgeColor: "emerald",
    desc: "Schliesse das Buch und schreibe alles auf, woran du dich erinnerst. Dieses aktive Erinnern ist deutlich wirksamer als erneutes Lesen – auch wenn es sich schwieriger anfühlt.",
    steps: [
      "Lerne einen Abschnitt deiner Unterlagen",
      "Schliesse alle Hilfsmittel",
      "Schreibe alles auf, woran du dich erinnerst (Stichworte oder Sätze)",
      "Vergleiche danach mit dem Original",
      "Markiere, was du vergessen hast – das sind deine Lernziele",
    ],
    tool: "CryptPad (leeres Dokument)",
    toolUrl: "https://cryptpad.fr",
    prompt: `Ich habe gerade das Thema [THEMA] gelernt. Hier ist meine Erinnerungsleistung (ohne Hilfsmittel aufgeschrieben): [DEINE NOTIZEN]. 
Bitte analysiere: Was habe ich korrekt erinnert? Was fehlt? Was war ungenau? Erstelle eine Liste der Punkte, die ich noch wiederholen muss.`,
  },
  {
    id: "feynman",
    title: "Feynman-Methode",
    subtitle: "Erklären & Verknüpfen",
    icon: Users,
    color: "emerald",
    badge: "Ideal für Zweiergruppen",
    badgeColor: "cyan",
    desc: "Erkläre ein Thema so einfach wie möglich, als würdest du es einer jüngeren Person erklären. Was du nicht einfach erklären kannst, hast du noch nicht wirklich verstanden.",
    steps: [
      "Wähle ein Thema aus deinen Unterlagen",
      "Erkläre es deiner Lernpartnerin / deinem Lernpartner in einfachen Worten",
      "Nutze Analogien und Alltagsbeispiele",
      "Wo stockst du? Das sind deine Wissenslücken",
      "Gehe zurück zu den Unterlagen und fülle die Lücken",
    ],
    tool: "Kein Tool nötig – oder Excalidraw für Skizzen",
    toolUrl: "https://excalidraw.com",
    prompt: `Ich erkläre dir jetzt das Thema [THEMA] in meinen eigenen Worten:
[DEINE ERKLÄRUNG]

Bitte gib mir Feedback: Was habe ich richtig erklärt? Was fehlt oder ist ungenau? Welche Fachbegriffe habe ich vergessen? Wie würdest du das Thema ergänzen?`,
  },
  {
    id: "spacing",
    title: "Verteiltes Lernen",
    subtitle: "Spacing Effect",
    icon: Clock,
    color: "amber",
    badge: "Für Langzeitgedächtnis",
    badgeColor: "amber",
    desc: "Mehrere kurze Lerneinheiten über mehrere Tage sind deutlich wirksamer als eine lange Marathon-Session. Plane deine Lernzeit bewusst über die verfügbaren Tage.",
    steps: [
      "Teile deinen Prüfungsstoff in kleinere Einheiten auf",
      "Plane täglich 2–3 kurze Lernblöcke (je 25–45 Min.)",
      "Wiederhole frühere Themen regelmässig (Spaced Repetition)",
      "Nutze Quizlet für automatische Wiederholungsintervalle",
      "Tracke deinen Fortschritt im Lerntracker unten",
    ],
    tool: "Quizlet (Spaced Repetition)",
    toolUrl: "https://quizlet.com",
    prompt: `Meine Prüfung ist in [TAGE] Tagen. Ich kann täglich [STUNDEN] Stunden lernen.
Mein Prüfungsstoff umfasst: [THEMEN AUFLISTEN]

Erstelle einen Lernplan nach dem Prinzip des verteilten Lernens. Verteile die Themen so, dass jedes Thema mindestens zweimal wiederholt wird. Plane auch Puffer für Wiederholungen ein.`,
  },
  {
    id: "wenn-dann",
    title: "Wenn-Dann-Planung",
    subtitle: "Motivationsmanagement",
    icon: Target,
    color: "purple",
    badge: "Motivation stärken",
    badgeColor: "purple",
    desc: "Formuliere konkrete Wenn-Dann-Pläne, um Hindernisse zu überwinden. Statt 'Ich will mehr lernen' sagst du: 'Wenn ich nach Hause komme, dann lerne ich sofort 30 Minuten.'",
    steps: [
      "Identifiziere deine grössten Lernhindernisse (Ablenkung, Prokrastination, Müdigkeit)",
      "Formuliere für jedes Hindernis einen Wenn-Dann-Plan",
      "Schreibe die Pläne auf und platziere sie sichtbar",
      "Nutze den Lerntracker für tägliche Motivation",
      "Reflektiere wöchentlich: Was hat funktioniert?",
    ],
    tool: "CryptPad oder Papier",
    toolUrl: "https://cryptpad.fr",
    prompt: `Ich habe folgende Lernprobleme: [PROBLEME BESCHREIBEN]
Hilf mir, konkrete Wenn-Dann-Pläne zu formulieren. Erstelle für jedes Problem einen spezifischen Plan im Format:
"Wenn [SITUATION], dann [KONKRETE AKTION]."
Gib mir auch 3 Tipps, wie ich meine Motivation für die Prüfungsvorbereitung aufrechterhalten kann.`,
  },
  {
    id: "mindmap",
    title: "Mindmapping",
    subtitle: "Wissen vernetzen",
    icon: Zap,
    color: "teal",
    badge: "Für visuelle Lernende",
    badgeColor: "teal",
    desc: "Erstelle eine Mindmap des Prüfungsstoffs, um Zusammenhänge sichtbar zu machen. Verbinde Konzepte, die zusammengehören. Dies aktiviert beide Gehirnhälften.",
    steps: [
      "Schreibe das Hauptthema in die Mitte",
      "Füge Hauptäste für die wichtigsten Unterthemen hinzu",
      "Verbinde verwandte Konzepte mit Pfeilen",
      "Nutze Farben für verschiedene Themenbereiche",
      "Teile die Mindmap mit deiner Lernpartnerin / deinem Lernpartner",
    ],
    tool: "Excalidraw oder Miro (kostenlos)",
    toolUrl: "https://excalidraw.com",
    prompt: `Erstelle eine textbasierte Mindmap-Struktur zum Thema [THEMA]. Nutze Einrückungen, um die Hierarchie darzustellen. Zeige die wichtigsten Verbindungen zwischen den Konzepten. Ich werde diese Struktur in Excalidraw oder Miro umsetzen.`,
  },
];

const wennDannExamples = [
  { wenn: "Ich komme nach Hause und will sofort auf mein Handy schauen", dann: "Lege das Handy in einen anderen Raum und lerne zuerst 25 Minuten" },
  { wenn: "Ich fühle mich überfordert und weiss nicht, wo anfangen", dann: "Öffne den Prüfungsnavigator und starte mit Phase 1" },
  { wenn: "Ich bin müde und kann mich nicht konzentrieren", dann: "Mache zuerst 10 Minuten Bewegung, dann 20 Minuten Lernen" },
  { wenn: "Meine Lernpartnerin / mein Lernpartner ist nicht verfügbar", dann: "Nutze ChatGPT als Gesprächspartner für die Feynman-Methode" },
];

export default function Phase4Strategien() {
  const { state, selectedFach, toggleCheckedItem, toggleLerntracker, completePhase } = useApp();
  const [activeStrategy, setActiveStrategy] = useState<string>("retrieval");
  const isDone = state.completedPhases.includes(4);

  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
    emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
    purple: "border-purple-500/30 bg-purple-500/8 text-purple-300",
    teal: "border-teal-500/30 bg-teal-500/8 text-teal-300",
  };
  const iconColorMap: Record<string, string> = {
    cyan: "text-cyan-400", emerald: "text-emerald-400",
    amber: "text-amber-400", purple: "text-purple-400", teal: "text-teal-400",
  };

  const active = strategies.find((s) => s.id === activeStrategy)!;
  const Icon = active.icon;

  // Streak aus globalem Lerntracker berechnen
  const streak = (() => {
    let s = 0;
    for (let i = state.lerntracker.length - 1; i >= 0; i--) {
      if (state.lerntracker[i]) s++; else break;
    }
    return s;
  })();

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="phase-badge bg-purple-500/20 border border-purple-500/30 text-purple-300">4</div>
            <div>
              <p className="text-purple-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 4 von 5</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Lern- & Motivationsstrategien</h1>
            </div>
            {state.pruefungsthema && (
              <span className="ml-2 px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                {selectedFach.emoji} {selectedFach.label}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Wähle die richtigen Strategien für deinen Lerntyp. Alle Methoden basieren auf wissenschaftlich belegten Erkenntnissen aus der Lernpsychologie. Dein Fortschritt wird automatisch gespeichert.
          </p>
        </div>

        {/* Strategy selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {strategies.map((s) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStrategy(s.id)}
                className={`
                  inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200
                  ${activeStrategy === s.id
                    ? colorMap[s.color] + " border-opacity-60"
                    : "border-white/10 text-slate-400 hover:text-white hover:border-white/20 bg-white/3"
                  }
                `}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                <SIcon size={13} className={activeStrategy === s.id ? iconColorMap[s.color] : "opacity-60"} />
                {s.title}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Strategy Detail */}
          <div className={`border rounded-xl overflow-hidden ${colorMap[active.color].split(" ")[0]}`}>
            <div className="p-5 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[active.color]} flex-shrink-0`}>
                  <Icon size={18} className={iconColorMap[active.color]} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-base" style={{ fontFamily: "Outfit, sans-serif" }}>{active.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${colorMap[active.badgeColor]}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      {active.badge}
                    </span>
                  </div>
                  <p className={`text-xs font-medium ${iconColorMap[active.color]}`}>{active.subtitle}</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mt-3">{active.desc}</p>
            </div>

            <div className="p-5 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
              <h4 className="text-white font-semibold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>Schritt-für-Schritt:</h4>
              {active.steps.map((step, idx) => {
                const stepId = `phase4-${active.id}-step-${idx}`;
                const done = state.checkedItems.includes(stepId);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCheckedItem(stepId)}
                    className="w-full flex items-start gap-3 text-left group"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${done ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover:border-white/40"}`}>
                      {done && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <span className={`text-xs leading-relaxed ${done ? "text-slate-500 line-through" : "text-slate-300"}`}>{step}</span>
                  </button>
                );
              })}

              <div className="pt-3 border-t border-white/8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-500 text-xs">Tool:</span>
                  <a
                    href={active.toolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${iconColorMap[active.color]} hover:opacity-80`}
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    <ExternalLink size={10} />
                    {active.tool}
                  </a>
                </div>
                {/* Prompt */}
                <div className="prompt-box text-xs whitespace-pre-line mt-2">{active.prompt}</div>
              </div>
            </div>
          </div>

          {/* Right column: Wenn-Dann + Lerntracker */}
          <div className="space-y-4">
            {/* Wenn-Dann Planer */}
            <div className="border border-purple-500/20 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-purple-500/15" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Wenn-Dann-Planer</h3>
                <p className="text-slate-400 text-xs">Beispiele für konkrete Motivationspläne</p>
              </div>
              <div className="p-4 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                {wennDannExamples.map((ex, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-white/6 bg-white/2">
                    <p className="text-xs text-slate-500 mb-0.5">Wenn …</p>
                    <p className="text-slate-300 text-xs mb-2">{ex.wenn}</p>
                    <p className="text-xs text-purple-400 mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>… dann:</p>
                    <p className="text-white text-xs font-medium">{ex.dann}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lerntracker – jetzt mit globalem State (localStorage) */}
            <div className="border border-white/8 rounded-xl p-5" style={{ background: "oklch(0.208 0.028 264.364)" }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Lerntracker (21 Tage)</h3>
                <span className="text-slate-500 text-xs">Wird gespeichert ✓</span>
              </div>
              <p className="text-slate-400 text-xs mb-4">Markiere jeden Tag, an dem du gelernt hast.</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {state.lerntracker.map((active, i) => (
                  <button
                    key={i}
                    onClick={() => toggleLerntracker(i)}
                    className={`
                      w-8 h-8 rounded-lg border text-xs font-bold transition-all duration-200
                      ${active
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-white/15 text-slate-500 hover:border-white/30"
                      }
                    `}
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400">{state.lerntracker.filter(Boolean).length} von 21 Tagen</span>
                {streak > 0 && (
                  <span className="text-emerald-400 font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                    🔥 {streak} Tage Streak
                  </span>
                )}
              </div>
            </div>

            {/* Drei Grundbedürfnisse */}
            <div className="border border-white/8 rounded-xl p-5" style={{ background: "oklch(0.208 0.028 264.364)" }}>
              <h3 className="text-white font-bold text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Motivation analysieren</h3>
              <div className="space-y-3">
                {[
                  { label: "Autonomie", q: "Habe ich Einfluss auf mein Lernen?", color: "cyan" },
                  { label: "Kompetenz", q: "Erlebe ich Fortschritt und Erfolge?", color: "emerald" },
                  { label: "Zugehörigkeit", q: "Fühle ich mich von meiner Lernpartnerin / meinem Lernpartner unterstützt?", color: "amber" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color === "cyan" ? "bg-cyan-400" : item.color === "emerald" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <div>
                      <p className={`text-xs font-semibold ${item.color === "cyan" ? "text-cyan-400" : item.color === "emerald" ? "text-emerald-400" : "text-amber-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>{item.label}</p>
                      <p className="text-slate-400 text-xs">{item.q}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <Link href="/phase/3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 text-sm font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
              <ArrowLeft size={14} />Phase 3
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { completePhase(4); toast.success("Phase 4 als abgeschlossen markiert!"); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/15 text-slate-400 hover:text-white hover:border-white/30"}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <CheckCircle size={13} />
              {isDone ? "Abgeschlossen ✓" : "Als erledigt markieren"}
            </button>
            <Link href="/phase/5">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm transition-all duration-200" style={{ fontFamily: "Outfit, sans-serif" }}>
                Weiter zu Phase 5<ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
