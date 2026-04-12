import React from "react";
import { 
  FileText, 
  Truck, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

interface EvidenceItemProps {
  type: string;
  label: string;
  source: string;
  status: "verified" | "warning" | "missing";
  details: string;
}

function EvidenceItemUI({ type, label, source, status, details }: EvidenceItemProps) {
  const isVerified = status === "verified";
  const isWarning = status === "warning";

  return (
    <div style={{
      padding: "16px 20px",
      background: "rgba(255,255,255,0.02)",
      borderRadius: 6,
      border: `1px solid ${isVerified ? "rgba(16, 185, 129, 0.1)" : isWarning ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)"}`,
      marginBottom: 12,
      display: "flex",
      alignItems: "flex-start",
      gap: 16
    }}>
      <div style={{
        marginTop: 2,
        padding: 8,
        borderRadius: 4,
        background: isVerified ? "rgba(16, 185, 129, 0.1)" : isWarning ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
        color: isVerified ? "#10B981" : isWarning ? "#F59E0B" : "#EF4444"
      }}>
        {type.includes("logistics") || type.includes("awb") || type.includes("delivery") ? <Truck size={16} /> : 
         type.includes("comm") ? <MessageSquare size={16} /> : 
         <FileText size={16} />}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F1F4F9" }}>{label}</span>
          <span style={{ 
            fontSize: 9, 
            fontFamily: "'Space Mono', monospace", 
            color: isVerified ? "#10B981" : isWarning ? "#F59E0B" : "#6B7280",
            fontWeight: 700
          }}>
            {status.toUpperCase()} SOURCE: {source.toUpperCase()}
          </span>
        </div>
        <p style={{ fontSize: 11, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{details}</p>
      </div>
      
      {isVerified && (
        <div style={{ alignSelf: "center", color: "#10B981" }}>
          <CheckCircle2 size={16} />
        </div>
      )}
      {!isVerified && !isWarning && (
        <div style={{ alignSelf: "center", color: "#EF4444" }}>
          <AlertCircle size={16} />
        </div>
      )}
    </div>
  );
}

interface EvidenceInspectorProps {
  evidence: any[];
  caseId: string;
}

export default function EvidenceInspector({ evidence, caseId }: EvidenceInspectorProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <div style={{
        background: "#08090C",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 8,
        padding: "48px 24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <ShieldAlert size={40} color="#1F2937" style={{ marginBottom: 16 }} />
        <div style={{ fontSize: 12, color: "#374151", fontFamily: "'Space Mono', monospace" }}>
          SCANNING FOR ARTIFACTS...
        </div>
        <p style={{ fontSize: 11, color: "#4B5563", marginTop: 8 }}>
          Intelligence agents are currently scouring external APIs for case artifacts.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "#08090C",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 8,
      padding: 24,
      height: "100%"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Search size={16} color="#3B82F6" />
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#3B82F6" }}>
            EVIDENCE DEEP INSPECTOR
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {evidence.map((item) => (
          <EvidenceItemUI 
            key={item.id}
            type={item.evidence_type}
            label={item.title}
            source={item.source_name}
            status={item.status === "found" ? "verified" : item.status === "partial" ? "warning" : "missing"}
            details={item.summary_text}
          />
        ))}
      </div>

      <div style={{ 
        marginTop: 24, 
        paddingTop: 16, 
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        justifyContent: "center"
      }}>
         <button style={{
           background: "transparent",
           border: "1px solid rgba(59, 130, 246, 0.3)",
           color: "#3B82F6",
           padding: "8px 16px",
           borderRadius: 4,
           fontSize: 10,
           fontFamily: "'Space Mono', monospace",
           fontWeight: 700,
           cursor: "pointer",
           display: "flex",
           alignItems: "center",
           gap: 8
         }}>
           <ExternalLink size={12} /> View Full Audit Trail
         </button>
      </div>
    </div>
  );
}
