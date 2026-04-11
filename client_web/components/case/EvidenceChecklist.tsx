import { CheckCircle, XCircle, MinusCircle } from "lucide-react";
import type { EvidenceItem } from "~backend/evidence/types";

const MONO = "'IBM Plex Mono', monospace";

const EVIDENCE_LABELS: Record<string, string> = {
  payment_record: "Payment Record",
  order_details: "Order Details",
  awb_tracking: "AWB Tracking",
  logistics_status: "Logistics Status",
  proof_of_delivery: "Proof of Delivery (POD)",
  invoice: "Tax Invoice",
  customer_communication: "Customer Communication",
  merchant_policy: "Merchant Policy",
  document_ocr: "Document OCR",
};

const ALL_TYPES = [
  "payment_record",
  "order_details",
  "awb_tracking",
  "logistics_status",
  "proof_of_delivery",
  "invoice",
  "customer_communication",
  "merchant_policy",
];

interface Props {
  evidence: EvidenceItem[];
  score: number;
}

export default function EvidenceChecklist({ evidence, score }: Props) {
  const scorePercent = Math.round(score * 100);
  const scoreColor = scorePercent >= 80 ? "#10B981" : scorePercent >= 50 ? "#F59E0B" : "#EF4444";

  const byType: Record<string, EvidenceItem | undefined> = {};
  for (const item of evidence) {
    if (!byType[item.evidence_type]) byType[item.evidence_type] = item;
  }

  return (
    <div style={{
      background: "#111318",
      border: "1px solid #2A2D36",
      borderRadius: 10,
      padding: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 12, fontFamily: MONO, color: "#6B7280", fontWeight: 600, letterSpacing: "0.1em" }}>
          EVIDENCE CHECKLIST
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 120, height: 6, background: "#1A1D24", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${scorePercent}%`, height: "100%", background: scoreColor, transition: "width 0.5s", borderRadius: 3 }} />
          </div>
          <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: scoreColor }}>
            {scorePercent}%
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
        {ALL_TYPES.map((type) => {
          const item = byType[type];
          const status = item?.status ?? "missing";

          let icon, iconColor;
          if (status === "found") {
            icon = <CheckCircle size={14} />;
            iconColor = "#10B981";
          } else if (status === "partial") {
            icon = <MinusCircle size={14} />;
            iconColor = "#F59E0B";
          } else {
            icon = <XCircle size={14} />;
            iconColor = "#EF4444";
          }

          return (
            <div key={type} style={{
              background: "#0A0C10",
              border: `1px solid ${status === "found" ? "rgba(16,185,129,0.15)" : status === "partial" ? "rgba(245,158,11,0.15)" : "#1A1D24"}`,
              borderRadius: 8,
              padding: "10px 12px",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}>
              <span style={{ color: iconColor, paddingTop: 1, flexShrink: 0 }}>{icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#E8EAF0", marginBottom: 2 }}>
                  {EVIDENCE_LABELS[type] ?? type}
                </div>
                {item ? (
                  <>
                    <div style={{ fontSize: 10, color: "#6B7280", fontFamily: MONO, marginBottom: 2 }}>
                      {item.source_name}
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.4 }}>
                      {item.preview_text}
                    </div>
                    {item.confidence < 1 && (
                      <div style={{ fontSize: 9, fontFamily: MONO, color: "#F59E0B", marginTop: 3 }}>
                        CONFIDENCE: {Math.round(item.confidence * 100)}%
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: 10, color: "#3D4251", fontFamily: MONO }}>not collected</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
