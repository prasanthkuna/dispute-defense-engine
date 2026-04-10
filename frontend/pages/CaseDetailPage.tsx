import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
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
import EvidenceChecklist from "../components/case/EvidenceChecklist";
import EvidencePack from "../components/case/EvidencePack";
import PolicyDecisionCard from "../components/case/PolicyDecisionCard";
import DraftEditor from "../components/case/DraftEditor";
import ApprovalControls from "../components/case/ApprovalControls";
import AuditTimeline from "../components/case/AuditTimeline";

const MONO = "'IBM Plex Mono', monospace";

const TABS = ["Overview", "Agent Trace", "Evidence", "Policy", "Draft", "Approvals", "Audit"];

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState("Overview");

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

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: MONO, color: "#6B7280" }}>
        Loading case...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: MONO, color: "#EF4444" }}>
        Case not found.
      </div>
    );
  }

  const evidence = evidenceData?.items ?? [];
  const steps = agentData?.steps ?? [];
  const decisions = policyData?.decisions ?? [];
  const drafts = draftsData?.drafts ?? [];
  const approvals = approvalsData?.approvals ?? [];
  const logs = auditData?.logs ?? [];

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            padding: 0,
          }}
        >
          <ArrowLeft size={14} />
          Inbox
        </button>
        <span style={{ color: "#3D4251", fontSize: 13 }}>/</span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: "#3B82F6" }}>{caseData.dispute_id}</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={refresh}
          style={{
            background: "transparent",
            border: "1px solid #2A2D36",
            borderRadius: 6,
            color: "#6B7280",
            padding: "5px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
          }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      <CaseHeader caseData={caseData} />

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #2A2D36",
        marginBottom: 24,
        marginTop: 20,
        overflowX: "auto",
      }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? "2px solid #3B82F6" : "2px solid transparent",
              color: tab === t ? "#3B82F6" : "#6B7280",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: MONO,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "Overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <DisputeSummary caseData={caseData} />
          <PolicyDecisionCard decision={decisions[0] ?? null} />
          <div style={{ gridColumn: "1 / -1" }}>
            <EvidenceChecklist evidence={evidence} score={caseData.evidence_completeness_score} />
          </div>
        </div>
      )}
      {tab === "Agent Trace" && <AgentTrace steps={steps} />}
      {tab === "Evidence" && <EvidencePack evidence={evidence} />}
      {tab === "Policy" && <PolicyDecisionCard decision={decisions[0] ?? null} large />}
      {tab === "Draft" && (
        <DraftEditor
          drafts={drafts}
          caseId={caseData.id}
          onRefresh={refresh}
        />
      )}
      {tab === "Approvals" && (
        <ApprovalControls
          caseData={caseData}
          approvals={approvals}
          drafts={drafts}
          onRefresh={refresh}
        />
      )}
      {tab === "Audit" && <AuditTimeline logs={logs} />}
    </div>
  );
}
