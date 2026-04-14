import { formatCurrency, formatDateTime, formatPhase, formatReasonCode } from "../../lib/disputes";

const MONO = "'IBM Plex Mono', monospace";

interface Props {
  caseData: any;
  events: any[];
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0" }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280" }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 11, color: "#E8EAF0", textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default function IntakePayloadCard({ caseData, events }: Props) {
  const event = events[0] ?? null;

  return (
    <div
      style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        padding: 20,
        height: "100%",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", marginBottom: 16, letterSpacing: "0.1em" }}>
        ORIGINAL INTAKE
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#3B82F6", marginBottom: 10 }}>NORMALIZED CASE VIEW</div>
          <MetaRow label="PAYMENT ID" value={caseData.payment_id ?? "Not captured"} />
          <MetaRow label="REASON CODE" value={formatReasonCode(caseData.reason_code)} />
          <MetaRow label="PHASE" value={formatPhase(caseData.phase)} />
          <MetaRow label="NETWORK" value={caseData.network ?? "Unknown"} />
          <MetaRow label="EXTERNAL STATUS" value={caseData.external_status ?? "Unknown"} />
          <MetaRow label="LAST WEBHOOK" value={formatDateTime(caseData.last_webhook_at)} />
          <MetaRow label="REWORK REASON" value={caseData.rework_reason ?? "None"} />
          <MetaRow label="RESPOND BY" value={formatDateTime(caseData.respond_by)} />
          <MetaRow label="AMOUNT" value={formatCurrency(caseData.amount, caseData.currency)} />
          <MetaRow label="AMOUNT DEDUCTED" value={formatCurrency(caseData.amount_deducted, caseData.currency)} />
        </div>

        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#3B82F6", marginBottom: 10 }}>WEBHOOK PAYLOAD</div>
          {!event ? (
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#3D4251" }}>No intake event recorded yet.</div>
          ) : (
            <>
              <MetaRow label="EVENT TYPE" value={event.event_type} />
              <MetaRow label="EXTERNAL EVENT ID" value={event.external_event_id} />
              <MetaRow label="RECEIVED" value={formatDateTime(event.processed_at)} />
              <pre
                style={{
                  margin: "12px 0 0",
                  background: "#0A0C10",
                  border: "1px solid #2A2D36",
                  borderRadius: 8,
                  padding: "12px 14px",
                  fontFamily: MONO,
                  fontSize: 10,
                  color: "#9CA3AF",
                  overflow: "auto",
                  maxHeight: 320,
                }}
              >
                {JSON.stringify(event.payload_json, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
