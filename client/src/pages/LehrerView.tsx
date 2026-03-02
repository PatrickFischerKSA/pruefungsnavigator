/* ============================================================
   LEHRPERSON-ANSICHT – Prüfungsnavigator
   Design: Functional Futurism
   Neu: Kommentarfunktion, Lernjournal-Anzeige, Feedback-Export
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp, type LehrpersonKommentar } from "@/contexts/AppContext";
import {
  GraduationCap, ExternalLink, Copy, CheckCircle, Eye,
  MessageSquare, FileText, Lightbulb, BookOpen, ClipboardList,
  ArrowRight, Download, ChevronDown, ChevronUp, Send, Trash2, Users
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Text kopiert!"));
};



const toolsForTeacher = [
  {
    name: "Google NotebookLM",
    url: "https://notebooklm.google.com",
    color: "cyan",
    icon: "NLM",
    desc: "Schüler*innen teilen ihr Notizbuch. Alle KI-Gespräche, Zusammenfassungen und Quellen sind sichtbar.",
    howTo: [
      "Schüler*innen klicken im Notizbuch auf das Teilen-Symbol (oben rechts)",
      "Sie geben Ihre E-Mail-Adresse ein und wählen 'Betrachter' oder 'Kommentator'",
      "Sie erhalten eine E-Mail-Einladung und können das Notizbuch einsehen",
      "Alle KI-Gespräche, Notizen und Quellen sind für Sie sichtbar",
    ],
  },
  {
    name: "CryptPad",
    url: "https://cryptpad.fr",
    color: "teal",
    icon: "CP",
    desc: "Schüler*innen laden ihr Lernjournal in CryptPad hoch. Sie können direkt im Dokument kommentieren.",
    howTo: [
      "Schüler*innen erstellen ein neues CryptPad-Dokument",
      "Sie teilen den Link mit Ihnen (Lese- oder Bearbeitungszugriff)",
      "Sie können das Dokument öffnen und direkt kommentieren",
      "Keine Anmeldung für Betrachter nötig",
    ],
  },
  {
    name: "Fobizz",
    url: "https://app.fobizz.com",
    color: "purple",
    icon: "FOB",
    desc: "Lehrkräfte können über Fobizz Klassen anlegen, Aufgaben stellen und Ergebnisse einsehen.",
    howTo: [
      "Erstellen Sie ein kostenloses Lehrperson-Konto auf fobizz.com",
      "Legen Sie eine Klasse an und laden Sie Schüler*innen ein",
      "Stellen Sie Aufgaben oder teilen Sie Arbeitsblätter",
      "Sehen Sie Ergebnisse und Bearbeitungsstände ein",
    ],
  },
];

const feedbackTemplates = [
  {
    title: "Allgemeines Fortschritts-Feedback",
    text: `Liebes Lernteam,

ich habe euer NotebookLM-Notizbuch / euer Lernjournal durchgesehen. Hier sind meine Beobachtungen:

Stärken:
- [STÄRKEN EINTRAGEN]

Verbesserungspotenzial:
- [VERBESSERUNGEN EINTRAGEN]

Empfehlungen für die weitere Vorbereitung:
- [EMPFEHLUNGEN EINTRAGEN]

Weiter so! Meldet euch, wenn ihr Fragen habt.`,
  },
  {
    title: "Feedback zu KI-Nutzung",
    text: `Ich habe eure KI-Gespräche in NotebookLM gesehen. Folgendes fällt mir auf:

Ihr nutzt die KI [gut/noch nicht optimal], weil [BEGRÜNDUNG].

Tipps für bessere Prompts:
- Seid spezifischer: Statt "Erkläre X" → "Erkläre X anhand eines Beispiels aus [KONTEXT]"
- Hinterfragt die KI: "Bist du sicher? Welche Quellen belegen das?"
- Nutzt die Feynman-Methode: "Erkläre mir X so, als wäre ich 12 Jahre alt"

Weiter so!`,
  },
  {
    title: "Feedback zum Lernjournal",
    text: `Ich habe euer Lernjournal gelesen. Meine Rückmeldung:

Reflexionstiefe: [BEWERTUNG]
Was mir auffällt: [BEOBACHTUNG]
Meine Empfehlung: [EMPFEHLUNG]

Besonders gut: [POSITIVES]
Noch zu vertiefen: [VERBESSERUNG]`,
  },
  {
    title: "Feedback zu Lernstrategien",
    text: `Ich habe euren Lerntracker und die gewählten Strategien angeschaut:

Lernkontinuität: [BEWERTUNG – z.B. "Ihr lernt regelmässig, das ist sehr gut!"]
Strategiewahl: [BEWERTUNG – z.B. "Die Feynman-Methode passt gut zu eurem Fach"]

Empfehlung für die verbleibende Zeit:
- [EMPFEHLUNG 1]
- [EMPFEHLUNG 2]

Ihr seid auf dem richtigen Weg!`,
  },
];

const phaseOverview = [
  { num: 1, title: "Unterlagen hochladen", href: "/phase/1", color: "cyan", icon: BookOpen, check: "Unterlagen und Modellprüfungen vorhanden?" },
  { num: 2, title: "KI-Analyse", href: "/phase/2", color: "emerald", icon: Eye, check: "NotebookLM-Notizbuch geteilt?" },
  { num: 3, title: "Probeprüfung", href: "/phase/3", color: "amber", icon: ClipboardList, check: "Probeprüfung generiert und bearbeitet?" },
  { num: 4, title: "Lernstrategien", href: "/phase/4", color: "purple", icon: BookOpen, check: "Strategie gewählt und Lernplan erstellt?" },
  { num: 5, title: "Reflexion", href: "/phase/5", color: "rose", icon: MessageSquare, check: "Lernjournal ausgefüllt und geteilt?" },
];

const KOMMENTAR_FELDER: { key: keyof LehrpersonKommentar; label: string; color: string }[] = [
  { key: "fortschritt", label: "Fortschritt & Engagement", color: "cyan" },
  { key: "kiNutzung", label: "KI-Nutzung", color: "emerald" },
  { key: "lernstrategien", label: "Lernstrategien", color: "purple" },
  { key: "reflexion", label: "Reflexionstiefe", color: "rose" },
  { key: "zusammenarbeit", label: "Zusammenarbeit", color: "amber" },
  { key: "personA", label: "Persönliches Feedback Person A", color: "teal" },
  { key: "personB", label: "Persönliches Feedback Person B", color: "teal" },
  { key: "allgemein", label: "Allgemeines Feedback", color: "slate" },
];

export default function LehrerView() {
  const { state, selectedFach, progressPercent, updateLehrpersonKommentar } = useApp();
  const kommentare = state.lehrpersonKommentar;

  const [kommentarInput, setKommentarInput] = useState<Partial<Record<keyof LehrpersonKommentar, string>>>({});
  const [showJournalA, setShowJournalA] = useState(false);
  const [showJournalB, setShowJournalB] = useState(false);
  const [showFeedbackTemplates, setShowFeedbackTemplates] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
    emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
    purple: "border-purple-500/30 bg-purple-500/8 text-purple-300",
    rose: "border-rose-500/30 bg-rose-500/8 text-rose-300",
    teal: "border-teal-500/30 bg-teal-500/8 text-teal-300",
  };
  const iconColorMap: Record<string, string> = {
    cyan: "text-cyan-400", emerald: "text-emerald-400",
    amber: "text-amber-400", purple: "text-purple-400",
    rose: "text-rose-400", teal: "text-teal-400",
  };

  const addKommentar = (key: keyof LehrpersonKommentar) => {
    const text = kommentarInput[key]?.trim();
    if (!text) return;
    updateLehrpersonKommentar(key, text);
    setKommentarInput((p) => ({ ...p, [key]: "" }));
    toast.success("Kommentar gespeichert!");
  };

  const deleteKommentar = (key: keyof LehrpersonKommentar) => {
    updateLehrpersonKommentar(key, "");
    toast.success("Kommentar gelöscht");
  };

  const exportFeedback = () => {
    const lines: string[] = [
      "LEHRPERSON-FEEDBACK – Prüfungsnavigator",
      "========================================",
      `Datum: ${new Date().toLocaleDateString("de-CH")}`,
      `Fach: ${selectedFach.emoji} ${selectedFach.label}${state.pruefungsthema ? ` – ${state.pruefungsthema}` : ""}`,
      `Fortschritt: ${progressPercent}% (${state.completedPhases.length}/5 Phasen)`,
      `Lernteam: ${state.personA} & ${state.personB}`,
      "",
    ];

    if (Object.keys(kommentare).length > 0) {
      lines.push("KOMMENTARE DER LEHRPERSON", "=========================");
      Object.entries(kommentare).forEach(([key, val]) => {
        lines.push(`[${key}]`);
        lines.push(val);
        lines.push("");
      });
    }

    lines.push("LERNJOURNAL – " + state.personA, "=========================");
    lines.push(`Heute gelernt: ${state.journal.gelernt || "(leer)"}`);
    lines.push(`Schwierigkeit: ${state.journal.schwierigkeit || "(leer)"}`);
    lines.push(`Nächster Schritt: ${state.journal.naechsterSchritt || "(leer)"}`);
    lines.push(`Was hat funktioniert: ${state.journal.wasHatFunktioniert || "(leer)"}`);
    lines.push(`Was ändere ich: ${state.journal.wasAendereIch || "(leer)"}`);
    lines.push(`Was behalte ich bei: ${state.journal.wasBehaltIchBei || "(leer)"}`);
    lines.push("");

    lines.push("LERNJOURNAL – " + state.personB, "=========================");
    lines.push(`Heute gelernt: ${state.journalB.gelernt || "(leer)"}`);
    lines.push(`Schwierigkeit: ${state.journalB.schwierigkeit || "(leer)"}`);
    lines.push(`Nächster Schritt: ${state.journalB.naechsterSchritt || "(leer)"}`);
    lines.push("");

    lines.push("LERNTRACKER", "===========");
    const lerntage = state.lerntracker.filter(Boolean).length;
    lines.push(`${lerntage} von 21 Lerntagen abgehakt`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lehrperson_feedback_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Feedback-Dokument exportiert!");
  };

  const journalFields = [
    { key: "gelernt", label: "Heute gelernt" },
    { key: "schwierigkeit", label: "Schwierigkeit" },
    { key: "naechsterSchritt", label: "Nächster Schritt" },
    { key: "wasHatFunktioniert", label: "Was hat funktioniert?" },
    { key: "wasAendereIch", label: "Was ändere ich?" },
    { key: "wasBehaltIchBei", label: "Was behalte ich bei?" },
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-500/20 border border-slate-500/30 flex items-center justify-center">
              <GraduationCap size={18} className="text-slate-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Lehrperson-Ansicht</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Begleitung & Feedback</h1>
            </div>
            <button
              onClick={exportFeedback}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:border-white/30 text-xs font-semibold transition-all"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <Download size={13} />
              Feedback exportieren
            </button>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Als Lehrperson kannst du den Lernprozess der Schüler*innen mitlesen, kommentieren und gezielt Feedback geben. Alle Tools sind kostenlos und erfordern keine zusätzliche Software.
          </p>

          {/* Aktueller Fortschritt */}
          <div className="mt-4 p-4 rounded-xl border border-white/8 bg-white/2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {selectedFach.emoji} {selectedFach.label}{state.pruefungsthema ? ` – ${state.pruefungsthema}` : ""}
                  </span>
                  <span className="text-cyan-400 text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg, #06b6d4, #10b981)" }}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span><Users size={11} className="inline mr-1" />{state.personA} & {state.personB}</span>
                  <span>·</span>
                  <span>{state.lerntracker.filter(Boolean).length}/21 Lerntage</span>
                  {state.pruefungsdatum && <><span>·</span><span>Prüfung: {new Date(state.pruefungsdatum).toLocaleDateString("de-CH")}</span></>}
                </div>
              </div>
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className={`w-8 h-8 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${state.completedPhases.includes(n) ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/15 text-slate-500"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                    {state.completedPhases.includes(n) ? "✓" : n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phasen-Checkliste */}
        <div className="mb-6">
          <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Phasen-Checkliste</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {phaseOverview.map((phase) => {
              const Icon = phase.icon;
              const done = state.completedPhases.includes(phase.num);
              return (
                <Link key={phase.num} href={phase.href}>
                  <div className={`border rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all relative ${done ? "border-emerald-500/30 bg-emerald-500/5" : colorMap[phase.color]}`}>
                    {done && <div className="absolute top-2 right-2"><CheckCircle size={13} className="text-emerald-400" /></div>}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-lg font-black ${done ? "text-emerald-400" : iconColorMap[phase.color]}`} style={{ fontFamily: "Outfit, sans-serif" }}>{phase.num}</span>
                      <Icon size={13} className={done ? "text-emerald-400" : iconColorMap[phase.color]} />
                    </div>
                    <p className="text-white text-xs font-semibold mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>{phase.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{phase.check}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-xs font-semibold ${done ? "text-emerald-400" : iconColorMap[phase.color]}`} style={{ fontFamily: "Outfit, sans-serif" }}>Ansehen</span>
                      <ArrowRight size={10} className={done ? "text-emerald-400" : iconColorMap[phase.color]} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── KOMMENTARFUNKTION ─── */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <MessageSquare size={16} className="text-cyan-400" />
            <div>
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Kommentare der Lehrperson</h2>
              <p className="text-slate-400 text-xs">Kommentare werden lokal gespeichert und können exportiert werden</p>
            </div>
            <span className="ml-auto text-xs text-slate-500">{Object.values(kommentare).filter(Boolean).length} Kommentar(e)</span>
          </div>
          <div className="p-5 space-y-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {KOMMENTAR_FELDER.filter(f => !["personA","personB"].includes(f.key)).map((item) => {
              const val = kommentare[item.key];
              const inputVal = kommentarInput[item.key] || "";
              return (
              <div key={item.key} className="border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                  <span className={`text-xs font-semibold ${iconColorMap[item.color] || "text-slate-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>{item.label}</span>
                  {val && (
                    <button onClick={() => deleteKommentar(item.key)} className="ml-auto text-slate-600 hover:text-rose-400 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
                <div className="p-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                  {val ? (
                    <div>
                      <p className="text-slate-300 text-xs leading-relaxed mb-2 whitespace-pre-wrap">{val}</p>
                      <button
                        onClick={() => {
                          setKommentarInput((p) => ({ ...p, [item.key]: val }));
                          deleteKommentar(item.key);
                        }}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        style={{ fontFamily: "Outfit, sans-serif" }}
                      >
                        Bearbeiten
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <textarea
                        value={inputVal}
                        onChange={(e) => setKommentarInput((p) => ({ ...p, [item.key]: e.target.value }))}
                        placeholder={`Kommentar zu ${item.label} eingeben…`}
                        rows={2}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 resize-none transition-colors"
                      />
                      <button
                        onClick={() => addKommentar(item.key)}
                        disabled={!inputVal.trim()}
                        className="px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* ─── LERNJOURNAL ANZEIGE ─── */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Person A */}
          <div className="border border-white/8 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-3 px-5 py-4 border-b border-white/8 hover:bg-white/2 transition-colors"
              style={{ background: "oklch(0.208 0.028 264.364)" }}
              onClick={() => setShowJournalA(!showJournalA)}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>A</div>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Lernjournal – {state.personA}</span>
              <span className="ml-auto text-slate-500">{showJournalA ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
            </button>
            {showJournalA && (
              <div className="p-4 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                {journalFields.map((f) => {
                  const val = state.journal[f.key as keyof typeof state.journal] as string;
                  return (
                    <div key={f.key}>
                      <p className="text-slate-500 text-xs mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{f.label}</p>
                      <p className={`text-xs leading-relaxed ${val ? "text-slate-300" : "text-slate-600 italic"}`}>
                        {val || "(noch nicht ausgefüllt)"}
                      </p>
                    </div>
                  );
                })}
                {/* Kommentar zu Person A */}
                <div className="pt-2 border-t border-white/8">
                  <p className="text-cyan-400 text-xs font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Kommentar zu {state.personA}:</p>
                  {kommentare["personA"] ? (
                    <div className="flex items-start gap-2">
                      <p className="text-slate-300 text-xs leading-relaxed flex-1">{kommentare["personA"]}</p>
                      <button onClick={() => deleteKommentar("personA")} className="text-slate-600 hover:text-rose-400 transition-colors flex-shrink-0"><Trash2 size={11} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={kommentarInput["personA"] || ""}
                        onChange={(e) => setKommentarInput((p) => ({ ...p, personA: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addKommentar("personA")}
                        placeholder="Kommentar eingeben…"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors"
                      />
                      <button onClick={() => addKommentar("personA")} className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 transition-all">
                        <Send size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Person B */}
          <div className="border border-white/8 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-3 px-5 py-4 border-b border-white/8 hover:bg-white/2 transition-colors"
              style={{ background: "oklch(0.208 0.028 264.364)" }}
              onClick={() => setShowJournalB(!showJournalB)}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>B</div>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Lernjournal – {state.personB}</span>
              <span className="ml-auto text-slate-500">{showJournalB ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
            </button>
            {showJournalB && (
              <div className="p-4 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                {journalFields.map((f) => {
                  const val = state.journalB[f.key as keyof typeof state.journalB] as string;
                  return (
                    <div key={f.key}>
                      <p className="text-slate-500 text-xs mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{f.label}</p>
                      <p className={`text-xs leading-relaxed ${val ? "text-slate-300" : "text-slate-600 italic"}`}>
                        {val || "(noch nicht ausgefüllt)"}
                      </p>
                    </div>
                  );
                })}
                {/* Kommentar zu Person B */}
                <div className="pt-2 border-t border-white/8">
                  <p className="text-emerald-400 text-xs font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Kommentar zu {state.personB}:</p>
                  {kommentare["personB"] ? (
                    <div className="flex items-start gap-2">
                      <p className="text-slate-300 text-xs leading-relaxed flex-1">{kommentare["personB"]}</p>
                      <button onClick={() => deleteKommentar("personB")} className="text-slate-600 hover:text-rose-400 transition-colors flex-shrink-0"><Trash2 size={11} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={kommentarInput["personB"] || ""}
                        onChange={(e) => setKommentarInput((p) => ({ ...p, personB: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addKommentar("personB")}
                        placeholder="Kommentar eingeben…"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
                      />
                      <button onClick={() => addKommentar("personB")} className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all">
                        <Send size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── FEEDBACK-VORLAGEN (kollabierbar) ─── */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-6">
          <button
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/2 transition-colors"
            style={{ background: "oklch(0.208 0.028 264.364)" }}
            onClick={() => setShowFeedbackTemplates(!showFeedbackTemplates)}
          >
            <FileText size={16} className="text-amber-400" />
            <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Feedback-Vorlagen (kopierfertig)</h2>
            <span className="ml-auto text-slate-500">{showFeedbackTemplates ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
          </button>
          {showFeedbackTemplates && (
            <div className="p-5 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
              {feedbackTemplates.map((tmpl, idx) => (
                <div key={idx} className="border border-white/8 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                    <p className="text-white font-semibold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>{tmpl.title}</p>
                    <button
                      onClick={() => copyText(tmpl.text)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-white/15 text-slate-400 hover:text-white text-xs transition-colors"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      <Copy size={10} /> Kopieren
                    </button>
                  </div>
                  <div className="p-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                    <pre className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap font-sans">{tmpl.text}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── TOOLS (kollabierbar) ─── */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-6">
          <button
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/2 transition-colors"
            style={{ background: "oklch(0.208 0.028 264.364)" }}
            onClick={() => setShowTools(!showTools)}
          >
            <Eye size={16} className="text-teal-400" />
            <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Wie du Ergebnisse mitlesen kannst</h2>
            <span className="ml-auto text-slate-500">{showTools ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
          </button>
          {showTools && (
            <div className="p-5 space-y-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
              {toolsForTeacher.map((tool) => (
                <div key={tool.name} className="border border-white/8 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${colorMap[tool.color]}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</p>
                      <p className="text-slate-400 text-xs">{tool.desc}</p>
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-semibold ${colorMap[tool.color]} hover:opacity-80`}
                      style={{ fontFamily: "Outfit, sans-serif" }}>
                      <ExternalLink size={9} /> Öffnen
                    </a>
                  </div>
                  <div className="p-4 space-y-2" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                    {tool.howTo.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle size={12} className={iconColorMap[tool.color] + " flex-shrink-0 mt-0.5"} />
                        <p className="text-slate-400 text-xs">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3">
                <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Datenschutz-Hinweis</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    CryptPad ist vollständig Ende-zu-Ende-verschlüsselt und DSGVO-konform. Fobizz ist speziell für den Schulbereich entwickelt. NotebookLM speichert Daten auf Google-Servern – informiere Schüler*innen entsprechend.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GitHub Deployment */}
        <div className="p-5 rounded-xl border border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <FileText size={14} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>GitHub Deployment</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Diese Anwendung kann als statische Website auf GitHub Pages deployed werden. Alle Inhalte sind im Quellcode enthalten – keine Serverinfrastruktur nötig.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "GitHub Pages", url: "https://pages.github.com" },
                  { label: "Netlify (kostenlos)", url: "https://netlify.com" },
                  { label: "Vercel (kostenlos)", url: "https://vercel.com" },
                ].map((d) => (
                  <a key={d.label} href={d.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    style={{ fontFamily: "Outfit, sans-serif" }}>
                    <ExternalLink size={10} /> {d.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
