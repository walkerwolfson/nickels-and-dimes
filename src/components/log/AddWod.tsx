"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { WODS, EXERCISE_BY_ID, type Wod } from "@/lib/domain";
import type { SessionItem } from "@/components/log/LogFlow";

export function AddWod({
  onAdd,
  onClose,
}: {
  onAdd: (item: SessionItem) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Wod | null>(null);
  const [rounds, setRounds] = useState("");
  const [partial, setPartial] = useState<Record<string, string>>({});

  if (!selected) {
    return (
      <div className="absolute inset-0 z-30 flex flex-col" style={{ background: "var(--bg)" }}>
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h1 className="font-display text-[22px] uppercase text-text">Named workout</h1>
          <button onClick={onClose} className="text-text-dim">
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-3 px-5">
          {WODS.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelected(w)}
              className="flex flex-col items-start rounded-xl border border-border bg-surface px-5 py-4 text-left"
            >
              <span className="font-display text-lg uppercase text-text">{w.name}</span>
              <span className="mt-1 font-data text-xs text-text-faint">{w.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function handleAdd() {
    if (!selected) return;
    const totals = selected.fixed
      ? selected.convert(0)
      : selected.convert(parseInt(rounds || "0", 10), {
          pullups: parseInt(partial.pullups || "0", 10),
          pushups: parseInt(partial.pushups || "0", 10),
          squats: parseInt(partial.squats || "0", 10),
        });
    const totalReps = Object.values(totals).reduce((a, b) => a + b, 0);
    const label = selected.fixed
      ? `${selected.name} — completed`
      : `${selected.name} — ${rounds} round${rounds === "1" ? "" : "s"}`;
    const breakdown: SessionItem["breakdown"] = {};
    Object.entries(totals).forEach(([exId, reps]) => {
      breakdown[exId] = { name: EXERCISE_BY_ID[exId]?.name ?? exId, unit: "reps", value: reps };
    });
    onAdd({ id: crypto.randomUUID(), label, totalReps, breakdown });
  }

  const canSubmit = selected.fixed || !!rounds;

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="font-display text-[22px] uppercase text-text">{selected.name}</h1>
        <button onClick={onClose} className="text-text-dim">
          <X size={22} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-6 px-5">
        <span className="text-[13px] text-text-dim">{selected.desc}</span>

        {selected.fixed ? (
          <span className="mt-5 text-center font-data text-[13px] text-text-dim">
            Adding this includes the full {selected.name} totals in your workout.
          </span>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <input
                autoFocus
                value={rounds}
                onChange={(e) => setRounds(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="0"
                className="w-full border-none bg-transparent text-center font-display text-[52px] text-text outline-none"
              />
              <span className="font-data text-xs tracking-wide text-text-dim">
                {selected.id === "cindy" ? "FULL ROUNDS" : "ROUNDS COMPLETED"}
              </span>
            </div>
            {selected.id === "cindy" && (
              <div>
                <span className="font-data text-[11px] tracking-wide text-text-dim">PARTIAL ROUND (OPTIONAL)</span>
                <div className="mt-2 flex gap-3">
                  {["pullups", "pushups", "squats"].map((k) => (
                    <div key={k} className="flex flex-1 flex-col items-center">
                      <input
                        value={partial[k] || ""}
                        onChange={(e) => setPartial((p) => ({ ...p, [k]: e.target.value.replace(/[^0-9]/g, "") }))}
                        placeholder="0"
                        className="w-full rounded-lg border border-border bg-surface py-1.5 text-center font-display text-xl text-text"
                      />
                      <span className="mt-1 font-data text-[9px] uppercase text-text-faint">{k}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <button
        disabled={!canSubmit}
        onClick={handleAdd}
        className="mx-5 mb-8 py-4 font-display text-base uppercase text-white"
        style={{ background: "var(--purple)", borderRadius: 12, opacity: canSubmit ? 1 : 0.4 }}
      >
        Add to workout
      </button>
    </div>
  );
}
