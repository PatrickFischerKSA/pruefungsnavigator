/* ============================================================
   PHASE 2 – KI-GESTÜTZTE ANALYSE (40–60 Min.)
   Design: Functional Futurism
   Tools: NotebookLM, ChatGPT, Fobizz, CryptPad, Excalidraw, Miro
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import {
  Brain, ExternalLink, Copy, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft, Lightbulb, CheckCircle, Clock, Users, Zap
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyPrompt = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Prompt kopiert!"));
};

function buildPrompts(fachLabel: string, thema: string, pruefungsformat: string) {
  const t = thema || `[THEMA aus ${fachLabel}]`;
  const f = pruefungsformat;
  return {
    notebooklm: [
      {
        title: "Strukturierte Zusammenfassung",
        prompt: `Erstelle eine strukturierte Zusammenfassung meiner Unterlagen zu "${t}" (${fachLabel}). Gliedere nach Hauptthemen und Unterthemen. Hebe die 5 wichtigsten Konzepte hervor. Nutze Tabellen wo möglich. Prüfungsformat: ${f}.`,
      },
      {
        title: "Prüfungsrelevante Inhalte extrahieren",
        prompt: `Analysiere meine Unterlagen und erstelle eine Übersicht der prüfungsrelevantesten Inhalte zu "${t}" (${fachLabel}). Gliedere in: (1) Kernbegriffe & Definitionen, (2) wichtige Konzepte & Zusammenhänge, (3) häufig geprüfte Themen. Prüfungsformat: ${f}.`,
      },
      {
        title: "Modellprüfung analysieren",
        prompt: `Analysiere die hochgeladene Modellprüfung (${fachLabel}). Welche Themengebiete werden geprüft? Welche Aufgabentypen kommen vor (Wissen, Verstehen, Anwenden, Analysieren)? Welche Schwerpunkte erkennst du? Erstelle eine Übersicht mit Gewichtung der Themen.`,
      },
      {
        title: "Wissenslücken identifizieren",
        prompt: `Ich habe folgende Themen aus ${fachLabel} bereits verstanden: [THEMEN EINTRAGEN]. Welche Bereiche meiner Unterlagen zu "${t}" habe ich noch nicht abgedeckt? Was sollte ich noch lernen, um die Prüfung (${f}) gut zu bestehen?`,
      },
      {
        title: "Vergleichstabelle erstellen",
        prompt: `Erstelle eine Vergleichstabelle der wichtigsten Konzepte/Theorien/Modelle zu "${t}" (${fachLabel}). Spalten: Name, Kernaussage, Beispiel, Stärken, Schwächen. Nutze ausschliesslich Informationen aus meinen Quellen.`,
      },
      {
        title: "10 Lernkarten generieren",
        prompt: `Erstelle 10 Lernkarten (Frage-Antwort-Format) zu den wichtigsten Konzepten in "${t}" (${fachLabel}). Format: Vorderseite: [Frage], Rückseite: [kurze, präzise Antwort in max. 3 Sätzen]. Orientiere dich an den Modellprüfungen.`,
      },
      {
        title: "Audio-Übersicht anfordern",
        prompt: `Erstelle eine gesprochene Übersicht zu "${t}" (${fachLabel}) für zwei Lernende, die sich auf eine Prüfung vorbereiten. Erkläre die wichtigsten Konzepte in einfacher Sprache, als würdest du mit Gleichaltrigen sprechen. Dauer: ca. 5 Minuten.`,
      },
      {
        title: "Zusammenfassung für Zweiergruppe",
        prompt: `Erstelle eine kompakte Zusammenfassung der wichtigsten Inhalte aus ${fachLabel} zu "${t}" für eine Prüfungsvorbereitung in der Zweiergruppe. Die Zusammenfassung soll als Grundlage für gegenseitiges Erklären (Feynman-Methode) dienen. Max. 1 Seite. Prüfungsformat: ${f}.`,
      },
    ],
    chatgpt: [
      {
        title: "Konzept vereinfacht erklären",
        prompt: `Erkläre mir das Konzept "[KONZEPT EINFÜGEN]" aus ${fachLabel} so, als wäre ich 16 Jahre alt. Nutze eine Analogie aus dem Alltag. Gib mir dann 3 Beispiele, die das Konzept verdeutlichen. Fasse am Ende in 3 Stichpunkten zusammen.`,
      },
      {
        title: "Feynman-Methode: Feedback",
        prompt: `Ich erkläre dir jetzt das Thema "${t}" (${fachLabel}) in meinen eigenen Worten. Bitte gib mir danach Feedback: Was habe ich richtig erklärt? Was fehlt? Was war ungenau? Wie kann ich es einfacher erklären? Hier meine Erklärung: [DEINE ERKLÄRUNG EINFÜGEN]`,
      },
      {
        title: "Übungsaufgaben generieren",
        prompt: `Erstelle 6 Übungsaufgaben zu "${t}" (${fachLabel}) auf verschiedenen Niveaus: 2 Wissensaufgaben (Definitionen), 2 Verständnisaufgaben (Erklären/Vergleichen) und 2 Anwendungsaufgaben. Prüfungsformat: ${f}. Gib jeweils die Musterlösung an.`,
      },
      {
        title: "Mündliche Prüfung simulieren",
        prompt: `Simuliere eine mündliche Prüfung zu "${t}" (${fachLabel}). Stelle mir 5 Fragen mit steigendem Schwierigkeitsgrad, wie sie eine Lehrperson stellen würde. Prüfungsformat: ${f}. Warte nach jeder Frage auf meine Antwort und gib mir kurzes Feedback, bevor du die nächste Frage stellst.`,
      },
      {
        title: "Zusammenhänge visualisieren",
        prompt: `Erkläre die Zusammenhänge zwischen folgenden Konzepten aus "${t}" (${fachLabel}): [KONZEPTE EINFÜGEN]. Erstelle eine textbasierte Mindmap oder ein Diagramm, das die Verbindungen zeigt. Erkläre jeden Zusammenhang in 1–2 Sätzen.`,
      },
      {
        title: "Eselsbrücken erstellen",
        prompt: `Erstelle für folgende Fachbegriffe aus "${t}" (${fachLabel}) je eine Eselsbrücke oder Merkhilfe: [BEGRIFFE EINFÜGEN]. Die Eselsbrücken sollen einprägsam, kreativ und auf Deutsch sein. Erkläre kurz, warum die Eselsbrücke funktioniert.`,
      },
      {
        title: "Lernplan erstellen",
        prompt: `Ich habe noch [ANZAHL] Tage bis zur Prüfung in ${fachLabel} zu "${t}". Meine Stärken sind: [STÄRKEN]. Meine Schwächen sind: [SCHWÄCHEN]. Erstelle mir einen realistischen Lernplan mit täglichen Aufgaben (max. 60 Min./Tag). Berücksichtige Pausen und Wiederholungen.`,
      },
      {
        title: "Fehler analysieren",
        prompt: `Ich habe diese Prüfungsaufgabe falsch beantwortet: Aufgabe: [AUFGABE]. Meine Antwort: [MEINE ANTWORT]. Richtige Antwort: [RICHTIGE ANTWORT]. Erkläre mir, warum meine Antwort falsch war. Was habe ich missverstanden? Wie merke ich mir die richtige Antwort?`,
      },
    ],
    fobizz: [
      {
        title: "Fachbegriff-Glossar erstellen",
        prompt: `Erstelle ein Glossar der 15 wichtigsten Fachbegriffe zu "${t}" (${fachLabel}). Format: Begriff – Definition (max. 2 Sätze) – Beispiel aus dem Schulalltag. Sortiere alphabetisch. Nutze einfache, verständliche Sprache.`,
      },
      {
        title: "Lückentext erstellen",
        prompt: `Erstelle einen Lückentext zu "${t}" (${fachLabel}) mit 10–12 Lücken. Die Lücken sollen wichtige Fachbegriffe oder Konzepte sein. Füge am Ende ein Wortfeld mit den fehlenden Begriffen und die Lösungen hinzu.`,
      },
      {
        title: "Richtig-Falsch-Aussagen",
        prompt: `Erstelle 12 Richtig-Falsch-Aussagen zu "${t}" (${fachLabel}). 6 sollen richtig, 6 falsch sein. Füge die Auflösungen mit kurzer Begründung am Ende hinzu. Orientiere dich am Prüfungsformat: ${f}.`,
      },
      {
        title: "Strukturierter Überblick",
        prompt: `Erstelle einen strukturierten Überblick über "${t}" (${fachLabel}) für Schülerinnen und Schüler der Fachmittelschule. Gliedere in: Grundlagen, Hauptkonzepte, Anwendungsbeispiele, Typische Prüfungsfragen. Prüfungsformat: ${f}.`,
      },
      {
        title: "Interaktives Arbeitsblatt",
        prompt: `Erstelle mit dem Fobizz Arbeitsblatt-Generator ein Übungsblatt zu "${t}" (${fachLabel}). Wähle: Lückentext, Zuordnungsaufgabe oder Multiple Choice. Das fertige Blatt kannst du mit deiner Lernpartnerin / deinem Lernpartner teilen.`,
      },
    ],
    cryptpad: [
      {
        title: "Gemeinsames Lernprotokoll",
        prompt: `Erstelle ein neues CryptPad-Dokument für ${fachLabel}. Strukturiere es mit: (1) Prüfungsthemen und Lernziele zu "${t}", (2) Zusammenfassungen aus NotebookLM, (3) Offene Fragen, (4) Lernfortschritt. Teile den Link mit deiner Lernpartnerin / deinem Lernpartner und der Lehrperson.`,
      },
      {
        title: "Lernkarten-Tabelle",
        prompt: `Erstelle eine CryptPad-Tabelle mit 3 Spalten: "Begriff/Frage", "Antwort/Definition", "Beherrscht (Ja/Nein)". Füge alle wichtigen Begriffe aus "${t}" (${fachLabel}) ein. Nutze diese Tabelle für aktives Abrufen (Retrieval Practice).`,
      },
      {
        title: "Peer-Feedback-Vorlage",
        prompt: `Erstelle in CryptPad eine Vorlage für gegenseitiges Feedback. Abschnitte: Person A erklärt [THEMA], Person B gibt Feedback nach der Sandwich-Methode (Positiv – Verbesserung – Positiv). Tauscht die Rollen nach 10 Minuten.`,
      },
    ],
  };
}

const toolMeta = [
  {
    id: "notebooklm",
    name: "Google NotebookLM",
    badge: "NLM",
    badgeColor: "cyan",
    url: "https://notebooklm.google.com",
    tagline: "Deine KI-Expertin für deine eigenen Dokumente",
    desc: "NotebookLM analysiert ausschliesslich deine hochgeladenen Quellen. Alle Antworten basieren auf deinen Unterlagen – keine Erfindungen. Ideal für präzise Zusammenfassungen, Lernkarten und Audio-Übersichten.",
    dauer: "15–20 Min.",
    prioritaet: "Hoch",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    badge: "GPT",
    badgeColor: "emerald",
    url: "https://chatgpt.com",
    tagline: "Allgemeines KI-Gespräch & Probeprüfungs-Vorbereitung",
    desc: "ChatGPT (kostenlose Version) eignet sich für Erklärungen, Übungsaufgaben und Prüfungssimulationen. Achtung: ChatGPT kennt deine Unterlagen nicht – füge relevante Textpassagen direkt in den Prompt ein.",
    dauer: "15–20 Min.",
    prioritaet: "Hoch",
  },
  {
    id: "fobizz",
    name: "Fobizz",
    badge: "FOB",
    badgeColor: "purple",
    url: "https://app.fobizz.com/tools",
    tagline: "Interaktive Lernmaterialien & KI-Tools für Schulen",
    desc: "Fobizz bietet kostenlose KI-Tools speziell für den Bildungsbereich. Besonders nützlich: der KI-Chatbot (datenschutzkonform), der Arbeitsblatt-Generator und das Whiteboard-Tool. Kein Abo für Basisnutzung nötig.",
    dauer: "10 Min.",
    prioritaet: "Mittel",
  },
  {
    id: "cryptpad",
    name: "CryptPad",
    badge: "CP",
    badgeColor: "teal",
    url: "https://cryptpad.fr",
    tagline: "Verschlüsseltes kollaboratives Schreiben",
    desc: "CryptPad ist eine datenschutzfreundliche Alternative zu Google Docs. Erstelle gemeinsame Dokumente ohne Anmeldung. Ideal für das gemeinsame Lernprotokoll, das auch die Lehrperson mitlesen kann.",
    dauer: "5–10 Min.",
    prioritaet: "Mittel",
  },
];

const AUFGABEN_P2 = [
  { id: "p2-a1", title: "NotebookLM: Strukturierte Zusammenfassung erstellen", dauer: "10 Min.", tool: "NotebookLM", color: "cyan", person: "beide", desc: "Nutzt den Prompt 'Strukturierte Zusammenfassung' in NotebookLM. Lest die generierte Zusammenfassung durch und ergänzt fehlende Punkte aus euren eigenen Notizen. Speichert die Zusammenfassung als Notiz." },
  { id: "p2-a2", title: "Mindmap des Prüfungsstoffs erstellen", dauer: "15 Min.", tool: "Excalidraw", color: "amber", person: "beide", desc: "Erstellt gemeinsam eine Mindmap in Excalidraw (excalidraw.com). Hauptthema in der Mitte, Unterthemen als Äste. Nutzt Farben für verschiedene Themenbereiche. Exportiert die Mindmap als PNG." },
  { id: "p2-a3", title: "Wissenslücken mit ChatGPT schliessen", dauer: "15 Min.", tool: "ChatGPT", color: "emerald", person: "einzeln", desc: "Jede Person wählt ihr schwächstes Thema und nutzt den Prompt 'Konzept vereinfacht erklären' in ChatGPT. Erklärt euch das Thema danach gegenseitig mit eigenen Worten (Feynman-Methode)." },
  { id: "p2-a4", title: "Fachbegriff-Glossar erstellen", dauer: "10 Min.", tool: "Fobizz", color: "violet", person: "beide", desc: "Erstellt mit Fobizz eine Liste der 15 wichtigsten Fachbegriffe mit Definitionen. Nutzt den KI-Assistenten, um Definitionen zu vereinfachen und mit Beispielen zu ergänzen." },
  { id: "p2-a5", title: "Gemeinsames Lernprotokoll in CryptPad", dauer: "5 Min.", tool: "CryptPad", color: "rose", person: "beide", desc: "Erstellt ein gemeinsames Dokument in CryptPad (cryptpad.fr). Tragt eure wichtigsten Erkenntnisse, offenen Fragen und Lernziele ein. Teilt den Link mit der Lehrperson." },
  { id: "p2-a6", title: "Audio-Übersicht mit NotebookLM anhören", dauer: "5 Min.", tool: "NotebookLM", color: "cyan", person: "beide", desc: "Nutzt die 'Audio-Übersicht'-Funktion in NotebookLM, um eine gesprochene Zusammenfassung des Stoffs zu generieren. Hört sie gemeinsam an und notiert neue Erkenntnisse." },
];

export default function Phase2KI() {
  const { state, selectedFach, toggleCheckedItem, completePhase } = useApp();
  const [openTool, setOpenTool] = useState<string>("notebooklm");
  const [openTask, setOpenTask] = useState<string | null>(null);
  const [showAllAufgaben, setShowAllAufgaben] = useState(false);

  const prompts = buildPrompts(selectedFach.label, state.pruefungsthema, selectedFach.pruefungsformat);
  const promptMap: Record<string, { title: string; prompt: string }[]> = {
    notebooklm: prompts.notebooklm,
    chatgpt: prompts.chatgpt,
    fobizz: prompts.fobizz,
    cryptpad: prompts.cryptpad,
  };

  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
    emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    purple: "border-purple-500/30 bg-purple-500/8 text-purple-300",
    teal: "border-teal-500/30 bg-teal-500/8 text-teal-300",
  };
  const iconColorMap: Record<string, string> = {
    cyan: "text-cyan-400", emerald: "text-emerald-400",
    purple: "text-purple-400", teal: "text-teal-400",
  };

  const isDone = state.completedPhases.includes(2);
  const visibleAufgaben = showAllAufgaben ? AUFGABEN_P2 : AUFGABEN_P2.slice(0, 3);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="phase-badge bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">2</div>
            <div>
              <p className="text-emerald-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 2 von 5 · 40–60 Min.</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>KI-gestützte Analyse & Strukturierung</h1>
            </div>
            <div className="ml-auto flex items-center gap-2 text-slate-500 text-xs">
              <Clock size={12} /><span>40–60 Min.</span>
              <Users size={12} className="ml-2" /><span>Zweiergruppe</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl">
            Nutzt KI-Tools, um den Prüfungsstoff zu <strong className="text-slate-300">strukturieren, verstehen und visualisieren</strong>. Erstellt Zusammenfassungen, Mindmaps und Glossare. Schliesst Wissenslücken gezielt mit KI-Erklärungen. Die Prompts sind auf <strong className="text-slate-300">{selectedFach.emoji} {selectedFach.label}</strong> zugeschnitten.
          </p>
        </div>

        {/* Zeitplan */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: "NLM Zusammenfassung", dauer: "10 Min.", emoji: "📝" },
            { label: "Mindmap", dauer: "15 Min.", emoji: "🗺️" },
            { label: "Wissenslücken", dauer: "15 Min.", emoji: "🔍" },
            { label: "Glossar", dauer: "10 Min.", emoji: "📖" },
            { label: "Protokoll", dauer: "5 Min.", emoji: "📋" },
            { label: "Audio-Übersicht", dauer: "5 Min.", emoji: "🎧" },
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
            <Zap size={16} className="text-emerald-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Aufgaben für Phase 2</h3>
            <span className="ml-auto text-xs text-slate-500">
              {AUFGABEN_P2.filter(a => state.checkedItems.includes(a.id)).length}/{AUFGABEN_P2.length} erledigt
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
            {AUFGABEN_P2.length > 3 && (
              <button onClick={() => setShowAllAufgaben(!showAllAufgaben)} className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white text-xs transition-colors">
                {showAllAufgaben ? <><ChevronUp size={14} /> Weniger anzeigen</> : <><ChevronDown size={14} /> Alle {AUFGABEN_P2.length} Aufgaben anzeigen</>}
              </button>
            )}
          </div>
        </div>

        {/* Tool Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {toolMeta.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setOpenTool(tool.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${openTool === tool.id ? colorMap[tool.badgeColor] : "border-white/10 text-slate-400 hover:text-white hover:border-white/20 bg-white/3"}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-white/8">{tool.badge}</span>
              {tool.name}
              <span className="text-slate-600 text-xs">{tool.dauer}</span>
            </button>
          ))}
        </div>

        {/* Active Tool Panel */}
        {toolMeta.map((tool) => {
          if (tool.id !== openTool) return null;
          const tasks = promptMap[tool.id] ?? [];
          return (
            <div key={tool.id} className="border border-white/8 rounded-xl overflow-hidden mb-8">
              <div className="flex items-start gap-4 p-5 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 border ${colorMap[tool.badgeColor]}`} style={{ fontFamily: "Outfit, sans-serif" }}>{tool.badge}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-base" style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</h3>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-semibold transition-colors ${colorMap[tool.badgeColor]} hover:opacity-80`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      <ExternalLink size={10} /> Öffnen
                    </a>
                    <span className="text-xs text-slate-500">{tool.dauer}</span>
                  </div>
                  <p className={`text-xs font-medium mb-1 ${iconColorMap[tool.badgeColor]}`}>{tool.tagline}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{tool.desc}</p>
                </div>
              </div>
              <div className="p-5 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                <h4 className="text-white font-semibold text-xs mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {tasks.length} Prompts für {selectedFach.label}{state.pruefungsthema ? ` – ${state.pruefungsthema}` : ""}:
                </h4>
                {tasks.map((task, idx) => {
                  const taskId = `phase2-${tool.id}-${idx}`;
                  const isOpen = openTask === taskId;
                  const checked = state.checkedItems.includes(taskId);
                  return (
                    <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${checked ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/8 bg-white/2"}`}>
                      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpenTask(isOpen ? null : taskId)}>
                        <button
                          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-emerald-500/50"}`}
                          onClick={(e) => { e.stopPropagation(); toggleCheckedItem(taskId); }}
                        >
                          {checked && <CheckCircle size={12} className="text-white" />}
                        </button>
                        <span className={`text-sm font-semibold flex-1 ${checked ? "text-slate-400 line-through" : "text-white"}`} style={{ fontFamily: "Outfit, sans-serif" }}>{task.title}</span>
                        {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-white/8 pt-3">
                          <pre className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-white/3 rounded-lg p-3 border border-white/8 mb-3">{task.prompt}</pre>
                          <button
                            onClick={() => copyPrompt(task.prompt)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${colorMap[tool.badgeColor]} hover:opacity-80`}
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            <Copy size={11} /> Prompt kopieren
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

        {/* Kollaborations-Tools */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <Brain size={16} className="text-amber-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Weitere kostenlose Kollaborations-Tools</h3>
          </div>
          <div className="p-5 grid md:grid-cols-3 gap-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {[
              { name: "Excalidraw", url: "https://excalidraw.com", desc: "Kollaboratives Whiteboard für Mindmaps. Kein Konto nötig, einfach Link teilen.", use: "Mindmap des Prüfungsstoffs", color: "amber" },
              { name: "Miro (Gratis)", url: "https://miro.com", desc: "Professionelles Whiteboard mit Vorlagen. Gratis-Plan für 3 Boards.", use: "Strukturierte Visualisierungen", color: "emerald" },
              { name: "Quizlet", url: "https://quizlet.com", desc: "Digitale Lernkarten mit Spielmodus. Gratis-Version ausreichend.", use: "Fachbegriffe einprägen", color: "violet" },
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
            <p className="text-amber-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Tipp: Feynman-Methode für tiefes Verstehen</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Erklärt euch die wichtigsten Konzepte gegenseitig mit eigenen Worten – ohne Notizen. Was ihr nicht einfach erklären könnt, habt ihr noch nicht wirklich verstanden. Nutzt ChatGPT, um eure Erklärungen zu überprüfen und zu verbessern.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <Link href="/phase/1">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 text-xs font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
              <ArrowLeft size={13} /> Phase 1
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { completePhase(2); toast.success("Phase 2 als abgeschlossen markiert!"); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/15 text-slate-400 hover:text-white hover:border-white/30"}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <CheckCircle size={13} />
              {isDone ? "Abgeschlossen ✓" : "Als erledigt markieren"}
            </button>
            <Link href="/phase/3">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm transition-all duration-200" style={{ fontFamily: "Outfit, sans-serif" }}>
                Weiter zu Phase 3 <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
