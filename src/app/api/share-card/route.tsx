import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

const SIZE = 1080;
const DARK = "#14121F";

function BarbellMark({ width, height }: { width: number; height: number }) {
  const capW = Math.round(width * 0.062);
  const barH = Math.round(height * 0.165);
  return (
    <div style={{ display: "flex", alignItems: "center", width, height }}>
      <div style={{ display: "flex", width: capW, height, background: DARK, flexShrink: 0, borderRadius: 2 }} />
      <div style={{ display: "flex", flex: 1, height: barH }}>
        <div style={{ display: "flex", flex: 1, height: barH, background: DARK }} />
        <div style={{ display: "flex", flex: 1, height: barH, background: "#8C6FF0" }} />
        <div style={{ display: "flex", flex: 1, height: barH, background: "#E0E64A" }} />
        <div style={{ display: "flex", flex: 1, height: barH, background: DARK }} />
      </div>
      <div style={{ display: "flex", width: capW, height, background: DARK, flexShrink: 0, borderRadius: 2 }} />
    </div>
  );
}

function CornerTick({ top, bottom, left, right }: { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }) {
  // Satori doesn't strip `undefined` style values the way the DOM does, so only the
  // relevant keys for this corner get included at all rather than set-to-undefined.
  const style: React.CSSProperties = { display: "flex", position: "absolute", width: 28, height: 28 };
  if (top) { style.top = 22; style.borderTop = `5px solid ${DARK}`; }
  if (bottom) { style.bottom = 22; style.borderBottom = `5px solid ${DARK}`; }
  if (left) { style.left = 22; style.borderLeft = `5px solid ${DARK}`; }
  if (right) { style.right = 22; style.borderRight = `5px solid ${DARK}`; }
  return <div style={style} />;
}

// A raw display line is either "150 Push-ups" (reps) or "Dead-Hang — 1:00" (time).
// Split each into a label/value pair for the two-column stat rows.
function parseLine(line: string): { label: string; value: string } {
  const repsMatch = line.match(/^(\d+)\s+(.+)$/);
  if (repsMatch) return { value: repsMatch[1], label: repsMatch[2].toUpperCase() };
  const timeMatch = line.match(/^(.+?)\s+—\s+(.+)$/);
  if (timeMatch) return { value: timeMatch[2], label: timeMatch[1].toUpperCase() };
  return { value: "", label: line.toUpperCase() };
}

// Fewer stat rows means more empty space to fill, so scale everything up; more rows (the
// composer caps at 6 exercises + 1 duration row = 7) means scale down to keep it all fitting
// cleanly above the fold instead of overflowing the card.
function scaleForRowCount(n: number): number {
  if (n <= 1) return 2.15;
  if (n === 2) return 1.65;
  if (n === 3) return 1;
  if (n === 4) return 0.85;
  if (n === 5) return 0.74;
  return 0.65;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = (searchParams.get("date") || "").slice(0, 40);
  const duration = (searchParams.get("duration") || "").slice(0, 20);
  const lines = (searchParams.get("lines") || "")
    .split("|")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);

  const stats = lines.map(parseLine);
  if (duration) stats.push({ label: "TIME", value: duration });

  const scale = scaleForRowCount(stats.length || 1);
  const px = (n: number) => Math.round(n * scale);

  const fontData = await readFile(join(process.cwd(), "public/fonts/BlackOpsOne-Regular.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#EEF0FB",
          padding: "26px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            background: "#fff",
            border: "12px solid " + DARK,
            borderRadius: 6,
            padding: "50px 48px 40px",
            position: "relative",
          }}
        >
          <CornerTick top left />
          <CornerTick top right />
          <CornerTick bottom left />
          <CornerTick bottom right />

          <BarbellMark width={px(270)} height={px(74)} />
          <div style={{ display: "flex", fontFamily: "Black Ops One", fontSize: px(38), color: DARK, marginTop: px(22), letterSpacing: 3 }}>
            NICKELS & DIMES
          </div>
          {date && (
            <div style={{ display: "flex", fontSize: Math.min(px(20), 26), color: "#65637F", marginTop: px(10), letterSpacing: 2 }}>
              {date.toUpperCase()}
            </div>
          )}

          {stats.length > 0 && (
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                gap: px(24),
                borderTop: `4px solid ${DARK}`,
                paddingTop: px(32),
                marginTop: px(32),
              }}
            >
              {stats.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ display: "flex", fontSize: Math.min(px(25), 62), color: DARK, letterSpacing: 2, fontWeight: 700 }}>
                    {s.label}
                  </div>
                  <div style={{ display: "flex", fontFamily: "Black Ops One", fontSize: Math.min(px(44), 130), color: "#6E4FE0" }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flex: 1 }} />

          <div style={{ display: "flex", fontSize: 17, color: "#9C9AB6", letterSpacing: 3 }}>NICKELSANDDIMES.APP</div>
        </div>
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      fonts: [{ name: "Black Ops One", data: fontData, style: "normal", weight: 400 }],
    }
  );
}
