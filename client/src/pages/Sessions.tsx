/* ============================================================
   SESSIONS – Prüfungsnavigator
   Design: Functional Futurism
   Archiv aller Lernsessions + Neue Session starten
   ============================================================ */
import Layout from "@/components/Layout";
import { useApp, FAECHER, type ArchivedSession } from "@/contexts/AppContext";
import { Archive, Plus, Trash2, CheckCircle, Calendar, BookOpen, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

function exportSession(session: ArchivedSession) {
  const fach = FAECHER.find((f) => f.id === session.selectedFachId);
  const fachLabel = fach ? `${fach.emoji} ${fach.label}` : session.selectedFachId;
  const lerntage = session.lerntracker.filter(Boolean).length;

  const text = `ARCHIVIERTE LERNSESSION – Prüfungsnavigator
============================================
Archiviert am: ${new Date(session.archivedAt).toLocaleDateString("de-CH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Prüfungsfach: ${fachLabel}
Prüfungsthema: ${session.pruefungsthema || "(nicht angegeben)"}
Prüfungsdatum: ${session.pruefungsdatum || "(nicht angegeben)"}
Abgeschlossene Phasen: ${session.completedPhases.sort().join(", ") || "keine"}
Lerntage: ${lerntage} von 21

LERNJOURNAL
===========
Heute gelernt: ${session.journal.gelernt || "(leer)"}
Schwierigkeit: ${session.journal.schwierigkeit || "(leer)"}
Nächster Schritt: ${session.journal.naechsterSchritt || "(leer)"}

ABSCHLUSSREFLEXION
==================
Was hat funktioniert? ${session.journal.wasHatFunktioniert || "(leer)"}
Was ändere ich? ${session.journal.wasAendereIch || "(leer)"}
Was behalte ich bei? ${session.journal.wasBehaltIchBei || "(leer)"}

PEER-FEEDBACK (Fünf-Finger-Methode)
=====================================
${Object.entries(session.fingerFeedback).map(([k, v]) => `${k}: ${v}`).join("\n") || "(kein Feedback eingetragen)"}
`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `session_${session.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Session exportiert!");
}

function SessionCard({ session, onDelete }: { session: ArchivedSession; onDelete: () => void }) {
  const fach = FAECHER.find((f) => f.id === session.selectedFachId);
  const lerntage = session.lerntracker.filter(Boolean).length;
  const phasesPercent = Math.round((session.completedPhases.length / 5) * 100);
  const archiveDate = new Date(session.archivedAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });

  const colorForPercent = phasesPercent === 100 ? "emerald" : phasesPercent >= 60 ? "amber" : "cyan";
  const colorMap: Record<string, string> = {
    emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
    cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  };

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden" style={{ background: "oklch(0.208 0.028 264.364)" }}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-base flex-shrink-0">
            {fach?.emoji ?? "📚"}
          </div>
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
              {fach?.label ?? session.selectedFachId}
            </p>
            <p className="text-slate-400 text-xs">
              {session.pruefungsthema || "Kein Thema angegeben"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => exportSession(session)}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            title="Session exportieren"
          >
            <Download size={13} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Session löschen"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3">
        {/* Fortschritt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 text-xs">Fortschritt</span>
            <span className={`text-xs font-bold ${colorMap[colorForPercent].split(" ")[2]}`} style={{ fontFamily: "Outfit, sans-serif" }}>
              {phasesPercent}% · {session.completedPhases.length}/5 Phasen
            </span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${phasesPercent}%`,
                background: phasesPercent === 100 ? "#10b981" : phasesPercent >= 60 ? "#f59e0b" : "#06b6d4",
              }}
            />
          </div>
        </div>

        {/* Phasen-Badges */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`w-6 h-6 rounded border text-xs font-bold flex items-center justify-center ${
                session.completedPhases.includes(n)
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-white/10 text-slate-600"
              }`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {n}
            </div>
          ))}
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
            <span>🔥 {lerntage} Lerntage</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-white/6">
          <span className="flex items-center gap-1">
            <Archive size={10} />
            Archiviert: {archiveDate}
          </span>
          {session.pruefungsdatum && (
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              Prüfung: {new Date(session.pruefungsdatum).toLocaleDateString("de-CH")}
            </span>
          )}
        </div>

        {/* Journal-Vorschau */}
        {session.journal.wasHatFunktioniert && (
          <div className="p-2.5 rounded-lg bg-white/3 border border-white/6">
            <p className="text-slate-500 text-xs mb-0.5">Was hat funktioniert:</p>
            <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">{session.journal.wasHatFunktioniert}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sessions() {
  const { state, archiveAndNewSession, deleteArchivedSession } = useApp();

  const handleNewSession = () => {
    const hasContent = state.completedPhases.length > 0 ||
      state.journal.gelernt || state.journal.wasHatFunktioniert ||
      state.lerntracker.some(Boolean);

    if (!hasContent) {
      toast.info("Keine Daten zum Archivieren. Starte einfach eine neue Session im Dashboard.");
      return;
    }

    if (window.confirm("Aktuelle Session archivieren und neu starten? Dein Fortschritt, Lernjournal und Lerntracker werden gespeichert.")) {
      archiveAndNewSession();
      toast.success("Session archiviert! Neue Session gestartet.");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Diese archivierte Session wirklich löschen?")) {
      deleteArchivedSession(id);
      toast.success("Session gelöscht.");
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <Archive size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-violet-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Session-Archiv</p>
                  <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Lernsessions</h1>
                </div>
              </div>
              <p className="text-slate-400 text-sm max-w-2xl">
                Archiviere abgeschlossene Prüfungsvorbereitungen und starte eine neue Session für ein anderes Fach oder Thema. Alle archivierten Sessions bleiben gespeichert und können exportiert werden.
              </p>
            </div>
            <button
              onClick={handleNewSession}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm transition-all"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <Plus size={16} />
              Neue Session
            </button>
          </div>
        </div>

        {/* Aktuelle Session */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Aktuelle Session
          </h2>
          <div className="border border-cyan-500/20 rounded-xl p-5" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-300 text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Aktiv</span>
              </div>
              <button
                onClick={handleNewSession}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold hover:bg-violet-500/20 transition-colors"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                <RotateCcw size={11} />
                Archivieren & neu starten
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-slate-500 text-xs mb-1">Fach</p>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {FAECHER.find((f) => f.id === state.selectedFachId)?.emoji} {FAECHER.find((f) => f.id === state.selectedFachId)?.label}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Thema</p>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {state.pruefungsthema || "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">Fortschritt</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`w-5 h-5 rounded border text-xs font-bold flex items-center justify-center ${
                          state.completedPhases.includes(n)
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-white/10 text-slate-600"
                        }`}
                        style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.6rem" }}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                  <span className="text-cyan-400 text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {Math.round((state.completedPhases.length / 5) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Archivierte Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
              Archivierte Sessions
              {state.archivedSessions.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                  {state.archivedSessions.length}
                </span>
              )}
            </h2>
          </div>

          {state.archivedSessions.length === 0 ? (
            <div className="border border-white/8 rounded-xl p-12 text-center" style={{ background: "oklch(0.208 0.028 264.364)" }}>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Archive size={22} className="text-slate-500" />
              </div>
              <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Noch keine archivierten Sessions</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Schliesse deine erste Prüfungsvorbereitung ab und archiviere sie, um eine neue Session für ein anderes Fach zu starten.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {state.archivedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onDelete={() => handleDelete(session.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
