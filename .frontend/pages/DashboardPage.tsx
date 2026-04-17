import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/client";
import type { IngestedEvent } from "~backend/ingest/types";
import { SCENARIOS } from "../lib/scenarios";
import { fetchApi } from "../lib/api";
import { useCaseStats } from "../hooks/useCases";
import { formatCurrency, formatDateTime } from "../lib/disputes";
import {
  Activity,
  AlertTriangle,
  BadgeIndianRupee,
  Bot,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Scale,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function getDisputePayload(payload: unknown): Record<string, any> | null {
  if (!payload) return null;
  try {
    const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
    if (!parsed) return null;
    return (parsed as any)?.payload?.dispute ?? (parsed as any)?.dispute ?? null;
  } catch {
    return null;
  }
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: any;
  colorClass: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 min-h-[148px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-widest">{label}</span>
        <Icon size={16} className={colorClass} />
      </div>
      <div className={`text-2xl font-display font-bold tracking-tight ${colorClass}`}>{value}</div>
      <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed font-medium">{note}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { data: stats, isLoading: statsLoading, isError: statsError } = useCaseStats();

  const { data: eventData, isError: eventsError } = useQuery({
    queryKey: ["ingest", "events"],
    queryFn: () => fetchApi<{ events: IngestedEvent[] }>("/ingest/events"),
    refetchInterval: 5000,
  });

  const events = eventData?.events ?? [];

  const summaryLine = useMemo(() => {
    if (!stats || stats.total_cases === 0) {
      return "Seed the four curated disputes to showcase intake normalization, evidence collection, decisioning, approvals, and bank-ready drafting.";
    }
    return `${stats.total_cases} live cases spanning ${formatCurrency(stats.total_disputed_amount)} in dispute value, with ${stats.overdue_count} overdue and ${stats.due_in_24h_count} due within 24 hours.`;
  }, [stats]);

  const hasSeededCases = (stats?.total_cases ?? 0) > 0;

  const seedScenarios = async () => {
    setIsSeeding(true);
    try {
      await client.simulation.seed();
      toast({ title: "Demo disputes seeded", description: "Four Razorpay-aligned cases are now available." });
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["cases", "stats"] });
      qc.invalidateQueries({ queryKey: ["ingest", "events"] });
    } catch {
      toast({ title: "Seed failed", description: "Unable to create demo disputes.", variant: "destructive" });
    } finally {
      setIsSeeding(false);
    }
  };

  const resetEnvironment = async () => {
    setIsResetting(true);
    try {
      await client.simulation.reset();
      toast({ title: "Environment reset", description: "All demo cases and telemetry were cleared." });
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["cases", "stats"] });
      qc.invalidateQueries({ queryKey: ["ingest", "events"] });
    } catch {
      toast({ title: "Reset failed", description: "The environment could not be cleared.", variant: "destructive" });
    } finally {
      setIsResetting(false);
    }
  };

  if (statsLoading) {
    return (
      <div className="p-20 flex items-center justify-center gap-4">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="font-mono text-[13px] text-muted-foreground uppercase tracking-widest font-bold">Synchronizing Global Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1500px] mx-auto animate-stagger">
      {(statsError || eventsError) && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-5 py-4 mb-6 text-[13px] font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle size={16} />
          <span>Real-time telemetry stream interrupted. Attempting reconnection...</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mb-6 items-stretch">
        <div className="bg-card border border-border rounded-xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg h-[480px]">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-5">
              <ShieldCheck size={18} className="text-primary" />
              <span className="font-mono text-[11px] text-primary font-bold tracking-[0.2em] uppercase">Dispute Defense Command Center</span>
            </div>
            <h1 className="m-0 font-display text-6xl leading-[1.1] text-foreground tracking-tight">
              Operational
              <br />
              <span className="text-muted-foreground/40">Intelligence View</span>
            </h1>
            <p className="mt-6 max-w-[600px] text-muted-foreground text-[16px] leading-relaxed font-medium">
              {summaryLine}
            </p>
          </div>

          <div className="mt-10 relative z-10">
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={seedScenarios}
                disabled={isSeeding || hasSeededCases}
                className={`
                  bg-primary text-primary-foreground rounded-lg px-6 py-3.5 font-mono text-[12px] font-bold uppercase tracking-widest
                  flex items-center gap-3 transition-all duration-300 shadow-xl shadow-primary/20
                  ${isSeeding ? "opacity-80 cursor-wait" : hasSeededCases ? "opacity-40 cursor-not-allowed" : "hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"}
                `}
              >
                {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <WandSparkles size={16} />}
                {isSeeding ? "Seeding..." : hasSeededCases ? "Scenarios Active" : "Initialize Demo Cluster"}
              </button>

              <button
                onClick={resetEnvironment}
                disabled={isResetting}
                className={`
                  bg-secondary/50 border border-border text-foreground rounded-lg px-6 py-3.5 font-mono text-[12px] font-bold uppercase tracking-widest
                  flex items-center gap-3 transition-all duration-300
                  ${isResetting ? "opacity-80 cursor-wait" : "hover:bg-secondary hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"}
                `}
              >
                <RefreshCw size={16} className={isResetting ? "animate-spin" : ""} />
                {isResetting ? "Resetting..." : "Purge Environment"}
              </button>
            </div>

            <div className="flex gap-6 mt-8 flex-wrap border-t border-border/30 pt-6">
              <div className="flex items-center gap-2.5 text-muted-foreground/60 text-[12px] font-mono font-bold uppercase tracking-tight">
                <Bot size={15} className="text-accent-foreground" />
                Active Agent Monitoring
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground/60 text-[12px] font-mono font-bold uppercase tracking-tight">
                <CheckCircle2 size={15} className="text-signal-green" />
                Multi-Role Approval Gating
              </div>
            </div>
          </div>
          
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-lg overflow-hidden h-[480px]">
          <div className="flex items-center justify-between mb-5 border-b border-border/50 pb-4">
            <div className="flex items-center gap-2.5">
              <Activity size={16} className="text-primary" />
              <span className="font-mono text-[11px] text-foreground font-bold uppercase tracking-[0.15em]">Live Ingestion Stream</span>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-signal-green/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-signal-green/20" />
            </div>
          </div>

          {events.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                <Activity size={20} className="text-muted-foreground/20" />
              </div>
              <p className="text-muted-foreground/60 text-[13px] leading-relaxed font-medium">
                No ingestion events detected. Initialize the demo cluster to simulate real-time dispute webhooks.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
              {events.map((event) => {
                const dispute = getDisputePayload(event.payload_json);
                const merchantName = dispute?.merchant_name ?? "Unknown Merchant";
                const paymentId = dispute?.payment_id ?? "—";
                const phase = dispute?.phase ? String(dispute.phase).replace(/_/g, " ").toUpperCase() : "PHASE UNKNOWN";
                const status = dispute?.status ? String(dispute.status).replace(/_/g, " ").toUpperCase() : "STATUS UNKNOWN";
                const amount = typeof dispute?.amount === "number" ? formatCurrency(dispute.amount / 100, dispute.currency ?? "INR") : null;

                return (
                  <div key={event.id} className="bg-secondary/20 border border-border/40 rounded-lg p-4 hover:border-primary/30 transition-all group">
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-tight truncate">{event.event_type}</span>
                      <span className="font-mono text-[9px] text-muted-foreground/40 whitespace-nowrap">{formatDateTime(event.processed_at)}</span>
                    </div>

                    <div className="font-display text-[14px] font-bold text-foreground mb-3 truncate group-hover:text-primary transition-colors">{merchantName}</div>

                    <div className="flex gap-2 flex-wrap">
                      <span className="font-mono text-[9px] text-muted-foreground font-bold border border-border/50 rounded-md px-1.5 py-0.5 bg-background/50">
                        {paymentId}
                      </span>
                      <span className="font-mono text-[9px] text-foreground/60 font-bold border border-border/50 rounded-md px-1.5 py-0.5 bg-secondary/40 uppercase tracking-tighter">
                        {phase}
                      </span>
                      {amount && (
                        <span className="font-mono text-[9px] text-signal-green font-bold border border-signal-green/20 rounded-md px-1.5 py-0.5 bg-signal-green/5">
                          {amount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <MetricCard label="DISPUTED VALUE" value={formatCurrency(stats?.total_disputed_amount ?? 0)} note="Active queue exposure" icon={BadgeIndianRupee} colorClass="text-signal-green" />
        <MetricCard label="CONTESTABLE" value={formatCurrency(stats?.contestable_amount ?? 0)} note="Strong evidence found" icon={Scale} colorClass="text-primary" />
        <MetricCard label="ACCEPTANCE" value={formatCurrency(stats?.acceptance_amount ?? 0)} note="Low fulfillment proof" icon={AlertTriangle} colorClass="text-hazard-orange" />
        <MetricCard label="MANUAL REVIEW" value={formatCurrency(stats?.escalated_amount ?? 0)} note="High complexity cases" icon={Bot} colorClass="text-accent-foreground" />
        <MetricCard label="DUE 24H" value={stats?.due_in_24h_count ?? 0} note="Critical response window" icon={Clock3} colorClass="text-hazard-orange" />
        <MetricCard label="OVERDUE" value={stats?.overdue_count ?? 0} note="Response window closed" icon={AlertTriangle} colorClass="text-destructive" />
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-8 border-b border-border/50 pb-6">
          <div className="space-y-1">
            <div className="font-mono text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Curated Strategy Scenarios</div>
            <p className="m-0 text-muted-foreground/80 text-[14px] font-medium leading-relaxed max-w-[800px]">
              Four end-to-end workflows designed to stress-test your dispute defense strategy across diverse fulfillment patterns.
            </p>
          </div>
          <div className="bg-secondary/50 border border-border px-3 py-1 rounded-full font-mono text-[11px] text-primary font-bold uppercase">
            {SCENARIOS.length} Operational Patterns
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SCENARIOS.map((scenario) => (
            <div key={scenario.type} className="bg-secondary/10 border border-border/30 rounded-xl p-6 hover:border-primary/20 hover:bg-secondary/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="m-0 font-display text-2xl font-bold text-foreground leading-none">{scenario.label}</h3>
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                    scenario.expected_recommendation === "Contest" ? "text-primary border-primary/20 bg-primary/5" :
                    scenario.expected_recommendation === "Accept" ? "text-hazard-orange border-hazard-orange/20 bg-hazard-orange/5" :
                    "text-destructive border-destructive/20 bg-destructive/5"
                  }`}>
                    {scenario.expected_recommendation}
                  </span>
                </div>
                <p className="m-0 text-muted-foreground text-[14px] leading-relaxed mb-6 font-medium">
                  {scenario.description}
                </p>
                <div className="flex gap-2 flex-wrap mb-6">
                  {["network", "phase", "amount", "expected_confidence"].map((key) => (
                    <span key={key} className="bg-background/40 border border-border/50 px-2.5 py-1 rounded-md font-mono text-[10px] text-muted-foreground/60 font-bold uppercase tracking-tight">
                      {key === "amount" ? formatCurrency(scenario.amount) : key === "expected_confidence" ? `${scenario.expected_confidence} Confidence` : (scenario as any)[key].replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2 border-t border-border/30 pt-4">
                {scenario.highlights.slice(0, 3).map((highlight) => (
                  <div key={highlight} className="text-[12px] text-foreground/70 flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-1.5 shrink-0" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
