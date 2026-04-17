import { formatCurrency, formatDateTime, formatPhase, formatReasonCode } from "../../lib/disputes";

interface Props {
  caseData: any;
  events: any[];
}

function normalizePayload(payload: unknown) {
  if (!payload) return null;
  try {
    return typeof payload === "string" ? JSON.parse(payload) : payload;
  } catch {
    return payload;
  }
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3 py-1.5 border-b border-border/20 last:border-0">
      <span className="font-mono text-[9px] text-muted-foreground font-bold uppercase tracking-widest pt-0.5">{label}</span>
      <span className="font-mono text-[11px] text-foreground/90 text-left min-w-0 break-all overflow-wrap-anywhere">
        {value}
      </span>
    </div>
  );
}

export default function IntakePayloadCard({ caseData, events }: Props) {
  const event = events[0] ?? null;
  const normalizedPayload = normalizePayload(event?.payload_json);

  return (
    <div className="bg-card border border-border rounded-lg p-5 h-full flex flex-col shadow-sm">
      <div className="font-mono text-[10px] text-muted-foreground font-bold mb-5 tracking-widest uppercase">
        ORIGINAL INTAKE TELEMETRY
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start flex-1">
        <section className="bg-secondary/30 border border-border/50 rounded-lg p-5">
          <div className="font-mono text-[10px] text-primary font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Normalized Model
          </div>
          <div className="space-y-0.5">
            <MetaRow label="DISPUTE ID" value={caseData.dispute_id} />
            <MetaRow label="PAYMENT ID" value={caseData.payment_id ?? "—"} />
            <MetaRow label="REASON" value={formatReasonCode(caseData.reason_code)} />
            <MetaRow label="PHASE" value={formatPhase(caseData.phase)} />
            <MetaRow label="NETWORK" value={caseData.network ?? "—"} />
            <MetaRow label="EXT STATUS" value={caseData.external_status ?? "—"} />
            <MetaRow label="DUE DATE" value={formatDateTime(caseData.respond_by)} />
            <MetaRow label="VALUE" value={formatCurrency(caseData.amount, caseData.currency)} />
            <MetaRow label="DEDUCTED" value={formatCurrency(caseData.amount_deducted, caseData.currency)} />
          </div>
        </section>

        <section className="bg-secondary/30 border border-border/50 rounded-lg p-5 flex flex-col h-full min-h-[400px]">
          <div className="font-mono text-[10px] text-primary font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Webhook Raw Payload
          </div>
          {!event ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground/40 font-mono text-[11px] uppercase tracking-widest">
              No intake event captured
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-background/50 p-2 rounded border border-border/30">
                  <div className="text-[8px] font-mono text-muted-foreground font-bold uppercase mb-1">Event Type</div>
                  <div className="text-[10px] font-mono text-foreground font-bold truncate">{event.event_type}</div>
                </div>
                <div className="bg-background/50 p-2 rounded border border-border/30">
                  <div className="text-[8px] font-mono text-muted-foreground font-bold uppercase mb-1">Processed At</div>
                  <div className="text-[10px] font-mono text-foreground font-bold truncate">{formatDateTime(event.processed_at)}</div>
                </div>
              </div>
              <pre className="flex-1 m-0 bg-background/80 border border-border rounded-lg p-4 font-mono text-[11px] text-primary/80 overflow-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent select-all leading-relaxed">
                {JSON.stringify(normalizedPayload, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
