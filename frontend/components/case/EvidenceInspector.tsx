import React from "react";
import { 
  FileText, 
  Truck, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ExternalLink
} from "lucide-react";

interface EvidenceItemProps {
  type: string;
  label: string;
  source: string;
  status: "verified" | "warning" | "missing";
  details: string;
}

function EvidenceItem({ type, label, source, status, details }: EvidenceItemProps) {
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
        {type === "logistics" && <Truck size={16} />}
        {type === "document" && <FileText size={16} />}
        {type === "comm" && <MessageSquare size={16} />}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F1F4F9" }}>{label}</span>
          <span style={{ 
            fontSize: 9, 
            fontFamily: "'Space Mono', monospace", 
            color: isVerified ? "#10B981" : "#6B7280",
            fontWeight: 700
          }}>
            {status.toUpperCase()}_SOURCE::{source.toUpperCase()}
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

export default function EvidenceInspector() {
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
            EVIDENCE_DEEP_INSPECTOR
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <EvidenceItem 
          type="logistics"
          label="Proof of Delivery (POD)"
          source="Shiprocket_API"
          status="verified"
          details="Physical signature 'P. Sharma' captured at destination coordinates 28.4595° N, 77.0266° E. Timestamp: 2026-03-28 14:30:00Z."
        />
        <EvidenceItem 
          type="document"
          label="Tax Invoice (GST)"
          source="ERP_Shopify"
          status="verified"
          details="Verified GSTIN 06AABCU9603R1ZP. Total amount INR 2,499.00 matches Razorpay capture signal. HSN Code 61091000 valid."
        />
        <EvidenceItem 
          type="comm"
          label="WhatsApp Customer Link"
          source="Interakt_Webhook"
          status="verified"
          details="OCR Parser (IndicTrans2) detected Hindi acknowledgement: 'haan, order mil gaya'. Confidence: 0.98."
        />
        <EvidenceItem 
          type="document"
          label="Merchant Terms (T&C)"
          source="Merchant_Policy_DB"
          status="warning"
          details="7-day return window expired at T-48h. Customer initial contact post-expiry detected."
        />
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
           <ExternalLink size={12} /> VIEW_FULL_AUDIT_TRAIL
         </button>
      </div>
    </div>
  );
}
