import { fmtTime } from "@/lib/domain";

// Single-exercise bar chart with the actual value printed above each bar — the
// gap StackedBarChart and MiniBarChart both left (values were hover-tooltip-only,
// useless on touch).
export function LabeledBarChart({
  data,
  color,
  unit,
  height = 140,
}: {
  data: { label: string; value: number }[];
  color: string;
  unit: "reps" | "time";
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = (v: number) => (unit === "time" ? fmtTime(v) : v.toLocaleString());

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const barHeight = Math.max((d.value / max) * height, d.value > 0 ? 4 : 2);
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="font-data text-[9px] font-bold text-text" style={{ visibility: d.value > 0 ? "visible" : "hidden" }}>
              {fmt(d.value)}
            </span>
            <div
              className="w-full rounded-[3px]"
              style={{
                height: barHeight,
                background: d.value > 0 ? color : "var(--border)",
                opacity: isLast ? 1 : 0.75 + 0.25 * (d.value / max),
              }}
            />
            <span className="font-data text-[9px] text-text-faint">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
