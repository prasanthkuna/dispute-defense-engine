const REC_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Contest: { bg: "rgba(59,130,246,0.12)", text: "#3B82F6", border: "rgba(59,130,246,0.35)" },
  Accept: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", border: "rgba(245,158,11,0.35)" },
  Escalate: { bg: "rgba(239,68,68,0.12)", text: "#EF4444", border: "rgba(239,68,68,0.35)" },
};

const DEFAULT = { bg: "#1A1D24", text: "#6B7280", border: "#2A2D36" };

interface Props {
  recommendation: string | null;
  size?: "sm" | "md" | "lg";
}

export default function RecommendationBadge({ recommendation, size = "sm" }: Props) {
  if (!recommendation) {
    return (
      <span
        style={{
          background: "#1A1D24",
          color: "#3D4251",
          border: "1px solid #2A2D36",
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 7px",
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        N/A
      </span>
    );
  }

  const colors = REC_COLORS[recommendation] ?? DEFAULT;
  const fontSize = size === "lg" ? 18 : size === "md" ? 13 : 10;
  const padding = size === "lg" ? "6px 16px" : size === "md" ? "4px 12px" : "2px 7px";

  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        fontSize,
        fontWeight: 700,
        padding,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: "0.04em",
      }}
    >
      {recommendation.toUpperCase()}
    </span>
  );
}
