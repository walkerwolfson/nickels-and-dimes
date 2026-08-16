export type StackedBucket = {
  label: string;
  total: number;
  segments: { exerciseId: string; value: number; color: string }[];
};

export function StackedBarChart({ data, height = 140 }: { data: StackedBucket[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((bucket, i) => {
        const isLast = i === data.length - 1;
        const barHeight = Math.max((bucket.total / max) * height, bucket.total > 0 ? 4 : 2);
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="font-data text-[9px] font-bold text-text" style={{ visibility: bucket.total > 0 ? "visible" : "hidden" }}>
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
            <span className="font-data text-[10px] text-text-faint">{bucket.label}</span>
          </div>
        );
      })}
    </div>
  );
}
