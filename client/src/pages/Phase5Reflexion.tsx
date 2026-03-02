/* ============================================================
   PHASE 5 – REFLEXION & FEEDBACK
   Design: Functional Futurism
   Basiert auf: Selbstlernheft_Lernstrategien.docx
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Sparkles, ArrowLeft, Copy, Download, ExternalLink, CheckCircle, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Text kopiert!"));
};

const reflectionPrompts = [
  {
    title: "Lernprozess analysieren",
    prompt: `Ich habe mich auf eine Prüfung vorbereitet und möchte meinen Lernprozess reflektieren. Hier sind meine Notizen:

Was ich gelernt habe: [EINTRAGEN]
Welche Strategien ich genutzt habe: [EINTRAGEN]
Was gut funktioniert hat: [EINTRAGEN]
Was schwierig war: [EINTRAGEN]

Bitte analysiere meinen Lernprozess als Lerncoach:
1. Welche Muster erkennst du in meinem Lernverhalten?
2. Was hat besonders gut funktioniert und warum?
3. Welche 2–3 konkreten Verbesserungen empfiehlst du für die nächste Prüfungsvorbereitung?
4. Welche Lernstrategien passen zu meinem Lernstil?`,
  },
  {
    title: "Antworten auf Feedback überprüfen",
    prompt: `Ich habe die folgende Prüfungsaufgabe bearbeitet:

Aufgabe: [AUFGABE EINFÜGEN]
Meine Antwort: [DEINE ANTWORT EINFÜGEN]
Musterlösung (falls vorhanden): [MUSTERLÖSUNG EINFÜGEN]

Bitte gib mir detailliertes Feedback:
1. Was ist inhaltlich korrekt?
2. Was fehlt oder ist unvollständig?
3. Wie würde eine Lehrperson diese Antwort bewerten (Note/Punkte)?
4. Wie kann ich meine Antwort verbessern?`,
  },
  {
    title: "Peer-Feedback strukturieren",
    prompt: `Ich möchte meiner Lernpartnerin / meinem Lernpartner strukturiertes Feedback geben. Sie/Er hat folgendes erklärt oder geschrieben:

[TEXT/ERKLÄRUNG EINFÜGEN]

Hilf mir, ein konstruktives Feedback nach der Sandwich-Methode zu formulieren:
1. Positives Feedback (Was war gut?)
2. Konstruktive Kritik (Was kann verbessert werden?)
3. Abschliessendes Positives (Ermutigung)

Das Feedback soll respektvoll, konkret und hilfreich sein.`,
  },
  {
    title: "Abschlussreflexion für Lehrperson",
    prompt: `Ich habe meine Prüfungsvorbereitung abgeschlossen und möchte eine Abschlussreflexion für meine Lehrperson schreiben.

Mein Prüfungsthema: [THEMA]
Genutzte Tools: [TOOLS]
Zeitaufwand: [STUNDEN]
Lernstrategien: [STRATEGIEN]

Hilf mir, eine strukturierte Abschlussreflexion (ca. 300 Wörter) zu schreiben, die folgende Punkte abdeckt:
- Wie habe ich gelernt? (Methoden und Tools)
- Was hat gut funktioniert?
- Was würde ich beim nächsten Mal anders machen?
- Was habe ich über mein eigenes Lernverhalten gelernt?`,
  },
  {
    title: "Lernstrategie-Selbsteinschätzung",
    prompt: `Ich möchte meine Lernstrategien reflektieren und einschätzen, wie gut ich sie angewendet habe.

Bitte stelle mir 8 Fragen (Skala 1–5) zu folgenden Bereichen:
1. Planung (Habe ich meinen Lernprozess gut geplant?)
2. Zeitmanagement (Habe ich meine Zeit effizient genutzt?)
3. Tiefenverarbeitung (Habe ich den Stoff wirklich verstanden?)
4. Selbsttests (Habe ich mich regelmässig getestet?)
5. Zusammenarbeit (Habe ich die Zweiergruppe gut genutzt?)
6. KI-Nutzung (Habe ich KI-Tools sinnvoll eingesetzt?)
7. Motivation (Habe ich mich gut motivieren können?)
8. Reflexion (Habe ich meinen Lernprozess bewusst reflektiert?)

Nach meinen Antworten: Erstelle eine kurze Auswertung mit Stärken und Entwicklungsfeldern.`,
  },
  {
    title: "Nächste Prüfung vorbereiten",
    prompt: `Ich habe die Prüfungsvorbereitung für [THEMA] abgeschlossen. Basierend auf meinen Erfahrungen:

Was gut funktioniert hat: [EINTRAGEN]
Was schwierig war: [EINTRAGEN]
Wie viel Zeit ich hatte: [EINTRAGEN]

Hilf mir, für meine nächste Prüfung:
1. Einen verbesserten Lernplan zu erstellen
2. Die 3 wichtigsten Lernstrategien für mich zu identifizieren
3. Konkrete Massnahmen gegen meine grössten Schwächen zu formulieren
4. Einen realistischen Zeitplan für die Vorbereitung aufzustellen`,
  },
];

const fiveFingerFeedback = [
  { finger: "👍", label: "Daumen", question: "Das lief richtig gut in unserer Zusammenarbeit:", color: "emerald" },
  { finger: "☝️", label: "Zeigefinger", question: "Darauf sollten wir beim nächsten Mal besonders achten:", color: "amber" },
  { finger: "🖕", label: "Mittelfinger", question: "Das hat mich gestört oder war schwierig:", color: "rose" },
  { finger: "💍", label: "Ringfinger", question: "Das war besonders wertvoll an deiner Mitarbeit:", color: "cyan" },
  { finger: "🤙", label: "Kleiner Finger", question: "Dieser Aspekt kam mir zu kurz:", color: "purple" },
];

export default function Phase5Reflexion() {
  const { state, selectedFach, updateJournal, setFingerFeedback: setGlobalFingerFeedback, completePhase } = useApp();
  const journal = state.journal;
  const fingerFeedback = state.fingerFeedback;
  const isDone = state.completedPhases.includes(5);
  const [activePrompt, setActivePrompt] = useState<number | null>(null);

  const exportJournal = () => {
    const text = `LERNJOURNAL – Prüfungsnavigator
================================
Datum: ${new Date().toLocaleDateString("de-CH")}

HEUTE GELERNT:
${journal.gelernt}

SCHWIERIGKEIT:
${journal.schwierigkeit}

NÄCHSTER SCHRITT:
${journal.naechsterSchritt}

ABSCHLUSSREFLEXION
==================
Was hat funktioniert?
${journal.wasHatFunktioniert}

Was ändere ich?
${journal.wasAendereIch}

Was behalte ich bei?
${journal.wasBehaltIchBei}

PEER-FEEDBACK (Fünf-Finger-Methode)
====================================
${fiveFingerFeedback.map((f) => `${f.label}: ${fingerFeedback[f.label] || "(nicht ausgefüllt)"}`).join("\n")}
`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lernjournal_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Lernjournal exportiert!");
  };

  const colorMap: Record<string, string> = {
    emerald: "border-emerald-500/30 text-emerald-300",
    amber: "border-amber-500/30 text-amber-300",
    rose: "border-rose-500/30 text-rose-300",
    cyan: "border-cyan-500/30 text-cyan-300",
    purple: "border-purple-500/30 text-purple-300",
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="phase-badge bg-rose-500/20 border border-rose-500/30 text-rose-300">5</div>
            <div>
              <p className="text-rose-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 5 von 5 · 30–40 Min.</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Reflexion & Feedback</h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Reflektiere deinen Lernprozess, hol dir KI-Feedback zu deinen Antworten und dokumentiere deinen Fortschritt. Diese Phase macht dich langfristig zu einer besseren Lernerin / einem besseren Lerner.
          </p>
        </div>

        {/* Zeitplan */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Lernjournal ausfüllen", dauer: "10 Min.", emoji: "📓" },
            { label: "KI-Feedback einholen", dauer: "10 Min.", emoji: "🤖" },
            { label: "Peer-Feedback geben", dauer: "10 Min.", emoji: "👥" },
            { label: "Abschlussreflexion", dauer: "10 Min.", emoji: "✨" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/8 bg-white/2 p-3 text-center">
              <div className="text-xl mb-1">{item.emoji}</div>
              <p className="text-white text-xs font-semibold leading-tight mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{item.label}</p>
              <p className="text-slate-500 text-xs">{item.dauer}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Lernjournal */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Digitales Lernjournal</h2>
              <button
                onClick={exportJournal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                <Download size={11} />
                Exportieren
              </button>
            </div>

            <div className="border border-white/8 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                <p className="text-white font-semibold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>Tages-Eintrag</p>
                <p className="text-slate-400 text-xs">{new Date().toLocaleDateString("de-CH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div className="p-4 space-y-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                {[
                  { key: "gelernt", label: "Heute gelernt:", placeholder: "Was habe ich heute gelernt? (Inhalt, Themen, Erkenntnisse)" },
                  { key: "schwierigkeit", label: "Schwierigkeit:", placeholder: "Was war schwierig? Wo hatte ich Mühe?" },
                  { key: "naechsterSchritt", label: "Nächster Schritt:", placeholder: "Was nehme ich mir für das nächste Mal vor?" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-slate-400 text-xs mb-1.5 block" style={{ fontFamily: "Outfit, sans-serif" }}>{field.label}</label>
                    <textarea
                  value={journal[field.key as keyof typeof journal]}
                      onChange={(e) => updateJournal(field.key as any, e.target.value)}
                      placeholder={field.placeholder}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500/40 resize-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Abschlussreflexion */}
            <div className="border border-rose-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-rose-500/15" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                <p className="text-white font-semibold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>Abschlussreflexion</p>
                <p className="text-slate-400 text-xs">Am Ende der gesamten Lerneinheit</p>
              </div>
              <div className="p-4 space-y-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                {[
                  { key: "wasHatFunktioniert", label: "Was hat funktioniert?", placeholder: "Welche Strategien, Tools und Methoden haben gut geholfen?" },
                  { key: "wasAendereIch", label: "Was ändere ich?", placeholder: "Was würde ich beim nächsten Mal anders machen?" },
                  { key: "wasBehaltIchBei", label: "Was behalte ich bei?", placeholder: "Was nehme ich als feste Gewohnheit mit?" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-slate-400 text-xs mb-1.5 block" style={{ fontFamily: "Outfit, sans-serif" }}>{field.label}</label>
                    <textarea
                      value={journal[field.key as keyof typeof journal]}
                      onChange={(e) => updateJournal(field.key as any, e.target.value)}
                      placeholder={field.placeholder}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500/40 resize-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* KI-Feedback Prompts */}
            <div>
              <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>KI-Feedback Prompts</h2>
              <div className="space-y-2">
                {reflectionPrompts.map((rp, idx) => (
                  <div key={idx} className="border border-white/8 rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-white/3 transition-colors"
                      onClick={() => setActivePrompt(activePrompt === idx ? null : idx)}
                    >
                      <div className="w-5 h-5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {idx + 1}
                      </div>
                      <span className="text-white text-xs font-semibold flex-1" style={{ fontFamily: "Outfit, sans-serif" }}>{rp.title}</span>
                      <span className="text-slate-500 text-xs">{activePrompt === idx ? "▲" : "▼"}</span>
                    </button>
                    {activePrompt === idx && (
                      <div className="px-4 pb-4">
                        <div className="prompt-box mb-3 whitespace-pre-line text-xs">{rp.prompt}</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyText(rp.prompt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            <Copy size={11} />
                            Kopieren
                          </button>
                          <a
                            href="https://chat.openai.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 text-xs font-semibold hover:text-white transition-colors"
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            <ExternalLink size={11} />
                            ChatGPT
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fünf-Finger-Feedback */}
            <div className="border border-white/8 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Peer-Feedback: Fünf-Finger-Methode</h3>
                <p className="text-slate-400 text-xs">Feedback für deine Lernpartnerin / deinen Lernpartner</p>
              </div>
              <div className="p-4 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                {fiveFingerFeedback.map((f) => (
                  <div key={f.label}>
                    <label className={`text-xs font-semibold mb-1.5 flex items-center gap-1.5 ${colorMap[f.color].split(" ")[1]}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      <span>{f.finger}</span>
                      <span>{f.label}:</span>
                      <span className="text-slate-500 font-normal">{f.question}</span>
                    </label>
                    <textarea
                      value={fingerFeedback[f.label] || ""}
                      onChange={(e) => setGlobalFingerFeedback(f.label, e.target.value)}
                      placeholder="Dein Feedback..."
                      rows={1}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none resize-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Lehrperson-Tipp */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex gap-3">
              <Lightbulb size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-cyan-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Für die Lehrperson</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Exportiere das Lernjournal als Textdatei und lade es in CryptPad oder Google Docs hoch. Teile den Link mit deiner Lehrperson – sie kann direkt kommentieren und Feedback geben. Alternativ: Teile dein NotebookLM-Notizbuch, das alle KI-Gespräche enthält.
                </p>
                <a
                  href="https://cryptpad.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  <ExternalLink size={10} />
                  CryptPad öffnen
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/8 text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={22} className="text-emerald-400" />
          </div>
          <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Prüfungsvorbereitung abgeschlossen!</h3>
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            Du hast alle 5 Phasen des Prüfungsnavigators durchlaufen. Exportiere dein Lernjournal und teile es mit deiner Lehrperson. Viel Erfolg bei der Prüfung!
          </p>
          <button
            onClick={exportJournal}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm transition-all"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <Download size={14} />
            Lernjournal exportieren
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <Link href="/phase/4">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 text-sm font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
              <ArrowLeft size={14} />Phase 4
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { completePhase(5); toast.success("Phase 5 abgeschlossen – Prüfungsvorbereitung vollständig! 🎉"); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/15 text-slate-400 hover:text-white hover:border-white/30"}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <CheckCircle size={13} />
              {isDone ? "Abgeschlossen ✓" : "Als erledigt markieren"}
            </button>
            <Link href="/">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm transition-all duration-200" style={{ fontFamily: "Outfit, sans-serif" }}>
                <Sparkles size={14} />Zum Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
