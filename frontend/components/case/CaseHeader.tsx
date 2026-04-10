import StatusBadge from "../StatusBadge";
import RecommendationBadge from "../RecommendationBadge";
import type { Case } from "~backend/cases/types";

const MONO = "'IBM Plex Mono', monospace";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "#10B981",
  Medium: "#F59E0B",
  Low: "#EF4444",
};

interface Props {
  caseData: Case;
}

export default function CaseHeader({ caseData }: Props) {
  const score = Math.round(caseData.evidence_completeness_score * 100);
  const scoreColor = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{
      background: "#111318",
      border: "1px solid #2A2D36",
      borderRadius: 10,
      padding: "20px 24px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: "#E8EAF0" }}>
            {caseData.dispute_id}
          </span>
          <StatusBadge status={caseData.status} size="md" />
        </div>
        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
          {caseData.merchant_name} · {caseData.dispute_reason.replace(/_/g, " ").toUpperCase()}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: "#3D4251" }}>
          {caseData.id}
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: "#10B981" }}>
            ₹{caseData.amount.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", fontFamily: MONO }}>{caseData.currency}</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: scoreColor }}>
            {score}%
          </div>
          <div style={{ fontSize: 10, color: "#6B7280", fontFamily: MONO }}>EVIDENCE SCORE</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <RecommendationBadge recommendation={caseData.recommendation} size="lg" />
          {caseData.confidence_band && (
            <div style={{
              fontSize: 10,
              fontFamily: MONO,
              color: CONFIDENCE_COLORS[caseData.confidence_band] ?? "#6B7280",
              marginTop: 4,
            }}>
              {caseData.confidence_band.toUpperCase()} CONFIDENCE
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
