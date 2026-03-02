/* ============================================================
   PERSONEN-MODUS – Prüfungsnavigator
   Zwei-Personen-Modus: Namen eingeben, aktive Person wählen
   ============================================================ */
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Users, Edit2, Check } from "lucide-react";

export default function PersonenModus() {
  const { state, setPersonName, setActivePerson } = useApp();
  const [editingA, setEditingA] = useState(false);
  const [editingB, setEditingB] = useState(false);
  const [nameA, setNameA] = useState(state.personA);
  const [nameB, setNameB] = useState(state.personB);

  const saveA = () => { setPersonName("A", nameA || "Person A"); setEditingA(false); };
  const saveB = () => { setPersonName("B", nameB || "Person B"); setEditingB(false); };

  return (
    <div className="border border-white/8 rounded-xl p-4 bg-white/2">
      <div className="flex items-center gap-2 mb-3">
        <Users size={14} className="text-purple-400" />
        <span className="text-white text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Lernteam</span>
        <span className="ml-auto text-xs text-slate-500">Aktive Person wählen</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Person A */}
        <button
          onClick={() => setActivePerson("A")}
          className={`relative flex flex-col items-start gap-1.5 p-3 rounded-xl border transition-all duration-200 text-left ${
            state.activePerson === "A"
              ? "border-cyan-500/50 bg-cyan-500/10"
              : "border-white/8 bg-white/2 hover:border-white/20"
          }`}
        >
          <div className="flex items-center gap-2 w-full">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              state.activePerson === "A" ? "bg-cyan-500 text-slate-900" : "bg-white/10 text-slate-400"
            }`} style={{ fontFamily: "Outfit, sans-serif" }}>A</div>
            {state.activePerson === "A" && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </div>
          {editingA ? (
            <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
              <input
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveA()}
                className="flex-1 bg-transparent border-b border-cyan-500/50 text-white text-xs outline-none py-0.5"
                autoFocus
                maxLength={20}
              />
              <button onClick={saveA} className="text-cyan-400 hover:text-cyan-300">
                <Check size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 w-full">
              <span className={`text-xs font-semibold truncate ${state.activePerson === "A" ? "text-white" : "text-slate-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                {state.personA}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setEditingA(true); }}
                className="ml-auto text-slate-600 hover:text-slate-400 transition-colors"
              >
                <Edit2 size={10} />
              </button>
            </div>
          )}
        </button>

        {/* Person B */}
        <button
          onClick={() => setActivePerson("B")}
          className={`relative flex flex-col items-start gap-1.5 p-3 rounded-xl border transition-all duration-200 text-left ${
            state.activePerson === "B"
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-white/8 bg-white/2 hover:border-white/20"
          }`}
        >
          <div className="flex items-center gap-2 w-full">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              state.activePerson === "B" ? "bg-emerald-500 text-slate-900" : "bg-white/10 text-slate-400"
            }`} style={{ fontFamily: "Outfit, sans-serif" }}>B</div>
            {state.activePerson === "B" && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          {editingB ? (
            <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
              <input
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveB()}
                className="flex-1 bg-transparent border-b border-emerald-500/50 text-white text-xs outline-none py-0.5"
                autoFocus
                maxLength={20}
              />
              <button onClick={saveB} className="text-emerald-400 hover:text-emerald-300">
                <Check size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 w-full">
              <span className={`text-xs font-semibold truncate ${state.activePerson === "B" ? "text-white" : "text-slate-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                {state.personB}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setEditingB(true); }}
                className="ml-auto text-slate-600 hover:text-slate-400 transition-colors"
              >
                <Edit2 size={10} />
              </button>
            </div>
          )}
        </button>
      </div>

      <p className="text-slate-600 text-xs mt-2 text-center">
        Journal & Feedback werden pro Person gespeichert
      </p>
    </div>
  );
}
