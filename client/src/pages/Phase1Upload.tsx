/* ============================================================
   PHASE 1 – UNTERLAGEN HOCHLADEN (20–30 Min.)
   Design: Functional Futurism
   Inhalt: Upload, NotebookLM-Anleitung, Lernziele, Aufgaben, Zeitplan
   ============================================================ */
import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import {
  Upload, FileText, X, CheckCircle, ArrowRight, BookOpen,
  ClipboardList, ExternalLink, Lightbulb, Clock, Users,
  ChevronDown, ChevronUp, Copy, Target
} from "lucide-react";
import LernzielCheckliste from "@/components/LernzielCheckliste";
import { Link } from "wouter";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: "unterlagen" | "modell";
}

const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Text kopiert!"));
};

const AUFGABEN = [
  {
    id: "a1-1",
    title: "Materialübersicht erstellen",
    desc: "Listet alle Unterlagen auf und bewertet ihre Relevanz für die Prüfung (1 = wenig wichtig, 5 = sehr wichtig). Notiert, welche Themen besonders häufig vorkommen.",
    person: "beide",
    dauer: "5 Min.",
    color: "cyan",
  },
  {
    id: "a1-2",
    title: "Schwerpunkte identifizieren",
    desc: "Schaut euch die Modellprüfungen an: Welche Themen tauchen immer wieder auf? Markiert diese in euren Unterlagen. Erstellt eine Top-5-Liste der wahrscheinlichsten Prüfungsthemen.",
    person: "beide",
    dauer: "8 Min.",
    color: "amber",
  },
  {
    id: "a1-3",
    title: "Wissenslücken kartieren",
    desc: "Jede Person geht den Stoff durch und markiert: Grün = sicher, Gelb = unsicher, Rot = unklar. Tauscht eure Einschätzungen aus und diskutiert Unterschiede.",
    person: "einzeln",
    dauer: "7 Min.",
    color: "emerald",
  },
  {
    id: "a1-4",
    title: "NotebookLM einrichten",
    desc: "Erstellt gemeinsam ein neues NotebookLM-Notizbuch, ladet alle Unterlagen hoch und teilt es mit der Lehrperson. Gebt dem Notizbuch einen aussagekräftigen Namen.",
    person: "beide",
    dauer: "10 Min.",
    color: "violet",
  },
];

const NOTEBOOKLM_PROMPTS = [
  {
    label: "Überblick verschaffen",
    text: "Fasse die wichtigsten Themen aus meinen Unterlagen in maximal 10 Stichpunkten zusammen. Welche Themen werden am häufigsten behandelt?",
  },
  {
    label: "Prüfungsrelevanz einschätzen",
    text: "Welche 5 Themen aus meinen Unterlagen sind deiner Einschätzung nach am prüfungsrelevantesten? Begründe deine Auswahl.",
  },
  {
    label: "Lernziele ableiten",
    text: "Leite aus meinen Unterlagen konkrete Lernziele ab. Formuliere sie im Format: 'Nach dem Lernen kann ich ...'",
  },
  {
    label: "Schwierige Konzepte finden",
    text: "Welche Konzepte in meinen Unterlagen sind besonders komplex oder könnten schwer zu verstehen sein? Erkläre sie kurz.",
  },
];

export default function Phase1Upload() {
  const { state, selectedFach, completePhase, toggleCheckedItem } = useApp();
  const isDone = state.completedPhases.includes(1);
  const [unterlagen, setUnterlagen] = useState<UploadedFile[]>([]);
  const [modellPruefungen, setModellPruefungen] = useState<UploadedFile[]>([]);
  const unterlagenRef = useRef<HTMLInputElement>(null);
  const modellRef = useRef<HTMLInputElement>(null);
  const [showAllAufgaben, setShowAllAufgaben] = useState(false);

  const handleFiles = (files: FileList | null, category: "unterlagen" | "modell") => {
    if (!files) return;
    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type,
      category,
    }));
    if (category === "unterlagen") setUnterlagen((prev) => [...prev, ...newFiles]);
    else setModellPruefungen((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} Datei(en) hinzugefügt`);
  };

  const removeFile = (id: string, category: "unterlagen" | "modell") => {
    if (category === "unterlagen") setUnterlagen((prev) => prev.filter((f) => f.id !== id));
    else setModellPruefungen((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const DropZone = ({ category, files, inputRef }: {
    category: "unterlagen" | "modell";
    files: UploadedFile[];
    inputRef: React.RefObject<HTMLInputElement | null>
  }) => {
    const [dragging, setDragging] = useState(false);
    const isMod = category === "modell";
    const color = isMod ? "amber" : "cyan";
    const Icon = isMod ? ClipboardList : BookOpen;

    return (
      <div>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragging
              ? `border-${color}-400 bg-${color}-500/10`
              : `border-white/15 hover:border-${color}-500/50 hover:bg-${color}-500/5`
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files, category); }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files, category)}
          />
          <div className={`w-12 h-12 rounded-xl bg-${color}-500/15 border border-${color}-500/30 flex items-center justify-center mx-auto mb-4`}>
            <Icon size={22} className={`text-${color}-400`} />
          </div>
          <p className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
            {isMod ? "Modellprüfungen hochladen" : "Unterrichtsunterlagen hochladen"}
          </p>
          <p className="text-slate-400 text-xs mb-1">Klicken oder Dateien hierher ziehen</p>
          <p className="text-slate-500 text-xs mb-3">PDF, Word, PowerPoint, Bilder · Max. 50 MB pro Datei</p>
          <button
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${color}-500/15 border border-${color}-500/30 text-${color}-300 text-xs font-semibold hover:bg-${color}-500/25 transition-colors`}
            style={{ fontFamily: "Outfit, sans-serif" }}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            <Upload size={12} />
            Dateien auswählen
          </button>
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/8 bg-white/3">
                <FileText size={14} className={`text-${color}-400 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{file.name}</p>
                  <p className="text-slate-500 text-xs">{formatSize(file.size)}</p>
                </div>
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                <button onClick={() => removeFile(file.id, category)} className="text-slate-500 hover:text-rose-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const visibleAufgaben = showAllAufgaben ? AUFGABEN : AUFGABEN.slice(0, 2);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="phase-badge bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">1</div>
            <div>
              <p className="text-cyan-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 1 von 5 · 20–30 Min.</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Unterlagen hochladen & Stoff kartieren</h1>
            </div>
            <div className="ml-auto flex items-center gap-2 text-slate-500 text-xs">
              <Clock size={12} />
              <span>20–30 Min.</span>
              <Users size={12} className="ml-2" />
              <span>Zweiergruppe</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl">
            Ladet eure Unterrichtsunterlagen und Modellprüfungen für <strong className="text-slate-300">{selectedFach.emoji} {selectedFach.label}</strong>{state.pruefungsthema ? ` – ${state.pruefungsthema}` : ""} hoch, kartiert eure Wissenslücken und richtet NotebookLM ein. Diese Phase legt das Fundament für alle weiteren Schritte.
          </p>
        </div>

        {/* Zeitplan-Übersicht */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Materialübersicht", dauer: "5 Min.", icon: "📋", color: "border-cyan-500/20 bg-cyan-500/5" },
            { label: "Schwerpunkte", dauer: "8 Min.", icon: "🎯", color: "border-amber-500/20 bg-amber-500/5" },
            { label: "Wissenslücken", dauer: "7 Min.", icon: "🗺️", color: "border-emerald-500/20 bg-emerald-500/5" },
            { label: "NotebookLM", dauer: "10 Min.", icon: "🤖", color: "border-violet-500/20 bg-violet-500/5" },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-3 text-center ${item.color}`}>
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-white text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{item.label}</p>
              <p className="text-slate-500 text-xs">{item.dauer}</p>
            </div>
          ))}
        </div>

        {/* Upload-Bereich */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="border border-white/8 rounded-xl p-5 bg-white/2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-cyan-400" />
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Unterrichtsunterlagen</h2>
              <span className="ml-auto text-xs text-slate-500">{unterlagen.length} Datei(en)</span>
            </div>
            <DropZone category="unterlagen" files={unterlagen} inputRef={unterlagenRef} />
            <div className="mt-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/15">
              <p className="text-cyan-300 text-xs font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Was hochladen?</p>
              <ul className="text-slate-400 text-xs space-y-0.5">
                <li>• Zusammenfassungen & Skripte</li>
                <li>• Präsentationen (PPT/PDF)</li>
                <li>• Lernkarten & Übungsblätter</li>
                <li>• Fotos von Tafelbildern</li>
              </ul>
            </div>
          </div>

          <div className="border border-white/8 rounded-xl p-5 bg-white/2">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={16} className="text-amber-400" />
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Modellprüfungen</h2>
              <span className="ml-auto text-xs text-slate-500">{modellPruefungen.length} Datei(en)</span>
            </div>
            <DropZone category="modell" files={modellPruefungen} inputRef={modellRef} />
            <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <p className="text-amber-300 text-xs font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Warum Modellprüfungen?</p>
              <ul className="text-slate-400 text-xs space-y-0.5">
                <li>• Zeigen Aufgabenformat & Schwierigkeit</li>
                <li>• Helfen, Schwerpunkte zu erkennen</li>
                <li>• Basis für KI-generierte Probeprüfungen</li>
                <li>• Ermöglichen realistische Selbsteinschätzung</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Aufgaben */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <Target size={16} className="text-cyan-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Aufgaben für Phase 1</h3>
            <span className="ml-auto text-xs text-slate-500">
              {AUFGABEN.filter(a => state.checkedItems.includes(a.id)).length}/{AUFGABEN.length} erledigt
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
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-semibold ${done ? "line-through text-slate-500" : "text-white"}`} style={{ fontFamily: "Outfit, sans-serif" }}>{aufgabe.title}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border bg-${aufgabe.color}-500/10 border-${aufgabe.color}-500/20 text-${aufgabe.color}-400`}>{aufgabe.dauer}</span>
                      <span className="text-xs text-slate-500">{aufgabe.person === "beide" ? "👥 Gemeinsam" : "👤 Einzeln"}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{aufgabe.desc}</p>
                  </div>
                </div>
              );
            })}
            {AUFGABEN.length > 2 && (
              <button
                onClick={() => setShowAllAufgaben(!showAllAufgaben)}
                className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white text-xs transition-colors"
              >
                {showAllAufgaben ? <><ChevronUp size={14} /> Weniger anzeigen</> : <><ChevronDown size={14} /> Alle {AUFGABEN.length} Aufgaben anzeigen</>}
              </button>
            )}
          </div>
        </div>

        {/* NotebookLM Anleitung */}
        <div className="border border-cyan-500/20 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/15" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>NLM</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Schritt-für-Schritt: NotebookLM einrichten</h3>
              <p className="text-slate-400 text-xs">Google NotebookLM · kostenlos mit Google-Konto · ca. 10 Min.</p>
            </div>
            <a
              href="https://notebooklm.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <ExternalLink size={11} />
              NotebookLM öffnen
            </a>
          </div>
          <div className="p-5 space-y-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {[
              { n: 1, title: "Google-Konto bereitstellen", desc: "Stellt sicher, dass ihr beide ein Google-Konto habt. Öffnet notebooklm.google.com. Falls ihr noch kein Konto habt, erstellt eines kostenlos unter accounts.google.com." },
              { n: 2, title: "Neues Notizbuch erstellen", desc: `Klickt auf "+ Neues Notizbuch". Gebt einen aussagekräftigen Namen ein, z.B. "Prüfung ${selectedFach.label}${state.pruefungsthema ? ` – ${state.pruefungsthema}` : ""} ${new Date().getFullYear()}". Ein klarer Name hilft beim späteren Wiederfinden.` },
              { n: 3, title: "Unterlagen als Quellen hinzufügen", desc: 'Klickt auf "Quelle hinzufügen". Ladet eure Unterrichtsunterlagen hoch (PDF, Word, PowerPoint). Ihr könnt auch Google Docs direkt verknüpfen oder Text einfügen. Benennt jede Quelle klar.' },
              { n: 4, title: "Modellprüfungen separat hochladen", desc: 'Ladet die Modellprüfungen als eigene Quellen hoch. Benennt sie z.B. "Modellprüfung 2024" oder "Probeprüfung Kanton". NotebookLM analysiert automatisch Aufgabentypen und Schwerpunkte.' },
              { n: 5, title: "Ersten Überblick generieren", desc: 'Klickt auf "Notizbuch-Leitfaden" (oben rechts). NotebookLM erstellt automatisch eine Zusammenfassung, ein FAQ und eine Zeitleiste. Das ist euer erster Überblick über den Prüfungsstoff.' },
              { n: 6, title: "Notizbuch teilen", desc: 'Klickt auf das Teilen-Symbol und gebt die E-Mail-Adresse eures Lernpartners / eurer Lernpartnerin ein. Optional: Ladet auch die Lehrperson ein, damit sie eure Arbeit mitlesen und kommentieren kann.' },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {step.n}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{step.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NotebookLM Starter-Prompts */}
        <div className="border border-violet-500/20 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-violet-500/15" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <span className="text-violet-400 text-lg">💬</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Starter-Prompts für NotebookLM</h3>
              <p className="text-slate-400 text-xs">Kopiere und stelle diese Fragen direkt in NotebookLM</p>
            </div>
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {NOTEBOOKLM_PROMPTS.map((prompt) => (
              <div key={prompt.label} className="p-3 rounded-xl border border-white/8 bg-white/3 group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-violet-300 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{prompt.label}</p>
                  <button
                    onClick={() => copyText(prompt.text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-violet-400"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed italic">"{prompt.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lernziele */}
        <div className="mb-8">
          <LernzielCheckliste />
        </div>

        {/* Tipp-Box */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3 mb-8">
          <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Tipp: Lehrperson kann mitlesen & kommentieren</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              NotebookLM erlaubt es, Notizbücher zu teilen. Ladet eure Lehrperson ein, das Notizbuch einzusehen. Sie kann eure KI-Gespräche, Zusammenfassungen und Fragen kommentieren – ohne selbst Änderungen vorzunehmen. Wechsle dafür zur <strong className="text-amber-300">Lehrperson-Ansicht</strong> für weitere Anleitungen.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <div className="text-slate-500 text-xs">
            {unterlagen.length + modellPruefungen.length} Datei(en) bereit · {AUFGABEN.filter(a => state.checkedItems.includes(a.id)).length}/{AUFGABEN.length} Aufgaben erledigt
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { completePhase(1); toast.success("Phase 1 als abgeschlossen markiert!"); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/15 text-slate-400 hover:text-white hover:border-white/30"}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <CheckCircle size={13} />
              {isDone ? "Abgeschlossen ✓" : "Als erledigt markieren"}
            </button>
            <Link href="/phase/2">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm transition-all duration-200"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Weiter zu Phase 2
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
