import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, RefreshCw, Database, CheckCircle, AlertTriangle, ArrowRight, Clock, Shield
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { ScenarioDefinition } from "~backend/simulation/scenarios";
import type { ScenarioType } from "~backend/simulation/simulate";

const MONO = "'IBM Plex Mono', monospace";

const SCENARIOS: ScenarioDefinition[] = [
  {
    type: "slam_dunk_contest",
    label: "Slam Dunk Contest",
    merchant_name: "Urban Cart",
    amount: 2499,
    description: "All 8 evidence types found. Shiprocket POD with signature. Customer complaint in Hindi translated. Clear contest case.",
    expected_recommendation: "Contest",
    expected_confidence: "High",
    evidence_score: 1.0,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-4521)",
      "AWB SHP789012 — Delivered",
      "POD signed by P. Sharma",
      "Invoice INV-4521 (₹2,499)",
      "Hindi complaint translated",
      "Merchant policy: Contest",
    ],
  },
  {
    type: "vernacular_evidence_contest",
    label: "Vernacular Evidence Contest",
    merchant_name: "House of Sarees",
    amount: 5899,
    description: "WhatsApp OCR extracts Hindi delivery acknowledgement from customer. 7/8 evidence. Missing formal invoice — approval required.",
    expected_recommendation: "Contest",
    expected_confidence: "Medium",
    evidence_score: 0.875,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-7832)",
      "AWB SHP345678 — Delivered",
      "POD signed by M. Iyer",
      "WhatsApp OCR: 'haan, order mil gaya'",
      "Invoice MISSING",
      "Approval required",
    ],
  },
  {
    type: "rto_accept",
    label: "RTO Accept",
    merchant_name: "Gadget Lane",
    amount: 14999,
    description: "Shiprocket tracking shows RTO — customer refused delivery. Policy mandates immediate acceptance.",
    expected_recommendation: "Accept",
    expected_confidence: "High",
    evidence_score: 0.5,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-2291)",
      "DHL AWB — RTO Initiated",
      "Customer refused delivery",
      "No POD available",
      "Policy: Accept RTO immediately",
    ],
  },
  {
    type: "weak_evidence_escalate",
    label: "Weak Evidence Escalate",
    merchant_name: "Fresh Nest",
    amount: 899,
    description: "Order unfulfilled. No AWB, no tracking, no POD, no invoice. 2/8 evidence. Escalate to human review.",
    expected_recommendation: "Escalate",
    expected_confidence: "Low",
    evidence_score: 0.25,
    highlights: [
      "Payment captured (Razorpay)",
      "Order UNFULFILLED (Shopify ORD-8801)",
      "No AWB assigned",
      "No logistics tracking",
      "No POD",
      "No invoice",
    ],
  },
];

function recColor(rec: string) {
  if (rec === "Contest") return "#3B82F6";
  if (rec === "Accept") return "#F59E0B";
  return "#EF4444";
}

function confColor(c: string) {
  if (c === "High") return "#10B981";
  if (c === "Medium") return "#F59E0B";
  return "#EF4444";
}

function scoreBar(score: number) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280" }}>EVIDENCE SCORE</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "#2A2D36", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

interface SimResult {
  case_id: string;
  scenario_type: string;
}

export default function SimulationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [results, setResults] = useState<SimResult[]>([]);

  const simulate = async (scenarioType: ScenarioType) => {
    setLoadingScenario(scenarioType);
    try {
      const res = await backend.simulation.simulate({ scenario_type: scenarioType });
      setResults((prev) => [{ case_id: res.case_id, scenario_type: scenarioType }, ...prev]);
      toast({
        title: "Simulation complete",
        description: `Case ${res.case_id.slice(0, 8)}... created. Recommendation: ${res.case.recommendation}`,
      });
    } catch (err) {
      console.error("Simulation error:", err);
      toast({ title: "Simulation failed", description: String(err), variant: "destructive" });
    } finally {
      setLoadingScenario(null);
    }
  };

  const seedAll = async () => {
    setSeeding(true);
    try {
      const res = await backend.simulation.seed();
      toast({ title: "Seeded", description: `${res.cases_created} cases created.` });
    } catch (err) {
      console.error("Seed error:", err);
      toast({ title: "Seed failed", description: String(err), variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  const resetAll = async () => {
    if (!confirm("This will delete ALL cases and data. Are you sure?")) return;
    setResetting(true);
    try {
      await backend.simulation.reset();
      setResults([]);
      toast({ title: "Environment reset", description: "All data cleared." });
    } catch (err) {
      console.error("Reset error:", err);
      toast({ title: "Reset failed", description: String(err), variant: "destructive" });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: "#3B82F6", letterSpacing: "0.15em", marginBottom: 8 }}>
          DISPUTE DEFENSE ENGINE
        </div>
        <h1 style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: "#E8EAF0", margin: 0, marginBottom: 8 }}>
          Simulation Panel
        </h1>
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>
          Trigger end-to-end dispute workflows. Each simulation runs the full agent pipeline: evidence collection, policy evaluation, draft generation.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" as const }}>
        <button
          onClick={seedAll}
          disabled={seeding}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#1A1D24",
            border: "1px solid #2A2D36",
            borderRadius: 8,
            padding: "10px 20px",
            color: seeding ? "#3D4251" : "#E8EAF0",
            fontFamily: MONO,
            fontSize: 12,
            fontWeight: 600,
            cursor: seeding ? "not-allowed" : "pointer",
          }}
        >
          <Database size={14} />
          {seeding ? "Seeding..." : "Seed All Scenarios"}
        </button>
        <button
          onClick={resetAll}
          disabled={resetting}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#1A0A0A",
            border: "1px solid #3D1212",
            borderRadius: 8,
            padding: "10px 20px",
            color: resetting ? "#3D4251" : "#EF4444",
            fontFamily: MONO,
            fontSize: 12,
            fontWeight: 600,
            cursor: resetting ? "not-allowed" : "pointer",
          }}
        >
          <RefreshCw size={14} />
          {resetting ? "Resetting..." : "Reset Environment"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, marginBottom: 40 }}>
        {SCENARIOS.map((sc) => {
          const isLoading = loadingScenario === sc.type;
          return (
            <div
              key={sc.type}
              style={{
                background: "#111318",
                border: "1px solid #2A2D36",
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "column" as const,
                gap: 16,
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 6, letterSpacing: "0.1em" }}>
                    {sc.merchant_name.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: "#E8EAF0", marginBottom: 4 }}>
                    {sc.label}
                  </div>
                </div>
                <div style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  background: recColor(sc.expected_recommendation),
                  borderRadius: 6,
                  padding: "4px 10px",
                }}>
                  {sc.expected_recommendation}
                </div>
              </div>

              <p style={{ color: "#6B7280", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                {sc.description}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                <div style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: confColor(sc.expected_confidence),
                  background: "#0A0C10",
                  border: `1px solid ${confColor(sc.expected_confidence)}33`,
                  borderRadius: 4,
                  padding: "3px 8px",
                }}>
                  {sc.expected_confidence} Confidence
                </div>
                <div style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: "#6B7280",
                  background: "#0A0C10",
                  border: "1px solid #2A2D36",
                  borderRadius: 4,
                  padding: "3px 8px",
                }}>
                  ₹{sc.amount.toLocaleString()}
                </div>
              </div>

              {scoreBar(sc.evidence_score)}

              <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                {sc.highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: h.includes("MISSING") || h.includes("No ") ? "#EF4444" : "#10B981",
                      flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: MONO, fontSize: 11, color: h.includes("MISSING") || h.includes("No ") ? "#EF444488" : "#9CA3AF" }}>
                      {h}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => simulate(sc.type)}
                disabled={!!loadingScenario}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: isLoading ? "#1A1D24" : "#3B82F6",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 20px",
                  color: isLoading ? "#3D4251" : "#fff",
                  fontFamily: MONO,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: !!loadingScenario ? "not-allowed" : "pointer",
                  marginTop: 4,
                  transition: "background 0.2s",
                  letterSpacing: "0.05em",
                }}
              >
                {isLoading ? (
                  <>
                    <Clock size={14} style={{ animation: "spin 1s linear infinite" }} />
                    Running Agent...
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Simulate Dispute
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {results.length > 0 && (
        <div style={{
          background: "#111318",
          border: "1px solid #2A2D36",
          borderRadius: 12,
          padding: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <CheckCircle size={14} color="#10B981" />
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>RECENT SIMULATIONS</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {results.map((r) => {
              const sc = SCENARIOS.find((s) => s.type === r.scenario_type);
              return (
                <div
                  key={r.case_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#0A0C10",
                    borderRadius: 8,
                    border: "1px solid #2A2D36",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/cases/${r.case_id}`)}
                >
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 12, color: "#E8EAF0", fontWeight: 600 }}>
                        {sc?.label ?? r.scenario_type}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251", marginTop: 2 }}>
                        {r.case_id.slice(0, 20)}...
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3B82F6" }}>
                    <span style={{ fontFamily: MONO, fontSize: 11 }}>View Case</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{
        marginTop: 40,
        background: "#0D0F14",
        border: "1px solid #1A2040",
        borderRadius: 12,
        padding: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Shield size={14} color="#3B82F6" />
          <div style={{ fontFamily: MONO, fontSize: 11, color: "#3B82F6", letterSpacing: "0.1em" }}>
            ARCHITECTURE NOTE
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { step: "01", label: "Event Ingested", desc: "Idempotent dispute event created" },
            { step: "02", label: "Case Created", desc: "Postgres row with full metadata" },
            { step: "03", label: "Agent Runs", desc: "Bounded tool-call loop executes" },
            { step: "04", label: "Evidence Packed", desc: "All source adapters queried" },
            { step: "05", label: "Policy Evaluated", desc: "Deterministic decision engine" },
            { step: "06", label: "Draft Generated", desc: "Bank-facing response created" },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: 12 }}>
              <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: "#1A2040", flexShrink: 0, width: 28 }}>
                {s.step}
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: "#E8EAF0", fontWeight: 600, marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
