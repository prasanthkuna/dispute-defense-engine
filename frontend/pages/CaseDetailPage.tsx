import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Layers, ShieldCheck, FileText, Activity } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCase,
  useCaseEvidence,
  useCaseAgentSteps,
  useCasePolicyDecisions,
  useCaseDrafts,
  useCaseApprovals,
  useCaseAuditLogs,
} from "../hooks/useCase";
import CaseHeader from "../components/case/CaseHeader";
import DisputeSummary from "../components/case/DisputeSummary";
import AgentTrace from "../components/case/AgentTrace";
import EvidencePack from "../components/case/EvidencePack";
import PolicyDecisionCard from "../components/case/PolicyDecisionCard";
import DraftEditor from "../components/case/DraftEditor";
import ApprovalControls from "../components/case/ApprovalControls";
import AuditTimeline from "../components/case/AuditTimeline";
import EvidenceInspector from "../components/case/EvidenceInspector";

const MONO = "'Space Mono', monospace";
const SYNE = "'Syne', sans-serif";

const TABS = [
  { label: "Intelligence", icon: <ShieldCheck size={14} /> },
  { label: "Agent Trace", icon: <Activity size={14} /> },
  { label: "Evidence Pack", icon: <Layers size={14} /> },
  { label: "Drafting", icon: <FileText size={14} /> },
  { label: "Audit", icon: <Activity size={14} /> }
];

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState("Intelligence");

  const { data: caseData, isLoading } = useCase(id!);
  const { data: evidenceData } = useCaseEvidence(id!);
  const { data: agentData } = useCaseAgentSteps(id!);
  const { data: policyData } = useCasePolicyDecisions(id!);
  const { data: draftsData } = useCaseDrafts(id!);
  const { data: approvalsData } = useCaseApprovals(id!);
  const { data: auditData } = useCaseAuditLogs(id!);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["case", id] });
    qc.invalidateQueries({ queryKey: ["evidence", id] });
    qc.invalidateQueries({ queryKey: ["agent-steps", id] });
    qc.invalidateQueries({ queryKey: ["policy", id] });
    qc.invalidateQueries({ queryKey: ["drafts", id] });
    qc.invalidateQueries({ queryKey: ["approvals", id] });
    qc.invalidateQueries({ queryKey: ["audit", id] });
  };

  if (isLoading) return <div style={{ padding: 100, textAlign: "center", fontFamily: MONO, color: "#3B82F6" }}>INGESTING_CASE_DATA...</div>;
  if (!caseData) return <div style={{ padding: 100, textAlign: "center", fontFamily: MONO, color: "#EF4444" }}>ERROR::CASE_NOT_FOUND</div>;

  const evidence = evidenceData?.items ?? [];
  const steps = agentData?.steps ?? [];
  const decisions = policyData?.decisions ?? [];
  const drafts = draftsData?.drafts ?? [];
  const approvals = approvalsData?.approvals ?? [];
  const logs = auditData?.logs ?? [];

  return (
    <div style={{ padding: "40px 60px", maxWidth: 1600, margin: "0 auto" }}>
      {/* Dossier Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }} className="animate-stagger">
        <button
          onClick={() => navigate("/inbox")}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: 6,
            gap: 8,
            fontSize: 11,
            fontFamily: MONO,
            fontWeight: 700
          }}
        >
          <ArrowLeft size={14} /> BACK_TO_FEED
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={refresh}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            color: "#6B7280",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            fontFamily: MONO,
            fontWeight: 700
          }}
        >
          <RefreshCw size={14} /> RELOAD_TELEMETRY
        </button>
      </div>

      <CaseHeader caseData={caseData} />

      {/* Industrial Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 32,
        marginTop: 32,
        padding: 4,
        background: "rgba(255,255,255,0.02)",
        borderRadius: 8,
        width: "fit-content"
      }}>
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.label)}
            style={{
              background: tab === t.label ? "#1F2937" : "transparent",
              border: "none",
              color: tab === t.label ? "#F1F4F9" : "#4B5563",
              padding: "8px 20px",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: MONO,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
          >
            {t.icon}
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="animate-stagger">
        {tab === "Intelligence" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            <div style={{ display: "grid", gap: 24 }}>
                <DisputeSummary caseData={caseData as any} />
                <PolicyDecisionCard decision={(decisions && decisions[0]) ? (decisions[0] as any) : null} />
             </div>
             <EvidenceInspector />
          </div>
        )}
        {tab === "Agent Trace" && <AgentTrace steps={steps as any} />}
        {tab === "Evidence Pack" && <EvidencePack evidence={evidence as any} />}
        {tab === "Drafting" && (
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 24 }}>
             <DraftEditor drafts={drafts as any} caseId={caseData.id} onRefresh={refresh} />
             <ApprovalControls caseData={caseData as any} approvals={approvals as any} drafts={drafts as any} onRefresh={refresh} />
          </div>
        )}
        {tab === "Audit" && <AuditTimeline logs={logs as any} />}
      </div>
    </div>
  );
}
