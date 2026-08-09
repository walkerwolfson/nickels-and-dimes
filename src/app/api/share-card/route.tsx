import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = 1080;

function BarbellMark({ width, height }: { width: number; height: number }) {
  const capW = Math.round(width * 0.062);
  const barH = Math.round(height * 0.165);
  const dark = "#14121F";
  return (
    <div style={{ display: "flex", alignItems: "center", width, height }}>
      <div style={{ display: "flex", width: capW, height, background: dark, flexShrink: 0, borderRadius: 3 }} />
      <div style={{ display: "flex", flex: 1, height: barH }}>
        <div style={{ display: "flex", flex: 1, height: barH, background: dark }} />
        <div style={{ display: "flex", flex: 1, height: barH, background: "#5D3FE4" }} />
        <div style={{ display: "flex", flex: 1, height: barH, background: "#E0E64A" }} />
        <div style={{ display: "flex", flex: 1, height: barH, background: dark }} />
      </div>
      <div style={{ display: "flex", width: capW, height, background: dark, flexShrink: 0, borderRadius: 3 }} />
    </div>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = (searchParams.get("date") || "").slice(0, 40);
  const lines = (searchParams.get("lines") || "")
    .split("|")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#8C6FF0",
          padding: "80px 90px",
        }}
      >
        <BarbellMark width={210} height={60} />

        {date && (
          <div style={{ display: "flex", fontSize: 24, color: "#CBBBF5", marginTop: 64 }}>{date}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 56 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "#fff" }}>
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#fff" }}>NICKELS & DIMES</div>
          <div style={{ display: "flex", fontSize: 22, color: "#CBBBF5" }}>nickelsanddimes.app</div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
