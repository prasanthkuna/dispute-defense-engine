import { FileText, Database, Globe } from "lucide-react";
import type { EvidenceItem } from "~backend/evidence/types";

const MONO = "'IBM Plex Mono', monospace";

const STATUS_COLORS: Record<string, { text: string; border: string }> = {
  found: { text: "#10B981", border: "rgba(16,185,129,0.2)" },
  partial: { text: "#F59E0B", border: "rgba(245,158,11,0.2)" },
  missing: { text: "#EF4444", border: "rgba(239,68,68,0.2)" },
};

interface Props {
  evidence: any[];
}

export default function EvidencePack({ evidence }: Props) {
  return (
    <div>
      <h3 style={{ margin: "0 0 16px", fontSize: 12, fontFamily: MONO, color: "#6B7280", fontWeight: 600, letterSpacing: "0.1em" }}>
        EVIDENCE PACK - {evidence.length} ITEMS
      </h3>
      {evidence.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", fontFamily: MONO, color: "#3D4251", fontSize: 12,
          background: "#111318", border: "1px solid #2A2D36", borderRadius: 10 }}>
          No evidence collected yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {evidence.map((item) => {
            const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS.missing;
            return (
              <div key={item.id} style={{
                background: "#111318",
                border: `1px solid #2A2D36`,
                borderLeft: `3px solid ${colors.text}`,
                borderRadius: 10,
                padding: 16,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <FileText size={16} color={colors.text} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#E8EAF0" }}>{item.title}</span>
                      <span style={{
                        fontFamily: MONO,
                        fontSize: 9,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 4,
                        padding: "1px 6px",
                      }}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}>
                        <Database size={9} />
                        {item.source_name}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 9, color: "#3D4251" }}>
                        {item.evidence_type}
                      </span>
                      {item.confidence < 1 && (
                        <span style={{ fontFamily: MONO, fontSize: 9, color: "#F59E0B" }}>
                          {Math.round(item.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                      {item.summary_text}
                    </p>
                    {item.preview_text && (
                      <div style={{
                        marginTop: 8,
                        background: "#0A0C10",
                        borderRadius: 6,
                        padding: "6px 10px",
                        fontFamily: MONO,
                        fontSize: 10,
                        color: "#3B82F6",
                      }}>
                        {item.preview_text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

