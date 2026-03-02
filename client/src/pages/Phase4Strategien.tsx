/* ============================================================
   PHASE 4 – LERNSTRATEGIEN & MOTIVATION (40–50 Min.)
   Design: Functional Futurism
   Basiert auf: Selbstlernheft_Lernstrategien.docx
   ============================================================ */
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/contexts/AppContext";
import {
  BookOpen, ArrowLeft, ArrowRight, CheckCircle, Copy,
  ChevronDown, ChevronUp, Lightbulb, Clock, Users,
  Target, Zap, BarChart2
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Text kopiert!"));
};

const STRATEGIEN = [
  {
    id: "feynman",
    emoji: "🧠",
    name: "Feynman-Methode",
    kurz: "Erkläre es einfach",
    farbe: "cyan",
    zeit: "10–15 Min.",
    wann: "Wenn du ein Konzept wirklich verstehen willst",
    schritte: [
      "Wähle ein Konzept, das du lernen möchtest.",
      "Erkläre es schriftlich oder mündlich, als würdest du es einem Kind erklären – ohne Fachbegriffe.",
      "Identifiziere, wo deine Erklärung stockt oder lückenhaft ist.",
      "Gehe zurück zu den Quellen und schliesse die Lücken.",
      "Vereinfache deine Erklärung weiter, bis sie wirklich klar ist.",
    ],
    prompt: `Ich erkläre dir jetzt das Konzept "[KONZEPT]" in meinen eigenen Worten: [DEINE ERKLÄRUNG]. Bitte gib mir Feedback: Was habe ich richtig erklärt? Was fehlt oder ist ungenau? Wie kann ich es noch einfacher erklären?`,
    tipp: "Wenn du es nicht einfach erklären kannst, hast du es noch nicht wirklich verstanden.",
  },
  {
    id: "retrieval",
    emoji: "🎯",
    name: "Retrieval Practice",
    kurz: "Aktives Abrufen",
    farbe: "emerald",
    zeit: "15–20 Min.",
    wann: "Täglich, besonders 1–2 Tage nach dem Lernen",
    schritte: [
      "Lege alle Unterlagen beiseite.",
      "Schreibe alles auf, was du zu einem Thema weisst – ohne nachzuschauen.",
      "Vergleiche deine Notizen mit den Unterlagen und markiere Lücken.",
      "Fokussiere die nächste Lerneinheit auf die markierten Lücken.",
      "Wiederhole den Prozess nach 1–2 Tagen.",
    ],
    prompt: `Ich habe gerade Retrieval Practice zu "[THEMA]" gemacht. Hier sind meine Notizen aus dem Gedächtnis: [DEINE NOTIZEN]. Bitte vergleiche sie mit dem korrekten Wissen zu diesem Thema. Was fehlt? Was ist ungenau? Was habe ich gut beherrscht?`,
    tipp: "Das Gefühl, sich nicht erinnern zu können, ist normal – genau dann wird das Gedächtnis trainiert.",
  },
  {
    id: "spacing",
    emoji: "📅",
    name: "Spacing",
    kurz: "Verteile das Lernen",
    farbe: "amber",
    zeit: "Je 20–30 Min. über mehrere Tage",
    wann: "Für die gesamte Prüfungsvorbereitung",
    schritte: [
      "Teile den Stoff in kleinere Einheiten auf.",
      "Lerne täglich 20–30 Minuten statt einmal 3 Stunden.",
      "Wiederhole ältere Themen regelmässig (nach 1 Tag, 3 Tagen, 1 Woche).",
      "Nutze den 21-Tage-Lerntracker, um deine Lerneinheiten zu dokumentieren.",
      "Plane Pausen ein – Schlaf ist entscheidend für die Gedächtniskonsolidierung.",
    ],
    prompt: `Ich habe noch [ANZAHL] Tage bis zur Prüfung in [FACH] zu "[THEMA]". Mein Stoff umfasst: [THEMEN]. Erstelle mir einen Lernplan mit verteiltem Lernen. Max. 30 Min./Tag. Berücksichtige Wiederholungsintervalle (1 Tag, 3 Tage, 1 Woche).`,
    tipp: "Kurze tägliche Lerneinheiten sind deutlich effektiver als langes Lernen kurz vor der Prüfung.",
  },
  {
    id: "wenn-dann",
    emoji: "⚡",
    name: "Wenn-Dann-Planung",
    kurz: "Konkrete Handlungspläne",
    farbe: "violet",
    zeit: "5 Min. Planung, dann täglich",
    wann: "Wenn du Schwierigkeiten hast, mit dem Lernen anzufangen",
    schritte: [
      "Formuliere konkrete Wenn-Dann-Sätze für deine Lernvorhaben.",
      "Beispiel: 'Wenn ich nach Hause komme, dann lerne ich 25 Minuten Biologie.'",
      "Verknüpfe das Lernen mit einem festen Ort, einer Zeit oder einer Routine.",
      "Plane auch Wenn-Dann-Sätze für Hindernisse.",
      "Schreibe deine Wenn-Dann-Pläne auf und hänge sie sichtbar auf.",
    ],
    prompt: `Ich möchte meine Lerngewohnheiten verbessern. Meine typischen Hindernisse sind: [HINDERNISSE]. Erstelle für mich 5 konkrete Wenn-Dann-Pläne, die mir helfen, regelmässig für [FACH] zu lernen.`,
    tipp: "Konkrete Pläne ('Wann, Wo, Wie') werden dreimal häufiger umgesetzt als vage Vorsätze.",
  },
  {
    id: "elaboration",
    emoji: "🔗",
    name: "Elaboration",
    kurz: "Verknüpfe neues Wissen",
    farbe: "rose",
    zeit: "10–15 Min.",
    wann: "Nach dem Lesen neuer Inhalte",
    schritte: [
      "Lies einen neuen Abschnitt in deinen Unterlagen.",
      "Stelle dir die Frage: 'Warum ist das so? Wie funktioniert das genau?'",
      "Verbinde das neue Wissen mit dem, was du bereits weisst.",
      "Suche nach Beispielen aus dem Alltag oder aus anderen Fächern.",
      "Erkläre die Verbindungen deiner Lernpartnerin / deinem Lernpartner.",
    ],
    prompt: `Ich habe gerade das Konzept "[KONZEPT]" aus [FACH] gelernt. Hilf mir, es mit meinem Vorwissen zu verknüpfen: Welche Verbindungen gibt es zu anderen Konzepten? Welche Alltagsbeispiele gibt es? Warum ist dieses Konzept wichtig?`,
    tipp: "Je mehr Verbindungen du zu einem Konzept herstellst, desto besser kannst du es abrufen.",
  },
  {
    id: "interleaving",
    emoji: "🔀",
    name: "Interleaving",
    kurz: "Wechsle zwischen Themen",
    farbe: "teal",
    zeit: "Je 15–20 Min. pro Thema",
    wann: "Wenn du mehrere Themen gleichzeitig lernst",
    schritte: [
      "Teile deine Lernzeit in Blöcke von 15–20 Minuten auf.",
      "Wechsle nach jedem Block das Thema (A → B → C → A).",
      "Nutze den Pomodoro-Timer in der Sidebar für die Zeitblöcke.",
      "Vermeide es, ein Thema stundenlang am Stück zu lernen.",
      "Überprüfe am Ende jedes Blocks kurz das Gelernte (Retrieval Practice).",
    ],
    prompt: `Ich lerne gerade folgende Themen für [FACH]: [THEMEN]. Erstelle mir einen Lernplan für heute (2 Stunden), der Interleaving nutzt. Wechsle zwischen den Themen in 20-Minuten-Blöcken. Füge kurze Retrieval-Practice-Phasen ein.`,
    tipp: "Interleaving fühlt sich schwieriger an als blockweises Lernen – aber genau das macht es effektiver.",
  },
  {
    id: "mindmap",
    emoji: "🗺️",
    name: "Mindmapping",
    kurz: "Visualisiere Zusammenhänge",
    farbe: "indigo",
    zeit: "15–20 Min.",
    wann: "Zum Strukturieren und Überblicken des Stoffs",
    schritte: [
      "Schreibe das Hauptthema in die Mitte.",
      "Füge Hauptäste für die wichtigsten Unterthemen hinzu.",
      "Ergänze Details, Beispiele und Verbindungen.",
      "Nutze Farben für verschiedene Themenbereiche.",
      "Erstelle die Mindmap aus dem Gedächtnis – ohne Unterlagen – als Test.",
    ],
    prompt: `Erstelle eine textbasierte Mindmap-Struktur zu "[THEMA]" ([FACH]). Zeige: Hauptthema → Hauptäste (5–7) → je 2–3 Unteräste. Ich werde diese Struktur dann in Excalidraw visualisieren.`,
    tipp: "Erstelle die Mindmap zuerst aus dem Gedächtnis, dann vergleiche mit den Unterlagen.",
  },
];

const MOTIVATIONS_STRATEGIEN = [
  { id: "m1", name: "Selbstbestimmungstheorie", desc: "Stärke deine drei Grundbedürfnisse: Autonomie (eigene Entscheidungen), Kompetenz (Fortschritt erleben) und Zugehörigkeit (gemeinsam lernen). Wähle selbst, wie du lernst, feiere kleine Fortschritte und lerne mit anderen.", farbe: "cyan" },
  { id: "m2", name: "Growth Mindset", desc: "Ersetze 'Ich kann das nicht' durch 'Ich kann das noch nicht'. Fehler sind Lernchancen, keine Misserfolge. Fokussiere auf den Prozess, nicht nur auf das Ergebnis.", farbe: "emerald" },
  { id: "m3", name: "Belohnungssystem einrichten", desc: "Setze dir kleine Belohnungen für erreichte Lernziele (z.B. nach 3 abgehakten Aufgaben: 15 Min. Pause, Lieblingssnack). Mache die Belohnung von der Leistung abhängig, nicht von der Zeit.", farbe: "amber" },
  { id: "m4", name: "SMART-Lernziele", desc: "Formuliere Lernziele Spezifisch, Messbar, Attraktiv, Realistisch und Terminiert. Statt 'Ich lerne Biologie' → 'Ich kann bis Freitag die 5 Hauptthemen der Zellbiologie erklären.'", farbe: "violet" },
];

const AUFGABEN_P4 = [
  { id: "p4-a1", title: "Lernstrategie auswählen und anwenden", dauer: "15 Min.", color: "cyan", person: "einzeln", desc: "Jede Person wählt eine Lernstrategie aus der Liste. Wendet sie 15 Minuten lang auf ein Thema aus eurer Prüfungsvorbereitung an. Besprecht danach, was gut funktioniert hat." },
  { id: "p4-a2", title: "Feynman-Methode: Gegenseitig erklären", dauer: "10 Min.", color: "emerald", person: "beide", desc: "Person A erklärt ein Konzept aus dem Prüfungsstoff in einfachen Worten (3 Min.). Person B gibt Feedback: Was war klar? Was fehlte? Dann tauscht die Rollen." },
  { id: "p4-a3", title: "Lernplan mit Spacing erstellen", dauer: "5 Min.", color: "amber", person: "beide", desc: "Nutzt den Spacing-Prompt und erstellt gemeinsam einen Lernplan für die verbleibenden Tage bis zur Prüfung. Tragt die Lerneinheiten in den Lerntracker ein." },
  { id: "p4-a4", title: "Wenn-Dann-Pläne formulieren", dauer: "5 Min.", color: "violet", person: "einzeln", desc: "Jede Person formuliert 3 konkrete Wenn-Dann-Pläne für die eigene Lernroutine. Teilt eure Pläne miteinander und gebt euch gegenseitig Feedback." },
  { id: "p4-a5", title: "Motivationsstrategie auswählen", dauer: "5 Min.", color: "rose", person: "beide", desc: "Lest die Motivationsstrategien durch. Jede Person wählt eine Strategie, die sie in der nächsten Woche ausprobieren möchte. Erklärt euch gegenseitig, warum ihr diese Strategie gewählt habt." },
  { id: "p4-a6", title: "Lerntracker für 21 Tage starten", dauer: "5 Min.", color: "teal", person: "beide", desc: "Markiert die heutigen Lerntage im 21-Tage-Lerntracker. Vereinbart, den Tracker täglich zu aktualisieren. Setzt euch ein gemeinsames Ziel: Wie viele Tage wollt ihr bis zur Prüfung lernen?" },
];

export default function Phase4Strategien() {
  const { state, completePhase, toggleCheckedItem, toggleLerntracker } = useApp();
  const isDone = state.completedPhases.includes(4);
  const [activeStrategie, setActiveStrategie] = useState("feynman");
  const [showAllAufgaben, setShowAllAufgaben] = useState(false);
  const [showAllMotivation, setShowAllMotivation] = useState(false);

  const aktiveStrategie = STRATEGIEN.find(s => s.id === activeStrategie) ?? STRATEGIEN[0];
  const visibleAufgaben = showAllAufgaben ? AUFGABEN_P4 : AUFGABEN_P4.slice(0, 3);
  const lernTage = state.lerntracker.filter(Boolean).length;

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="phase-badge bg-purple-500/20 border border-purple-500/30 text-purple-300">4</div>
            <div>
              <p className="text-purple-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Phase 4 von 5 · 40–50 Min.</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Lernstrategien & Motivation</h1>
            </div>
            <div className="ml-auto flex items-center gap-2 text-slate-500 text-xs">
              <Clock size={12} /><span>40–50 Min.</span>
              <Users size={12} className="ml-2" /><span>Zweiergruppe</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl">
            Lernt <strong className="text-slate-300">7 wissenschaftlich fundierte Lernstrategien</strong> kennen und wendet sie direkt an. Baut eine nachhaltige Lernroutine auf und stärkt eure Motivation für die Prüfungsvorbereitung.
          </p>
        </div>

        {/* Zeitplan */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Strategie anwenden", dauer: "15 Min.", emoji: "🧠" },
            { label: "Feynman gegenseitig", dauer: "10 Min.", emoji: "🗣️" },
            { label: "Lernplan erstellen", dauer: "5 Min.", emoji: "📅" },
            { label: "Wenn-Dann-Pläne", dauer: "5 Min.", emoji: "⚡" },
            { label: "Motivation", dauer: "5 Min.", emoji: "🔥" },
            { label: "Lerntracker", dauer: "5 Min.", emoji: "📊" },
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
            <Target size={16} className="text-purple-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Aufgaben für Phase 4</h3>
            <span className="ml-auto text-xs text-slate-500">
              {AUFGABEN_P4.filter(a => state.checkedItems.includes(a.id)).length}/{AUFGABEN_P4.length} erledigt
            </span>
          </div>
          <div className="p-5 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {visibleAufgaben.map((aufgabe) => {
              const done = state.checkedItems.includes(aufgabe.id);
              return (
                <div key={aufgabe.id} className={`flex gap-3 p-4 rounded-xl border transition-all ${done ? "border-white/5 bg-white/2 opacity-60" : "border-white/8 bg-white/3"}`}>
                  <button
                    onClick={() => toggleCheckedItem(aufgabe.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${done ? "bg-purple-500 border-purple-500 text-white" : "border-white/20 hover:border-purple-500/50"}`}
                  >
                    {done && <CheckCircle size={11} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className={`text-sm font-semibold ${done ? "line-through text-slate-500" : "text-white"}`} style={{ fontFamily: "Outfit, sans-serif" }}>{aufgabe.title}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded border bg-purple-500/10 border-purple-500/20 text-purple-400">{aufgabe.dauer}</span>
                      <span className="text-xs text-slate-500">{aufgabe.person === "beide" ? "👥 Gemeinsam" : "👤 Einzeln"}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{aufgabe.desc}</p>
                  </div>
                </div>
              );
            })}
            {AUFGABEN_P4.length > 3 && (
              <button onClick={() => setShowAllAufgaben(!showAllAufgaben)} className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white text-xs transition-colors">
                {showAllAufgaben ? <><ChevronUp size={14} /> Weniger</> : <><ChevronDown size={14} /> Alle {AUFGABEN_P4.length} Aufgaben</>}
              </button>
            )}
          </div>
        </div>

        {/* Lernstrategien */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <BookOpen size={16} className="text-purple-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>7 Lernstrategien – Wissenschaftlich fundiert</h3>
          </div>
          <div style={{ background: "oklch(0.175 0.028 264.695)" }}>
            <div className="flex overflow-x-auto border-b border-white/8 px-4 pt-3 gap-1">
              {STRATEGIEN.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStrategie(s.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold transition-all border-b-2 ${activeStrategie === s.id ? "text-purple-300 border-purple-400 bg-purple-500/10" : "text-slate-400 border-transparent hover:text-white"}`}
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  <span>{s.emoji}</span>
                  <span className="hidden md:inline">{s.name}</span>
                </button>
              ))}
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                  {aktiveStrategie.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-base mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{aktiveStrategie.name}</h4>
                  <p className="text-purple-400 text-xs font-semibold mb-1">{aktiveStrategie.kurz}</p>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span>⏱ {aktiveStrategie.zeit}</span>
                    <span>📌 {aktiveStrategie.wann}</span>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-white text-xs font-semibold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Schritt-für-Schritt:</p>
                  <ol className="space-y-2">
                    {aktiveStrategie.schritte.map((schritt, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{idx + 1}</span>
                        <p className="text-slate-300 text-xs leading-relaxed">{schritt}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5">
                    <p className="text-purple-300 text-xs font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>💡 Tipp</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{aktiveStrategie.tipp}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-white/8 bg-white/3">
                    <p className="text-white text-xs font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>KI-Prompt für diese Strategie:</p>
                    <p className="text-slate-400 text-xs leading-relaxed italic mb-2">"{aktiveStrategie.prompt.slice(0, 120)}…"</p>
                    <button
                      onClick={() => copyText(aktiveStrategie.prompt)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs hover:bg-purple-500/20 transition-colors"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      <Copy size={10} /> Prompt kopieren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivationsstrategien */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <Zap size={16} className="text-amber-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Motivationsstrategien</h3>
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            {(showAllMotivation ? MOTIVATIONS_STRATEGIEN : MOTIVATIONS_STRATEGIEN.slice(0, 2)).map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <p className="text-amber-300 font-bold text-sm mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{m.name}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
            {MOTIVATIONS_STRATEGIEN.length > 2 && (
              <button onClick={() => setShowAllMotivation(!showAllMotivation)} className="md:col-span-2 flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white text-xs transition-colors">
                {showAllMotivation ? <><ChevronUp size={14} /> Weniger</> : <><ChevronDown size={14} /> Alle {MOTIVATIONS_STRATEGIEN.length} Motivationsstrategien</>}
              </button>
            )}
          </div>
        </div>

        {/* 21-Tage-Lerntracker */}
        <div className="border border-white/8 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
            <BarChart2 size={16} className="text-teal-400" />
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>21-Tage-Lerntracker</h3>
              <p className="text-slate-400 text-xs">Klicke auf einen Tag, um ihn als Lerntag zu markieren</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-teal-400 font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>{lernTage}</p>
              <p className="text-slate-500 text-xs">von 21 Tagen</p>
            </div>
          </div>
          <div className="p-5" style={{ background: "oklch(0.175 0.028 264.695)" }}>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
                <div key={d} className="text-center text-slate-500 text-xs pb-1" style={{ fontFamily: "Outfit, sans-serif" }}>{d}</div>
              ))}
              {state.lerntracker.map((checked, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleLerntracker(idx)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                    checked
                      ? "bg-teal-500 border border-teal-400 text-white shadow-lg shadow-teal-500/20"
                      : "border border-white/10 bg-white/3 text-slate-500 hover:border-teal-500/30 hover:bg-teal-500/5"
                  }`}
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {checked ? "✓" : idx + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500" style={{ width: `${(lernTage / 21) * 100}%` }} />
              </div>
              <span className="text-teal-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{Math.round((lernTage / 21) * 100)}%</span>
            </div>
            {lernTage >= 7 && lernTage < 14 && <p className="text-emerald-400 text-xs mt-2">🎉 Grossartig! Eine Woche Lernen hinter dir!</p>}
            {lernTage >= 14 && lernTage < 21 && <p className="text-emerald-400 text-xs mt-2">🚀 Zwei Wochen! Du bist auf dem besten Weg!</p>}
            {lernTage === 21 && <p className="text-emerald-400 text-xs mt-2">🏆 21 Tage geschafft! Du hast eine echte Lerngewohnheit aufgebaut!</p>}
          </div>
        </div>

        {/* Tipp */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3 mb-8">
          <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Tipp: Kombiniere mehrere Strategien</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Die effektivste Prüfungsvorbereitung kombiniert: <strong className="text-slate-300">Spacing</strong> (verteile das Lernen), <strong className="text-slate-300">Retrieval Practice</strong> (teste dich täglich) und <strong className="text-slate-300">Feynman-Methode</strong> (erkläre gegenseitig). Nutze den Pomodoro-Timer in der Sidebar für strukturierte Lernblöcke.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/8">
          <Link href="/phase/3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 text-xs font-semibold transition-all" style={{ fontFamily: "Outfit, sans-serif" }}>
              <ArrowLeft size={13} /> Phase 3
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { completePhase(4); toast.success("Phase 4 als abgeschlossen markiert!"); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/15 text-slate-400 hover:text-white hover:border-white/30"}`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <CheckCircle size={13} />
              {isDone ? "Abgeschlossen ✓" : "Als erledigt markieren"}
            </button>
            <Link href="/phase/5">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm transition-all duration-200" style={{ fontFamily: "Outfit, sans-serif" }}>
                Weiter zu Phase 5 <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
