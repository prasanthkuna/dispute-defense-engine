import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, TrendingUp, Clock3, ShieldAlert, Landmark, Scale, AlertTriangle, Filter } from "lucide-react";
import { useCases, useCaseStats } from "../hooks/useCases";
import StatusBadge from "../components/StatusBadge";
import RecommendationBadge from "../components/RecommendationBadge";
import { formatCurrency, formatDateTime, formatPhase, formatReasonCode, getSlaState } from "../lib/disputes";

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  note,
}: {
  label: string;
  value: string | number;
  icon: any;
  colorClass: string;
  note?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex-1 min-w-[200px] flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-muted-foreground font-mono uppercase font-bold tracking-widest">{label}</span>
        <div className={`p-1.5 rounded-md bg-secondary/50 group-hover:bg-primary/10 transition-colors`}>
          <Icon size={14} className={colorClass} />
        </div>
      </div>
      <div className={`text-2xl font-display font-bold ${colorClass}`}>{value}</div>
      {note ? <div className="font-mono text-[9px] text-muted-foreground/40 mt-2 uppercase font-bold tracking-widest">{note}</div> : null}
    </div>
  );
}

const REASON_OPTIONS = [
  { value: "", label: "All Reason Codes" },
  { value: "products_not_received", label: "Products Not Received" },
];

const PHASE_OPTIONS = [
  { value: "", label: "All Phases" },
  { value: "retrieval", label: "Retrieval" },
  { value: "chargeback", label: "Chargeback" },
  { value: "pre_arbitration", label: "Pre-Arbitration" },
];

const SLA_OPTIONS = [
  { value: "", label: "All SLA Urgency" },
  { value: "due_24h", label: "Due < 24h" },
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

  const selectClassName = "bg-secondary/30 border border-border/50 rounded-lg text-foreground text-[12px] px-3 py-2.5 font-mono font-bold uppercase tracking-tight outline-none focus:border-primary/50 transition-all cursor-pointer hover:bg-secondary/50";

  return (
    <div className="p-8 max-w-[1500px] mx-auto animate-stagger">
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Landmark size={14} className="text-primary" />
            <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Operational Ledger</span>
          </div>
          <h1 className="m-0 text-4xl font-display font-bold text-foreground tracking-tight">Active Disputes</h1>
          <p className="mt-3 text-[15px] text-muted-foreground max-w-2xl leading-relaxed font-medium">
            Centralized queue of Razorpay-ingested disputes, optimized for high-velocity evidence hunting and bank-ready response drafting.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => refetch()}
            className="bg-secondary/50 border border-border rounded-lg text-muted-foreground p-3 hover:text-primary transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-10 flex-wrap">
        <StatCard label="OPEN DISPUTES" value={stats?.total_cases ?? 0} icon={TrendingUp} colorClass="text-foreground" />
        <StatCard label="QUEUE VALUE" value={formatCurrency(stats?.total_disputed_amount ?? 0)} icon={Landmark} colorClass="text-signal-green" />
        <StatCard label="STRATEGY: CONTEST" value={formatCurrency(stats?.contestable_amount ?? 0)} icon={Scale} colorClass="text-primary" />
        <StatCard label="STRATEGY: ACCEPT" value={formatCurrency(stats?.acceptance_amount ?? 0)} icon={ShieldAlert} colorClass="text-hazard-orange" />
        <StatCard label="URGENT SLA" value={`${stats?.due_in_24h_count ?? 0} / ${stats?.overdue_count ?? 0}`} icon={Clock3} colorClass="text-destructive" note="Due 24h / Overdue" />
      </div>

      <div className="bg-card/50 border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-[340px]">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Payment, or Merchant..."
              className="w-full bg-background/50 border border-border rounded-lg text-foreground text-[14px] py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/20"
            />
          </div>

          <div className="flex items-center gap-2 px-3 border-l border-border/50 ml-2">
            <Filter size={14} className="text-muted-foreground/30" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClassName}>
              <option value="">Workflow</option>
              <option value="New">New</option>
              <option value="Hunting Evidence">Evidence Hunting</option>
              <option value="Ready for Review">Awaiting Review</option>
              <option value="Approval Pending">Approval Gated</option>
              <option value="Ready to Submit">Ready to Submit</option>
              <option value="Submitted">Submitted</option>
              <option value="Action Required">Action Required</option>
            </select>

            <select value={recFilter} onChange={(e) => setRecFilter(e.target.value)} className={selectClassName}>
              <option value="">Decision</option>
              <option value="Contest">Contest</option>
              <option value="Accept">Accept</option>
              <option value="Escalate">Escalate</option>
            </select>

            <select value={slaFilter} onChange={(e) => setSlaFilter(e.target.value)} className={selectClassName}>
              {SLA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-secondary/30 border-b border-border">
              {["Object Identifier", "Merchant Details", "Protocol Context", "Deadline", "Exposure", "Engine Strategy", "Workflow State"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-muted-foreground/50 font-mono font-bold text-[9px] tracking-[0.15em] uppercase whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-24 text-center">
                  <RefreshCw size={24} className="animate-spin text-primary mx-auto mb-4 opacity-40" />
                  <span className="font-mono text-[11px] text-muted-foreground uppercase font-bold tracking-widest">Refreshing Ledger Metadata...</span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-24 text-center">
                  <div className="text-muted-foreground/30 mb-2 italic">Zero matches found for current filter cluster.</div>
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const sla = getSlaState(item.respond_by);
                return (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/cases/${item.id}`)}
                    className="cursor-pointer transition-all hover:bg-primary/[0.02] group border-l-4 border-l-transparent hover:border-l-primary"
                  >
                    <td className="px-6 py-5">
                      <div className="font-mono text-foreground font-bold text-[12px] group-hover:text-primary transition-colors tracking-tight">{item.dispute_id}</div>
                      <div className="font-mono text-muted-foreground/40 text-[9px] mt-1 font-bold uppercase tracking-tighter">PAYMENT: {item.payment_id ?? "N/A"}</div>
                    </td>
                    <td className="px-6 py-5 font-display font-bold text-foreground/90">{item.merchant_name}</td>
                    <td className="px-6 py-5">
                      <div className="font-mono text-foreground/70 text-[11px] font-bold uppercase tracking-tighter">{formatPhase(item.phase)}</div>
                      <div className="font-mono text-muted-foreground/40 text-[9px] mt-1 italic">{formatReasonCode(item.reason_code)}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-mono text-foreground/90 text-[11px] font-bold">{formatDateTime(item.respond_by)}</div>
                      <div className="font-mono text-[9px] mt-1 font-bold uppercase tracking-tighter" style={{ color: sla.color }}>{sla.label}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-mono text-signal-green font-bold text-[13px]">{formatCurrency(item.amount, item.currency)}</div>
                      <div className="font-mono text-muted-foreground/40 text-[9px] mt-1 uppercase font-bold tracking-tighter">
                        NET {formatCurrency(item.amount_deducted, item.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <RecommendationBadge recommendation={item.recommendation} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <StatusBadge status={item.status} />
                        {item.approval_state !== "Not Needed" && (
                          <div className={`
                            font-mono text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border w-fit
                            ${item.approval_state === "Approved" ? "bg-signal-green/10 text-signal-green border-signal-green/20" : 
                              item.approval_state === "Rejected" ? "bg-destructive/10 text-destructive border-destructive/20" : 
                              item.approval_state === "Pending" ? "bg-hazard-orange/10 text-hazard-orange border-hazard-orange/20" : 
                              "bg-secondary/50 text-muted-foreground/40 border-border"}
                          `}>
                            {item.approval_state}
                          </div>
                        )}
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
