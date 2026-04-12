export function formatCurrency(amount: number | null | undefined, currency = "INR"): string {
  const value = (amount ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  return currency === "INR" ? `Rs ${value}` : `${currency} ${value}`;
}

export function formatReasonCode(reasonCode: string | null | undefined): string {
  if (!reasonCode) return "Unknown";
  return reasonCode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatPhase(phase: string | null | undefined): string {
  if (!phase) return "Unknown";
  if (phase === "pre_arbitration") return "Pre-Arbitration";
  return phase
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "Not set";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function durationLabel(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / (60 * 1000)));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

export function getSlaState(respondBy: Date | string | null | undefined): {
  label: string;
  color: string;
  border: string;
  tone: "overdue" | "soon" | "healthy" | "unknown";
} {
  if (!respondBy) {
    return {
      label: "No SLA",
      color: "#6B7280",
      border: "rgba(107,114,128,0.25)",
      tone: "unknown",
    };
  }

  const target = new Date(respondBy).getTime();
  const delta = target - Date.now();

  if (delta < 0) {
    return {
      label: `Overdue by ${durationLabel(Math.abs(delta))}`,
      color: "#EF4444",
      border: "rgba(239,68,68,0.3)",
      tone: "overdue",
    };
  }

  if (delta <= 24 * 60 * 60 * 1000) {
    return {
      label: `Due in ${durationLabel(delta)}`,
      color: "#F59E0B",
      border: "rgba(245,158,11,0.3)",
      tone: "soon",
    };
  }

  return {
    label: `Due in ${durationLabel(delta)}`,
    color: "#10B981",
    border: "rgba(16,185,129,0.3)",
    tone: "healthy",
  };
}
