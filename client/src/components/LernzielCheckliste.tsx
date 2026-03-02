/* ============================================================
   LERNZIEL-CHECKLISTE – Prüfungsnavigator
   Editierbare Lernziele mit Personen-Zuweisung
   Wird in Phase 1 und Druckansicht genutzt
   ============================================================ */
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Target, Plus, Trash2, Edit2, Check, X } from "lucide-react";

export default function LernzielCheckliste() {
  const { state, addLernziel, toggleLernziel, deleteLernziel, updateLernziel } = useApp();
  const [newText, setNewText] = useState("");
  const [newPerson, setNewPerson] = useState<"A" | "B" | "beide">("beide");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    if (!newText.trim()) return;
    addLernziel(newText.trim(), newPerson);
    setNewText("");
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) updateLernziel(id, editText.trim());
    setEditingId(null);
  };

  const doneCount = state.lernziele.filter((z) => z.done).length;
  const total = state.lernziele.length;

  const personColor = (p: "A" | "B" | "beide") => {
    if (p === "A") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    if (p === "B") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    return "bg-purple-500/20 text-purple-300 border-purple-500/30";
  };

  const personLabel = (p: "A" | "B" | "beide") => {
    if (p === "A") return state.personA;
    if (p === "B") return state.personB;
    return "Beide";
  };

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <Target size={14} className="text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Lernziele</h3>
          <p className="text-slate-400 text-xs">Was wollen wir nach dieser Session können?</p>
        </div>
        {total > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-400">{doneCount}/{total}</span>
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3" style={{ background: "oklch(0.175 0.028 264.695)" }}>
        {/* Lernziel-Liste */}
        {state.lernziele.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-4">
            Noch keine Lernziele definiert. Füge dein erstes Lernziel hinzu!
          </p>
        ) : (
          <div className="space-y-2">
            {state.lernziele.map((ziel) => (
              <div
                key={ziel.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  ziel.done ? "border-white/5 bg-white/2 opacity-60" : "border-white/8 bg-white/3"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleLernziel(ziel.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    ziel.done
                      ? "bg-violet-500 border-violet-500 text-white"
                      : "border-white/20 hover:border-violet-500/50"
                  }`}
                >
                  {ziel.done && <Check size={11} />}
                </button>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  {editingId === ziel.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(ziel.id); if (e.key === "Escape") setEditingId(null); }}
                        className="flex-1 bg-transparent border-b border-violet-500/50 text-white text-xs outline-none py-0.5"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(ziel.id)} className="text-violet-400"><Check size={12} /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-500"><X size={12} /></button>
                    </div>
                  ) : (
                    <p className={`text-xs leading-relaxed ${ziel.done ? "line-through text-slate-500" : "text-slate-300"}`}>
                      {ziel.text}
                    </p>
                  )}
                  <span className={`inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-xs border ${personColor(ziel.person)}`} style={{ fontFamily: "Outfit, sans-serif", fontSize: "10px" }}>
                    {personLabel(ziel.person)}
                  </span>
                </div>

                {/* Aktionen */}
                {editingId !== ziel.id && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(ziel.id, ziel.text)} className="text-slate-600 hover:text-slate-400 transition-colors p-0.5">
                      <Edit2 size={11} />
                    </button>
                    <button onClick={() => deleteLernziel(ziel.id)} className="text-slate-600 hover:text-rose-400 transition-colors p-0.5">
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Neues Lernziel hinzufügen */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 bg-white/3 focus-within:border-violet-500/50 transition-colors">
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Neues Lernziel eingeben..."
              className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-slate-600"
            />
          </div>
          {/* Person-Auswahl */}
          <select
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value as "A" | "B" | "beide")}
            className="px-2 py-2 rounded-lg border border-white/10 bg-white/3 text-slate-300 text-xs outline-none cursor-pointer"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <option value="beide">Beide</option>
            <option value="A">{state.personA}</option>
            <option value="B">{state.personB}</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <Plus size={13} />
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}
