import React from "react";
import { useQuery } from "@tanstack/react-query";
import client from "@/lib/client";
import { 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Clock, 
  Activity, 
  ArrowUpRight,
  ShieldAlert
} from "lucide-react";

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["cases", "stats"],
    queryFn: () => client.cases.stats(),
  });

  const { data: eventLog } = useQuery({
    queryKey: ["ingest", "events"],
    queryFn: () => client.ingest.list(),
    refetchInterval: 3000,
  });

  return (
    <div style={{ padding: 40, position: "relative" }}>
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
          }}>SYSTEM::COMMAND_CENTER</span>
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
          <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, fontFamily: "'Space Mono', monospace", marginBottom: 24 }}>
            TOTAL_DEFENDED_VOLUME
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 72, fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              ₹{(stats?.defended_value ?? 0).toLocaleString()}
            </span>
            <span style={{ color: "#10B981", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowUpRight size={14} /> +24%
            </span>
          </div>
          <div style={{ marginTop: 24, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
            <div style={{ width: "72%", height: "100%", background: "#3B82F6", borderRadius: 2, boxShadow: "0 0 10px #3B82F6" }} />
          </div>
        </div>

        {/* Victory Rate */}
        <div style={{ 
          background: "linear-gradient(135deg, #0A0C10 0%, #08090C 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 24,
          borderRadius: 8
        }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, fontFamily: "'Space Mono', monospace", marginBottom: 20 }}>
            AUTO_RESOLUTION
          </div>
          <div style={{ fontSize: 48, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#10B981" }}>
            {stats?.auto_complete_rate ?? 0}%
          </div>
          <p style={{ fontSize: 11, color: "#4B5563", marginTop: 8 }}>
            Engine resolved {stats?.ready_for_review ?? 0} disputes this week without human intervention.
          </p>
        </div>

        {/* SLA Status */}
        <div style={{ 
          background: "linear-gradient(135deg, #0A0C10 0%, #08090C 100%)",
          border: "1px solid rgba(59,130,246,0.1)",
          padding: 24,
          borderRadius: 8
        }}>
          <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, fontFamily: "'Space Mono', monospace", marginBottom: 20 }}>
            SLA_REMAINING
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Clock size={32} color="#3B82F6" />
            <div style={{ fontSize: 32, fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              4d:12h
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
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>REAL_TIME_TELEMETRY</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 9, color: "#4B5563", fontWeight: 700 }}>LIVE_STREAM_ACTIVE</span>
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
               <div style={{ padding: 40, textAlign: "center", color: "#374151", fontSize: 13 }}>
                  No active telemetry signals detected. Start simulation to see feed.
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
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>SLA_RISK_MAP</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      aspectRatio: "1/1", 
                      borderRadius: 4, 
                      background: i < 3 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)",
                      border: i < 3 ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: i < 3 ? "#F59E0B" : "#1F2937"
                    }}
                  >
                    {i < 3 ? "!!" : ""}
                  </div>
                ))}
            </div>
            <p style={{ fontSize: 11, color: "#4B5563", marginTop: 20 }}>
              Monitoring 15 active dispute lifecycles. <strong>3 cases</strong> at critical SLA risk ({"<"} 24h).
            </p>

            <button style={{
              width: "100%",
              marginTop: 32,
              padding: "12px",
              background: "#3B82F6",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
            }}>
              <Zap size={14} /> INITIALIZE_SIM_SWEEP
            </button>
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
