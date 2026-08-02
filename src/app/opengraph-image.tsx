import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "Nickels & Dimes — calisthenics rep tracking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const markData = await readFile(join(process.cwd(), "public/brand/icon-mark.png"), "base64");
  const markSrc = `data:image/png;base64,${markData}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={420} height={121} />
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -2, marginTop: 18 }}>
          NICKELS &amp; DIMES
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#EAE3FF", marginTop: 30 }}>
          Stop logging push-ups in your Notes app.
        </div>
      </div>
    ),
    { ...size }
  );
}
