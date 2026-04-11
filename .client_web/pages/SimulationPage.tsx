import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Zap, RefreshCw, Terminal, CheckCircle, ArrowRight, Shield, Activity, Database
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import client from "@/lib/client";

const SCENARIOS = [
  {
    name: "Slam Dunk Defense",
    desc: "UPI INR dispute with multi-source POD validation. High confidence automated contest.",
    index: 0,
    accent: "#10B981"
  },
  {
    name: "Vernacular OCR Engine",
    desc: "Multi-modal analysis of Hindi WhatsApp screenshots. Extracts acknowledgement signatures.",
    index: 1,
    accent: "#3B82F6"
  },
  {
    name: "Logistics RTO Recovery",
    desc: "Carrier-confirmed Return-to-Origin. Engine triggers immediate merchant recovery policy.",
    index: 2,
    accent: "#F59E0B"
  },
  {
    name: "Subscription Audit",
    desc: "Recurring payment contest. Validates cancellation timestamps vs network auth signals.",
    index: 3,
    accent: "#6366F1"
  }
];

export default function SimulationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [running, setRunning] = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);

  const { data: eventLog, refetch: refetchEvents } = useQuery({
    queryKey: ["ingest", "events"],
    queryFn: () => client.ingest.list(),
    refetchInterval: 2000,
  });

  const runSimulation = async (index: number) => {
    setRunning(index);
    try {
      await client.simulation.runSim({ scenario_index: index });
      toast({ title: "Signal Ingested", description: "Razorpay Webhook successfully processed." });
      refetchEvents();
    } catch (err) {
      toast({ title: "Ingest Failed", description: String(err), variant: "destructive" });
    } finally {
      setRunning(null);
    }
  };

  const resetAll = async () => {
    setResetting(true);
    try {
      await client.simulation.reset();
      toast({ title: "Environment Purged", description: "All telemetry and case data cleared." });
      refetchEvents();
    } catch (err) {
      toast({ title: "Purge Failed", description: String(err), variant: "destructive" });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ padding: 40, position: "relative" }}>
      <div style={{ marginBottom: 48 }} className="animate-stagger">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Terminal size={18} color="#3B82F6" />
          <span style={{ 
            fontSize: 10, 
            color: "#3B82F6", 
            fontFamily: "'Space Mono', monospace", 
            fontWeight: 700,
            letterSpacing: "0.1em" 
          }}>SYSTEM::SIGNAL_SIMULATOR</span>
        </div>
        <h1 style={{ 
          fontSize: 48, 
          margin: 0, 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800,
          color: "#F1F4F9",
          letterSpacing: "-0.04em"
        }}>Dispute Simulation</h1>
        <p style={{ color: "#4B5563", fontSize: 16, marginTop: 4 }}>
          Initialize high-fidelity Razorpay event signals to test engine response and auto-resolution logic.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {/* Scenario Grid */}
        <div style={{ display: "grid", gap: 20 }}>
          {SCENARIOS.map((sc) => (
            <div 
              key={sc.index}
              style={{
                background: "#08090C",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: "100%", background: sc.accent }} />
              <div>
                 <div style={{ 
                   fontSize: 10, 
                   color: "#374151", 
                   fontFamily: "'Space Mono', monospace", 
                   fontWeight: 700, 
                   marginBottom: 4 
                 }}>SCENARIO_ID::0{sc.index + 1}</div>
                 <div style={{ 
                   fontSize: 18, 
                   color: "#F1F4F9", 
                   fontWeight: 700,
                   fontFamily: "'Inter', sans-serif" 
                 }}>{sc.name}</div>
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{sc.desc}</p>
              
              <button 
                onClick={() => runSimulation(sc.index)}
                disabled={running !== null}
                style={{
                  background: running === sc.index ? "rgba(255,255,255,0.05)" : "#1F2937",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 16px",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s"
                }}
              >
                {running === sc.index ? (
                  <>INGESTING_SIGNAL...</>
                ) : (
                  <><Zap size={14} /> INITIALIZE_EVENT</>
                )}
              </button>
            </div>
          ))}

          <button 
            onClick={resetAll}
            disabled={resetting}
            style={{
              marginTop: 20,
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.1)",
              borderRadius: 6,
              padding: "16px",
              color: "#EF4444",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'Space Mono', monospace",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <RefreshCw size={14} /> {resetting ? "PURGING_SYSTEM..." : "PURGE_ALL_TELEMETRY_DATA"}
          </button>
        </div>

        {/* Live Signal Feed */}
        <div style={{ 
          background: "#050505", 
          border: "1px solid rgba(255,255,255,0.08)", 
          borderRadius: 8,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ 
            padding: "16px 20px", 
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={14} color="#10B981" />
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>INGEST_SIGNAL_STREAM</span>
            </div>
            <div style={{ fontSize: 9, color: "#4B5563", fontWeight: 700 }}>VERIFIED_ENCRYPTED</div>
          </div>
          
          <div style={{ flex: 1, padding: 20, overflow: "auto", background: "rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#F1F4F9", display: "grid", gap: 12 }}>
              {eventLog?.events.map((evt: any, i: number) => (
                <div key={evt.id} style={{ opacity: i === 0 ? 1 : 0.6 }}>
                  <div style={{ color: "#3B82F6", marginBottom: 2 }}>
                    [{new Date(evt.processed_at).toLocaleTimeString()}] INGESTION_COMPLETE::{evt.event_type}
                  </div>
                  <div style={{ 
                    padding: "8px 12px", 
                    background: "rgba(255,255,255,0.03)", 
                    borderRadius: 4, 
                    fontSize: 10, 
                    color: "#6B7280",
                    borderLeft: "2px solid #3B82F6",
                    whiteSpace: "pre-wrap"
                  }}>
                    {JSON.stringify(evt.payload_json, null, 2)}
                  </div>
                </div>
              ))}
              {(!eventLog?.events || eventLog.events.length === 0) && (
                <div style={{ color: "#374151", textAlign: "center", padding: 40 }}>
                   -- NO ACTIVE SIGNALS DETECTED --
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
