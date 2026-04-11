import type { Case } from "~backend/cases/types";

const MONO = "'IBM Plex Mono', monospace";

interface Props {
  caseData: any;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      borderBottom: "1px solid #1A1D24",
    }}>
      <span style={{ fontSize: 11, color: "#6B7280", fontFamily: MONO }}>{label}</span>
      <span style={{ fontSize: 12, color: "#E8EAF0", fontFamily: mono ? MONO : "Inter, sans-serif", fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

export default function DisputeSummary({ caseData }: Props) {
  return (
    <div style={{
      background: "#111318",
      border: "1px solid #2A2D36",
      borderRadius: 10,
      padding: 20,
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 12, fontFamily: MONO, color: "#6B7280", fontWeight: 600, letterSpacing: "0.1em" }}>
        DISPUTE SUMMARY
      </h3>
      <Row label="DISPUTE ID" value={caseData.dispute_id} mono />
      <Row label="MERCHANT" value={caseData.merchant_name} />
      <Row label="AMOUNT" value={`₹${caseData.amount.toLocaleString("en-IN")} ${caseData.currency}`} mono />
      <Row label="REASON" value={caseData.dispute_reason.replace(/_/g, " ").toUpperCase()} mono />
      <Row label="SCENARIO" value={caseData.scenario_type.replace(/_/g, " ")} />
      <Row label="APPROVAL STATE" value={caseData.approval_state} mono />
      <Row label="CREATED" value={new Date(caseData.created_at).toLocaleString("en-IN")} mono />
      <Row label="UPDATED" value={new Date(caseData.updated_at).toLocaleString("en-IN")} mono />
    </div>
  );
}
