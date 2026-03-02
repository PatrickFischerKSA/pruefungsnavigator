/* ============================================================
   PHASE 1 – UNTERLAGEN HOCHLADEN
   Design: Functional Futurism
   ============================================================ */
import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import { Upload, FileText, X, CheckCircle, ArrowRight, BookOpen, ClipboardList, ExternalLink, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: "unterlagen" | "modell";
}

export default function Phase1Upload() {
  const { state, selectedFach, completePhase } = useApp();
  const isDone = state.completedPhases.includes(1);
  const [unterlagen, setUnterlagen] = useState<UploadedFile[]>([]);
  const [modellPruefungen, setModellPruefungen] = useState<UploadedFile[]>([]);
  const unterlagenRef = useRef<HTMLInputElement>(null);
  const modellRef = useRef<HTMLInputElement>(null);

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

  const DropZone = ({ category, files, inputRef }: { category: "unterlagen" | "modell"; files: UploadedFile[]; inputRef: React.RefObject<HTMLInputElement | null> }) => {
    const [dragging, setDragging] = useState(false);
    const isMod = category === "modell";
    const color = isMod ? "amber" : "cyan";
    const Icon = isMod ? ClipboardList : BookOpen;

    return (
      <div>
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${dragging
              ? `border-${color}-400 bg-${color}-500/10`
              : `border-white/15 hover:border-${color}-500/50 hover:bg-${color}-500/5`
            }
          `}
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
          <p className="text-slate-400 text-xs mb-3">
            Klicken oder Dateien hierher ziehen
          </p>
          <p className="text-slate-500 text-xs">PDF, Word, PowerPoint, Bilder · Max. 50 MB pro Datei</p>
          <button
            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${color}-500/15 border border-${color}-500/30 text-${color}-300 text-xs font-semibold hover:bg-${color}-500/25 transition-colors`}
            style={{ fontFamily: "Outfit, sans-serif" }}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            <Upload size={12} />
            Dateien auswählen
          </button>
        </div>

        {/* File list */}
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

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="phase-badge bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">1</div>
            <div>
              <p className="text-cyan-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 1 von 5</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Unterlagen hochladen</h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Lade deine Unterrichtsunterlagen und Modellprüfungen für <strong className="text-slate-300">{selectedFach.emoji} {selectedFach.label}</strong>{state.pruefungsthema ? ` – ${state.pruefungsthema}` : ""} hoch. Anschliessend überträgst du sie in NotebookLM.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Unterlagen */}
          <div className="border border-white/8 rounded-xl p-5 bg-white/2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-cyan-400" />
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Unterrichtsunterlagen</h2>
              <span className="ml-auto text-xs text-slate-500">{unterlagen.length} Datei(en)</span>
            </div>
            <DropZone category="unterlagen" files={unterlagen} inputRef={unterlagenRef} />
          </div>

          {/* Modellprüfungen */}
          <div className="border border-white/8 rounded-xl p-5 bg-white/2">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={16} className="text-amber-400" />
              <h2 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Modellprüfungen</h2>
              <span className="ml-auto text-xs text-slate-500">{modellPruefungen.length} Datei(en)</span>
            </div>
            <DropZone category="modell" files={modellPruefungen} inputRef={modellRef} />
          </div>
        </div>

        {/* NotebookLM Anleitung */}
        <div className="border border-cyan-500/20 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/15" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>NLM</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Schritt-für-Schritt: Unterlagen in NotebookLM laden</h3>
              <p className="text-slate-400 text-xs">Google NotebookLM · kostenlos mit Google-Konto</p>
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
              { n: 1, title: "Neues Notizbuch erstellen", desc: 'Gehe zu notebooklm.google.com und klicke auf "+ Neues Notizbuch". Gib deinem Notizbuch einen Namen, z.B. "Prüfung Biologie – März 2026".' },
              { n: 2, title: "Quellen hinzufügen", desc: 'Klicke auf "Quelle hinzufügen" und lade deine Unterrichtsunterlagen (PDF, Word, etc.) hoch. Du kannst auch Google Docs direkt verknüpfen oder Text einfügen.' },
              { n: 3, title: "Modellprüfungen als Quelle", desc: 'Lade auch deine Modellprüfungen als separate Quelle hoch. Benenne sie klar, z.B. "Modellprüfung 2024". NotebookLM analysiert Aufgabentypen und Schwerpunkte.' },
              { n: 4, title: "Notizbuch mit Partner teilen", desc: 'Klicke auf das Teilen-Symbol (oben rechts) und gib die E-Mail-Adresse deines Lernpartners / deiner Lernpartnerin ein. So könnt ihr gemeinsam im selben Notizbuch arbeiten.' },
              { n: 5, title: "Lehrperson einladen (optional)", desc: 'Teile das Notizbuch auch mit deiner Lehrperson. Diese kann eure Fragen und Zusammenfassungen mitlesen und direkt kommentieren.' },
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

        {/* Tipp-Box */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3 mb-8">
          <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Tipp: Lehrperson kann mitlesen</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              NotebookLM erlaubt es, Notizbücher zu teilen. Lade deine Lehrperson ein, das Notizbuch einzusehen. Sie kann eure KI-Gespräche und Zusammenfassungen kommentieren und Feedback geben – ohne selbst Änderungen vorzunehmen. Wechsle dafür in der Phase 2 zur Lehrperson-Ansicht.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <div className="text-slate-500 text-xs">
            {unterlagen.length + modellPruefungen.length} Datei(en) bereit
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
