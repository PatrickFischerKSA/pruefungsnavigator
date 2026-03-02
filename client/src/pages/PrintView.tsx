/* ============================================================
   PRINT VIEW – Prüfungsnavigator
   Design: Clean Print Layout (heller Hintergrund für Druck)
   Zeigt alle Lerndaten der aktuellen Session druckoptimiert
   ============================================================ */
import { useApp, FAECHER } from "@/contexts/AppContext";
import { Printer, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const PHASE_LABELS = ["Unterlagen hochladen", "KI-gestützte Analyse", "Probeprüfung generieren", "Lernstrategien", "Reflexion & Feedback"];

export default function PrintView() {
  const { state, selectedFach } = useApp();
  const lerntage = state.lerntracker.filter(Boolean).length;
  const phasesPercent = Math.round((state.completedPhases.length / 5) * 100);
  const today = new Date().toLocaleDateString("de-CH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const fingerLabels = ["Daumen – Was lief gut?", "Zeigefinger – Was war wichtig?", "Mittelfinger – Was war schwierig?", "Ringfinger – Was nehme ich mit?", "Kleiner Finger – Was fehlt noch?"];

  const kommentarFelder: { key: keyof typeof state.lehrpersonKommentar; label: string }[] = [
    { key: "fortschritt", label: "Fortschritt & Engagement" },
    { key: "kiNutzung", label: "KI-Nutzung" },
    { key: "lernstrategien", label: "Lernstrategien" },
    { key: "reflexion", label: "Reflexionstiefe" },
    { key: "zusammenarbeit", label: "Zusammenarbeit" },
    { key: "allgemein", label: "Allgemeines Feedback" },
  ];

  const hasKommentare = Object.values(state.lehrpersonKommentar).some(Boolean);

  return (
    <>
      {/* Drucksteuerung – nur auf Bildschirm sichtbar */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/8" style={{ background: "oklch(0.175 0.028 264.695)" }}>
        <Link href="/">
          <button className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
            <ArrowLeft size={16} />
            Zurück zum Dashboard
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>Druckansicht – zeigt aktuelle Session</span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm transition-all"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <Printer size={15} />
            Drucken / Als PDF speichern
          </button>
        </div>
      </div>

      {/* Druckinhalt */}
      <div className="print-page pt-16 print:pt-0" style={{ fontFamily: "Georgia, serif" }}>
        <div className="max-w-[210mm] mx-auto px-8 py-8 print:px-0 print:py-0 bg-white text-gray-900 min-h-screen">

          {/* Titelblock */}
          <div className="border-b-2 border-gray-800 pb-5 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Prüfungsnavigator
                </h1>
                <p className="text-gray-500 text-sm">Future Skills Lab · FMS Pädagogisches Profil</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Erstellt am</p>
                <p className="text-gray-700 text-sm font-semibold">{today}</p>
              </div>
            </div>
          </div>

          {/* Session-Übersicht */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Session-Übersicht
            </h2>
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-500 font-medium w-40">Prüfungsfach</td>
                  <td className="py-2 text-gray-800 font-semibold">{selectedFach.emoji} {selectedFach.label}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-500 font-medium">Prüfungsthema</td>
                  <td className="py-2 text-gray-800">{state.pruefungsthema || "—"}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-500 font-medium">Prüfungsdatum</td>
                  <td className="py-2 text-gray-800">
                    {state.pruefungsdatum
                      ? new Date(state.pruefungsdatum).toLocaleDateString("de-CH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                      : "—"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-500 font-medium">Gesamtfortschritt</td>
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={`inline-flex w-6 h-6 rounded border text-xs font-bold items-center justify-center ${
                              state.completedPhases.includes(n)
                                ? "bg-gray-800 border-gray-800 text-white"
                                : "border-gray-300 text-gray-400"
                            }`}
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-700 font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {phasesPercent}% ({state.completedPhases.length}/5 Phasen)
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-500 font-medium">Lerntracker</td>
                  <td className="py-2 text-gray-800">{lerntage} von 21 Lerntagen absolviert</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Abgeschlossene Phasen */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Phasenübersicht
            </h2>
            <div className="space-y-2">
              {PHASE_LABELS.map((label, i) => {
                const n = i + 1;
                const done = state.completedPhases.includes(n);
                return (
                  <div key={n} className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <span className={`w-6 h-6 rounded border text-xs font-bold flex items-center justify-center flex-shrink-0 ${done ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      {n}
                    </span>
                    <span className={`text-sm ${done ? "text-gray-800 font-medium" : "text-gray-400"}`}>{label}</span>
                    <span className="ml-auto text-xs font-semibold" style={{ color: done ? "#166534" : "#9ca3af" }}>
                      {done ? "✓ Abgeschlossen" : "Ausstehend"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lerntracker */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              21-Tage-Lerntracker
            </h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {state.lerntracker.map((done, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${done ? "bg-gray-800 border-gray-800 text-white" : "border-gray-300 text-gray-400"}`}
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs">{lerntage} von 21 Tagen absolviert ({Math.round((lerntage / 21) * 100)}%)</p>
          </section>

          {/* Lernjournal */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Lernjournal
            </h2>
            <div className="space-y-4">
              {[
                { label: "Heute gelernt", value: state.journal.gelernt },
                { label: "Schwierigkeit", value: state.journal.schwierigkeit },
                { label: "Nächster Schritt", value: state.journal.naechsterSchritt },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                  <div className="min-h-[3rem] p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                    {value || <span className="text-gray-300 italic">Keine Eingabe</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Abschlussreflexion */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Abschlussreflexion
            </h2>
            <div className="space-y-4">
              {[
                { label: "Was hat funktioniert?", value: state.journal.wasHatFunktioniert },
                { label: "Was ändere ich beim nächsten Mal?", value: state.journal.wasAendereIch },
                { label: "Was behalte ich bei?", value: state.journal.wasBehaltIchBei },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                  <div className="min-h-[3rem] p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                    {value || <span className="text-gray-300 italic">Keine Eingabe</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Peer-Feedback */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Peer-Feedback (Fünf-Finger-Methode)
            </h2>
            <div className="space-y-3">
              {fingerLabels.map((label) => (
                <div key={label}>
                  <p className="text-gray-500 text-xs font-semibold mb-1">{label}</p>
                  <div className="min-h-[2.5rem] p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                    {state.fingerFeedback[label] || <span className="text-gray-300 italic">Keine Eingabe</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lehrperson-Kommentare */}
          <section className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Feedback der Lehrperson
            </h2>
            {hasKommentare ? (
              <div className="space-y-4">
                {/* Persönliche Kommentare zu Person A & B */}
                {(state.lehrpersonKommentar.personA || state.lehrpersonKommentar.personB) && (
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    {state.lehrpersonKommentar.personA && (
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Feedback an {state.personA}</p>
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap">{state.lehrpersonKommentar.personA}</div>
                      </div>
                    )}
                    {state.lehrpersonKommentar.personB && (
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Feedback an {state.personB}</p>
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap">{state.lehrpersonKommentar.personB}</div>
                      </div>
                    )}
                  </div>
                )}
                {/* Kategorie-Kommentare */}
                <div className="space-y-3">
                  {kommentarFelder.map(({ key, label }) => {
                    const val = state.lehrpersonKommentar[key];
                    if (!val) return null;
                    return (
                      <div key={key}>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap">{val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 min-h-[6rem] bg-gray-50">
                <p className="text-gray-300 text-sm italic">Noch kein Feedback eingetragen (via Lehrperson-Ansicht)</p>
              </div>
            )}
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-gray-400 text-xs">
            <span>Prüfungsnavigator · Future Skills Lab · FMS Pädagogisches Profil</span>
            <span>Alle Tools kostenlos · notebooklm.google.com · chatgpt.com · fobizz.com</span>
          </div>
        </div>
      </div>

      {/* Print-spezifisches CSS */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print-page { padding-top: 0 !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>
    </>
  );
}
