import React from "react";
import { Bot, User, Settings, Shield, Activity } from "lucide-react";
import type { ActorType } from "~backend/audit/types";

interface Props {
  logs: any[];
}

function actorConfig(type: ActorType) {
  switch (type) {
    case "system":
      return { color: "text-primary", border: "border-primary/40", bg: "bg-primary/10", label: "SYSTEM", Icon: Settings };
    case "agent":
      return { color: "text-accent-foreground", border: "border-accent-foreground/40", bg: "bg-accent-foreground/10", label: "AI AGENT", Icon: Bot };
    case "operator":
      return { color: "text-signal-green", border: "border-signal-green/40", bg: "bg-signal-green/10", label: "OPERATOR", Icon: User };
    case "approver":
      return { color: "text-hazard-orange", border: "border-hazard-orange/40", bg: "bg-hazard-orange/10", label: "APPROVER", Icon: Shield };
    default:
      return { color: "text-muted-foreground", border: "border-border", bg: "bg-secondary", label: String(type).toUpperCase(), Icon: User };
  }
}

function formatAction(action: string) {
  return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AuditTimeline({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
          <Activity size={20} className="text-muted-foreground/30" />
        </div>
        <div className="font-mono text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
          No audit history recorded
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm animate-stagger">
      <div className="flex items-center justify-between mb-8">
        <h3 className="m-0 text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase">
          PROTOCOL AUDIT TRAIL
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground font-bold bg-secondary/50 px-2 py-0.5 rounded border border-border">
          {logs.length} EVENTS
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/40" />

        <div className="space-y-6">
          {logs.map((log) => {
            const config = actorConfig(log.actor_type);
            return (
              <div key={log.id} className="relative flex gap-6 group">
                {/* Timeline Icon */}
                <div className={`w-8 h-8 rounded-full border-2 ${config.bg} ${config.border} flex items-center justify-center shrink-0 z-10 shadow-sm transition-transform group-hover:scale-110`}>
                  <config.Icon size={14} className={config.color} />
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-secondary/20 border border-border/40 rounded-lg p-4 group-hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${config.color} ${config.border} ${config.bg}`}>
                      {config.label}
                    </span>
                    <span className="font-display text-[14px] font-bold text-foreground">
                      {formatAction(log.action_type || "action")}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/40 ml-auto">
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                      })}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-muted-foreground/80 mb-3 font-bold uppercase tracking-tight">
                    {log.actor_name}
                  </div>

                  {Object.keys(log.details_json).length > 0 && (
                    <div className="bg-background/40 border border-border/30 rounded-md p-3 font-mono text-[11px] space-y-1.5 shadow-inner">
                      {Object.entries(log.details_json).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[140px_1fr] gap-4">
                          <span className="text-muted-foreground/40 uppercase font-bold tracking-tighter shrink-0">{k}</span>
                          <span className="text-foreground/70 break-all">
                            {typeof v === "object" ? JSON.stringify(v) : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
