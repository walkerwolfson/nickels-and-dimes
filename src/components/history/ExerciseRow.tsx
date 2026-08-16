"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import { LabeledBarChart } from "@/components/charts/LabeledBarChart";
import { fmtTime } from "@/lib/domain";
import { colorForExercise } from "@/lib/exercise-colors";
import type { ExerciseRowData } from "@/lib/data/history";

function fmtValue(row: ExerciseRowData) {
  return row.unit === "time" ? fmtTime(row.total) : row.total.toLocaleString();
}

export function ExerciseRow({ row, rangeUnit }: { row: ExerciseRowData; rangeUnit: string }) {
  const [expanded, setExpanded] = useState(false);
  const hasData = row.total > 0;

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 py-3.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold text-text">{row.name}</span>
          <span className="font-data text-[11px] text-text-faint">
            {hasData ? `total this ${rangeUnit}` : "nothing logged"}
          </span>
        </div>
        {hasData && (
          <div style={{ width: 56 }}>
            <MiniBarChart data={row.series} />
          </div>
        )}
        <span
          className="w-[64px] flex-shrink-0 text-right font-data text-[13px] font-bold"
          style={{ color: hasData ? "var(--purple-deep)" : "var(--text-faint)" }}
        >
          {hasData ? fmtValue(row) : "—"}
        </span>
        <ChevronDown
          size={15}
          className="flex-shrink-0 text-text-faint transition-transform"
          style={{ transform: expanded ? "rotate(180deg)" : "none" }}
        />
      </button>

      {expanded && (
        <div className="pb-4">
          {hasData ? (
            <div className="rounded-[12px] border border-border bg-surface-alt/40 p-4">
              <LabeledBarChart data={row.series} color={colorForExercise(row.exerciseId)} unit={row.unit} height={110} />
            </div>
          ) : (
            <span className="text-[13px] text-text-faint">Nothing logged for this exercise yet.</span>
          )}
        </div>
      )}
    </div>
  );
}
