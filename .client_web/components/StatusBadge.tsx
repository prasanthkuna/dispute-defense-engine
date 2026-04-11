const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "New": { bg: "#1A1D24", text: "#6B7280", border: "#2A2D36" },
  "Hunting Evidence": { bg: "rgba(59,130,246,0.1)", text: "#3B82F6", border: "rgba(59,130,246,0.3)" },
  "Ready for Review": { bg: "rgba(16,185,129,0.1)", text: "#10B981", border: "rgba(16,185,129,0.3)" },
  "Approval Pending": { bg: "rgba(245,158,11,0.1)", text: "#F59E0B", border: "rgba(245,158,11,0.3)" },
  "Ready to Submit": { bg: "rgba(139,92,246,0.1)", text: "#8B5CF6", border: "rgba(139,92,246,0.3)" },
  "Submitted": { bg: "rgba(16,185,129,0.15)", text: "#10B981", border: "rgba(16,185,129,0.4)" },
  "Closed": { bg: "#1A1D24", text: "#3D4251", border: "#2A2D36" },
};

const DEFAULT_COLORS = { bg: "#1A1D24", text: "#6B7280", border: "#2A2D36" };

interface Props {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: Props) {
  const colors = STATUS_COLORS[status] ?? DEFAULT_COLORS;
  const fontSize = size === "sm" ? 10 : 12;
  const padding = size === "sm" ? "2px 7px" : "3px 10px";

  return (
    <span style={{
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
      fontSize,
      fontWeight: 600,
      padding,
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}>
      {status.toUpperCase()}
    </span>
  );
}
