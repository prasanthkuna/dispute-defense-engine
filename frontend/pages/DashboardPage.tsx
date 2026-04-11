import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/client";
import { 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Clock, 
  Activity, 
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  Database,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { data: stats, isError: statsError, isLoading: statsLoading } = useQuery({
    queryKey: ["cases", "stats"],
    queryFn: () => client.cases.stats(),
    refetchInterval: 5000,
  });

  const { data: eventLog, isError: eventsError } = useQuery({
    queryKey: ["ingest", "events"],
    queryFn: () => client.ingest.list(),
    refetchInterval: 3000,
  });

  const initializeSimSweep = async () => {
    setIsInitializing(true);
    try {
      await client.simulation.seed();
      toast({
        title: "Simulation Sweep Initiated",
        description: "Executing 4 high-fidelity dispute scenarios. Watch the telemetry stream.",
      });
      // Force refresh data
      qc.invalidateQueries({ queryKey: ["cases", "stats"] });
      qc.invalidateQueries({ queryKey: ["ingest", "events"] });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Failed to initialize factory scenarios. Is the domain engine online?",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const resetAll = async () => {
    setIsResetting(true);
    try {
      await client.simulation.reset();
      toast({ 
        title: "System Reset", 
        description: "All telemetry, cases and audit logs have been purged." 
      });
      qc.invalidateQueries({ queryKey: ["cases", "stats"] });
      qc.invalidateQueries({ queryKey: ["ingest", "events"] });
    } catch (err) {
      toast({ 
        title: "Reset Failed", 
        description: "Environment purge command rejected.", 
        variant: "destructive" 
      });
    } finally {
      setIsResetting(false);
    }
  };

  const isSeeded = (stats?.total ?? 0) > 0;

  const calculateTimeLeft = (targetDate: any) => {
    if (!targetDate || stats?.approval_pending === 0) return "--";
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return "EXPIRED";
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${d}d:${h}h`;
  };

  const dynamicTarget = Math.max(20000, Math.ceil((stats?.defended_value || 0) / 10000) * 10000 + 10000);
  const progressBarWidth = `${Math.min(100, ((stats?.defended_value || 0) / dynamicTarget) * 100)}%`;

  if (statsLoading) {
    return (
      <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
        <Loader2 className="animate-spin" size={32} color="#3B82F6" />
        <span style={{ marginLeft: 16, color: "#4B5563", fontFamily: "'Space Mono', monospace" }}>SYNCING_DOMAIN_INTEL...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, position: "relative" }}>
      {(statsError || eventsError) && (
        <div style={{ 
          background: "rgba(239, 68, 68, 0.1)", 
          border: "1px solid rgba(239, 68, 68, 0.2)", 
          padding: "12px 20px", 
          borderRadius: 8, 
          color: "#EF4444", 
          fontSize: 13, 
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <Loader2 size={16} className="animate-spin" />
          SYSTEM_ALERT: Connection to backend engine disrupted. Retrying...
        </div>
      )}

      {/* Header */}
      <div className="animate-stagger" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <ShieldCheck size={18} color="#3B82F6" />
          <span style={{ 
            fontSize: 10, 
            color: "#3B82F6", 
            fontFamily: "'Space Mono', monospace", 
            fontWeight: 700,
            letterSpacing: "0.1em" 
          }}>SYSTEM.COMMAND.CENTER</span>
        </div>
        <h1 style={{ 
          fontSize: 64, 
          margin: 0, 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800,
          color: "#F1F4F9",
          letterSpacing: "-0.04em"
        }}>Mission Control</h1>
        <p style={{ color: "#4B5563", fontSize: 16, marginTop: 4, maxWidth: 600 }}>
          Real-time dispute defense intelligence and automated recovery stream for Razorpay merchants.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: 24, 
        marginBottom: 48 
      }} className="animate-stagger">
        {/* Main Metric */}
        <div style={{ 
          gridColumn: "span 2",
          background: "linear-gradient(135deg, #0A0C10 0%, #08090C 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 32,
          borderRadius: 8,
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: 0, right: 0, padding: 32, opacity: 0.1 }}>
            <TrendingUp size={120} />
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, fontFamily: "'Space Mono', monospace", marginBottom: 24, letterSpacing: "0.05em" }}>
            TOTAL DEFENDED VOLUME
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 72, fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              ₹{(stats?.defended_value ?? 0).toLocaleString()}
            </span>
            <span style={{ color: "#10B981", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowUpRight size={14} /> Tracking <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: 4 }}>(Target: ₹{dynamicTarget.toLocaleString()})</span>
            </span>
          </div>
          <div style={{ marginTop: 24, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
            <div style={{ 
              width: progressBarWidth, 
              height: "100%", 
              background: "#3B82F6", 
              borderRadius: 2, 
              boxShadow: "0 0 10px #3B82F6",
              transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
            }} />
          </div>
        </div>

        {/* Victory Rate */}
        <div style={{ 
          background: "linear-gradient(135deg, #0A0C10 0%, #08090C 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 24,
          borderRadius: 8
        }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, fontFamily: "'Space Mono', monospace", marginBottom: 20, letterSpacing: "0.05em" }}>
            AUTO RESOLUTION
          </div>
          <div style={{ fontSize: 48, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#10B981" }}>
            {stats?.auto_complete_rate ?? 0}%
          </div>
          <p style={{ fontSize: 11, color: "#4B5563", marginTop: 8 }}>
            Engine processed and built {stats?.ready_for_review ?? 0} response packets without human intervention.
          </p>
        </div>

        {/* SLA Status */}
        <div style={{ 
          background: "linear-gradient(135deg, #0A0C10 0%, #08090C 100%)",
          border: "1px solid rgba(59,130,246,0.1)",
          padding: 24,
          borderRadius: 8
        }}>
          <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, fontFamily: "'Space Mono', monospace", marginBottom: 20, letterSpacing: "0.05em" }}>
            SLA REMAINING
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Clock size={32} color="#3B82F6" />
            <div style={{ fontSize: 32, fontFamily: "'Syne', sans-serif", fontWeight: 800, opacity: (stats?.approval_pending || 0) === 0 ? 0.3 : 1 }}>
              {calculateTimeLeft((stats as any)?.earliest_sla)}
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#4B5563", marginTop: 8 }}>
            Average time remaining for {stats?.approval_pending ?? 0} pending contestant packets.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }} className="animate-stagger">
        {/* Live Feed */}
        <div style={{ 
          background: "#08090C", 
          border: "1px solid rgba(255,255,255,0.05)", 
          borderRadius: 8,
          overflow: "hidden"
        }}>
          <div style={{ 
            padding: "16px 20px", 
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={14} color="#3B82F6" />
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>REAL TIME TELEMETRY</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 9, color: "#4B5563", fontWeight: 700 }}>LIVE STREAM ACTIVE</span>
            </div>
          </div>
          <div style={{ height: 400, overflow: "auto", padding: 0 }}>
             {eventLog?.events.map((evt: any, i: number) => (
                <div 
                  key={evt.id} 
                  style={{ 
                    padding: "12px 20px", 
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    background: i === 0 ? "rgba(59,130,246,0.03)" : "transparent"
                  }}
                >
                  <div style={{ 
                    fontSize: 10, 
                    color: "#374151", 
                    fontFamily: "'Space Mono', monospace",
                    width: 100
                  }}>
                    {new Date(evt.processed_at).toLocaleTimeString()}
                  </div>
                  <div style={{ 
                    fontSize: 11, 
                    color: "#F1F4F9", 
                    fontWeight: 700,
                    minWidth: 180 
                  }}>
                    {evt.event_type}
                  </div>
                  <div style={{ 
                    fontSize: 10, 
                    color: "#4B5563", 
                    fontFamily: "'Space Mono', monospace",
                    flex: 1
                  }}>
                    {evt.external_event_id}
                  </div>
                  <div style={{ 
                    padding: "4px 8px", 
                    borderRadius: 4, 
                    fontSize: 9, 
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.05)",
                    color: "#9CA3AF"
                  }}>
                    INGESTED
                  </div>
                </div>
             ))}
             {(!eventLog?.events || eventLog.events.length === 0) && (
                <div style={{ padding: 60, textAlign: "center" }}>
                   <Database size={40} color="#1F2937" style={{ margin: "0 auto 16px" }} />
                   <div style={{ color: "#374151", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>
                      NO_ACTIVE_TELEMETRY_FOUND
                   </div>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
                     <button 
                       onClick={initializeSimSweep}
                       disabled={isInitializing || isSeeded}
                       style={{ 
                         background: isSeeded ? "rgba(255,255,255,0.05)" : "transparent", 
                         border: isSeeded ? "1px solid rgba(255,255,255,0.1)" : "1px solid #3B82F6", 
                         color: isSeeded ? "#6B7280" : "#3B82F6", 
                         fontSize: 10, 
                         padding: "8px 16px", 
                         borderRadius: 4, 
                         cursor: isSeeded ? "not-allowed" : "pointer",
                         fontFamily: "'Space Mono', monospace"
                      }}>
                        {isInitializing ? "EXECUTING_FACTORY_SEED..." : (isSeeded ? "ENVIRONMENT_POPULATED" : "INITIALIZE_FIRST_SYNC")}
                     </button>
                     {isSeeded && (
                       <button onClick={resetAll} disabled={isResetting} style={{
                         background: "rgba(239, 68, 68, 0.05)",
                         border: "1px solid rgba(239, 68, 68, 0.2)",
                         color: "#EF4444",
                         fontSize: 10,
                         padding: "8px 16px",
                         borderRadius: 4,
                         cursor: "pointer",
                         fontFamily: "'Space Mono', monospace",
                         display: "flex",
                         alignItems: "center",
                         gap: 6
                       }}>
                         <RefreshCw size={12} className={isResetting ? "animate-spin" : ""} />
                         PURGE
                       </button>
                     )}
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* Domain Health */}
        <div style={{ 
          background: "#08090C", 
          border: "1px solid rgba(255,255,255,0.05)", 
          borderRadius: 8,
          padding: 24
        }}>
           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <ShieldAlert size={14} color="#F59E0B" />
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>SLA RISK MAP</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(30px, 1fr))", gap: 8 }}>
                {Array.from({ length: Math.max(15, stats?.total || 15) }).map((_, i) => {
                  const isApprovalPending = stats?.approval_pending && i < stats.approval_pending;
                  const isReadyForReview = stats?.ready_for_review && i >= (stats?.approval_pending || 0) && i < (stats?.approval_pending || 0) + stats.ready_for_review;
                  const isFilled = i < (stats?.total || 0);

                  let bgColor = "rgba(255,255,255,0.05)";
                  let borderColor = "1px solid transparent";
                  let color = "#1F2937";
                  let text = "";

                  if (isApprovalPending) {
                    bgColor = "rgba(245,158,11,0.2)";
                    borderColor = "1px solid rgba(245,158,11,0.3)";
                    color = "#F59E0B";
                    text = "!!";
                  } else if (isReadyForReview) {
                    bgColor = "rgba(16,185,129,0.2)";
                    borderColor = "1px solid rgba(16,185,129,0.3)";
                    color = "#10B981";
                    text = "OK";
                  } else if (isFilled) {
                    bgColor = "rgba(59,130,246,0.1)";
                    borderColor = "1px solid rgba(59,130,246,0.2)";
                    color = "#3B82F6";
                    text = "••";
                  }

                  return (
                    <div 
                      key={i} 
                      style={{ 
                        aspectRatio: "1/1", 
                        borderRadius: 4, 
                        background: bgColor,
                        border: borderColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 700,
                        color,
                        transition: "all 0.5s ease"
                      }}
                    >
                      {text}
                    </div>
                  );
                })}
            </div>
            <p style={{ fontSize: 11, color: "#4B5563", marginTop: 20 }}>
              Monitoring {stats?.total ?? 0} active dispute lifecycles. <strong>{stats?.approval_pending ?? 0} cases</strong> at critical SLA risk ({"<"} 24h).
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button 
                onClick={initializeSimSweep}
                disabled={isInitializing || isSeeded}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: isSeeded || isInitializing ? "#1F2937" : "#3B82F6",
                  border: "none",
                  borderRadius: 6,
                  color: isSeeded ? "#6B7280" : "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: isSeeded ? "not-allowed" : (isInitializing ? "wait" : "pointer"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  boxShadow: isSeeded || isInitializing ? "none" : "0 4px 15px rgba(59,130,246,0.3)",
                  transition: "all 0.2s"
                }}>
                {isInitializing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    INITIALIZING SWEEP...
                  </>
                ) : isSeeded ? (
                  <>
                    <CheckCircle size={14} color="#10B981" /> Seeded
                  </>
                ) : (
                  <>
                    <Zap size={14} /> Initialize Sim Sweep
                  </>
                )}
              </button>

              <button 
                onClick={resetAll}
                disabled={isResetting}
                style={{
                  padding: "12px 16px",
                  background: "rgba(239, 68, 68, 0.05)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: 6,
                  color: "#EF4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isResetting ? "wait" : "pointer",
                  transition: "all 0.2s"
                }}
                title="Reset Environment"
              >
                <RefreshCw size={16} className={isResetting ? "animate-spin" : ""} />
              </button>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
