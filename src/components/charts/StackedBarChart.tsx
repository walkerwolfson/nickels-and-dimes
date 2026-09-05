export type StackedBucket = {
  label: string;
  total: number;
  segments: { exerciseId: string; value: number; color: string }[];
};

// Reserved vertical space (px) for the value label above the bar and the axis label
// below it, so the tallest bar's own height never has to exceed the container's
// declared `height` — without this, a max-value bar scaled to fill the full height
// plus its label rows would spill out the top of the box and collide with whatever
// sits above the chart.
const VALUE_LABEL_SPACE = 16;
const AXIS_LABEL_SPACE = 16;

export function StackedBarChart({ data, height = 140 }: { data: StackedBucket[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const barAreaHeight = Math.max(height - VALUE_LABEL_SPACE - AXIS_LABEL_SPACE, 24);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((bucket, i) => {
        const isLast = i === data.length - 1;
        const barHeight = Math.max((bucket.total / max) * barAreaHeight, bucket.total > 0 ? 4 : 2);
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span
              className="font-data text-[9px] font-bold leading-none text-text"
              style={{ height: VALUE_LABEL_SPACE - 4, visibility: bucket.total > 0 ? "visible" : "hidden" }}
            >
              {bucket.total.toLocaleString()}
            </span>
            <div
              className="flex w-full flex-col-reverse overflow-hidden rounded-[3px]"
              style={{ height: barHeight, opacity: isLast ? 1 : 0.85 }}
            >
              {bucket.segments.map((seg, j) => (
                <div
                  key={j}
                  style={{
                    height: `${(seg.value / bucket.total) * 100}%`,
                    background: seg.color,
                  }}
                  title={`${seg.exerciseId}: ${seg.value}`}
                />
              ))}
              {bucket.total === 0 && <div className="h-full w-full bg-border" />}
            </div>
            <span
              className="font-data text-[10px] leading-none text-text-faint"
              style={{ height: AXIS_LABEL_SPACE - 4 }}
            >
              {bucket.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
