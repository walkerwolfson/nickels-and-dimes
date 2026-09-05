"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { LabeledBarChart } from "@/components/charts/LabeledBarChart";
import { ExerciseRow } from "@/components/history/ExerciseRow";
import { fmtTime } from "@/lib/domain";
import { colorForExercise } from "@/lib/exercise-colors";
import {
  RANGE_LABEL,
  type HistoryData,
  type HistoryRange,
  type MonthOption,
  type MonthSnapshot,
} from "@/lib/data/history";

const RANGE_UNIT: Record<HistoryRange, string> = { W: "day", M: "week", Y: "month", All: "year" };
const RANGES: HistoryRange[] = ["W", "M", "Y", "All"];
const ALL_EXERCISES = "all";
const NO_MONTH = "";

export function HistoryScreen({
  dataByRange,
  months,
  monthSnapshots,
}: {
  dataByRange: Record<HistoryRange, HistoryData>;
  months: MonthOption[];
  monthSnapshots: Record<string, MonthSnapshot>;
}) {
  const [range, setRange] = useState<HistoryRange>("W");
  const [selectedMonth, setSelectedMonth] = useState(NO_MONTH);
  const [selectedExercise, setSelectedExercise] = useState(ALL_EXERCISES);

  const monthSnapshot = selectedMonth ? monthSnapshots[selectedMonth] : undefined;
  const data: HistoryData | MonthSnapshot = monthSnapshot ?? dataByRange[range];
  const periodLabel = monthSnapshot ? monthSnapshot.monthLabel : RANGE_LABEL[range];
  const rowUnit = monthSnapshot ? "week" : RANGE_UNIT[range];

  const loggedRows = data.rows.filter((r) => r.total > 0);
  const activeRow =
    selectedExercise !== ALL_EXERCISES ? loggedRows.find((r) => r.exerciseId === selectedExercise) : undefined;

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ background: "var(--bg)" }}>
      <TopBar title="History" subtitle={`Your progress, ${periodLabel}`} />

      <div className="flex items-center gap-2 px-5">
        {RANGES.map((r) => {
          const active = r === range && !monthSnapshot;
          return (
            <button
              key={r}
              onClick={() => {
                setRange(r);
                setSelectedMonth(NO_MONTH);
              }}
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

        {months.length > 0 && (
          <div
            className="relative ml-auto flex flex-shrink-0 items-center rounded-[20px] border-[1.5px] bg-surface"
            style={{ borderColor: monthSnapshot ? "var(--purple)" : "var(--border)" }}
          >
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full appearance-none bg-transparent py-1.5 pl-3.5 pr-7 font-data text-xs font-semibold outline-none"
              style={{ color: monthSnapshot ? "var(--purple)" : "var(--text-dim)" }}
            >
              <option value={NO_MONTH}>By month…</option>
              {months.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5"
              style={{ color: monthSnapshot ? "var(--purple)" : "var(--text-dim)" }}
            />
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="mx-5 mt-5 rounded-[16px] border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-data text-[11px] uppercase tracking-wide text-text-faint">
            {activeRow ? `${activeRow.name} · ${periodLabel}` : `Total reps · ${periodLabel}`}
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
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                  {data.breakdown.map((b) => (
                    <div key={b.exerciseId} className="flex min-w-0 items-center gap-1.5">
                      <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: b.color }} />
                      <span className="truncate text-[12px] text-text-dim">{b.name}</span>
                      <span className="ml-auto flex-shrink-0 font-data text-[12px] font-semibold text-text">
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
        <span className="font-data text-[10px] text-text-faint">{periodLabel.toUpperCase()}</span>
      </div>
      <div className="mx-5 mt-2 rounded-[14px] border border-border bg-surface px-4">
        {data.rows.map((row) => (
          <ExerciseRow key={row.exerciseId} row={row} rangeUnit={rowUnit} />
        ))}
      </div>
    </div>
  );
}
