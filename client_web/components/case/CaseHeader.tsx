import React, { useState, useEffect } from "react";
import StatusBadge from "../StatusBadge";
import RecommendationBadge from "../RecommendationBadge";
import type { Case } from "~backend/cases/types";
import { Clock, ShieldAlert, Hash } from "lucide-react";

const MONO = "'Space Mono', monospace";
const SYNE = "'Syne', sans-serif";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "#10B981",
  Medium: "#F59E0B",
  Low: "#EF4444",
};

interface Props {
  caseData: any;
}

export default function CaseHeader({ caseData }: Props) {
  const score = Math.round(caseData.evidence_completeness_score * 100);
  const scoreColor = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!caseData.respond_by) return;
    
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(caseData.respond_by!).getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    };

    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [caseData.respond_by]);

  return (
    <div style={{
      background: "#0A0C10",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "24px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32,
      marginBottom: 24,
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: 4, background: "#3B82F6" }} />
      
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <span style={{ fontFamily: SYNE, fontSize: 32, fontWeight: 800, color: "#F1F4F9", letterSpacing: "-0.03em" }}>
            {caseData.dispute_id}
          </span>
          <StatusBadge status={caseData.status} size="md" />
        </div>
        
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Hash size={14} color="#4B5563" />
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>
              PAYMENT_ID: <span style={{ color: "#9CA3AF" }}>{caseData.payment_id ?? "UNKNOWN"}</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldAlert size={14} color="#4B5563" />
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>
              CODE: <span style={{ color: "#9CA3AF" }}>{caseData.reason_code ?? "GENERAL"}</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
        {/* SLA Ticker */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#6B7280", fontFamily: MONO, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
            <Clock size={10} /> SLA_COUNTDOWN
          </div>
          <div style={{ 
            fontFamily: MONO, 
            fontSize: 20, 
            fontWeight: 700, 
            color: timeLeft.startsWith("0d") ? "#EF4444" : "#F1F4F9",
            letterSpacing: "-0.02em"
          }}>
            {timeLeft || "NO_SLATE"}
          </div>
        </div>

        {/* Amount */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#6B7280", fontFamily: MONO, fontWeight: 700, marginBottom: 4 }}>
            CAPTURED_VOLUME
          </div>
          <div style={{ fontFamily: SYNE, fontSize: 24, fontWeight: 800, color: "#10B981" }}>
            ₹{caseData.amount.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Evidence Gauge */}
        <div style={{ textAlign: "center", minWidth: 100 }}>
          <div style={{ fontSize: 10, color: "#6B7280", fontFamily: MONO, fontWeight: 700, marginBottom: 4 }}>
            EVIDENCE_SIG
          </div>
          <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: scoreColor }}>
            {score}%
          </div>
        </div>

        {/* Recommendation */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <RecommendationBadge recommendation={caseData.recommendation} size="lg" />
          {caseData.confidence_band && (
            <div style={{
              fontSize: 9,
              fontFamily: MONO,
              fontWeight: 700,
              color: CONFIDENCE_COLORS[caseData.confidence_band] ?? "#6B7280",
              background: "rgba(255,255,255,0.03)",
              padding: "2px 6px",
              borderRadius: 4
            }}>
              {caseData.confidence_band.toUpperCase()}_CONFIDENCE
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
