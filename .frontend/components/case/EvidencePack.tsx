import { FileText, Database, Shield } from "lucide-react";

const STATUS_COLORS: Record<string, { text: string; border: string; bg: string }> = {
  found: { text: "text-signal-green", border: "border-signal-green/20", bg: "bg-signal-green/5" },
  partial: { text: "text-hazard-orange", border: "border-hazard-orange/20", bg: "bg-hazard-orange/5" },
  missing: { text: "text-destructive", border: "border-destructive/20", bg: "bg-destructive/5" },
};

interface Props {
  evidence: any[];
}

export default function EvidencePack({ evidence }: Props) {
  return (
    <div className="animate-stagger">
      <div className="flex items-center justify-between mb-6">
        <h3 className="m-0 text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase">
          EVIDENCE PACK TELEMETRY
        </h3>
        <span className="bg-primary/10 text-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-primary/20">
          {evidence.length} OBJECTS
        </span>
      </div>

      {evidence.length === 0 ? (
        <div className="p-20 text-center flex flex-col items-center gap-4 bg-card border border-border rounded-lg shadow-sm">
          <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
            <FileText size={20} className="text-muted-foreground/30" />
          </div>
          <div className="font-mono text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
            No evidence objects detected
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {evidence.map((item) => {
            const styles = STATUS_COLORS[item.status] ?? STATUS_COLORS.missing;
            return (
              <div 
                key={item.id} 
                className={`bg-card border border-border rounded-lg p-5 shadow-sm transition-all hover:border-primary/30 group relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${styles.text.replace("text-", "bg-")}`} />
                
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${styles.bg}`}>
                    <FileText size={18} className={styles.text} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-display text-[15px] font-bold text-foreground leading-tight">{item.title}</span>
                      <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${styles.text} ${styles.border} ${styles.bg}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex gap-x-4 gap-y-1.5 mb-3 flex-wrap">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                        <Database size={10} className="opacity-40" />
                        <span className="font-bold uppercase tracking-tight text-foreground/60">{item.source_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                        <Shield size={10} className="opacity-40" />
                        <span className="font-bold uppercase tracking-tight text-primary/70">{item.purpose}</span>
                      </div>
                      {item.confidence < 1 && (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-hazard-orange font-bold uppercase tracking-tighter">
                          {Math.round(item.confidence * 100)}% Match
                        </div>
                      )}
                    </div>

                    <p className="m-0 text-[13px] text-foreground/80 leading-relaxed mb-4">
                      {item.summary_text}
                    </p>

                    {item.preview_text && (
                      <div className="bg-secondary/30 border border-border/50 rounded-md p-3 font-mono text-[11px] text-primary leading-snug break-all overflow-wrap-anywhere italic shadow-inner">
                        <span className="text-muted-foreground/40 mr-2 not-italic font-bold">RAW:</span>
                        {item.preview_text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
