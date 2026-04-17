import { CheckCircle, XCircle, MinusCircle } from "lucide-react";

const EVIDENCE_LABELS: Record<string, string> = {
  payment_record: "Payment Record",
  order_details: "Order Details",
  awb_tracking: "AWB Tracking",
  logistics_status: "Logistics Status",
  proof_of_delivery: "Proof of Delivery (POD)",
  invoice: "Tax Invoice",
  customer_communication: "Customer Communication",
  merchant_policy: "Merchant Policy",
  document_ocr: "Document OCR",
};

const ALL_TYPES = [
  "payment_record",
  "order_details",
  "awb_tracking",
  "logistics_status",
  "proof_of_delivery",
  "invoice",
  "customer_communication",
  "merchant_policy",
];

interface Props {
  evidence: any[];
  score: number;
}

export default function EvidenceChecklist({ evidence, score }: Props) {
  const scorePercent = Math.round(score * 100);
  
  const getScoreColor = (p: number) => {
    if (p >= 80) return "text-signal-green";
    if (p >= 50) return "text-hazard-orange";
    return "text-destructive";
  };

  const getScoreBg = (p: number) => {
    if (p >= 80) return "bg-signal-green";
    if (p >= 50) return "bg-hazard-orange";
    return "bg-destructive";
  };

  const byType: Record<string, any> = {};
  for (const item of evidence) {
    if (!byType[item.evidence_type]) byType[item.evidence_type] = item;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="m-0 text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase">
          EVIDENCE CHECKLIST
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 rounded-full ${getScoreBg(scorePercent)}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <span className={`font-mono text-xl font-bold tracking-tighter ${getScoreColor(scorePercent)}`}>
            {scorePercent}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {ALL_TYPES.map((type) => {
          const item = byType[type];
          const status = item?.status ?? "missing";

          const getStatusStyles = (s: string) => {
            switch (s) {
              case "found":
                return {
                  icon: <CheckCircle size={14} />,
                  text: "text-signal-green",
                  border: "border-signal-green/20",
                  bg: "bg-signal-green/5"
                };
              case "partial":
                return {
                  icon: <MinusCircle size={14} />,
                  text: "text-hazard-orange",
                  border: "border-hazard-orange/20",
                  bg: "bg-hazard-orange/5"
                };
              default:
                return {
                  icon: <XCircle size={14} />,
                  text: "text-destructive",
                  border: "border-border/50",
                  bg: "bg-secondary/20"
                };
            }
          };

          const styles = getStatusStyles(status);

          return (
            <div 
              key={type} 
              className={`border rounded-md p-3.5 flex items-start gap-3 transition-all duration-200 ${styles.border} ${styles.bg} hover:shadow-md`}
            >
              <span className={`shrink-0 mt-0.5 ${styles.text}`}>{styles.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-foreground leading-tight mb-1">
                  {EVIDENCE_LABELS[type] ?? type}
                </div>
                {item ? (
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono text-muted-foreground font-bold uppercase tracking-tight">
                      {item.source_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/80 leading-normal line-clamp-2 italic">
                      {item.preview_text}
                    </div>
                    {item.confidence < 1 && (
                      <div className="text-[9px] font-mono font-bold text-hazard-orange mt-1.5 uppercase">
                        Confidence: {Math.round(item.confidence * 100)}%
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-muted-foreground/40 font-medium uppercase tracking-widest">
                    Missing
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
