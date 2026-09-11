import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

const WIDTH = 1080;
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

// Layout constants at 1:1 scale — kept fixed regardless of row count. A workout with one
// exercise used to shrink the card's own font down to fit a fixed 1080x1080 square (leaving
// a wall of empty space below it); now the card's *height* adapts to the content instead, so
// the text stays the same readable size whether there's 1 stat row or 7.
const CARD_PADDING_TOP = 50;
const CARD_PADDING_BOTTOM = 40;
const CARD_BORDER = 12;
const OUTER_PADDING = 26;
const BARBELL_HEIGHT = 74;
const TITLE_GAP = 22;
const TITLE_LINE_HEIGHT = 46; // fontSize 38
const DATE_BLOCK_HEIGHT = 34; // marginTop 10 + fontSize 20 line
const ROWS_TOP_BORDER = 4;
const ROWS_PADDING_TOP = 32;
const ROWS_MARGIN_TOP = 32;
const ROW_GAP = 24;
const ROW_HEIGHT = 53; // tallest of the label (25) / value (44) line heights in a stat row
const FOOTER_GAP = 40;
const FOOTER_HEIGHT = 22;
const MIN_HEIGHT = 480;
const MAX_HEIGHT = 1400;

function computeHeight(rowCount: number, hasDate: boolean): number {
  const rowsBlock = rowCount > 0 ? ROWS_TOP_BORDER + ROWS_PADDING_TOP + ROWS_MARGIN_TOP + rowCount * ROW_HEIGHT + Math.max(rowCount - 1, 0) * ROW_GAP : 0;
  const total =
    OUTER_PADDING * 2 +
    CARD_BORDER * 2 +
    CARD_PADDING_TOP +
    CARD_PADDING_BOTTOM +
    BARBELL_HEIGHT +
    TITLE_GAP +
    TITLE_LINE_HEIGHT +
    (hasDate ? DATE_BLOCK_HEIGHT : 0) +
    rowsBlock +
    FOOTER_GAP +
    FOOTER_HEIGHT;
  return Math.min(Math.max(Math.round(total), MIN_HEIGHT), MAX_HEIGHT);
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

  const height = computeHeight(stats.length, Boolean(date));

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
          padding: OUTER_PADDING,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            background: "#fff",
            border: `${CARD_BORDER}px solid ${DARK}`,
            borderRadius: 6,
            padding: `${CARD_PADDING_TOP}px 48px ${CARD_PADDING_BOTTOM}px`,
            position: "relative",
          }}
        >
          <CornerTick top left />
          <CornerTick top right />
          <CornerTick bottom left />
          <CornerTick bottom right />

          <BarbellMark width={270} height={BARBELL_HEIGHT} />
          <div style={{ display: "flex", fontFamily: "Black Ops One", fontSize: 38, color: DARK, marginTop: TITLE_GAP, letterSpacing: 3 }}>
            NICKELS & DIMES
          </div>
          {date && (
            <div style={{ display: "flex", fontSize: 20, color: "#65637F", marginTop: 10, letterSpacing: 2 }}>
              {date.toUpperCase()}
            </div>
          )}

          {stats.length > 0 && (
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                gap: ROW_GAP,
                borderTop: `${ROWS_TOP_BORDER}px solid ${DARK}`,
                paddingTop: ROWS_PADDING_TOP,
                marginTop: ROWS_MARGIN_TOP,
              }}
            >
              {stats.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ display: "flex", fontSize: 25, color: DARK, letterSpacing: 2, fontWeight: 700 }}>
                    {s.label}
                  </div>
                  <div style={{ display: "flex", fontFamily: "Black Ops One", fontSize: 44, color: "#6E4FE0" }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", marginTop: FOOTER_GAP, fontSize: 17, color: "#9C9AB6", letterSpacing: 3 }}>
            NICKELSANDDIMES.APP
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height,
      fonts: [{ name: "Black Ops One", data: fontData, style: "normal", weight: 400 }],
    }
  );
}
