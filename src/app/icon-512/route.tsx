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
        <div style={{ display: "flex", fontSize: 180, fontWeight: 700, letterSpacing: -6 }}>N&D</div>
        <div style={{ display: "flex", width: 160, height: 20, background: "#E8FF3D", marginTop: 26 }} />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
