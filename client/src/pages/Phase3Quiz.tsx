/* ============================================================
   PHASE 3 – PROBEPRÜFUNG GENERIEREN
   Design: Functional Futurism
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { FlaskConical, Copy, ExternalLink, ArrowRight, ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyPrompt = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Prompt kopiert!"));
};

// Demo-Probeprüfung (wird im echten Einsatz durch KI-generierte Fragen ersetzt)
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
    explanation: "Die Selbstbestimmungstheorie (Deci & Ryan) nennt Autonomie (Einfluss auf eigenes Handeln), Kompetenz (Erleben von Fortschritt) und Zugehörigkeit (soziale Einbindung) als die drei zentralen Grundbedürfnisse für intrinsische Motivation.",
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
    explanation: "Verteiltes Lernen (Spacing Effect) nutzt den natürlichen Vergessenskurve: Wenn man kurz vor dem Vergessen wiederholt, wird die Erinnerungsspur stärker. Mehrere kurze Lerneinheiten über mehrere Tage sind deutlich effektiver als eine lange Lernsession.",
  },
];

const promptTemplates = [
  {
    title: "Vollständige Probeprüfung generieren",
    desc: "Erstellt eine komplette Probeprüfung basierend auf deinen Unterlagen",
    prompt: `Ich bereite mich auf eine Prüfung zum Thema [THEMA] vor. Erstelle eine Probeprüfung mit folgenden Anforderungen:
- 5 Multiple-Choice-Fragen (4 Optionen, eine richtig)
- 3 Kurzantwort-Fragen (2–4 Sätze)
- 2 Transferfragen (Anwendung auf neue Situationen)
Gib nach jeder Frage die Musterlösung und eine kurze Erklärung an.
Orientiere dich an diesem Prüfungsformat: [MODELLPRÜFUNG EINFÜGEN ODER BESCHREIBEN]`,
  },
  {
    title: "Schwachstellen-Analyse nach Probeprüfung",
    desc: "Analysiert deine Antworten und identifiziert Lücken",
    prompt: `Ich habe die folgende Probeprüfung bearbeitet. Hier sind meine Antworten:
[DEINE ANTWORTEN EINFÜGEN]

Analysiere meine Antworten:
1. Welche Themen beherrsche ich gut?
2. Wo liegen meine grössten Wissenslücken?
3. Welche 3 Themen sollte ich zuerst wiederholen?
4. Erstelle für jede Wissenslücke eine kurze Erklärung.`,
  },
  {
    title: "Adaptiver Lernplan nach Schwachstellen",
    desc: "Erstellt einen gezielten Lernplan für die verbleibende Zeit",
    prompt: `Meine Prüfung ist in [ANZAHL TAGE] Tagen. Ich lerne täglich [STUNDEN] Stunden.
Meine Schwachstellen sind: [THEMEN EINFÜGEN]
Meine Stärken sind: [THEMEN EINFÜGEN]

Erstelle einen detaillierten Lernplan für die verbleibenden Tage. Berücksichtige:
- Verteiltes Lernen (keine Marathon-Sessions)
- Fokus auf Schwachstellen, aber auch Stärken festigen
- Konkrete Aufgaben pro Lerneinheit (z.B. "30 Min: Kapitel X mit Feynman-Methode")`,
  },
  {
    title: "Quizlet-Lernkarten generieren",
    desc: "Erstellt Lernkarten-Sets für Quizlet",
    prompt: `Erstelle 20 Lernkarten-Paare (Frage/Begriff – Antwort/Definition) zum Thema [THEMA] im folgenden Format:
VORDERSEITE: [Begriff oder Frage]
RÜCKSEITE: [Definition oder Antwort in max. 2 Sätzen]

Die Karten sollen alle wichtigen Prüfungsbegriffe abdecken. Ich werde sie in Quizlet importieren.`,
  },
];

const quizTools = [
  { name: "Quizlet", url: "https://quizlet.com", desc: "Lernkarten & automatische Tests", color: "text-blue-400" },
  { name: "Revisely", url: "https://www.revisely.com/quiz-generator", desc: "KI-Quiz aus PDF/Text", color: "text-purple-400" },
  { name: "Mentimeter", url: "https://www.mentimeter.com", desc: "Live-Quiz für Zweiergruppen", color: "text-pink-400" },
  { name: "Kahoot!", url: "https://kahoot.com", desc: "Spielbasiertes Quiz (kostenlos)", color: "text-amber-400" },
];

export default function Phase3Quiz() {
  const { state, selectedFach, completePhase } = useApp();
  const isDone = state.completedPhases.includes(3);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(demoQuestions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [openPrompt, setOpenPrompt] = useState<number | null>(0);

  const handleAnswer = (idx: number) => {
    if (answers[currentQ] !== null) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQ < demoQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(answers[currentQ + 1]);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers(new Array(demoQuestions.length).fill(null));
    setShowResult(false);
    setQuizStarted(false);
  };

  const score = answers.filter((a, i) => a === demoQuestions[i].correct).length;

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="phase-badge bg-amber-500/20 border border-amber-500/30 text-amber-300">3</div>
            <div>
              <p className="text-amber-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 3 von 5</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Probeprüfung generieren</h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Generiere mit KI eine massgeschneiderte Probeprüfung für <strong className="text-slate-300">{selectedFach.emoji} {selectedFach.label}</strong>{state.pruefungsthema ? ` (${state.pruefungsthema})` : ""}, erkenne deine Wissenslücken und erstelle einen adaptiven Lernplan.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Prompt Templates */}
          <div>
            <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
              KI-Prompts für Probeprüfungen
            </h2>
            <div className="space-y-3">
              {promptTemplates.map((pt, idx) => (
                <div key={idx} className="border border-white/8 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/3 transition-colors"
                    onClick={() => setOpenPrompt(openPrompt === idx ? null : idx)}
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{pt.title}</p>
                      <p className="text-slate-500 text-xs">{pt.desc}</p>
                    </div>
                    {openPrompt === idx ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                  </button>
                  {openPrompt === idx && (
                    <div className="px-4 pb-4">
                      <div className="prompt-box mb-3 whitespace-pre-line">{pt.prompt}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyPrompt(pt.prompt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                          <Copy size={11} />
                          Kopieren
                        </button>
                        <a
                          href="https://chat.openai.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 text-xs font-semibold hover:text-white hover:border-white/20 transition-colors"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                          <ExternalLink size={11} />
                          In ChatGPT öffnen
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quiz Tools */}
            <div className="mt-6">
              <h3 className="text-white font-bold text-xs mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Weitere Quiz-Tools (kostenlos)</h3>
              <div className="grid grid-cols-2 gap-2">
                {quizTools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/15 transition-all group"
                  >
                    <ExternalLink size={12} className={`${tool.color} flex-shrink-0`} />
                    <div>
                      <p className="text-white text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</p>
                      <p className="text-slate-500 text-xs">{tool.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Quiz */}
          <div>
            <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
              Demo-Quiz: Lernstrategien
            </h2>
            <div className="border border-amber-500/20 rounded-xl overflow-hidden">
              {!quizStarted && !showResult && (
                <div className="p-6 text-center" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                    <FlaskConical size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Demo-Probeprüfung</h3>
                  <p className="text-slate-400 text-xs mb-1">3 Fragen · Thema: Lernstrategien</p>
                  <p className="text-slate-500 text-xs mb-5">Dies ist ein Beispiel. Im echten Einsatz generierst du Fragen mit ChatGPT aus deinen eigenen Unterlagen.</p>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Quiz starten
                  </button>
                </div>
              )}

              {quizStarted && !showResult && (
                <div style={{ background: "oklch(0.208 0.028 264.364)" }}>
                  {/* Progress */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Frage {currentQ + 1} von {demoQuestions.length}</span>
                      <span className="text-xs text-amber-400 font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {answers.filter(a => a !== null).length}/{demoQuestions.length} beantwortet
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQ + 1) / demoQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {demoQuestions[currentQ].question}
                    </p>
                    <div className="space-y-2 mb-4">
                      {demoQuestions[currentQ].options.map((opt, idx) => {
                        const answered = answers[currentQ] !== null;
                        const isCorrect = idx === demoQuestions[currentQ].correct;
                        const isSelected = answers[currentQ] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={answered}
                            className={`
                              w-full text-left p-3 rounded-lg border text-xs transition-all duration-200
                              ${!answered ? "border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 text-slate-300" : ""}
                              ${answered && isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : ""}
                              ${answered && isSelected && !isCorrect ? "border-rose-500/50 bg-rose-500/10 text-rose-300" : ""}
                              ${answered && !isSelected && !isCorrect ? "border-white/5 text-slate-500" : ""}
                            `}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded border border-current flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              {opt}
                              {answered && isCorrect && <CheckCircle size={12} className="ml-auto text-emerald-400" />}
                              {answered && isSelected && !isCorrect && <XCircle size={12} className="ml-auto text-rose-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {answers[currentQ] !== null && (
                      <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 mb-4">
                        <p className="text-cyan-300 text-xs font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Erklärung:</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{demoQuestions[currentQ].explanation}</p>
                      </div>
                    )}

                    <button
                      onClick={nextQuestion}
                      disabled={answers[currentQ] === null}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold text-sm transition-all"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {currentQ < demoQuestions.length - 1 ? "Nächste Frage" : "Auswertung"}
                    </button>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="p-6 text-center" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${score === demoQuestions.length ? "bg-emerald-500/20 border border-emerald-500/30" : score >= demoQuestions.length / 2 ? "bg-amber-500/20 border border-amber-500/30" : "bg-rose-500/20 border border-rose-500/30"}`}>
                    <span className="text-2xl font-black" style={{ fontFamily: "Outfit, sans-serif", color: score === demoQuestions.length ? "#10B981" : score >= demoQuestions.length / 2 ? "#F59E0B" : "#F43F5E" }}>
                      {score}/{demoQuestions.length}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {score === demoQuestions.length ? "Perfekt!" : score >= demoQuestions.length / 2 ? "Gut gemacht!" : "Noch Luft nach oben"}
                  </h3>
                  <p className="text-slate-400 text-xs mb-5">
                    {score === demoQuestions.length
                      ? "Du beherrschst alle Themen dieses Demo-Quiz. Generiere jetzt eine Probeprüfung zu deinem echten Prüfungsstoff."
                      : `Du hast ${demoQuestions.length - score} Frage(n) falsch. Nutze die Schwachstellen-Analyse in Phase 2, um gezielt zu wiederholen.`}
                  </p>
                  <button onClick={resetQuiz} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
                    <RotateCcw size={12} />
                    Nochmals
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 rounded-xl border border-amber-500/15 bg-amber-500/5 flex gap-3">
              <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-400 text-xs leading-relaxed">
                <strong className="text-amber-300">Autopilot-Tipp:</strong> Kopiere den Prompt "Vollständige Probeprüfung generieren" in ChatGPT und füge relevante Textpassagen aus deinen Unterlagen ein. ChatGPT erstellt dann eine massgeschneiderte Prüfung – inklusive Musterlösungen.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <Link href="/phase/2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 text-sm font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
              <ArrowLeft size={14} />Phase 2
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
                Weiter zu Phase 4<ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
