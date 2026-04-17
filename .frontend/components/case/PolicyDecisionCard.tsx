import { Shield, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import RecommendationBadge from "../RecommendationBadge";
import type { PolicyDecision } from "~backend/policy/types";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "var(--signal-green)",
  Medium: "var(--hazard-orange)",
  Low: "var(--destructive)",
};

interface Props {
  decision: PolicyDecision | null;
  large?: boolean;
}

export default function PolicyDecisionCard({ decision, large }: Props) {
  const isAcceptDecision = decision?.recommended_action === "Accept";
  const approvalRequired = isAcceptDecision || Boolean(decision?.approval_required);

  return (
    <div className={`bg-card border border-border rounded-lg p-6 h-full flex flex-col shadow-sm ${large ? "p-8" : "p-6"}`}>
      {/* Engine label */}
      <div className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-md px-3 py-1.5 mb-6 w-fit">
        <Shield size={12} className="text-primary" />
        <span className="font-mono text-[9px] text-primary font-bold tracking-widest uppercase">
          DETERMINISTIC POLICY ENGINE
        </span>
      </div>

      {!decision ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg text-center">
          <Loader2 size={24} className="text-muted-foreground/30 mb-3" />
          <div className="text-muted-foreground font-mono text-[11px] uppercase tracking-widest">
            No policy decision available.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Decision */}
          <div className="flex items-center gap-5">
            <RecommendationBadge recommendation={decision.recommended_action} size="md" />
            
            <div className="h-8 w-px bg-border/50" />
            
            <div>
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">CONFIDENCE</div>
              <div 
                className="font-display text-lg font-bold tracking-tight uppercase"
                style={{ color: CONFIDENCE_COLORS[decision.confidence_band] ?? "var(--muted-foreground)" }}
              >
                {decision.confidence_band}
              </div>
            </div>

            <div className="ml-auto">
              <span className={`
                font-mono text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-tight
                ${approvalRequired 
                  ? "bg-hazard-orange/10 text-hazard-orange border-hazard-orange/20" 
                  : "bg-signal-green/10 text-signal-green border-signal-green/20"}
              `}>
                {approvalRequired ? "APPROVAL REQUIRED" : "AUTO-APPROVED"}
              </span>
            </div>
          </div>

          {isAcceptDecision && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex flex-col gap-2 shadow-inner">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-destructive" />
                <span className="font-mono text-[11px] font-bold text-destructive uppercase tracking-widest">
                  IRREVERSIBLE PATH
                </span>
              </div>
              <p className="m-0 text-[12px] text-foreground/80 leading-relaxed font-medium italic">
                "Accepting a dispute is a final action. This should only be chosen when carrier evidence clearly rules out defense."
              </p>
            </div>
          )}

          {/* Rationale */}
          {(decision.rationale_json as string[]).length > 0 && (
            <div>
              <div className="font-mono text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-3">
                RATIONALE
              </div>
              <div className="space-y-2.5">
                {(decision.rationale_json as string[]).map((r, i) => (
                  <div key={i} className="flex gap-3 items-start group">
                    <CheckCircle size={14} className="text-signal-green shrink-0 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[13px] text-foreground/90 leading-relaxed font-medium">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing items */}
          {(decision.missing_items_json as string[]).length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <div className="font-mono text-[10px] text-hazard-orange font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <AlertTriangle size={12} />
                MISSING EVIDENCE
              </div>
              <div className="flex flex-wrap gap-2">
                {(decision.missing_items_json as string[]).map((m, i) => (
                  <span key={i} className="bg-hazard-orange/10 text-hazard-orange font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-hazard-orange/20 uppercase tracking-tighter">
                    {m.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
