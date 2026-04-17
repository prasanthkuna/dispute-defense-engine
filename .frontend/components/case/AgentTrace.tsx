import { useState } from "react";
import { ChevronRight, ChevronDown, Terminal, Wrench, Eye, Clock } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  success: "text-signal-green",
  warning: "text-hazard-orange",
  error: "text-destructive",
  pending: "text-muted-foreground",
};

interface Props {
  steps: any[];
}

function StepRow({ step, index }: { step: any; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = STATUS_COLORS[step.status] ?? "text-muted-foreground";
  const isTool = step.action_type === "tool_call";

  return (
    <div className="border-b border-border/20 last:border-0">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-start gap-4 p-4 cursor-pointer hover:bg-secondary/20 transition-all group"
      >
        <div className="font-mono text-[10px] text-muted-foreground/40 w-6 pt-1 flex-shrink-0 group-hover:text-muted-foreground transition-colors">
          {String(step.step_number).padStart(2, "0")}
        </div>

        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${colorClass.replace("text-", "bg-")} shadow-[0_0_8px_rgba(0,0,0,0.2)]`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            {isTool ? (
              <span className="font-mono text-[11px] text-primary font-bold flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                <Wrench size={10} />
                CALL: {step.tool_name}
              </span>
            ) : (
              <span className="font-mono text-[11px] text-accent-foreground font-bold flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded border border-border/50">
                <Eye size={10} />
                OBSERVE
              </span>
            )}
            <span className="font-mono text-[9px] text-muted-foreground/60 flex items-center gap-1">
              <Clock size={8} />
              {new Date(step.created_at).toLocaleTimeString("en-IN", { hour12: false })}
            </span>
          </div>
          <div className="text-[13px] text-foreground/90 leading-relaxed font-medium">
            {step.observation_text}
          </div>
        </div>

        <div className="text-muted-foreground/30 pt-1 group-hover:text-muted-foreground transition-colors">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-6 ml-14 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-mono text-[9px] text-muted-foreground font-bold uppercase tracking-widest pl-1">Argument Input</div>
              <pre className="bg-background/80 border border-border rounded-lg p-4 font-mono text-[11px] text-muted-foreground overflow-auto max-h-[200px] shadow-inner">
                {JSON.stringify(step.input_json, null, 2)}
              </pre>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-[9px] text-muted-foreground font-bold uppercase tracking-widest pl-1">Execution Result</div>
              <pre className={`bg-background/80 border border-border rounded-lg p-4 font-mono text-[11px] overflow-auto max-h-[200px] shadow-inner ${colorClass}`}>
                {JSON.stringify(step.output_json, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentTrace({ steps }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-secondary/30 border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className="text-primary" />
          <span className="font-mono text-[11px] text-foreground font-bold uppercase tracking-widest">
            Agent Execution Telemetry
          </span>
          <span className="bg-primary/10 text-primary text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-primary/20 ml-2">
            {steps.length} STEPS
          </span>
        </div>
        <div className="flex gap-4">
          {[
            { colorClass: "bg-signal-green", label: "success" },
            { colorClass: "bg-hazard-orange", label: "warning" },
            { colorClass: "bg-destructive", label: "error" },
          ].map(({ colorClass, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
              <span className="text-[9px] font-mono text-muted-foreground font-bold uppercase tracking-tighter">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card/50">
        {steps.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
              <Terminal size={20} className="text-muted-foreground/30" />
            </div>
            <div className="font-mono text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
              Awaiting telemetry stream...
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            {steps.map((step, idx) => (
              <StepRow key={step.id} step={step} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
