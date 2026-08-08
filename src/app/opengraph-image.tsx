import { ImageResponse } from "next/og";

export const alt = "Nickels & Dimes — calisthenics rep tracking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#8C6FF0",
          color: "#fff",
        }}
      >
        <BarbellMark width={420} height={121} />
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -2, marginTop: 18 }}>
          NICKELS &amp; DIMES
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#EAE3FF", marginTop: 30 }}>
          Log Reps, Chase PRs, and Compete With Friends
        </div>
      </div>
    ),
    { ...size }
  );
}
