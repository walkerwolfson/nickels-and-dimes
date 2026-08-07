"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Check, ChevronRight, Clock } from "lucide-react";
import { AddExercise } from "@/components/log/AddExercise";
import { AddWod } from "@/components/log/AddWod";
import { fmtDateTime } from "@/lib/domain";
import { postWorkout } from "@/lib/actions/log";

export type SessionItem = {
  id: string;
  label: string;
  totalReps: number;
  breakdown: Record<string, { name: string; unit: "reps" | "time"; value: number }>;
  source:
    | { kind: "exercise"; exerciseId: string; repInput: string; hours: string; minutes: string; seconds: string; showTime: boolean }
    | { kind: "wod"; wodId: string; rounds: string; partial: Record<string, string> };
};

export function LogFlow() {
  const router = useRouter();
  const [session, setSession] = useState<SessionItem[]>([]);
  const [adding, setAdding] = useState<"exercise" | "wod" | null>(null);
  const [editingItem, setEditingItem] = useState<SessionItem | null>(null);
  const [posting, setPosting] = useState(false);
  const [done, setDone] = useState(false);

  const [showDuration, setShowDuration] = useState(false);
  const [durHours, setDurHours] = useState("");
  const [durMinutes, setDurMinutes] = useState("");
  const [durSeconds, setDurSeconds] = useState("");

  function saveItem(item: SessionItem) {
    setSession((s) => {
      const idx = s.findIndex((i) => i.id === item.id);
      if (idx === -1) return [...s, item];
      const copy = [...s];
      copy[idx] = item;
      return copy;
    });
    setAdding(null);
    setEditingItem(null);
  }

  function removeItem(id: string) {
    setSession((s) => s.filter((i) => i.id !== id));
  }

  function editItem(item: SessionItem) {
    setEditingItem(item);
    setAdding(item.source.kind);
  }

  async function post() {
    if (session.length === 0 || posting) return;
    setPosting(true);
    const breakdown: SessionItem["breakdown"] = {};
    session.forEach((item) => {
      Object.entries(item.breakdown).forEach(([exId, info]) => {
        if (!breakdown[exId]) breakdown[exId] = { name: info.name, unit: info.unit, value: 0 };
        breakdown[exId].value += info.value;
      });
    });
    const durationSec =
      parseInt(durHours || "0", 10) * 3600 + parseInt(durMinutes || "0", 10) * 60 + parseInt(durSeconds || "0", 10);
    await postWorkout({
      lines: session.map((i) => i.label),
      totalReps: session.reduce((s, i) => s + i.totalReps, 0),
      breakdown,
      durationSec: durationSec > 0 ? durationSec : undefined,
    });
    setDone(true);
    setTimeout(() => router.push("/home"), 900);
  }

  return (
    <div className="relative flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex flex-col">
          <h1 className="font-display text-2xl uppercase text-text">Log your workout</h1>
          <span className="font-data text-[11px] text-text-faint">{fmtDateTime(new Date())}</span>
        </div>
        <button onClick={() => router.push("/home")} className="text-text-dim">
          <X size={22} />
        </button>
      </div>

      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "var(--yellow)" }}
          >
            <Check size={30} color="#2B2E00" />
          </div>
          <span className="font-display text-xl uppercase text-text">Posted</span>
        </div>
      ) : (
        <>
          <div className="px-5">
            {session.length === 0 ? (
              <span className="text-[13px] text-text-faint">
                Add everything you did today, then post it all at once.
              </span>
            ) : (
              <div className="flex flex-col gap-2">
                {session.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => editItem(item)}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left"
                  >
                    <span className="text-sm font-semibold text-text">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <ChevronRight size={15} className="text-text-faint" />
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="text-text-faint"
                      >
                        <X size={16} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setAdding("exercise")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 font-data text-xs font-bold"
                style={{ background: "var(--purple-soft)", color: "var(--purple-deep)" }}
              >
                <Plus size={14} /> Add exercise
              </button>
              <button
                onClick={() => setAdding("wod")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 font-data text-xs font-bold text-text"
                style={{ background: "var(--blue-soft)" }}
              >
                <Plus size={14} /> Add named workout
              </button>
            </div>

            <div className="mt-6">
              {!showDuration ? (
                <button
                  onClick={() => setShowDuration(true)}
                  className="flex items-center gap-1.5 font-data text-xs text-text-faint"
                >
                  <Clock size={13} /> Add total workout time (optional)
                </button>
              ) : (
                <div className="rounded-xl border border-border bg-surface px-4 py-3.5">
                  <span className="font-data text-[11px] tracking-wide text-text-dim">
                    TOTAL TIME FOR THIS WORKOUT <span className="text-text-faint">— OPTIONAL</span>
                  </span>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    {[
                      { v: durHours, set: setDurHours, ph: "0" },
                      { v: durMinutes, set: setDurMinutes, ph: "00" },
                      { v: durSeconds, set: setDurSeconds, ph: "00" },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        {i > 0 && <span className="font-display text-2xl text-text-dim">:</span>}
                        <input
                          autoFocus={i === 0}
                          value={f.v}
                          onChange={(e) => f.set(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder={f.ph}
                          className="w-12 rounded-lg border border-border bg-bg py-1.5 text-center font-display text-2xl text-text"
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
                </div>
              )}
            </div>
          </div>

          <button
            disabled={session.length === 0 || posting}
            onClick={post}
            className="mx-5 mt-6 mb-8 py-4 font-display text-base uppercase text-white"
            style={{ background: "var(--purple)", borderRadius: 12, opacity: session.length === 0 || posting ? 0.4 : 1 }}
          >
            {posting ? "Posting…" : "Post workout"}
          </button>
        </>
      )}

      {adding === "exercise" && (
        <AddExercise
          initial={editingItem && editingItem.source.kind === "exercise" ? { ...editingItem, source: editingItem.source } : null}
          onAdd={saveItem}
          onClose={() => {
            setAdding(null);
            setEditingItem(null);
          }}
        />
      )}
      {adding === "wod" && (
        <AddWod
          initial={editingItem && editingItem.source.kind === "wod" ? { ...editingItem, source: editingItem.source } : null}
          onAdd={saveItem}
          onClose={() => {
            setAdding(null);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
