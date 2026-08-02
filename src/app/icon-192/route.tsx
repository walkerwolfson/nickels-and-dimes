import { ImageResponse } from "next/og";

export async function GET() {
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
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>N&D</div>
        <div style={{ display: "flex", width: 60, height: 8, background: "#E8FF3D", marginTop: 10 }} />
      </div>
    ),
    { width: 192, height: 192 }
  );
}
