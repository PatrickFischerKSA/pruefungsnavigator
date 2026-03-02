/* ============================================================
   PHASE 3 – PROBEPRÜFUNG GENERIEREN (30–40 Min.)
   Design: Functional Futurism
   Inhalt: KI-Prompts, Demo-Quiz, Auswertung, Quizlet/Kahoot
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import {
  FlaskConical, Copy, ExternalLink, ArrowRight, ArrowLeft,
  CheckCircle, XCircle, RotateCcw, Lightbulb, ChevronDown,
  ChevronUp, Clock, Users, Target, Zap, BarChart2
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyPrompt = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Prompt kopiert!"));
};

const demoQuestions = [
  {
    id: 1,
    question: "Was versteht man unter 'Retrieval Practice' (aktives Abrufen)?",
    options: [
      "Mehrfaches Lesen des gleichen Textes",
      "Das aktive Erinnern von Informationen aus dem Gedächtnis ohne Hilfsmittel",
      "Das Erstellen von Zusammenfassungen mit KI",
      "Das Anschauen von Erklärvideos",
    ],
    correct: 1,
    explanation: "Retrieval Practice bedeutet, Wissen aktiv aus dem Gedächtnis abzurufen – z.B. durch Selbsttests oder das Aufschreiben von Erlerntem ohne Vorlage. Studien zeigen, dass dies deutlich effektiver ist als erneutes Lesen.",
    kategorie: "Lernstrategien",
    schwierigkeit: "leicht",
  },
  {
    id: 2,
    question: "Welche drei Grundbedürfnisse müssen laut Selbstbestimmungstheorie erfüllt sein, damit Motivation entsteht?",
    options: [
      "Sicherheit, Erfolg, Anerkennung",
      "Autonomie, Kompetenz, Zugehörigkeit",
      "Interesse, Disziplin, Belohnung",
      "Planung, Durchführung, Reflexion",
    ],
    correct: 1,
    explanation: "Die Selbstbestimmungstheorie (Deci & Ryan) nennt Autonomie, Kompetenz und Zugehörigkeit als die drei zentralen Grundbedürfnisse für intrinsische Motivation.",
    kategorie: "Motivationstheorie",
    schwierigkeit: "mittel",
  },
  {
    id: 3,
    question: "Was ist der Hauptvorteil von 'verteiltem Lernen' gegenüber 'Massen-Lernen' (Cramming)?",
    options: [
      "Verteiltes Lernen ist schneller",
      "Massen-Lernen ist für Prüfungen besser geeignet",
      "Verteiltes Lernen führt zu besserem Langzeitgedächtnis",
      "Beide Methoden sind gleich effektiv",
    ],
    correct: 2,
    explanation: "Verteiltes Lernen (Spacing Effect) nutzt die natürliche Vergessenskurve: Wenn man kurz vor dem Vergessen wiederholt, wird die Erinnerungsspur stärker. Mehrere kurze Lerneinheiten über mehrere Tage sind deutlich effektiver als eine lange Lernsession.",
    kategorie: "Lernstrategien",
    schwierigkeit: "leicht",
  },
  {
    id: 4,
    question: "Was beschreibt die 'Feynman-Methode' als Lernstrategie?",
    options: [
      "Lernen durch Karteikarten und Wiederholung",
      "Einen Stoff so einfach erklären, dass ihn ein Kind verstehen würde",
      "Lernen in kurzen Intervallen mit Pausen",
      "Zusammenfassungen mit KI erstellen",
    ],
    correct: 1,
    explanation: "Die Feynman-Methode (nach Richard Feynman) besagt: Wenn du ein Konzept wirklich verstehst, kannst du es einfach erklären. Wenn du es nicht einfach erklären kannst, hast du noch Lücken – geh zurück zu den Quellen.",
    kategorie: "Lernstrategien",
    schwierigkeit: "leicht",
  },
  {
    id: 5,
    question: "Was versteht man unter 'Metakognition' im Lernkontext?",
    options: [
      "Das Lernen mit digitalen Medien",
      "Das Nachdenken über das eigene Denken und Lernen",
      "Das Erstellen von Mindmaps",
      "Das gemeinsame Lernen in der Gruppe",
    ],
    correct: 1,
    explanation: "Metakognition bezeichnet die Fähigkeit, das eigene Denken und Lernen zu beobachten und zu steuern. Dazu gehören: Planung (Wie gehe ich vor?), Monitoring (Verstehe ich das?) und Evaluation (Was hat funktioniert?).",
    kategorie: "Lernkompetenz",
    schwierigkeit: "mittel",
  },
  {
    id: 6,
    question: "Welche Strategie hilft am besten, um Prüfungsangst zu reduzieren?",
    options: [
      "Kurz vor der Prüfung nochmals alles durchlesen",
      "Regelmässige Probeprüfungen unter Prüfungsbedingungen",
      "Möglichst viel Stoff auswendig lernen",
      "Die Prüfung möglichst lange ignorieren",
    ],
    correct: 1,
    explanation: "Regelmässige Probeprüfungen unter realistischen Bedingungen (Zeitdruck, keine Hilfsmittel) reduzieren Prüfungsangst, weil sie die Prüfungssituation vertraut machen und das Vertrauen in die eigenen Fähigkeiten stärken.",
    kategorie: "Motivationsstrategien",
    schwierigkeit: "mittel",
  },
  {
    id: 7,
    question: "Was ist eine 'Wenn-Dann-Planung' (Implementierungsintention)?",
    options: [
      "Ein Lernplan für die Woche",
      "Eine Strategie, bei der man konkrete Situationen mit Handlungen verknüpft",
      "Eine Methode zum Erstellen von Lernkarten",
      "Ein Verfahren zur Gruppenarbeit",
    ],
    correct: 1,
    explanation: "Wenn-Dann-Planungen sind konkrete Handlungspläne: 'Wenn [Situation], dann [Handlung]'. Beispiel: 'Wenn ich nach Hause komme, dann lerne ich 25 Minuten Biologie.' Diese Technik erhöht die Wahrscheinlichkeit, Vorhaben tatsächlich umzusetzen.",
    kategorie: "Motivationsstrategien",
    schwierigkeit: "mittel",
  },
  {
    id: 8,
    question: "Welche Aussage über KI-Tools wie ChatGPT beim Lernen ist korrekt?",
    options: [
      "KI kann die eigene Denkarbeit vollständig ersetzen",
      "KI ist nur für Texte geeignet, nicht für Mathematik",
      "KI kann als Lernpartner dienen, ersetzt aber nicht das eigene Verstehen",
      "KI-generierte Inhalte sind immer fehlerfrei",
    ],
    correct: 2,
    explanation: "KI-Tools wie ChatGPT sind wertvolle Lernpartner: Sie können erklären, Fragen stellen und Feedback geben. Aber: KI kann Fehler machen, und das eigene Verstehen und kritische Denken sind nicht ersetzbar. KI ist ein Werkzeug, kein Ersatz für Lernprozesse.",
    kategorie: "KI & Lernen",
    schwierigkeit: "schwer",
  },
];

function buildProbeprüfungsPrompts(fachLabel: string, thema: string, pruefungsformat: string) {
  const t = thema || `[THEMA aus ${fachLabel}]`;
  const f = pruefungsformat;
  return [
    {
      title: "Vollständige Probeprüfung (30 Min.)",
      desc: "Generiert eine komplette Probeprüfung mit Zeitvorgabe und Musterlösung",
      prompt: `Erstelle eine vollständige Probeprüfung zu "${t}" (${fachLabel}). Anforderungen:
- Prüfungsformat: ${f}
- Zeitvorgabe: 30 Minuten
- Aufgabentypen: 3 Multiple-Choice-Fragen (je 1 Punkt), 2 Kurzantwort-Fragen (je 2 Punkte), 1 Erklärungsaufgabe (4 Punkte)
- Gesamtpunkte: 11 Punkte
- Schwierigkeitsgrad: Fachmittelschule (17-jährige Schüler*innen)
- Füge am Ende eine detaillierte Musterlösung mit Bewertungshinweisen hinzu
- Markiere, welche Themen aus meinen Unterlagen geprüft werden`,
    },
    {
      title: "Kurztest (10 Min.) – Wissenssicherung",
      desc: "Schneller 10-Minuten-Test zum Überprüfen des Grundwissens",
      prompt: `Erstelle einen Kurztest (10 Minuten) zu "${t}" (${fachLabel}) zur Wissenssicherung. Anforderungen:
- 5 Fragen: 3 Richtig-Falsch, 2 Kurzantwort (1–2 Sätze)
- Fokus auf Grundwissen und Definitionen
- Prüfungsformat: ${f}
- Musterlösung am Ende
- Hinweis: Welche Lücken zeigt dieser Test?`,
    },
    {
      title: "Tiefenprüfung (45 Min.) – Anwenden & Analysieren",
      desc: "Anspruchsvolle Prüfung mit Transferaufgaben und Fallbeispielen",
      prompt: `Erstelle eine anspruchsvolle Probeprüfung zu "${t}" (${fachLabel}) mit Fokus auf Anwenden und Analysieren. Anforderungen:
- Zeitvorgabe: 45 Minuten
- 1 Fallbeispiel mit 3 Teilaufgaben (Analysieren, Bewerten, Empfehlen)
- 2 Vergleichsaufgaben (Gemeinsamkeiten und Unterschiede)
- 1 Transferaufgabe (Konzept auf neue Situation anwenden)
- Prüfungsformat: ${f}
- Musterlösung mit Bewertungskriterien (Rubrik)`,
    },
    {
      title: "Lückenanalyse nach Probeprüfung",
      desc: "Analysiert Fehler und erstellt einen gezielten Nachbereitungsplan",
      prompt: `Ich habe die Probeprüfung zu "${t}" (${fachLabel}) gemacht. Meine Ergebnisse: [ERGEBNISSE EINTRAGEN – z.B. Aufgabe 1: richtig, Aufgabe 2: falsch, etc.].

Bitte analysiere:
1. Welche Themen beherrsche ich gut?
2. Wo liegen meine grössten Lücken?
3. Was sind die Ursachen für die Fehler (Wissenslücke, Denkfehler, Zeitproblem)?
4. Erstelle einen gezielten 2-Stunden-Nachbereitungsplan für meine Schwachstellen.`,
    },
    {
      title: "Mündliche Prüfungssimulation",
      desc: "Simuliert ein mündliches Prüfungsgespräch mit Feedback",
      prompt: `Simuliere ein mündliches Prüfungsgespräch zu "${t}" (${fachLabel}). Stelle mir 5 Fragen mit steigendem Schwierigkeitsgrad:
- 2 Wissensfragen (Definitionen, Fakten)
- 2 Verständnisfragen (Erklären, Vergleichen)
- 1 Anwendungsfrage (Fallbeispiel)

Warte nach jeder Frage auf meine Antwort. Gib mir dann:
- Kurzes Feedback (Was war gut? Was fehlt?)
- Ergänzende Informationen falls nötig
- Eine Einschätzung (Note 1–6 oder Punkte)
Prüfungsformat: ${f}`,
    },
    {
      title: "Peer-Prüfung vorbereiten",
      desc: "Erstellt Fragen, die ihr euch gegenseitig stellen könnt",
      prompt: `Erstelle 10 Fragen zu "${t}" (${fachLabel}), die sich zwei Lernende gegenseitig stellen können (Peer-Prüfung). Anforderungen:
- 5 Fragen für Person A an Person B
- 5 Fragen für Person B an Person A
- Verschiedene Schwierigkeitsgrade
- Zu jeder Frage: Musterlösung und Bewertungshinweis (Was ist eine vollständige Antwort?)
- Prüfungsformat: ${f}`,
    },
  ];
}

const AUFGABEN_P3 = [
  { id: "p3-a1", title: "Probeprüfung mit ChatGPT generieren", dauer: "10 Min.", tool: "ChatGPT", color: "amber", person: "beide", desc: "Nutzt den Prompt 'Vollständige Probeprüfung (30 Min.)' und kopiert ihn in ChatGPT. Passt die eckigen Klammern an euer Thema an. Druckt die Prüfung aus oder öffnet sie in einem zweiten Tab." },
  { id: "p3-a2", title: "Demo-Quiz absolvieren", dauer: "10 Min.", tool: "Demo-Quiz", color: "cyan", person: "einzeln", desc: "Absolviert das Demo-Quiz auf dieser Seite einzeln (ohne Abschauen!). Vergleicht eure Ergebnisse danach und besprecht die Fragen, bei denen ihr unterschiedliche Antworten hattet." },
  { id: "p3-a3", title: "Lückenanalyse durchführen", dauer: "5 Min.", tool: "ChatGPT", color: "rose", person: "beide", desc: "Tragt eure Quiz-Ergebnisse in den Prompt 'Lückenanalyse nach Probeprüfung' ein und lasst ChatGPT einen Nachbereitungsplan erstellen. Notiert die wichtigsten Lücken." },
  { id: "p3-a4", title: "Peer-Prüfung durchführen", dauer: "10 Min.", tool: "Peer-Prüfung", color: "emerald", person: "beide", desc: "Nutzt den Prompt 'Peer-Prüfung vorbereiten'. Stellt euch gegenseitig die generierten Fragen. Gebt nach jeder Antwort kurzes Feedback. Wechselt die Rollen nach 5 Minuten." },
  { id: "p3-a5", title: "Lernkarten in Quizlet erstellen", dauer: "5 Min.", tool: "Quizlet", color: "violet", person: "beide", desc: "Erstellt in Quizlet (quizlet.com) ein Set mit den 10 wichtigsten Fachbegriffen aus der Probeprüfung. Nutzt den Lernmodus und den Spielmodus für abwechslungsreiche Wiederholung." },
];

export default function Phase3Quiz() {
  const { state, selectedFach, completePhase, toggleCheckedItem } = useApp();
  const isDone = state.completedPhases.includes(3);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showAllAufgaben, setShowAllAufgaben] = useState(false);
  const [activePromptTab, setActivePromptTab] = useState(0);

  const promptTemplates = buildProbeprüfungsPrompts(selectedFach.label, state.pruefungsthema, selectedFach.pruefungsformat);
  const visibleAufgaben = showAllAufgaben ? AUFGABEN_P3 : AUFGABEN_P3.slice(0, 3);

  const handleAnswer = (qId: number, optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < demoQuestions.length) {
      toast.error(`Bitte beantworte alle ${demoQuestions.length} Fragen, bevor du auswerten lässt.`);
      return;
    }
    setSubmitted(true);
    const correct = demoQuestions.filter((q) => answers[q.id] === q.correct).length;
    const pct = Math.round((correct / demoQuestions.length) * 100);
    if (pct >= 75) toast.success(`${correct}/${demoQuestions.length} richtig (${pct}%) – Sehr gut!`);
    else if (pct >= 50) toast.info(`${correct}/${demoQuestions.length} richtig (${pct}%) – Gut, aber noch Lücken vorhanden.`);
    else toast.error(`${correct}/${demoQuestions.length} richtig (${pct}%) – Mehr Übung nötig!`);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const correctCount = submitted ? demoQuestions.filter((q) => answers[q.id] === q.correct).length : 0;
  const score = submitted ? Math.round((correctCount / demoQuestions.length) * 100) : 0;

  const kategorien = Array.from(new Set(demoQuestions.map(q => q.kategorie)));
  const kategorieStats = kategorien.map(kat => {
    const fragen = demoQuestions.filter(q => q.kategorie === kat);
    const richtig = submitted ? fragen.filter(q => answers[q.id] === q.correct).length : 0;
    return { kat, total: fragen.length, richtig };
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="phase-badge bg-amber-500/20 border border-amber-500/30 text-amber-300">3</div>
            <div>
              <p className="text-amber-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 3 von 5 · 30–40 Min.</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Probeprüfung & Lernstandsermittlung</h1>
            </div>
            <div className="ml-auto flex items-center gap-2 text-slate-500 text-xs">
              <Clock size={12} /><span>30–40 Min.</span>
              <Users size={12} className="ml-2" /><span>Zweiergruppe</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl">
            Generiert mit KI eine <strong className="text-slate-300">massgeschneiderte Probeprüfung</strong> für <strong className="text-slate-300">{selectedFach.emoji} {selectedFach.label}</strong>{state.pruefungsthema ? ` – ${state.pruefungsthema}` : ""}. Ermittelt euren Lernstand, identifiziert Lücken und führt eine Peer-Prüfung durch.
          </p>
        </div>

        {/* Zeitplan */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Probeprüfung generieren", dauer: "10 Min.", emoji: "🤖" },
            { label: "Demo-Quiz", dauer: "10 Min.", emoji: "📝" },
            { label: "Lückenanalyse", dauer: "5 Min.", emoji: "🔍" },
            { label: "Peer-Prüfung", dauer: "10 Min.", emoji: "👥" },
            { label: "Lernkarten", dauer: "5 Min.", emoji: "🃏" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/8 bg-white/2 p-3 text-center">
              <div className="text-xl mb-1">{item.emoji}</div>
              <p className="text-white text-xs font-semibold leading-tight mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{item.label}</p>
              <p className="text-slate-500 text-xs">{item.dauer}</p>
            </div>
          ))}
        </div>

        {/* Aufgaben */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <Target size={16} className="text-amber-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Aufgaben für Phase 3</h3>
            <span className="ml-auto text-xs text-slate-500">
              {AUFGABEN_P3.filter(a => state.checkedItems.includes(a.id)).length}/{AUFGABEN_P3.length} erledigt
            </span>
          </div>
          <div className="p-5 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {visibleAufgaben.map((aufgabe) => {
              const done = state.checkedItems.includes(aufgabe.id);
              return (
                <div key={aufgabe.id} className={`flex gap-3 p-4 rounded-xl border transition-all ${done ? "border-white/5 bg-white/2 opacity-60" : "border-white/8 bg-white/3"}`}>
                  <button
                    onClick={() => toggleCheckedItem(aufgabe.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${done ? `bg-${aufgabe.color}-500 border-${aufgabe.color}-500 text-white` : `border-white/20 hover:border-${aufgabe.color}-500/50`}`}
                  >
                    {done && <CheckCircle size={11} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className={`text-sm font-semibold ${done ? "line-through text-slate-500" : "text-white"}`} style={{ fontFamily: "Outfit, sans-serif" }}>{aufgabe.title}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border bg-${aufgabe.color}-500/10 border-${aufgabe.color}-500/20 text-${aufgabe.color}-400`}>{aufgabe.dauer}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded border bg-slate-500/10 border-slate-500/20 text-slate-400">{aufgabe.tool}</span>
                      <span className="text-xs text-slate-500">{aufgabe.person === "beide" ? "👥 Gemeinsam" : "👤 Einzeln"}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{aufgabe.desc}</p>
                  </div>
                </div>
              );
            })}
            {AUFGABEN_P3.length > 3 && (
              <button onClick={() => setShowAllAufgaben(!showAllAufgaben)} className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white text-xs transition-colors">
                {showAllAufgaben ? <><ChevronUp size={14} /> Weniger</> : <><ChevronDown size={14} /> Alle {AUFGABEN_P3.length} Aufgaben</>}
              </button>
            )}
          </div>
        </div>

        {/* Prompt-Tabs */}
        <div className="border border-amber-500/20 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-amber-500/15" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <Zap size={16} className="text-amber-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>KI-Prompts für Probeprüfungen</h3>
            <span className="ml-auto text-xs text-slate-500">{promptTemplates.length} Vorlagen</span>
          </div>
          <div style={{ background: "oklch(0.175 0.028 264.695)" }}>
            <div className="flex overflow-x-auto border-b border-white/8 px-4 pt-3 gap-2">
              {promptTemplates.map((pt, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePromptTab(idx)}
                  className={`flex-shrink-0 px-3 py-2 rounded-t-lg text-xs font-semibold transition-all border-b-2 ${activePromptTab === idx ? "text-amber-300 border-amber-400 bg-amber-500/10" : "text-slate-400 border-transparent hover:text-white"}`}
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {pt.title}
                </button>
              ))}
            </div>
            <div className="p-5">
              <p className="text-slate-400 text-xs mb-3">{promptTemplates[activePromptTab].desc}</p>
              <pre className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-white/3 rounded-xl p-4 border border-white/8 mb-3">{promptTemplates[activePromptTab].prompt}</pre>
              <div className="flex gap-2">
                <button
                  onClick={() => copyPrompt(promptTemplates[activePromptTab].prompt)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-colors"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  <Copy size={11} /> Prompt kopieren
                </button>
                <a
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  <ExternalLink size={11} /> In ChatGPT öffnen
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Demo-Quiz */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <FlaskConical size={16} className="text-cyan-400" />
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Demo-Quiz: Lernstrategien & KI</h3>
              <p className="text-slate-400 text-xs">{demoQuestions.length} Fragen · ca. 10 Min. · Einzeln bearbeiten, dann vergleichen</p>
            </div>
            {submitted && (
              <div className="ml-auto flex items-center gap-2">
                <span className={`text-sm font-bold ${score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                  {correctCount}/{demoQuestions.length} ({score}%)
                </span>
                <button onClick={handleReset} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/15 text-slate-400 hover:text-white text-xs transition-colors">
                  <RotateCcw size={11} /> Neu
                </button>
              </div>
            )}
          </div>

          {/* Auswertungs-Balken */}
          {submitted && (
            <div className="px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white text-xs font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Gesamtergebnis</p>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-xs">{score >= 75 ? "Sehr gut – bereit für die Prüfung!" : score >= 50 ? "Gut – noch einige Lücken schliessen" : "Mehr Übung nötig – zurück zu Phase 2"}</p>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Nach Kategorie</p>
                  <div className="space-y-1">
                    {kategorieStats.map(({ kat, total, richtig }) => (
                      <div key={kat} className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs w-36 truncate">{kat}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-cyan-500 transition-all duration-700" style={{ width: `${(richtig / total) * 100}%` }} />
                        </div>
                        <span className="text-slate-500 text-xs">{richtig}/{total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-5 space-y-5" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {demoQuestions.map((q, qIdx) => {
              const userAnswer = answers[q.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = submitted && userAnswer === q.correct;
              const isWrong = submitted && isAnswered && userAnswer !== q.correct;
              return (
                <div key={q.id} className={`border rounded-xl p-4 transition-all ${isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : isWrong ? "border-rose-500/30 bg-rose-500/5" : "border-white/8 bg-white/2"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCorrect ? "bg-emerald-500/20 text-emerald-400" : isWrong ? "bg-rose-500/20 text-rose-400" : "bg-white/8 text-slate-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      {qIdx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold leading-relaxed mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>{q.question}</p>
                      <div className="flex gap-2">
                        <span className="text-xs text-slate-500">{q.kategorie}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${q.schwierigkeit === "leicht" ? "text-emerald-400 bg-emerald-500/10" : q.schwierigkeit === "mittel" ? "text-amber-400 bg-amber-500/10" : "text-rose-400 bg-rose-500/10"}`}>{q.schwierigkeit}</span>
                      </div>
                    </div>
                    {submitted && (
                      isCorrect
                        ? <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                        : <XCircle size={18} className="text-rose-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="space-y-2 ml-9">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isCorrectOpt = optIdx === q.correct;
                      let cls = "border-white/10 bg-white/3 text-slate-300";
                      if (submitted) {
                        if (isCorrectOpt) cls = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
                        else if (isSelected && !isCorrectOpt) cls = "border-rose-500/40 bg-rose-500/10 text-rose-300";
                        else cls = "border-white/5 bg-white/1 text-slate-500";
                      } else if (isSelected) {
                        cls = "border-cyan-500/40 bg-cyan-500/10 text-cyan-300";
                      }
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswer(q.id, optIdx)}
                          disabled={submitted}
                          className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${cls} ${!submitted ? "hover:border-cyan-500/30 hover:bg-cyan-500/5 cursor-pointer" : "cursor-default"}`}
                        >
                          <span className="font-semibold mr-2" style={{ fontFamily: "Outfit, sans-serif" }}>{["A", "B", "C", "D"][optIdx]}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div className="mt-3 ml-9 p-3 rounded-lg bg-white/3 border border-white/8">
                      <p className="text-slate-300 text-xs leading-relaxed">
                        <strong className="text-white">Erklärung:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Quiz auswerten ({Object.keys(answers).length}/{demoQuestions.length} beantwortet)
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <p className="text-amber-300 font-semibold text-xs mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Nächste Schritte nach dem Quiz:</p>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>→ Tragt eure Ergebnisse in den Prompt 'Lückenanalyse nach Probeprüfung' ein</li>
                  <li>→ Besprecht falsche Antworten gemeinsam und erklärt euch gegenseitig die richtigen Lösungen</li>
                  <li>→ Erstellt Lernkarten für die Themen, bei denen ihr Fehler gemacht habt</li>
                  <li>→ Führt die Peer-Prüfung durch (Aufgabe 4)</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Lernkarten-Tools */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <BarChart2 size={16} className="text-violet-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Lernkarten & Quiz-Tools (kostenlos)</h3>
          </div>
          <div className="p-5 grid md:grid-cols-3 gap-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {[
              { name: "Quizlet", url: "https://quizlet.com", desc: "Digitale Lernkarten mit Spielmodus, Matching und Schreibübungen. Gratis-Version ausreichend.", use: "Fachbegriffe einprägen", color: "violet" },
              { name: "Kahoot!", url: "https://kahoot.com", desc: "Interaktive Quiz-Spiele. Erstellt ein Quiz und spielt es gemeinsam – macht Lernen zum Spiel.", use: "Gemeinsames Quiz-Spiel", color: "amber" },
              { name: "Revisely", url: "https://revisely.com", desc: "KI-generierte Lernkarten aus eigenem Text. Füge deine Zusammenfassung ein und erhalte sofort Lernkarten.", use: "Automatische Lernkarten", color: "cyan" },
            ].map((tool) => (
              <div key={tool.name} className={`p-4 rounded-xl border border-${tool.color}-500/20 bg-${tool.color}-500/5`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-${tool.color}-300 font-bold text-sm`} style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</p>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className={`text-${tool.color}-400 hover:text-${tool.color}-300`}><ExternalLink size={13} /></a>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-2">{tool.desc}</p>
                <p className={`text-xs text-${tool.color}-400 font-medium`}>→ {tool.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tipp */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3 mb-8">
          <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Tipp: Probeprüfung unter echten Bedingungen</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Macht die KI-generierte Probeprüfung unter echten Bedingungen: Zeitlimit setzen, keine Hilfsmittel, kein Abschauen. Erst danach die Musterlösung anschauen. Das ist deutlich effektiver als das Lesen der Musterlösung ohne vorherigen Versuch.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <Link href="/phase/2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 text-xs font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
              <ArrowLeft size={13} /> Phase 2
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { completePhase(3); toast.success("Phase 3 als abgeschlossen markiert!"); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/15 text-slate-400 hover:text-white hover:border-white/30"}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <CheckCircle size={13} />
              {isDone ? "Abgeschlossen ✓" : "Als erledigt markieren"}
            </button>
            <Link href="/phase/4">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all duration-200" style={{ fontFamily: "Outfit, sans-serif" }}>
                Weiter zu Phase 4 <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
