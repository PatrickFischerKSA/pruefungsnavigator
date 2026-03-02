/* ============================================================
   PHASE 2 – KI-GESTÜTZTE ANALYSE
   Design: Functional Futurism
   Tools: NotebookLM, ChatGPT, Fobizz, CryptPad, Excalidraw
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { Brain, ExternalLink, Copy, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Lightbulb, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyPrompt = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Prompt kopiert!"));
};

const tools = [
  {
    id: "notebooklm",
    name: "Google NotebookLM",
    badge: "NLM",
    badgeColor: "cyan",
    url: "https://notebooklm.google.com",
    tagline: "Deine KI-Expertin für deine eigenen Dokumente",
    desc: "NotebookLM analysiert ausschliesslich deine hochgeladenen Quellen. Es erfindet nichts – alle Antworten basieren auf deinen Unterlagen. Ideal für präzise Zusammenfassungen und prüfungsrelevante Extraktion.",
    tasks: [
      {
        title: "Prüfungsrelevante Inhalte extrahieren",
        prompt: `Analysiere meine Unterlagen und erstelle eine strukturierte Übersicht der prüfungsrelevanten Inhalte. Gliedere sie nach: (1) Kernbegriffe und Definitionen, (2) wichtige Konzepte und Zusammenhänge, (3) häufig geprüfte Themen. Nutze Tabellen wo möglich.`,
      },
      {
        title: "Modellprüfung analysieren",
        prompt: `Analysiere die hochgeladene Modellprüfung. Welche Themengebiete werden geprüft? Welche Aufgabentypen kommen vor (Wissen, Verstehen, Anwenden, Analysieren)? Welche Schwerpunkte erkennst du? Erstelle eine Übersicht.`,
      },
      {
        title: "Wissenslücken identifizieren",
        prompt: `Ich habe folgende Themen bereits verstanden: [THEMEN EINTRAGEN]. Welche Bereiche meiner Unterlagen habe ich noch nicht abgedeckt? Was sollte ich noch lernen, um die Prüfung gut zu bestehen?`,
      },
      {
        title: "Zusammenfassung für Zweiergruppe",
        prompt: `Erstelle eine kompakte Zusammenfassung der wichtigsten Inhalte für eine Prüfungsvorbereitung in der Zweiergruppe. Die Zusammenfassung soll als Grundlage für gegenseitiges Erklären (Feynman-Methode) dienen. Max. 1 Seite.`,
      },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    badge: "GPT",
    badgeColor: "emerald",
    url: "https://chat.openai.com",
    tagline: "Allgemeines KI-Gespräch & Probeprüfungs-Vorbereitung",
    desc: "ChatGPT (kostenlose Version) eignet sich für allgemeine Erklärungen, das Generieren von Übungsaufgaben und das Simulieren von Prüfungsgesprächen. Achtung: ChatGPT kennt deine Unterlagen nicht – füge relevante Textpassagen direkt in den Prompt ein.",
    tasks: [
      {
        title: "Thema einfach erklären lassen",
        prompt: `Erkläre mir das Thema [THEMA] so, als würde ich es zum ersten Mal hören. Nutze ein konkretes Alltagsbeispiel. Fasse danach die 3 wichtigsten Punkte in Stichpunkten zusammen.`,
      },
      {
        title: "Übungsaufgaben generieren",
        prompt: `Erstelle 5 Übungsaufgaben zum Thema [THEMA] auf verschiedenen Niveaus: 2 Wissensaufgaben (Definitionen), 2 Verständnisaufgaben (Erklären/Vergleichen) und 1 Anwendungsaufgabe. Gib jeweils die Musterlösung an.`,
      },
      {
        title: "Feynman-Methode: Feedback",
        prompt: `Ich erkläre dir jetzt das Thema [THEMA] in meinen eigenen Worten. Bitte gib mir danach Feedback: Was habe ich richtig erklärt? Was fehlt? Was war ungenau? Hier meine Erklärung: [DEINE ERKLÄRUNG]`,
      },
      {
        title: "Mündliche Prüfung simulieren",
        prompt: `Simuliere eine mündliche Prüfung zum Thema [THEMA]. Stelle mir 5 Fragen, wie sie eine Lehrperson stellen würde. Warte nach jeder Frage auf meine Antwort und gib mir kurzes Feedback, bevor du die nächste Frage stellst.`,
      },
    ],
  },
  {
    id: "fobizz",
    name: "Fobizz",
    badge: "FOB",
    badgeColor: "purple",
    url: "https://app.fobizz.com/tools",
    tagline: "Interaktive Lernmaterialien & KI-Tools für Schulen",
    desc: "Fobizz bietet kostenlose KI-Tools speziell für den Bildungsbereich. Besonders nützlich: der KI-Chatbot (datenschutzkonform), der Arbeitsblatt-Generator und das Whiteboard-Tool. Kein Abo für Basisnutzung nötig.",
    tasks: [
      {
        title: "KI-Chatbot für Schüler*innen",
        prompt: `Nutze den Fobizz KI-Chatbot unter app.fobizz.com/tools → "KI-Chatbot". Stelle ihm dieselben Fragen wie ChatGPT und vergleiche die Antworten. Fobizz ist DSGVO-konform und speichert keine Daten.`,
      },
      {
        title: "Interaktives Arbeitsblatt erstellen",
        prompt: `Erstelle mit dem Fobizz Arbeitsblatt-Generator ein Übungsblatt zu deinem Prüfungsthema. Wähle: Lückentext, Zuordnungsaufgabe oder Multiple Choice. Das fertige Blatt kannst du mit deiner Lernpartnerin / deinem Lernpartner teilen.`,
      },
      {
        title: "Whiteboard für Mindmap",
        prompt: `Nutze das Fobizz Whiteboard (oder Excalidraw als Alternative) um gemeinsam mit deiner Lernpartnerin / deinem Lernpartner eine Mindmap des Prüfungsstoffs zu erstellen. Exportiere sie als Bild.`,
      },
    ],
  },
  {
    id: "cryptpad",
    name: "CryptPad",
    badge: "CP",
    badgeColor: "teal",
    url: "https://cryptpad.fr",
    tagline: "Verschlüsseltes kollaboratives Schreiben",
    desc: "CryptPad ist eine datenschutzfreundliche Alternative zu Google Docs. Erstelle gemeinsame Dokumente, Tabellen oder Kanban-Boards ohne Anmeldung. Ideal für das gemeinsame Erstellen von Lernunterlagen.",
    tasks: [
      {
        title: "Gemeinsames Lernprotokoll",
        prompt: `Erstelle ein neues CryptPad-Dokument. Strukturiere es mit folgenden Abschnitten: (1) Prüfungsthemen und Lernziele, (2) Zusammenfassungen aus NotebookLM, (3) Offene Fragen, (4) Lernfortschritt. Teile den Link mit deiner Lernpartnerin / deinem Lernpartner.`,
      },
      {
        title: "Lernkarten-Tabelle",
        prompt: `Erstelle eine CryptPad-Tabelle mit 3 Spalten: "Begriff/Frage", "Antwort/Definition", "Beherrscht (Ja/Nein)". Füge alle wichtigen Begriffe aus deinen Unterlagen ein. Nutze diese Tabelle für das aktive Abrufen (Retrieval Practice).`,
      },
    ],
  },
];

export default function Phase2KI() {
  const [openTool, setOpenTool] = useState<string>("notebooklm");
  const [openTask, setOpenTask] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
    emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    purple: "border-purple-500/30 bg-purple-500/8 text-purple-300",
    teal: "border-teal-500/30 bg-teal-500/8 text-teal-300",
  };
  const iconColorMap: Record<string, string> = {
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    teal: "text-teal-400",
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="phase-badge bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">2</div>
            <div>
              <p className="text-emerald-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 2 von 5</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>KI-gestützte Analyse</h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Nutze die KI-Tools, um deinen Prüfungsstoff zu strukturieren, Zusammenfassungen zu erstellen und Wissenslücken zu identifizieren. Kopiere die Prompts direkt in das jeweilige Tool.
          </p>
        </div>

        {/* Tool Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setOpenTool(tool.id)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-200
                ${openTool === tool.id
                  ? colorMap[tool.badgeColor] + " border-opacity-60"
                  : "border-white/10 text-slate-400 hover:text-white hover:border-white/20 bg-white/3"
                }
              `}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${openTool === tool.id ? "" : "opacity-60"}`} style={{ background: "oklch(1 0 0 / 8%)" }}>
                {tool.badge}
              </span>
              {tool.name}
            </button>
          ))}
        </div>

        {/* Active Tool Panel */}
        {tools.map((tool) => {
          if (tool.id !== openTool) return null;
          return (
            <div key={tool.id} className="border border-white/8 rounded-xl overflow-hidden mb-6">
              {/* Tool header */}
              <div className="flex items-start gap-4 p-5 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 border ${colorMap[tool.badgeColor]}`}
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {tool.badge}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-base" style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</h3>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-semibold transition-colors ${colorMap[tool.badgeColor]} hover:opacity-80`}
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      <ExternalLink size={10} />
                      Öffnen
                    </a>
                  </div>
                  <p className={`text-xs font-medium mb-1 ${iconColorMap[tool.badgeColor]}`}>{tool.tagline}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{tool.desc}</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-5 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                <h4 className="text-white font-semibold text-xs mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Aufgaben & Prompts für diese Phase:
                </h4>
                {tool.tasks.map((task, idx) => {
                  const taskId = `${tool.id}-${idx}`;
                  const isOpen = openTask === taskId;
                  const isDone = checked.has(taskId);
                  return (
                    <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/8 bg-white/2"}`}>
                      <button
                        className="w-full flex items-center gap-3 p-4 text-left"
                        onClick={() => setOpenTask(isOpen ? null : taskId)}
                      >
                        <button
                          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isDone ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-emerald-500/50"}`}
                          onClick={(e) => { e.stopPropagation(); toggleCheck(taskId); }}
                        >
                          {isDone && <CheckCircle size={12} className="text-white" />}
                        </button>
                        <span className={`text-sm font-semibold flex-1 ${isDone ? "text-slate-400 line-through" : "text-white"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                          {task.title}
                        </span>
                        {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <div className="prompt-box mb-3">
                            {task.prompt}
                          </div>
                          <button
                            onClick={() => copyPrompt(task.prompt)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${colorMap[tool.badgeColor]} hover:opacity-80`}
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            <Copy size={11} />
                            Prompt kopieren
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Lehrperson-Hinweis */}
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex gap-3 mb-8">
          <Lightbulb size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-cyan-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Lehrperson kann Resultate mitlesen</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Teile dein NotebookLM-Notizbuch mit der Lehrperson (Teilen-Button im Notizbuch). Sie kann alle KI-Gespräche, Zusammenfassungen und Notizen einsehen und direkt kommentieren. Alternativ: Exportiere deine Zusammenfassung als PDF und lade sie in CryptPad hoch.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <Link href="/phase/1">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 text-sm font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
              <ArrowLeft size={14} />
              Phase 1
            </button>
          </Link>
          <Link href="/phase/3">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm transition-all duration-200" style={{ fontFamily: "Outfit, sans-serif" }}>
              Weiter zu Phase 3
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
