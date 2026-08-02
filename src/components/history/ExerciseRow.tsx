"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import { fmtTime } from "@/lib/domain";
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
              <MiniBarChart data={row.series} size="large" />
              <div className="mt-3 flex justify-between gap-2">
                {row.series.map((s, i) => (
                  <span key={i} className="flex-1 text-center font-data text-[9px] text-text-faint">
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-[13px] text-text-faint">Nothing logged for this exercise yet.</span>
          )}
        </div>
      )}
    </div>
  );
}
