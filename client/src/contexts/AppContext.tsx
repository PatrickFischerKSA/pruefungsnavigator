/* ============================================================
   APP CONTEXT – Prüfungsnavigator
   Zentraler State mit localStorage-Persistenz
   - Prüfungsfach-Auswahl
   - Fortschritts-Tracking (abgeschlossene Phasen)
   - Lernjournal-Einträge (Person A + B)
   - Lerntracker (21 Tage)
   - Abgehakte Schritte
   - Session-Archiv (mehrere Lernsessions)
   - Lernziele (editierbare Checkliste)
   - Zwei-Personen-Modus
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

export interface Lernziel {
  id: string;
  text: string;
  done: boolean;
  person: "A" | "B" | "beide";
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
  journalB: JournalEntry;
  fingerFeedback: Record<string, string>;
  fingerFeedbackB: Record<string, string>;
  lernziele: Lernziel[];
  personA: string;
  personB: string;
}

export interface AppState {
  // Zwei-Personen-Modus
  personA: string;
  personB: string;
  activePerson: "A" | "B";
  // Fach
  selectedFachId: string;
  // Fortschritt: welche Phasen wurden abgeschlossen (1–5)
  completedPhases: number[];
  // Abgehakte Aufgaben (phasenübergreifend)
  checkedItems: string[];
  // Lerntracker (21 Tage)
  lerntracker: boolean[];
  // Lernjournal Person A
  journal: JournalEntry;
  // Lernjournal Person B
  journalB: JournalEntry;
  // Finger-Feedback Person A
  fingerFeedback: Record<string, string>;
  // Finger-Feedback Person B
  fingerFeedbackB: Record<string, string>;
  // Prüfungsthema (Freitext)
  pruefungsthema: string;
  // Prüfungsdatum
  pruefungsdatum: string;
  // Archivierte Sessions
  archivedSessions: ArchivedSession[];
  // Lernziele
  lernziele: Lernziel[];
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
  personA: "Person A",
  personB: "Person B",
  activePerson: "A",
  selectedFachId: "allgemein",
  completedPhases: [],
  checkedItems: [],
  lerntracker: new Array(21).fill(false),
  journal: { ...DEFAULT_JOURNAL },
  journalB: { ...DEFAULT_JOURNAL },
  fingerFeedback: {},
  fingerFeedbackB: {},
  pruefungsthema: "",
  pruefungsdatum: "",
  archivedSessions: [],
  lernziele: [],
};

// ─── Context ─────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  selectedFach: Fach;
  setFach: (id: string) => void;
  setPruefungsthema: (t: string) => void;
  setPruefungsdatum: (d: string) => void;
  setPersonName: (person: "A" | "B", name: string) => void;
  setActivePerson: (person: "A" | "B") => void;
  completePhase: (n: number) => void;
  uncompletePhase: (n: number) => void;
  toggleCheckedItem: (id: string) => void;
  toggleLerntracker: (idx: number) => void;
  updateJournal: (field: keyof JournalEntry, value: string, person?: "A" | "B") => void;
  setFingerFeedback: (label: string, value: string, person?: "A" | "B") => void;
  // Lernziele
  addLernziel: (text: string, person: "A" | "B" | "beide") => void;
  toggleLernziel: (id: string) => void;
  deleteLernziel: (id: string) => void;
  updateLernziel: (id: string, text: string) => void;
  resetAll: () => void;
  archiveAndNewSession: () => void;
  deleteArchivedSession: (id: string) => void;
  progressPercent: number;
  // Aktives Journal (je nach activePerson)
  activeJournal: JournalEntry;
  activeFingerFeedback: Record<string, string>;
  activePersonName: string;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "pruefungsnavigator_state_v4";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Migration von v3/v2
    const rawV3 = localStorage.getItem("pruefungsnavigator_state_v3");
    const rawV2 = localStorage.getItem("pruefungsnavigator_state_v2");
    const rawOld = raw ?? rawV3 ?? rawV2;
    if (!rawOld) return DEFAULT_STATE;
    const parsed = JSON.parse(rawOld) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      journal: { ...DEFAULT_JOURNAL, ...(parsed.journal ?? {}) },
      journalB: { ...DEFAULT_JOURNAL, ...(parsed.journalB ?? {}) },
      lerntracker: Array.isArray(parsed.lerntracker) && parsed.lerntracker.length === 21
        ? parsed.lerntracker : DEFAULT_STATE.lerntracker,
      archivedSessions: Array.isArray(parsed.archivedSessions) ? parsed.archivedSessions : [],
      lernziele: Array.isArray(parsed.lernziele) ? parsed.lernziele : [],
      personA: parsed.personA ?? "Person A",
      personB: parsed.personB ?? "Person B",
      activePerson: parsed.activePerson ?? "A",
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

  useEffect(() => { saveState(state); }, [state]);

  const selectedFach = FAECHER.find((f) => f.id === state.selectedFachId) ?? FAECHER[0];

  const setFach = useCallback((id: string) => setState((p) => ({ ...p, selectedFachId: id })), []);
  const setPruefungsthema = useCallback((t: string) => setState((p) => ({ ...p, pruefungsthema: t })), []);
  const setPruefungsdatum = useCallback((d: string) => setState((p) => ({ ...p, pruefungsdatum: d })), []);

  const setPersonName = useCallback((person: "A" | "B", name: string) => {
    setState((p) => person === "A" ? { ...p, personA: name } : { ...p, personB: name });
  }, []);

  const setActivePerson = useCallback((person: "A" | "B") => {
    setState((p) => ({ ...p, activePerson: person }));
  }, []);

  const completePhase = useCallback((n: number) => {
    setState((p) => ({
      ...p,
      completedPhases: p.completedPhases.includes(n) ? p.completedPhases : [...p.completedPhases, n],
    }));
  }, []);

  const uncompletePhase = useCallback((n: number) => {
    setState((p) => ({ ...p, completedPhases: p.completedPhases.filter((x) => x !== n) }));
  }, []);

  const toggleCheckedItem = useCallback((id: string) => {
    setState((p) => ({
      ...p,
      checkedItems: p.checkedItems.includes(id) ? p.checkedItems.filter((i) => i !== id) : [...p.checkedItems, id],
    }));
  }, []);

  const toggleLerntracker = useCallback((idx: number) => {
    setState((p) => {
      const next = [...p.lerntracker];
      next[idx] = !next[idx];
      return { ...p, lerntracker: next };
    });
  }, []);

  const updateJournal = useCallback((field: keyof JournalEntry, value: string, person?: "A" | "B") => {
    setState((p) => {
      const who = person ?? p.activePerson;
      if (who === "B") return { ...p, journalB: { ...p.journalB, [field]: value } };
      return { ...p, journal: { ...p.journal, [field]: value } };
    });
  }, []);

  const setFingerFeedback = useCallback((label: string, value: string, person?: "A" | "B") => {
    setState((p) => {
      const who = person ?? p.activePerson;
      if (who === "B") return { ...p, fingerFeedbackB: { ...p.fingerFeedbackB, [label]: value } };
      return { ...p, fingerFeedback: { ...p.fingerFeedback, [label]: value } };
    });
  }, []);

  // Lernziele
  const addLernziel = useCallback((text: string, person: "A" | "B" | "beide") => {
    setState((p) => ({
      ...p,
      lernziele: [...p.lernziele, { id: Date.now().toString(), text, done: false, person }],
    }));
  }, []);

  const toggleLernziel = useCallback((id: string) => {
    setState((p) => ({
      ...p,
      lernziele: p.lernziele.map((z) => z.id === id ? { ...z, done: !z.done } : z),
    }));
  }, []);

  const deleteLernziel = useCallback((id: string) => {
    setState((p) => ({ ...p, lernziele: p.lernziele.filter((z) => z.id !== id) }));
  }, []);

  const updateLernziel = useCallback((id: string, text: string) => {
    setState((p) => ({
      ...p,
      lernziele: p.lernziele.map((z) => z.id === id ? { ...z, text } : z),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
    ["pruefungsnavigator_state_v4", "pruefungsnavigator_state_v3", "pruefungsnavigator_state_v2"].forEach((k) => localStorage.removeItem(k));
  }, []);

  const archiveAndNewSession = useCallback(() => {
    setState((p) => {
      const archived: ArchivedSession = {
        id: Date.now().toString(),
        archivedAt: new Date().toISOString(),
        selectedFachId: p.selectedFachId,
        pruefungsthema: p.pruefungsthema,
        pruefungsdatum: p.pruefungsdatum,
        completedPhases: p.completedPhases,
        lerntracker: p.lerntracker,
        journal: p.journal,
        journalB: p.journalB,
        fingerFeedback: p.fingerFeedback,
        fingerFeedbackB: p.fingerFeedbackB,
        lernziele: p.lernziele,
        personA: p.personA,
        personB: p.personB,
      };
      return { ...DEFAULT_STATE, archivedSessions: [archived, ...p.archivedSessions] };
    });
  }, []);

  const deleteArchivedSession = useCallback((id: string) => {
    setState((p) => ({ ...p, archivedSessions: p.archivedSessions.filter((s) => s.id !== id) }));
  }, []);

  const progressPercent = Math.round((state.completedPhases.length / 5) * 100);

  const activeJournal = state.activePerson === "B" ? state.journalB : state.journal;
  const activeFingerFeedback = state.activePerson === "B" ? state.fingerFeedbackB : state.fingerFeedback;
  const activePersonName = state.activePerson === "B" ? state.personB : state.personA;

  return (
    <AppContext.Provider value={{
      state, selectedFach,
      setFach, setPruefungsthema, setPruefungsdatum,
      setPersonName, setActivePerson,
      completePhase, uncompletePhase,
      toggleCheckedItem, toggleLerntracker,
      updateJournal, setFingerFeedback,
      addLernziel, toggleLernziel, deleteLernziel, updateLernziel,
      resetAll, archiveAndNewSession, deleteArchivedSession,
      progressPercent,
      activeJournal, activeFingerFeedback, activePersonName,
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
