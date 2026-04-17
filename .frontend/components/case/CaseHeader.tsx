import StatusBadge from "../StatusBadge";
import RecommendationBadge from "../RecommendationBadge";
import { formatCurrency, formatDateTime, formatPhase, formatReasonCode, getSlaState } from "../../lib/disputes";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "var(--signal-green)",
  Medium: "var(--hazard-orange)",
  Low: "var(--destructive)",
};

interface Props {
  caseData: any;
}

function Metric({ label, value, color, sublabel }: { label: string; value: string; color: string; sublabel?: string }) {
  return (
    <div className="min-w-[140px]">
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">{label}</div>
      <div className="font-display text-2xl font-bold tracking-tight" style={{ color }}>{value}</div>
      {sublabel ? <div className="font-mono text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-tighter">{sublabel}</div> : null}
    </div>
  );
}

export default function CaseHeader({ caseData }: Props) {
  const sla = getSlaState(caseData.respond_by);
  const isAcceptCase = caseData.recommendation === "Accept";

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-wrap items-start justify-between gap-6 shadow-sm">
      <div className="max-w-[600px] flex-1">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="font-display text-2xl font-bold text-foreground tracking-tight">{caseData.dispute_id}</span>
          <StatusBadge status={caseData.status} size="md" />
          <span
            className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border transition-colors uppercase tracking-widest"
            style={{ color: sla.color, borderColor: sla.border, backgroundColor: `${sla.color}10` }}
          >
            {sla.label}
          </span>
        </div>

        <div className="text-[14px] text-foreground/80 font-medium mb-2.5">
          {caseData.merchant_name} <span className="text-muted-foreground mx-1.5">•</span> {formatPhase(caseData.phase)} <span className="text-muted-foreground mx-1.5">•</span> {formatReasonCode(caseData.reason_code)}
        </div>

        <div className="flex gap-x-5 gap-y-2 flex-wrap font-mono text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/40 font-bold">PAYMENT</span>
            <span className="text-foreground/70">{caseData.payment_id ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/40 font-bold">NETWORK</span>
            <span className="text-foreground/70">{caseData.network ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/40 font-bold">DUE</span>
            <span className="text-foreground/70">{formatDateTime(caseData.respond_by)}</span>
          </div>
        </div>

        {caseData.rework_reason && (
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold text-hazard-orange bg-hazard-orange/10 border border-hazard-orange/20 rounded-md px-3 py-2 uppercase tracking-tight">
            <span className="bg-hazard-orange text-white text-[9px] px-1 rounded-sm">ACTION REQUIRED</span>
            {caseData.rework_reason}
          </div>
        )}
        
        {isAcceptCase && (
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2 uppercase tracking-tight leading-snug">
            <span className="bg-destructive text-white text-[9px] px-1 rounded-sm shrink-0">WARNING</span>
            Acceptance is irreversible. Approver confirmation required.
          </div>
        )}
      </div>

      <div className="flex gap-8 flex-wrap items-start">
        <Metric label="DISPUTED VALUE" value={formatCurrency(caseData.amount, caseData.currency)} color="var(--signal-green)" />
        <Metric
          label="DEDUCTED"
          value={formatCurrency(caseData.amount_deducted, caseData.currency)}
          color={(caseData.amount_deducted ?? 0) > 0 ? "var(--hazard-orange)" : "var(--muted-foreground)"}
          sublabel={(caseData.amount_deducted ?? 0) > 0 ? "Funds Impacted" : "No deduction"}
        />
        <Metric label="EVIDENCE SCORE" value={`${Math.round(caseData.evidence_completeness_score * 100)}%`} color="var(--primary)" />

        <div className="min-w-[170px] bg-secondary/30 rounded-lg p-3 border border-border/50">
          <div className="mb-2">
            <RecommendationBadge recommendation={caseData.recommendation} size="md" />
          </div>
          {caseData.confidence_band ? (
            <div
              className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2"
              style={{ color: CONFIDENCE_COLORS[caseData.confidence_band] ?? "var(--muted-foreground)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: CONFIDENCE_COLORS[caseData.confidence_band] ?? "var(--muted-foreground)" }} />
              {caseData.confidence_band} Confidence
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
