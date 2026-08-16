"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { LabeledBarChart } from "@/components/charts/LabeledBarChart";
import { ExerciseRow } from "@/components/history/ExerciseRow";
import { fmtTime } from "@/lib/domain";
import { colorForExercise } from "@/lib/exercise-colors";
import { RANGE_LABEL, type HistoryData, type HistoryRange } from "@/lib/data/history";

const RANGE_UNIT: Record<HistoryRange, string> = { W: "day", M: "week", Y: "month", All: "year" };
const RANGES: HistoryRange[] = ["W", "M", "Y", "All"];
const ALL_EXERCISES = "all";

export function HistoryScreen({ dataByRange }: { dataByRange: Record<HistoryRange, HistoryData> }) {
  const [range, setRange] = useState<HistoryRange>("W");
  const [selectedExercise, setSelectedExercise] = useState(ALL_EXERCISES);
  const data = dataByRange[range];

  const loggedRows = data.rows.filter((r) => r.total > 0);
  const activeRow =
    selectedExercise !== ALL_EXERCISES ? loggedRows.find((r) => r.exerciseId === selectedExercise) : undefined;

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ background: "var(--bg)" }}>
      <TopBar title="History" subtitle={`Your progress, ${RANGE_LABEL[range]}`} />

      <div className="flex gap-2 px-5">
        {RANGES.map((r) => {
          const active = r === range;
          return (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="rounded-[20px] border px-4 py-1.5 font-data text-xs font-semibold"
              style={{
                background: active ? "var(--purple)" : "var(--surface)",
                color: active ? "#fff" : "var(--text-dim)",
                borderColor: active ? "var(--purple)" : "var(--border)",
              }}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Hero */}
      <div className="mx-5 mt-5 rounded-[16px] border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-data text-[11px] uppercase tracking-wide text-text-faint">
            {activeRow ? `${activeRow.name} · ${RANGE_LABEL[range]}` : `Total reps · ${RANGE_LABEL[range]}`}
          </span>
          {loggedRows.length > 0 && (
            <div className="relative flex flex-shrink-0 items-center rounded-[10px] border-[1.5px] border-border bg-bg">
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full appearance-none bg-transparent py-1.5 pl-3 pr-7 font-data text-[11px] font-semibold text-text outline-none"
              >
                <option value={ALL_EXERCISES}>All Exercises</option>
                {loggedRows.map((r) => (
                  <option key={r.exerciseId} value={r.exerciseId}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2 text-text-dim" />
            </div>
          )}
        </div>

        {activeRow ? (
          <>
            <div className="font-display text-[44px] leading-tight text-text">
              {activeRow.unit === "time" ? fmtTime(activeRow.total) : activeRow.total.toLocaleString()}
            </div>
            <div className="mt-4">
              <LabeledBarChart data={activeRow.series} color={colorForExercise(activeRow.exerciseId)} unit={activeRow.unit} />
            </div>
          </>
        ) : (
          <>
            <div className="font-display text-[44px] leading-tight text-text">
              {data.heroTotal.toLocaleString()}
            </div>

            {data.breakdown.length === 0 ? (
              <span className="text-[13px] text-text-faint">Nothing logged yet — get after it.</span>
            ) : (
              <>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5">
                  {data.breakdown.map((b) => (
                    <div key={b.exerciseId} className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
                      <span className="text-[12px] text-text-dim">{b.name}</span>
                      <span className="font-data text-[12px] font-semibold text-text">
                        {b.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <StackedBarChart data={data.chart} />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* All exercises */}
      <div className="mt-7 flex items-center justify-between px-5">
        <span className="font-data text-xs tracking-wide text-text-dim">ALL EXERCISES</span>
        <span className="font-data text-[10px] text-text-faint">{RANGE_LABEL[range].toUpperCase()}</span>
      </div>
      <div className="mx-5 mt-2 rounded-[14px] border border-border bg-surface px-4">
        {data.rows.map((row) => (
          <ExerciseRow key={row.exerciseId} row={row} rangeUnit={RANGE_UNIT[range]} />
        ))}
      </div>
    </div>
  );
}
