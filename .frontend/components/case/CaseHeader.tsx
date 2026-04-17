import StatusBadge from "../StatusBadge";
import RecommendationBadge from "../RecommendationBadge";
import { formatCurrency, formatDateTime, formatPhase, formatReasonCode, getSlaState } from "../../lib/disputes";

const MONO = "'IBM Plex Mono', monospace";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "#10B981",
  Medium: "#F59E0B",
  Low: "#EF4444",
};

interface Props {
  caseData: any;
}

function Metric({ label, value, color, sublabel }: { label: string; value: string; color: string; sublabel?: string }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color }}>{value}</div>
      {sublabel ? <div style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251", marginTop: 4 }}>{sublabel}</div> : null}
    </div>
  );
}

export default function CaseHeader({ caseData }: Props) {
  const sla = getSlaState(caseData.respond_by);
  const isAcceptCase = caseData.recommendation === "Accept";

  return (
    <div
      style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        padding: "20px 24px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: "#E8EAF0" }}>{caseData.dispute_id}</span>
          <StatusBadge status={caseData.status} size="md" />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: sla.color,
              border: `1px solid ${sla.border}`,
              borderRadius: 4,
              padding: "3px 8px",
            }}
          >
            {sla.label.toUpperCase()}
          </span>
        </div>

        <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 6 }}>
          {caseData.merchant_name} - {formatPhase(caseData.phase)} - {formatReasonCode(caseData.reason_code)}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>
          <span>PAYMENT {caseData.payment_id ?? "Unknown"}</span>
          <span>NETWORK {caseData.network ?? "Unknown"}</span>
          <span>RESPOND BY {formatDateTime(caseData.respond_by)}</span>
          <span>EVENT STATUS {caseData.external_status ?? "Unknown"}</span>
        </div>
        {caseData.rework_reason && (
          <div
            style={{
              marginTop: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 11,
              color: "#F59E0B",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.22)",
              borderRadius: 6,
              padding: "6px 10px",
            }}
          >
            ACTION REQUIRED: {caseData.rework_reason}
          </div>
        )}
        {isAcceptCase && (
          <div
            style={{
              marginTop: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 11,
              color: "#FDE7BA",
              background: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(239,68,68,0.08))",
              border: "1px solid rgba(245,158,11,0.28)",
              borderRadius: 6,
              padding: "6px 10px",
            }}
          >
            ACCEPTANCE IS IRREVERSIBLE. APPROVER CONFIRMATION SHOULD BE REQUIRED BEFORE FINALIZING.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <Metric label="DISPUTED VALUE" value={formatCurrency(caseData.amount, caseData.currency)} color="#10B981" />
        <Metric
          label="AMOUNT DEDUCTED"
          value={formatCurrency(caseData.amount_deducted, caseData.currency)}
          color={(caseData.amount_deducted ?? 0) > 0 ? "#F59E0B" : "#6B7280"}
          sublabel={(caseData.amount_deducted ?? 0) > 0 ? "Funds already impacted" : "No deduction yet"}
        />
        <Metric label="EVIDENCE SCORE" value={`${Math.round(caseData.evidence_completeness_score * 100)}%`} color="#3B82F6" />

        <div style={{ minWidth: 170 }}>
          <div style={{ marginBottom: 4 }}>
            <RecommendationBadge recommendation={caseData.recommendation} size="lg" />
          </div>
          {caseData.confidence_band ? (
            <div
              style={{
                fontSize: 10,
                fontFamily: MONO,
                color: CONFIDENCE_COLORS[caseData.confidence_band] ?? "#6B7280",
                marginTop: 6,
              }}
            >
              {caseData.confidence_band.toUpperCase()} CONFIDENCE
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
