import { ImageResponse } from "next/og";

export const alt = "Nickels & Dimes — calisthenics rep tracking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
          NICKELS &amp; DIMES
        </div>
        <div style={{ display: "flex", width: 140, height: 10, background: "#E8FF3D", marginTop: 22 }} />
        <div style={{ display: "flex", fontSize: 34, color: "#EAE3FF", marginTop: 36 }}>
          Stop logging push-ups in your Notes app.
        </div>
      </div>
    ),
    { ...size }
  );
}
