import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCase,
  useCaseEvidence,
  useCaseAgentSteps,
  useCasePolicyDecisions,
  useCaseDrafts,
  useCaseApprovals,
  useCaseAuditLogs,
  useCaseEvents,
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
import IntakePayloadCard from "../components/case/IntakePayloadCard";

const TABS = ["Overview", "Intake", "Agent Trace", "Evidence", "Drafting", "Approvals", "Audit"];

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
  const { data: eventsData } = useCaseEvents(id!);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["case", id] });
    qc.invalidateQueries({ queryKey: ["evidence", id] });
    qc.invalidateQueries({ queryKey: ["agent-steps", id] });
    qc.invalidateQueries({ queryKey: ["policy", id] });
    qc.invalidateQueries({ queryKey: ["drafts", id] });
    qc.invalidateQueries({ queryKey: ["approvals", id] });
    qc.invalidateQueries({ queryKey: ["audit", id] });
    qc.invalidateQueries({ queryKey: ["events", id] });
  };

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-primary opacity-70" />
        <span className="font-mono text-muted-foreground text-[13px] tracking-widest uppercase">Initializing Agent Trace...</span>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-20 text-center">
        <div className="text-destructive font-mono text-sm uppercase tracking-widest mb-2">Error 404</div>
        <div className="text-foreground font-display text-2xl font-bold">Case not found.</div>
        <button 
          onClick={() => navigate("/ledger")}
          className="mt-6 text-primary font-mono text-xs uppercase tracking-widest hover:underline"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  const evidence = evidenceData?.items ?? [];
  const steps = agentData?.steps ?? [];
  const decisions = policyData?.decisions ?? [];
  const drafts = draftsData?.drafts ?? [];
  const approvals = approvalsData?.approvals ?? [];
  const logs = auditData?.logs ?? [];
  const events = eventsData?.events ?? [];

  return (
    <div className="p-8 max-w-[1500px] mx-auto animate-stagger">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/ledger")}
          className="bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex items-center gap-2 text-[12px] font-medium cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Queue
        </button>
        <div className="h-4 w-[1px] bg-border/50" />
        <span className="font-mono text-[12px] text-primary font-bold tracking-tight bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          {caseData.dispute_id}
        </span>
        <div className="flex-1" />
        <button
          onClick={refresh}
          className="bg-transparent border border-border rounded-md text-muted-foreground px-3 py-1.5 hover:bg-white/5 transition-all flex items-center gap-2 text-[12px] font-medium cursor-pointer"
        >
          <RefreshCw size={14} />
          Sync Telemetry
        </button>
      </div>

      <CaseHeader caseData={caseData} />

      <div className="flex gap-2 border-b border-border mb-8 mt-6 overflow-x-auto scrollbar-none pb-px">
        {TABS.map((entry) => (
          <button
            key={entry}
            onClick={() => setTab(entry)}
            className={`
              px-5 py-3.5 text-[11px] font-bold font-mono tracking-widest uppercase transition-all relative whitespace-nowrap cursor-pointer
              ${tab === entry 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"}
            `}
          >
            {entry}
            {tab === entry && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_-2px_8px_rgba(19,100,241,0.4)]" />
            )}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {tab === "Overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DisputeSummary caseData={caseData} />
            <PolicyDecisionCard decision={decisions[0] ?? null} />
            <div className="xl:col-span-2">
              <EvidenceChecklist evidence={evidence} score={caseData.evidence_completeness_score} />
            </div>
            <div className="xl:col-span-2">
              <IntakePayloadCard caseData={caseData} events={events} />
            </div>
          </div>
        )}
        {tab === "Intake" && <IntakePayloadCard caseData={caseData} events={events} />}
        {tab === "Agent Trace" && <AgentTrace steps={steps} />}
        {tab === "Evidence" && <EvidencePack evidence={evidence} />}
        {tab === "Drafting" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DraftEditor drafts={drafts} caseId={caseData.id} onRefresh={refresh} />
            </div>
            <div className="lg:col-span-1">
              <ApprovalControls caseData={caseData} approvals={approvals} drafts={drafts} onRefresh={refresh} />
            </div>
          </div>
        )}
        {tab === "Approvals" && <ApprovalControls caseData={caseData} approvals={approvals} drafts={drafts} onRefresh={refresh} />}
        {tab === "Audit" && <AuditTimeline logs={logs} />}
      </div>
    </div>
  );
}
