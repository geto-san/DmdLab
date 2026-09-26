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
          background: "#12141c",
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
              background: "#e8a33d",
            }}
          />
          <div style={{ fontSize: 30, color: "#8d90a3" }}>DeepMinds Research Lab</div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 72,
            color: "#f2ede0",
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          AI Research that&nbsp;<span style={{ color: "#38c6be" }}>Watches</span>,&nbsp;Listens, and Translates.
        </div>
      </div>
    ),
    { ...size }
  );
}
