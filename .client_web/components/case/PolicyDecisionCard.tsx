import { Shield, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import RecommendationBadge from "../RecommendationBadge";
import type { PolicyDecision } from "~backend/policy/types";

const MONO = "'IBM Plex Mono', monospace";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "#10B981",
  Medium: "#F59E0B",
  Low: "#EF4444",
};

interface Props {
  decision: PolicyDecision | null;
  large?: boolean;
}

export default function PolicyDecisionCard({ decision, large }: Props) {
  return (
    <div style={{
      background: "#111318",
      border: "1px solid #2A2D36",
      borderRadius: 10,
      padding: large ? 28 : 20,
      height: "100%",
    }}>
      {/* Engine label */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.2)",
        borderRadius: 6,
        padding: "4px 10px",
        marginBottom: 16,
      }}>
        <Shield size={11} color="#3B82F6" />
        <span style={{ fontFamily: MONO, fontSize: 9, color: "#3B82F6", letterSpacing: "0.12em", fontWeight: 700 }}>
          DETERMINISTIC POLICY ENGINE — NOT LLM
        </span>
      </div>

      {!decision ? (
        <div style={{ padding: 20, textAlign: "center", fontFamily: MONO, color: "#3D4251", fontSize: 12 }}>
          No policy decision yet. Run the agent to generate a decision.
        </div>
      ) : (
        <>
          {/* Decision */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <RecommendationBadge recommendation={decision.recommended_action} size="lg" />
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 2 }}>CONFIDENCE</div>
              <div style={{
                fontFamily: MONO,
                fontSize: 14,
                fontWeight: 700,
                color: CONFIDENCE_COLORS[decision.confidence_band] ?? "#6B7280",
              }}>
                {decision.confidence_band}
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{
                fontFamily: MONO,
                fontSize: 10,
                color: decision.approval_required ? "#F59E0B" : "#10B981",
                background: decision.approval_required ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                border: `1px solid ${decision.approval_required ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)"}`,
                borderRadius: 4,
                padding: "3px 8px",
              }}>
                {decision.approval_required ? "APPROVAL REQUIRED" : "AUTO-APPROVED"}
              </span>
            </div>
          </div>

          {/* Rationale */}
          {(decision.rationale_json as string[]).length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 8, letterSpacing: "0.08em" }}>
                RATIONALE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(decision.rationale_json as string[]).map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <CheckCircle size={11} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#E8EAF0", lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing items */}
          {(decision.missing_items_json as string[]).length > 0 && (
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: "#F59E0B", marginBottom: 8, letterSpacing: "0.08em" }}>
                MISSING EVIDENCE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {(decision.missing_items_json as string[]).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <AlertTriangle size={10} color="#F59E0B" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontFamily: MONO, color: "#F59E0B" }}>
                      {m.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
