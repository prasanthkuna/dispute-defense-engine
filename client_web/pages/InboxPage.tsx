import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Activity, Clock, ShieldCheck, Zap, Database } from "lucide-react";
import { useCases, useCaseStats } from "../hooks/useCases";
import StatusBadge from "../components/StatusBadge";
import RecommendationBadge from "../components/RecommendationBadge";

const MONO = "'Space Mono', monospace";
const SYNE = "'Syne', sans-serif";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0A0C10 0%, #08090C 100%)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 8,
      padding: "20px 24px",
      flex: 1,
      minWidth: 180,
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, padding: 20, opacity: 0.05 }}>
        <Icon size={48} />
      </div>
      <div style={{ fontSize: 10, color: "#4B5563", fontFamily: MONO, fontWeight: 700, marginBottom: 16, letterSpacing: "0.05em" }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color, fontFamily: SYNE, letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

export default function InboxPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [recFilter, setRecFilter] = useState("");

  const { data: cases = [], isLoading, refetch } = useCases({
    status: statusFilter || undefined,
    recommendation: recFilter || undefined,
  });

  const { data: stats } = useCaseStats();

  const filtered = cases.filter((c: any) => {
    const q = search.toLowerCase();
    return !q || c.dispute_id.toLowerCase().includes(q) || c.merchant_name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  const selectStyle = {
    background: "#08090C",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    color: "#F1F4F9",
    fontSize: 11,
    padding: "8px 12px",
    fontFamily: MONO,
    fontWeight: 700,
    cursor: "pointer",
    outline: "none"
  };

  return (
    <div style={{ padding: "40px 60px", maxWidth: 1600, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }} className="animate-stagger">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Database size={18} color="#3B82F6" />
          <span style={{ 
            fontSize: 10, 
            color: "#3B82F6", 
            fontFamily: MONO, 
            fontWeight: 700,
            letterSpacing: "0.1em" 
          }}>SYSTEM::DISPUTE_LEDGER</span>
        </div>
        <h1 style={{ 
          margin: 0, 
          fontSize: 48, 
          fontWeight: 800, 
          color: "#F1F4F9", 
          fontFamily: SYNE,
          letterSpacing: "-0.04em"
        }}>Active Ledger</h1>
        <p style={{ margin: "4px 0 0", fontSize: 16, color: "#4B5563" }}>
          Real-time stream of all active Razorpay dispute lifecycles.
        </p>
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 40, flexWrap: "wrap" }} className="animate-stagger">
        <StatCard label="Total Signals" value={stats?.total ?? 0} icon={Activity} color="#F1F4F9" />
        <StatCard label="Defended Vol" value={`₹${(stats?.defended_value ?? 0).toLocaleString()}`} icon={ShieldCheck} color="#10B981" />
        <StatCard label="SLA Critical" value={stats?.approval_pending ?? 0} icon={Clock} color="#F59E0B" />
        <StatCard label="Auto-Res Rate" value={`${stats?.auto_complete_rate ?? 0}%`} icon={Zap} color="#3B82F6" />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }} className="animate-stagger">
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={14} color="#374151" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER_BY_METADATA..."
            style={{
              width: "100%",
              background: "#08090C",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6,
              color: "#F1F4F9",
              fontSize: 11,
              padding: "10px 12px 10px 36px",
              fontFamily: MONO,
              fontWeight: 700,
              outline: "none",
            }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">ALL_PHASES</option>
          <option value="New">SIGNAL_DETECTED</option>
          <option value="Hunting Evidence">EVIDENCE_HUNT</option>
          <option value="Ready for Review">DRAFT_COMPLETE</option>
          <option value="Approval Pending">SLA_PENDING</option>
          <option value="Submitted">DEFENSE_ACTIVE</option>
        </select>
        <select value={recFilter} onChange={(e) => setRecFilter(e.target.value)} style={selectStyle}>
          <option value="">ALL_POLICIES</option>
          <option value="Contest">CONTEST</option>
          <option value="Accept">ACCEPT</option>
          <option value="Escalate">ESCALATE</option>
        </select>
        <button
          onClick={() => refetch()}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            color: "#6B7280",
            padding: "9px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
          }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div style={{
        background: "#050505",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        overflow: "hidden",
      }} className="animate-stagger">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Dispute ID", "Merchant", "Amount", "Status", "Confidence", "Action", "Ingested"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#4B5563",
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ padding: 60, textAlign: "center", color: "#3B82F6", fontFamily: MONO, fontSize: 11 }}>
                  INGESTING_LEDGER_DATA...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 60, textAlign: "center", color: "#374151", fontFamily: MONO, fontSize: 11 }}>
                  -- NO_ACTIVE_SIGNALS_FOUND --
                </td>
              </tr>
            ) : (
              filtered.map((c: any, idx: number) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/cases/${c.id}`)}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e: any) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e: any) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "16px 20px", fontFamily: MONO, color: "#3B82F6", fontSize: 12, fontWeight: 700 }}>
                    {c.dispute_id}
                  </td>
                  <td style={{ padding: "16px 20px", color: "#F1F4F9", fontSize: 13, fontWeight: 600 }}>
                    {c.merchant_name}
                  </td>
                  <td style={{ padding: "16px 20px", fontFamily: MONO, color: "#10B981", fontWeight: 700, fontSize: 14 }}>
                    ₹{c.amount.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                       <div style={{ height: 4, width: 40, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                          <div style={{ 
                            height: "100%", 
                            width: `${Math.round(c.evidence_completeness_score * 100)}%`, 
                            background: c.evidence_completeness_score >= 0.8 ? "#10B981" : "#F59E0B",
                            borderRadius: 2
                          }}/>
                       </div>
                       <span style={{ fontSize: 10, fontFamily: MONO, color: "#4B5563", fontWeight: 700 }}>
                         {Math.round(c.evidence_completeness_score * 100)}%
                       </span>
                     </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <RecommendationBadge recommendation={c.recommendation} />
                  </td>
                  <td style={{ padding: "16px 20px", fontFamily: MONO, color: "#374151", fontSize: 10, fontWeight: 700 }}>
                    {new Date(c.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
