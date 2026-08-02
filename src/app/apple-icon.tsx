import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>N&D</div>
        <div style={{ display: "flex", width: 56, height: 8, background: "#E8FF3D", marginTop: 10 }} />
      </div>
    ),
    { ...size }
  );
}
