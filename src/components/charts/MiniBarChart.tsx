export function MiniBarChart({
  data,
  size = "normal",
}: {
  data: { label: string; value: number }[];
  size?: "normal" | "large";
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const h = size === "large" ? 56 : 30;
  return (
    <div className="flex items-end gap-1" style={{ height: h }}>
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: Math.max((d.value / max) * h, 3),
              background: isLast ? "var(--yellow)" : "var(--purple)",
              opacity: isLast ? 1 : 0.55 + 0.45 * (d.value / max),
            }}
            title={`${d.label}: ${d.value}`}
          />
        );
      })}
    </div>
  );
}
