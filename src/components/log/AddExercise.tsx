"use client";

import { useState } from "react";
import { X, ChevronRight, Plus } from "lucide-react";
import { EXERCISES, EXERCISE_BY_ID, fmtTime, type Exercise } from "@/lib/domain";
import type { SessionItem } from "@/components/log/LogFlow";

type ExerciseSource = Extract<SessionItem["source"], { kind: "exercise" }>;

export function AddExercise({
  initial,
  onAdd,
  onClose,
}: {
  initial?: (SessionItem & { source: ExerciseSource }) | null;
  onAdd: (item: SessionItem) => void;
  onClose: () => void;
}) {
  const initialExercise = initial ? EXERCISE_BY_ID[initial.source.exerciseId] ?? null : null;
  const [selected, setSelected] = useState<Exercise | null>(initialExercise);
  const [repInput, setRepInput] = useState(initial?.source.repInput ?? "");
  const [hours, setHours] = useState(initial?.source.hours ?? "");
  const [minutes, setMinutes] = useState(initial?.source.minutes ?? "");
  const [seconds, setSeconds] = useState(initial?.source.seconds ?? "");
  const [showTime, setShowTime] = useState(initial?.source.showTime ?? false);

  if (!selected) {
    return (
      <div className="absolute inset-0 z-30 flex flex-col" style={{ background: "var(--bg)" }}>
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h1 className="font-display text-[22px] uppercase text-text">Pick a movement</h1>
          <button onClick={onClose} className="text-text-dim">
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto px-5">
          {EXERCISES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelected(ex)}
              className="flex items-center justify-between border-b border-border py-3"
            >
              <span className="text-[15px] text-text">{ex.name}</span>
              <ChevronRight size={16} className="text-text-faint" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const canSubmit = selected.unit === "reps" ? !!repInput : !!hours || !!minutes || !!seconds;
  const durationSec =
    parseInt(hours || "0", 10) * 3600 + parseInt(minutes || "0", 10) * 60 + parseInt(seconds || "0", 10);

  function handleAdd() {
    if (!selected) return;
    const id = initial?.id ?? crypto.randomUUID();
    if (selected.unit === "reps") {
      const reps = parseInt(repInput || "0", 10);
      const label = durationSec > 0 ? `${reps} ${selected.name} · ${fmtTime(durationSec)}` : `${reps} ${selected.name}`;
      onAdd({
        id,
        label,
        totalReps: reps,
        breakdown: { [selected.id]: { name: selected.name, unit: "reps", value: reps } },
        source: { kind: "exercise", exerciseId: selected.id, repInput, hours, minutes, seconds, showTime },
      });
    } else {
      onAdd({
        id,
        label: `${selected.name} — ${fmtTime(durationSec)}`,
        totalReps: 0,
        breakdown: { [selected.id]: { name: selected.name, unit: "time", value: durationSec } },
        source: { kind: "exercise", exerciseId: selected.id, repInput, hours, minutes, seconds, showTime },
      });
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="font-display text-[22px] uppercase text-text">{selected.name}</h1>
        <button onClick={onClose} className="text-text-dim">
          <X size={22} />
        </button>
      </div>

      {selected.unit === "reps" ? (
        <>
          <div className="mt-4 flex flex-col items-center gap-2 px-5">
            <input
              autoFocus
              value={repInput}
              onChange={(e) => setRepInput(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="0"
              className="w-full border-none bg-transparent text-center font-display text-[60px] text-text outline-none"
            />
            <span className="font-data text-xs tracking-wide text-text-dim">REPS</span>
          </div>
          <div className="mt-8 px-5">
            {!showTime ? (
              <button
                onClick={() => setShowTime(true)}
                className="mx-auto flex items-center gap-1.5 font-data text-xs text-text-faint"
              >
                <Plus size={13} /> Add time it took (totally optional)
              </button>
            ) : (
              <>
                <span className="font-data text-[11px] tracking-wide text-text-dim">
                  TIME IT TOOK <span className="text-text-faint">— OPTIONAL, SKIP IF N/A</span>
                </span>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  {[
                    { v: hours, set: setHours, ph: "0" },
                    { v: minutes, set: setMinutes, ph: "00" },
                    { v: seconds, set: setSeconds, ph: "00" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      {i > 0 && <span className="font-display text-2xl text-text-dim">:</span>}
                      <input
                        autoFocus={i === 0}
                        value={f.v}
                        onChange={(e) => f.set(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder={f.ph}
                        className="w-12 rounded-lg border border-border bg-surface py-1.5 text-center font-display text-2xl text-text"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  {["HRS", "MIN", "SEC"].map((l, i) => (
                    <span key={l} className={`w-12 text-center font-data text-[9px] text-text-faint ${i > 0 ? "ml-1.5" : ""}`}>
                      {l}
                    </span>
                  ))}
                </div>
                <span className="mt-1.5 block text-center font-data text-[10px] text-text-faint">
                  e.g. 30 push-ups in 30 minutes — only fill this in if you actually timed it
                </span>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="mt-10 flex flex-col items-center px-5">
          <div className="flex items-center justify-center gap-1.5">
            {[
              { v: hours, set: setHours, ph: "0" },
              { v: minutes, set: setMinutes, ph: "00" },
              { v: seconds, set: setSeconds, ph: "00" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="font-display text-4xl text-text-dim">:</span>}
                <input
                  autoFocus={i === 0}
                  value={f.v}
                  onChange={(e) => f.set(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={f.ph}
                  className="w-16 border-none bg-transparent text-center font-display text-4xl text-text outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            {["HRS", "MIN", "SEC"].map((l, i) => (
              <span key={l} className={`w-16 text-center font-data text-[9px] text-text-faint ${i > 0 ? "ml-1.5" : ""}`}>
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={!canSubmit}
        onClick={handleAdd}
        className="mx-5 mt-auto mb-8 py-4 font-display text-base uppercase text-white"
        style={{ background: "var(--purple)", borderRadius: 12, opacity: canSubmit ? 1 : 0.4 }}
      >
        {initial ? "Save changes" : "Add to workout"}
      </button>
    </div>
  );
}
