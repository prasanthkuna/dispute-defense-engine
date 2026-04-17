import { formatCurrency, formatDateTime, formatPhase, formatReasonCode } from "../../lib/disputes";

interface Props {
  caseData: any;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border/30 gap-4 last:border-0">
      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">{label}</span>
      <span className={`text-[12px] text-foreground font-medium text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default function DisputeSummary({ caseData }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="m-0 mb-4 text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase">
        DISPUTE SUMMARY
      </h3>
      <div className="space-y-0.5">
        <Row label="DISPUTE ID" value={caseData.dispute_id} mono />
        <Row label="PAYMENT ID" value={caseData.payment_id ?? "Not captured"} mono />
        <Row label="MERCHANT" value={caseData.merchant_name} />
        <Row label="AMOUNT" value={`${formatCurrency(caseData.amount, caseData.currency)} ${caseData.currency}`} mono />
        <Row label="AMOUNT DEDUCTED" value={formatCurrency(caseData.amount_deducted, caseData.currency)} mono />
        <Row label="REASON CODE" value={formatReasonCode(caseData.reason_code)} mono />
        <Row label="PHASE" value={formatPhase(caseData.phase)} mono />
        <Row label="NETWORK" value={caseData.network ?? "Unknown"} mono />
        <Row label="EXTERNAL STATUS" value={caseData.external_status ?? "Unknown"} mono />
        <Row label="LAST WEBHOOK" value={formatDateTime(caseData.last_webhook_at)} mono />
        <Row label="REWORK REASON" value={caseData.rework_reason ?? "None"} />
        <Row label="RESPOND BY" value={formatDateTime(caseData.respond_by)} mono />
        <Row label="SCENARIO" value={caseData.scenario_type.replace(/_/g, " ")} />
        <Row label="APPROVAL STATE" value={caseData.approval_state} mono />
        <Row label="CREATED" value={formatDateTime(caseData.created_at)} mono />
        <Row label="UPDATED" value={formatDateTime(caseData.updated_at)} mono />
      </div>
    </div>
  );
}
