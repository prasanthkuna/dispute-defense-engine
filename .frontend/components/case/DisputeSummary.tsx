import { formatCurrency, formatDateTime, formatPhase, formatReasonCode } from "../../lib/disputes";

const MONO = "'IBM Plex Mono', monospace";

interface Props {
  caseData: any;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #1A1D24",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 11, color: "#6B7280", fontFamily: MONO }}>{label}</span>
      <span style={{ fontSize: 12, color: "#E8EAF0", fontFamily: mono ? MONO : "Inter, sans-serif", fontWeight: 500, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export default function DisputeSummary({ caseData }: Props) {
  return (
    <div
      style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        padding: 20,
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontSize: 12, fontFamily: MONO, color: "#6B7280", fontWeight: 600, letterSpacing: "0.1em" }}>
        DISPUTE SUMMARY
      </h3>
      <Row label="DISPUTE ID" value={caseData.dispute_id} mono />
      <Row label="PAYMENT ID" value={caseData.payment_id ?? "Not captured"} mono />
      <Row label="MERCHANT" value={caseData.merchant_name} />
      <Row label="AMOUNT" value={`${formatCurrency(caseData.amount, caseData.currency)} ${caseData.currency}`} mono />
      <Row label="AMOUNT DEDUCTED" value={formatCurrency(caseData.amount_deducted, caseData.currency)} mono />
      <Row label="REASON CODE" value={formatReasonCode(caseData.reason_code)} mono />
      <Row label="PHASE" value={formatPhase(caseData.phase)} mono />
      <Row label="NETWORK" value={caseData.network ?? "Unknown"} mono />
      <Row label="EXTERNAL STATUS" value={caseData.external_status ?? "Unknown"} mono />
      <Row label="RESPOND BY" value={formatDateTime(caseData.respond_by)} mono />
      <Row label="SCENARIO" value={caseData.scenario_type.replace(/_/g, " ")} />
      <Row label="APPROVAL STATE" value={caseData.approval_state} mono />
      <Row label="CREATED" value={formatDateTime(caseData.created_at)} mono />
      <Row label="UPDATED" value={formatDateTime(caseData.updated_at)} mono />
    </div>
  );
}
