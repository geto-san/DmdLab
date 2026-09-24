import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0d",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 999,
              background: "#a3e635",
            }}
          />
          <div style={{ fontSize: 32, color: "#9a9a9a", letterSpacing: 2 }}>
            DEEPMINDS RESEARCH LAB · MUST
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 72,
            color: "#f2efe8",
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          AI Research that&nbsp;<span style={{ color: "#8b7cff" }}>Watches</span>,&nbsp;Listens, and Translates.
        </div>
      </div>
    ),
    { ...size }
  );
}
