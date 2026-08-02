"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Check } from "lucide-react";
import { AddExercise } from "@/components/log/AddExercise";
import { AddWod } from "@/components/log/AddWod";
import { fmtDateTime } from "@/lib/domain";
import { postWorkout } from "@/lib/actions/log";

export type SessionItem = {
  id: string;
  label: string;
  totalReps: number;
  breakdown: Record<string, { name: string; unit: "reps" | "time"; value: number }>;
};

export function LogFlow() {
  const router = useRouter();
  const [session, setSession] = useState<SessionItem[]>([]);
  const [adding, setAdding] = useState<"exercise" | "wod" | null>(null);
  const [posting, setPosting] = useState(false);
  const [done, setDone] = useState(false);

  function addItem(item: SessionItem) {
    setSession((s) => [...s, item]);
    setAdding(null);
  }

  function removeItem(id: string) {
    setSession((s) => s.filter((i) => i.id !== id));
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
    await postWorkout({
      lines: session.map((i) => i.label),
      totalReps: session.reduce((s, i) => s + i.totalReps, 0),
      breakdown,
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
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-text">{item.label}</span>
                    <button onClick={() => removeItem(item.id)} className="text-text-faint">
                      <X size={16} />
                    </button>
                  </div>
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

      {adding === "exercise" && <AddExercise onAdd={addItem} onClose={() => setAdding(null)} />}
      {adding === "wod" && <AddWod onAdd={addItem} onClose={() => setAdding(null)} />}
    </div>
  );
}
