import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, TrendingUp, Clock3, ShieldAlert, Landmark, Scale, AlertTriangle } from "lucide-react";
import { useCases, useCaseStats } from "../hooks/useCases";
import StatusBadge from "../components/StatusBadge";
import RecommendationBadge from "../components/RecommendationBadge";
import { formatCurrency, formatDateTime, formatPhase, formatReasonCode, getSlaState } from "../lib/disputes";

const MONO = "'IBM Plex Mono', monospace";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  note,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  note?: string;
}) {
  return (
    <div
      style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        padding: "16px 20px",
        flex: 1,
        minWidth: 160,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#6B7280", fontFamily: MONO }}>{label}</span>
        <Icon size={14} color={color} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: MONO }}>{value}</div>
      {note ? <div style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251", marginTop: 6 }}>{note}</div> : null}
    </div>
  );
}

const REASON_OPTIONS = [
  { value: "", label: "All Reasons" },
  { value: "products_not_received", label: "Products Not Received" },
];

const PHASE_OPTIONS = [
  { value: "", label: "All Phases" },
  { value: "retrieval", label: "Retrieval" },
  { value: "chargeback", label: "Chargeback" },
  { value: "pre_arbitration", label: "Pre-Arbitration" },
];

const SLA_OPTIONS = [
  { value: "", label: "All SLA" },
  { value: "due_24h", label: "Due <24h" },
  { value: "overdue", label: "Overdue" },
];

export default function InboxPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [recFilter, setRecFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [slaFilter, setSlaFilter] = useState("");

  const { data: cases = [], isLoading, refetch } = useCases({
    status: statusFilter || undefined,
    recommendation: recFilter || undefined,
    reason_code: reasonFilter || undefined,
    phase: phaseFilter || undefined,
    sla_bucket: slaFilter || undefined,
  });

  const { data: stats } = useCaseStats();

  const filtered = cases.filter((item) => {
    const q = search.toLowerCase();
    return (
      !q ||
      item.dispute_id.toLowerCase().includes(q) ||
      (item.payment_id ?? "").toLowerCase().includes(q) ||
      item.merchant_name.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
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
    <div style={{ padding: 24, maxWidth: 1500 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#E8EAF0", fontFamily: MONO }}>Dispute Queue</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>
          Razorpay-aligned dispute operations queue sorted by SLA urgency and reviewer-ready decisioning.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="OPEN CASES" value={stats?.total_cases ?? 0} icon={TrendingUp} color="#3B82F6" />
        <StatCard label="DISPUTED VALUE" value={formatCurrency(stats?.total_disputed_amount ?? 0)} icon={Landmark} color="#10B981" />
        <StatCard label="CONTESTABLE VALUE" value={formatCurrency(stats?.contestable_amount ?? 0)} icon={Scale} color="#3B82F6" />
        <StatCard label="REFUND EXPOSURE" value={formatCurrency(stats?.acceptance_amount ?? 0)} icon={ShieldAlert} color="#F59E0B" />
        <StatCard label="MANUAL REVIEW VALUE" value={formatCurrency(stats?.escalated_amount ?? 0)} icon={AlertTriangle} color="#EF4444" />
        <StatCard
          label="SLA PRESSURE"
          value={`${stats?.due_in_24h_count ?? 0} / ${stats?.overdue_count ?? 0}`}
          icon={Clock3}
          color="#F59E0B"
          note="Due <24h / Overdue"
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by dispute id, payment id, merchant, or case id..."
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
          <option value="">All Workflow</option>
          <option value="New">New</option>
          <option value="Hunting Evidence">Hunting Evidence</option>
          <option value="Ready for Review">Ready for Review</option>
          <option value="Approval Pending">Approval Pending</option>
          <option value="Ready to Submit">Ready to Submit</option>
          <option value="Submitted">Submitted</option>
        </select>

        <select value={recFilter} onChange={(e) => setRecFilter(e.target.value)} style={selectStyle}>
          <option value="">All Decisions</option>
          <option value="Contest">Contest</option>
          <option value="Accept">Accept</option>
          <option value="Escalate">Escalate</option>
        </select>

        <select value={reasonFilter} onChange={(e) => setReasonFilter(e.target.value)} style={selectStyle}>
          {REASON_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} style={selectStyle}>
          {PHASE_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select value={slaFilter} onChange={(e) => setSlaFilter(e.target.value)} style={selectStyle}>
          {SLA_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
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

      <div
        style={{
          background: "#111318",
          border: "1px solid #2A2D36",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2D36" }}>
              {["Dispute", "Payment", "Merchant", "Reason", "Phase", "Respond By", "Amount", "Decision", "Workflow"].map((heading) => (
                <th
                  key={heading}
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
                  {heading.toUpperCase()}
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
                  No cases found. Seed demo disputes to populate the queue.
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => {
                const sla = getSlaState(item.respond_by);

                return (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/cases/${item.id}`)}
                    style={{
                      borderBottom: index < filtered.length - 1 ? "1px solid #1A1D24" : "none",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(event) => (event.currentTarget.style.background = "#1A1D24")}
                    onMouseLeave={(event) => (event.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontFamily: MONO, color: "#E8EAF0", fontSize: 11 }}>{item.dispute_id}</div>
                      <div style={{ fontFamily: MONO, color: "#3B82F6", fontSize: 10, marginTop: 2 }}>{item.id.slice(0, 8)}...</div>
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: MONO, color: "#9CA3AF", fontSize: 11 }}>{item.payment_id ?? "Unknown"}</td>
                    <td style={{ padding: "10px 14px", color: "#E8EAF0" }}>{item.merchant_name}</td>
                    <td style={{ padding: "10px 14px", fontFamily: MONO, color: "#9CA3AF", fontSize: 11 }}>{formatReasonCode(item.reason_code)}</td>
                    <td style={{ padding: "10px 14px", fontFamily: MONO, color: "#9CA3AF", fontSize: 11 }}>{formatPhase(item.phase)}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontFamily: MONO, color: "#E8EAF0", fontSize: 11 }}>{formatDateTime(item.respond_by)}</div>
                      <div style={{ fontFamily: MONO, color: sla.color, fontSize: 10, marginTop: 2 }}>{sla.label}</div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontFamily: MONO, color: "#10B981", fontWeight: 600 }}>{formatCurrency(item.amount, item.currency)}</div>
                      <div style={{ fontFamily: MONO, color: "#3D4251", fontSize: 10, marginTop: 2 }}>
                        deducted {formatCurrency(item.amount_deducted, item.currency)}
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <RecommendationBadge recommendation={item.recommendation} />
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <StatusBadge status={item.status} />
                      <div
                        style={{
                          fontFamily: MONO,
                          fontSize: 10,
                          color:
                            item.approval_state === "Approved"
                              ? "#10B981"
                              : item.approval_state === "Rejected"
                                ? "#EF4444"
                                : item.approval_state === "Pending"
                                  ? "#F59E0B"
                                  : "#3D4251",
                          marginTop: 6,
                        }}
                      >
                        {item.approval_state}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
