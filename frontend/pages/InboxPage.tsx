import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, TrendingUp, Clock, CheckCircle, Send, Zap } from "lucide-react";
import { useCases, useCaseStats } from "../hooks/useCases";
import StatusBadge from "../components/StatusBadge";
import RecommendationBadge from "../components/RecommendationBadge";

const MONO = "'IBM Plex Mono', monospace";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div style={{
      background: "#111318",
      border: "1px solid #2A2D36",
      borderRadius: 10,
      padding: "16px 20px",
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#6B7280", fontFamily: MONO }}>{label}</span>
        <Icon size={14} color={color} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: MONO }}>{value}</div>
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

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.dispute_id.toLowerCase().includes(q) || c.merchant_name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  const selectStyle = {
    background: "#111318",
    border: "1px solid #2A2D36",
    borderRadius: 6,
    color: "#E8EAF0",
    fontSize: 12,
    padding: "7px 10px",
    fontFamily: MONO,
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#E8EAF0", fontFamily: MONO }}>
          Dispute Inbox
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>
          Item Not Received (INR) dispute cases
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="TOTAL CASES" value={stats?.total ?? 0} icon={TrendingUp} color="#3B82F6" />
        <StatCard label="READY FOR REVIEW" value={stats?.ready_for_review ?? 0} icon={CheckCircle} color="#10B981" />
        <StatCard label="APPROVAL PENDING" value={stats?.approval_pending ?? 0} icon={Clock} color="#F59E0B" />
        <StatCard label="SUBMITTED" value={stats?.submitted ?? 0} icon={Send} color="#8B5CF6" />
        <StatCard label="AUTO-COMPLETE %" value={`${stats?.auto_complete_rate ?? 0}%`} icon={Zap} color="#10B981" />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, merchant..."
            style={{
              width: "100%",
              background: "#111318",
              border: "1px solid #2A2D36",
              borderRadius: 6,
              color: "#E8EAF0",
              fontSize: 13,
              padding: "8px 10px 8px 30px",
              fontFamily: "Inter, sans-serif",
              outline: "none",
            }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Hunting Evidence">Hunting Evidence</option>
          <option value="Ready for Review">Ready for Review</option>
          <option value="Approval Pending">Approval Pending</option>
          <option value="Ready to Submit">Ready to Submit</option>
          <option value="Submitted">Submitted</option>
        </select>
        <select value={recFilter} onChange={(e) => setRecFilter(e.target.value)} style={selectStyle}>
          <option value="">All Recommendations</option>
          <option value="Contest">Contest</option>
          <option value="Accept">Accept</option>
          <option value="Escalate">Escalate</option>
        </select>
        <button
          onClick={() => refetch()}
          style={{
            background: "transparent",
            border: "1px solid #2A2D36",
            borderRadius: 6,
            color: "#6B7280",
            padding: "7px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
          }}
        >
          <RefreshCw size={13} />
        </button>
      </div>

      <div style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2D36" }}>
              {["Case ID", "Dispute ID", "Merchant", "Amount", "Status", "Score", "Recommendation", "Approval", "Created"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    color: "#3D4251",
                    fontFamily: MONO,
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.08em",
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
                <td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#6B7280", fontFamily: MONO, fontSize: 12 }}>
                  Loading cases...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#3D4251", fontFamily: MONO, fontSize: 12 }}>
                  No cases found. Run a simulation to create cases.
                </td>
              </tr>
            ) : (
              filtered.map((c, idx) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/cases/${c.id}`)}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? "1px solid #1A1D24" : "none",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1A1D24")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "10px 14px", fontFamily: MONO, color: "#3B82F6", fontSize: 11 }}>
                    {c.id.slice(0, 8)}...
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: MONO, color: "#E8EAF0", fontSize: 11 }}>
                    {c.dispute_id}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#E8EAF0" }}>
                    {c.merchant_name}
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: MONO, color: "#10B981", fontWeight: 600 }}>
                    INR {c.amount.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 48,
                        height: 4,
                        background: "#2A2D36",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${Math.round(c.evidence_completeness_score * 100)}%`,
                          height: "100%",
                          background: c.evidence_completeness_score >= 0.8 ? "#10B981" : c.evidence_completeness_score >= 0.5 ? "#F59E0B" : "#EF4444",
                          transition: "width 0.3s",
                        }} />
                      </div>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280" }}>
                        {Math.round(c.evidence_completeness_score * 100)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <RecommendationBadge recommendation={c.recommendation} />
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: c.approval_state === "Approved" ? "#10B981" : c.approval_state === "Rejected" ? "#EF4444" : c.approval_state === "Pending" ? "#F59E0B" : "#3D4251",
                    }}>
                      {c.approval_state}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: MONO, color: "#6B7280", fontSize: 10 }}>
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
