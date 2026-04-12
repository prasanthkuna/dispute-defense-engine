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

const MONO = "'Space Mono', monospace";
const SYNE = "'Syne', sans-serif";

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(17,19,24,0.96) 0%, rgba(10,12,16,0.96) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: 20,
        minHeight: 148,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontFamily: MONO, color: "#6B7280", letterSpacing: "0.08em" }}>{label}</span>
        <Icon size={16} color={color} />
      </div>
      <div style={{ fontSize: 28, fontFamily: SYNE, fontWeight: 800, color }}>{value}</div>
      <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{note}</p>
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

  const seedScenarios = async () => {
    setIsSeeding(true);
    try {
      await client.simulation.seed();
      toast({
        title: "Demo disputes seeded",
        description: "Four Razorpay-aligned cases are now available in the queue.",
      });
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["ingest", "events"] });
    } catch {
      toast({
        title: "Seed failed",
        description: "Unable to create demo disputes right now.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const resetEnvironment = async () => {
    setIsResetting(true);
    try {
      await client.simulation.reset();
      toast({
        title: "Environment reset",
        description: "All demo cases and telemetry were cleared. Seed again to rebuild the queue.",
      });
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["ingest", "events"] });
    } catch {
      toast({
        title: "Reset failed",
        description: "The environment could not be cleared.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (statsLoading) {
    return (
      <div style={{ padding: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Loader2 size={24} className="animate-spin" color="#3B82F6" />
        <span style={{ fontFamily: MONO, color: "#6B7280" }}>Loading dispute telemetry...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 1500, margin: "0 auto" }}>
      {(statsError || eventsError) && (
        <div
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#EF4444",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 20,
            fontSize: 13,
          }}
        >
          Some live telemetry is unavailable. The dashboard will keep retrying.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 24,
          marginBottom: 24,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0C111A 0%, #08090C 60%, #0B1426 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <ShieldCheck size={16} color="#3B82F6" />
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#3B82F6", letterSpacing: "0.08em" }}>RAZORPAY DEMO CONSOLE</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: SYNE, fontSize: 52, lineHeight: 1, color: "#F1F4F9" }}>
            Dispute Ops
            <br />
            Command View
          </h1>
          <p style={{ margin: "16px 0 0", maxWidth: 700, color: "#9CA3AF", fontSize: 15, lineHeight: 1.6 }}>
            {summaryLine}
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button
              onClick={seedScenarios}
              disabled={isSeeding}
              style={{
                background: "#3B82F6",
                border: "none",
                color: "#fff",
                borderRadius: 8,
                padding: "12px 18px",
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: isSeeding ? "wait" : "pointer",
              }}
            >
              {isSeeding ? <Loader2 size={14} className="animate-spin" /> : <WandSparkles size={14} />}
              {isSeeding ? "Seeding demo cases..." : "Seed 4 demo disputes"}
            </button>

            <button
              onClick={resetEnvironment}
              disabled={isResetting}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#E8EAF0",
                borderRadius: 8,
                padding: "12px 18px",
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: isResetting ? "wait" : "pointer",
              }}
            >
              <RefreshCw size={14} className={isResetting ? "animate-spin" : ""} />
              {isResetting ? "Resetting..." : "Clear environment"}
            </button>
          </div>

          <div style={{ display: "flex", gap: 18, marginTop: 28, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280", fontSize: 12 }}>
              <Bot size={14} color="#8B5CF6" />
              Agent trace + policy engine
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280", fontSize: 12 }}>
              <CheckCircle2 size={14} color="#10B981" />
              Editable draft + approval routing
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Activity size={15} color="#3B82F6" />
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", letterSpacing: "0.08em" }}>RECENT WEBHOOK INTAKE</span>
          </div>

          {events.length === 0 ? (
            <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>
              No disputes ingested yet. Use the demo seed to create four realistic intake events without asking the reviewer to wire a live webhook.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: "#0A0C10",
                    border: "1px solid #2A2D36",
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: "#E8EAF0" }}>{event.event_type}</span>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280" }}>{formatDateTime(event.processed_at)}</span>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: "#3B82F6", marginBottom: 4 }}>{event.external_event_id}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                    {(event.payload_json as any)?.dispute?.merchant_name ?? "Merchant"} · {(event.payload_json as any)?.dispute?.payment_id ?? "Payment pending"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginBottom: 24 }}>
        <MetricCard
          label="TOTAL DISPUTED VALUE"
          value={formatCurrency(stats?.total_disputed_amount ?? 0)}
          note="Total amount currently represented in the active dispute queue."
          icon={BadgeIndianRupee}
          color="#10B981"
        />
        <MetricCard
          label="CONTESTABLE VALUE"
          value={formatCurrency(stats?.contestable_amount ?? 0)}
          note="Cases the engine currently recommends contesting."
          icon={Scale}
          color="#3B82F6"
        />
        <MetricCard
          label="REFUND EXPOSURE"
          value={formatCurrency(stats?.acceptance_amount ?? 0)}
          note="Cases recommended for acceptance based on fulfillment evidence."
          icon={AlertTriangle}
          color="#F59E0B"
        />
        <MetricCard
          label="MANUAL REVIEW VALUE"
          value={formatCurrency(stats?.escalated_amount ?? 0)}
          note="Cases intentionally escalated because evidence is incomplete or conflicting."
          icon={Bot}
          color="#EF4444"
        />
        <MetricCard
          label="DUE IN 24 HOURS"
          value={stats?.due_in_24h_count ?? 0}
          note="Cases that need attention before the next business day."
          icon={Clock3}
          color="#F59E0B"
        />
        <MetricCard
          label="OVERDUE"
          value={stats?.overdue_count ?? 0}
          note="Cases already past their current response deadline."
          icon={AlertTriangle}
          color="#EF4444"
        />
      </div>

      <div
        style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", letterSpacing: "0.08em" }}>CURATED DEMO SCENARIOS</div>
            <div style={{ marginTop: 6, color: "#9CA3AF", fontSize: 14 }}>
              Each case demonstrates a different Razorpay dispute workflow: strong defense, vernacular evidence, smart refund acceptance, and manual review.
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: "#3B82F6" }}>{SCENARIOS.length} scenarios</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.type}
              style={{
                background: "#0A0C10",
                border: "1px solid #2A2D36",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <span style={{ fontFamily: SYNE, fontSize: 22, fontWeight: 700, color: "#F1F4F9" }}>{scenario.label}</span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color:
                      scenario.expected_recommendation === "Contest"
                        ? "#3B82F6"
                        : scenario.expected_recommendation === "Accept"
                          ? "#F59E0B"
                          : "#EF4444",
                  }}
                >
                  {scenario.expected_recommendation.toUpperCase()}
                </span>
              </div>
              <p style={{ margin: 0, color: "#9CA3AF", fontSize: 13, lineHeight: 1.6 }}>{scenario.description}</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14, fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>
                <span>{scenario.network}</span>
                <span>{scenario.phase.replace("_", " ")}</span>
                <span>{formatCurrency(scenario.amount)}</span>
                <span>{scenario.expected_confidence} confidence</span>
              </div>
              <div style={{ display: "grid", gap: 6, marginTop: 16 }}>
                {scenario.highlights.slice(0, 4).map((highlight) => (
                  <div key={highlight} style={{ fontSize: 12, color: "#E8EAF0" }}>
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
