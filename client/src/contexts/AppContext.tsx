/* ============================================================
   APP CONTEXT – Prüfungsnavigator
   Zentraler State mit localStorage-Persistenz
   - Prüfungsfach-Auswahl
   - Fortschritts-Tracking (abgeschlossene Phasen)
   - Lernjournal-Einträge
   - Lerntracker (21 Tage)
   - Abgehakte Schritte
   - Session-Archiv (mehrere Lernsessions)
   ============================================================ */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ─── Fächer ──────────────────────────────────────────────────────────────────
export interface Fach {
  id: string;
  label: string;
  emoji: string;
  themen: string[];
  pruefungsformat: string;
  promptHinweis: string;
}

export const FAECHER: Fach[] = [
  {
    id: "allgemein",
    label: "Allgemein",
    emoji: "📚",
    themen: ["Hauptthema 1", "Hauptthema 2", "Hauptthema 3"],
    pruefungsformat: "schriftliche Prüfung mit Wissens- und Transferfragen",
    promptHinweis: "Ersetze [THEMA] durch dein konkretes Prüfungsthema.",
  },
  {
    id: "biologie",
    label: "Biologie",
    emoji: "🧬",
    themen: ["Zellbiologie", "Genetik", "Ökologie", "Evolution", "Physiologie"],
    pruefungsformat: "schriftliche Prüfung mit Definitionen, Diagrammen und Transferfragen",
    promptHinweis: "Nutze Fachbegriffe auf Latein/Griechisch und erkläre Prozesse mit Diagrammen.",
  },
  {
    id: "geschichte",
    label: "Geschichte",
    emoji: "🏛️",
    themen: ["Ereignisse & Daten", "Ursachen & Folgen", "Quellenkritik", "Epochen", "Persönlichkeiten"],
    pruefungsformat: "Quellenanalyse, Kurzessay und Faktenfragen",
    promptHinweis: "Verknüpfe Ereignisse mit Ursachen, Folgen und historischem Kontext.",
  },
  {
    id: "mathematik",
    label: "Mathematik",
    emoji: "📐",
    themen: ["Algebra", "Geometrie", "Analysis", "Statistik", "Trigonometrie"],
    pruefungsformat: "Rechenaufgaben mit Lösungsweg und Begründung",
    promptHinweis: "Zeige immer den vollständigen Lösungsweg. Erkläre jeden Schritt.",
  },
  {
    id: "deutsch",
    label: "Deutsch",
    emoji: "✍️",
    themen: ["Textanalyse", "Grammatik", "Aufsatz", "Literatur", "Rhetorik"],
    pruefungsformat: "Textanalyse, Erörterung oder kreatives Schreiben",
    promptHinweis: "Achte auf Textbelege (Zitate mit Zeilenangabe) und strukturierte Argumentation.",
  },
  {
    id: "englisch",
    label: "Englisch",
    emoji: "🌍",
    themen: ["Grammar", "Vocabulary", "Text Analysis", "Writing", "Listening"],
    pruefungsformat: "Reading comprehension, essay writing and grammar exercises",
    promptHinweis: "Use academic vocabulary. Provide examples for grammar rules.",
  },
  {
    id: "psychologie",
    label: "Psychologie",
    emoji: "🧠",
    themen: ["Lerntheorien", "Entwicklungspsychologie", "Sozialpsychologie", "Kognition", "Motivation"],
    pruefungsformat: "Fallstudien, Theorienvergleich und Anwendungsaufgaben",
    promptHinweis: "Verknüpfe Theorien mit konkreten Fallbeispielen aus dem Schulalltag.",
  },
  {
    id: "paedagogik",
    label: "Pädagogik",
    emoji: "👩‍🏫",
    themen: ["Lerntheorien", "Unterrichtsmethoden", "Entwicklungsphasen", "Inklusion", "Didaktik"],
    pruefungsformat: "Fallanalysen, Unterrichtsplanung und Theorienvergleich",
    promptHinweis: "Beziehe dich auf konkrete Unterrichtssituationen und pädagogische Konzepte.",
  },
  {
    id: "wirtschaft",
    label: "Wirtschaft & Recht",
    emoji: "💼",
    themen: ["Volkswirtschaft", "Betriebswirtschaft", "Recht", "Finanzen", "Marketing"],
    pruefungsformat: "Fallstudien, Berechnungen und Rechtsfragen",
    promptHinweis: "Nutze wirtschaftliche Fachbegriffe und beziehe dich auf aktuelle Beispiele.",
  },
];

// ─── State-Typen ─────────────────────────────────────────────────────────────
export interface JournalEntry {
  date: string;
  gelernt: string;
  schwierigkeit: string;
  naechsterSchritt: string;
  wasHatFunktioniert: string;
  wasAendereIch: string;
  wasBehaltIchBei: string;
}

export interface ArchivedSession {
  id: string;
  archivedAt: string;
  selectedFachId: string;
  pruefungsthema: string;
  pruefungsdatum: string;
  completedPhases: number[];
  lerntracker: boolean[];
  journal: JournalEntry;
  fingerFeedback: Record<string, string>;
}

export interface AppState {
  // Fach
  selectedFachId: string;
  // Fortschritt: welche Phasen wurden abgeschlossen (1–5)
  completedPhases: number[];
  // Abgehakte Aufgaben (phasenübergreifend)
  checkedItems: string[];
  // Lerntracker (21 Tage)
  lerntracker: boolean[];
  // Lernjournal
  journal: JournalEntry;
  // Finger-Feedback
  fingerFeedback: Record<string, string>;
  // Prüfungsthema (Freitext)
  pruefungsthema: string;
  // Prüfungsdatum
  pruefungsdatum: string;
  // Archivierte Sessions
  archivedSessions: ArchivedSession[];
}

const DEFAULT_JOURNAL: JournalEntry = {
  date: new Date().toISOString().slice(0, 10),
  gelernt: "",
  schwierigkeit: "",
  naechsterSchritt: "",
  wasHatFunktioniert: "",
  wasAendereIch: "",
  wasBehaltIchBei: "",
};

const DEFAULT_STATE: AppState = {
  selectedFachId: "allgemein",
  completedPhases: [],
  checkedItems: [],
  lerntracker: new Array(21).fill(false),
  journal: { ...DEFAULT_JOURNAL },
  fingerFeedback: {},
  pruefungsthema: "",
  pruefungsdatum: "",
  archivedSessions: [],
};

// ─── Context ─────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  selectedFach: Fach;
  setFach: (id: string) => void;
  setPruefungsthema: (t: string) => void;
  setPruefungsdatum: (d: string) => void;
  completePhase: (n: number) => void;
  uncompletePhase: (n: number) => void;
  toggleCheckedItem: (id: string) => void;
  toggleLerntracker: (idx: number) => void;
  updateJournal: (field: keyof JournalEntry, value: string) => void;
  setFingerFeedback: (label: string, value: string) => void;
  resetAll: () => void;
  archiveAndNewSession: () => void;
  deleteArchivedSession: (id: string) => void;
  progressPercent: number;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "pruefungsnavigator_state_v3";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Migration von v2
    const rawV2 = localStorage.getItem("pruefungsnavigator_state_v2");
    if (!raw && rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<AppState>;
      return {
        ...DEFAULT_STATE,
        ...parsed,
        journal: { ...DEFAULT_JOURNAL, ...(parsed.journal ?? {}) },
        lerntracker: Array.isArray(parsed.lerntracker) && parsed.lerntracker.length === 21
          ? parsed.lerntracker : DEFAULT_STATE.lerntracker,
        archivedSessions: [],
      };
    }
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      journal: { ...DEFAULT_JOURNAL, ...(parsed.journal ?? {}) },
      lerntracker: Array.isArray(parsed.lerntracker) && parsed.lerntracker.length === 21
        ? parsed.lerntracker : DEFAULT_STATE.lerntracker,
      archivedSessions: Array.isArray(parsed.archivedSessions) ? parsed.archivedSessions : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Persist on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const selectedFach = FAECHER.find((f) => f.id === state.selectedFachId) ?? FAECHER[0];

  const setFach = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedFachId: id }));
  }, []);

  const setPruefungsthema = useCallback((t: string) => {
    setState((prev) => ({ ...prev, pruefungsthema: t }));
  }, []);

  const setPruefungsdatum = useCallback((d: string) => {
    setState((prev) => ({ ...prev, pruefungsdatum: d }));
  }, []);

  const completePhase = useCallback((n: number) => {
    setState((prev) => ({
      ...prev,
      completedPhases: prev.completedPhases.includes(n)
        ? prev.completedPhases
        : [...prev.completedPhases, n],
    }));
  }, []);

  const uncompletePhase = useCallback((n: number) => {
    setState((prev) => ({
      ...prev,
      completedPhases: prev.completedPhases.filter((p) => p !== n),
    }));
  }, []);

  const toggleCheckedItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      checkedItems: prev.checkedItems.includes(id)
        ? prev.checkedItems.filter((i) => i !== id)
        : [...prev.checkedItems, id],
    }));
  }, []);

  const toggleLerntracker = useCallback((idx: number) => {
    setState((prev) => {
      const next = [...prev.lerntracker];
      next[idx] = !next[idx];
      return { ...prev, lerntracker: next };
    });
  }, []);

  const updateJournal = useCallback((field: keyof JournalEntry, value: string) => {
    setState((prev) => ({
      ...prev,
      journal: { ...prev.journal, [field]: value },
    }));
  }, []);

  const setFingerFeedback = useCallback((label: string, value: string) => {
    setState((prev) => ({
      ...prev,
      fingerFeedback: { ...prev.fingerFeedback, [label]: value },
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("pruefungsnavigator_state_v2");
  }, []);

  // Aktuelle Session archivieren und neue starten
  const archiveAndNewSession = useCallback(() => {
    setState((prev) => {
      const archived: ArchivedSession = {
        id: Date.now().toString(),
        archivedAt: new Date().toISOString(),
        selectedFachId: prev.selectedFachId,
        pruefungsthema: prev.pruefungsthema,
        pruefungsdatum: prev.pruefungsdatum,
        completedPhases: prev.completedPhases,
        lerntracker: prev.lerntracker,
        journal: prev.journal,
        fingerFeedback: prev.fingerFeedback,
      };
      return {
        ...DEFAULT_STATE,
        archivedSessions: [archived, ...prev.archivedSessions],
      };
    });
  }, []);

  const deleteArchivedSession = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      archivedSessions: prev.archivedSessions.filter((s) => s.id !== id),
    }));
  }, []);

  const progressPercent = Math.round((state.completedPhases.length / 5) * 100);

  return (
    <AppContext.Provider value={{
      state,
      selectedFach,
      setFach,
      setPruefungsthema,
      setPruefungsdatum,
      completePhase,
      uncompletePhase,
      toggleCheckedItem,
      toggleLerntracker,
      updateJournal,
      setFingerFeedback,
      resetAll,
      archiveAndNewSession,
      deleteArchivedSession,
      progressPercent,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
