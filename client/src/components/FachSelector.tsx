/* ============================================================
   FACH-SELEKTOR – Prüfungsnavigator
   Dropdown für Prüfungsfach + Freitext Thema + Datum
   ============================================================ */
import { useState } from "react";
import { useApp, FAECHER } from "@/contexts/AppContext";
import { ChevronDown, Calendar, BookOpen, X } from "lucide-react";

export default function FachSelector() {
  const { state, selectedFach, setFach, setPruefungsthema, setPruefungsdatum } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/8 rounded-xl p-4 mb-6" style={{ background: "oklch(0.208 0.028 264.364)" }}>
      <div className="flex flex-wrap gap-4 items-end">
        {/* Fach-Dropdown */}
        <div className="flex-1 min-w-[180px]">
          <label className="text-slate-400 text-xs mb-1.5 block" style={{ fontFamily: "Outfit, sans-serif" }}>
            Prüfungsfach
          </label>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:border-white/25 text-white text-sm font-medium transition-colors text-left"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <span className="text-base">{selectedFach.emoji}</span>
              <span className="flex-1">{selectedFach.label}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-white/15 overflow-hidden z-50"
                style={{ background: "oklch(0.175 0.028 264.695)" }}
              >
                {FAECHER.map((fach) => (
                  <button
                    key={fach.id}
                    onClick={() => { setFach(fach.id); setOpen(false); }}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors
                      ${state.selectedFachId === fach.id
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "text-slate-300 hover:bg-white/5"
                      }
                    `}
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    <span className="text-base">{fach.emoji}</span>
                    {fach.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prüfungsthema */}
        <div className="flex-[2] min-w-[200px]">
          <label className="text-slate-400 text-xs mb-1.5 block" style={{ fontFamily: "Outfit, sans-serif" }}>
            <BookOpen size={10} className="inline mr-1" />
            Prüfungsthema (optional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={state.pruefungsthema}
              onChange={(e) => setPruefungsthema(e.target.value)}
              placeholder={`z.B. ${selectedFach.themen[0]}, ${selectedFach.themen[1]}`}
              className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors pr-8"
            />
            {state.pruefungsthema && (
              <button
                onClick={() => setPruefungsthema("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Prüfungsdatum */}
        <div className="min-w-[160px]">
          <label className="text-slate-400 text-xs mb-1.5 block" style={{ fontFamily: "Outfit, sans-serif" }}>
            <Calendar size={10} className="inline mr-1" />
            Prüfungsdatum
          </label>
          <input
            type="date"
            value={state.pruefungsdatum}
            onChange={(e) => setPruefungsdatum(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white text-sm focus:outline-none focus:border-cyan-500/40 transition-colors"
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {/* Fach-Kontext-Hinweis */}
      {state.selectedFachId !== "allgemein" && (
        <div className="mt-3 pt-3 border-t border-white/8 flex items-start gap-2">
          <span className="text-cyan-400 text-xs font-semibold flex-shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>
            Tipp für {selectedFach.label}:
          </span>
          <span className="text-slate-400 text-xs">{selectedFach.promptHinweis}</span>
        </div>
      )}

      {/* Countdown */}
      {state.pruefungsdatum && (() => {
        const diff = Math.ceil((new Date(state.pruefungsdatum).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return null;
        return (
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-bold ${diff <= 3 ? "text-rose-400" : diff <= 7 ? "text-amber-400" : "text-emerald-400"}`} style={{ fontFamily: "Outfit, sans-serif" }}>
              ⏱ Noch {diff} Tag{diff !== 1 ? "e" : ""} bis zur Prüfung
            </span>
          </div>
        );
      })()}
    </div>
  );
}
