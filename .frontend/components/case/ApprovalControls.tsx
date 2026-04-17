import React, { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, Send, Clock, Shield } from "lucide-react";
import { useRole } from "../../hooks/useRole";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

const MONO = "'IBM Plex Mono', monospace";

interface Props {
  caseData: any;
  approvals: any[];
  drafts: any[];
  onRefresh: () => void;
}

const ACTOR_NAMES: Record<string, string> = {
  Operator: "Ops Team Member",
  Approver: "Senior Analyst",
  Admin: "Admin User",
};

function Btn({
  onClick,
  disabled,
  color,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#1A1D24" : color,
        color: disabled ? "#3D4251" : "#fff",
        border: "none",
        borderRadius: 6,
        padding: "10px 18px",
        fontFamily: MONO,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "opacity 0.2s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

export default function ApprovalControls({ caseData, approvals, drafts, onRefresh }: Props) {
  const { role } = useRole();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const draft = drafts[0] ?? null;
  const canOperator = role === "Operator" || role === "Admin";
  const canApprover = role === "Approver" || role === "Admin";
  const isAcceptCase = caseData.recommendation === "Accept";
  const isContestCase = caseData.recommendation === "Contest";
  const needsApproval = isAcceptCase || caseData.approval_state !== "Not Needed";
  const isActionRequired = caseData.status === "Action Required";
  const submitEnabledByApproval =
    role === "Admin" ||
    caseData.approval_state === "Approved" ||
    (!isAcceptCase && caseData.approval_state === "Not Needed");
  const canSubmit =
    submitEnabledByApproval &&
    caseData.status !== "Submitted" &&
    !isActionRequired;
  const approvalSubject = isAcceptCase ? "Acceptance" : isContestCase ? "Contest Submission" : "Escalation Review";
  const submitLabel = isAcceptCase ? "Mock Confirm Acceptance" : isContestCase ? "Mock Submit Contest" : "Mock Submit Response";
  const submitToastTitle = isAcceptCase ? "Acceptance confirmed" : isContestCase ? "Contest submitted" : "Case submitted";
  const submitToastDescription = isAcceptCase
    ? "Mock acceptance recorded. This path is treated as an irreversible loss acknowledgement."
    : isContestCase
      ? "Mock contest packet sent for bank review."
      : "Mock dispute response sent to the bank.";
  const approvalPrompt = isAcceptCase
    ? "Acceptance is irreversible. This confirms the dispute as lost in the mocked workflow. Continue?"
    : "Submit the current response packet in the mocked workflow?";

  const doApproval = async (decision: "Approved" | "Rejected" | "Sent Back") => {
    setLoading(decision);
    try {
      await backend.approvals.createApproval({
        case_id: caseData.id,
        draft_id: draft?.id,
        actor_role: role,
        actor_name: ACTOR_NAMES[role] ?? role,
        decision,
        notes: notes || undefined,
      });
      toast({
        title: `${approvalSubject}: ${decision}`,
        description: "Approval recorded and case updated.",
      });
      setNotes("");
      onRefresh();
    } catch (err) {
      console.error("Approval error:", err);
      toast({ title: "Approval failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleMarkReady = async () => {
    setLoading("MarkReady");
    try {
      await backend.cases.update(caseData.id, { status: "Approval Pending", approval_state: "Pending" });
      await backend.audit.log({
        case_id: caseData.id,
        actor_type: "operator",
        actor_name: ACTOR_NAMES[role] ?? role,
        action_type: "sent_for_approval",
        details_json: { role, note: `Marked ready and sent for approval: ${approvalSubject}` },
      });
      toast({ title: "Sent for approval", description: `${approvalSubject} is now pending approval.` });
      onRefresh();
    } catch (err) {
      console.error("Mark ready error:", err);
      toast({ title: "Failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async () => {
    if (isAcceptCase && !window.confirm(approvalPrompt)) {
      return;
    }

    setLoading("Submit");
    try {
      await backend.cases.update(caseData.id, { status: "Submitted" });
      await backend.audit.log({
        case_id: caseData.id,
        actor_type: "operator",
        actor_name: ACTOR_NAMES[role] ?? role,
        action_type: isAcceptCase ? "acceptance_confirmed" : isContestCase ? "contest_submitted" : "case_submitted",
        details_json: {
          role,
          submitted_at: new Date().toISOString(),
          recommendation: caseData.recommendation,
          irreversible: isAcceptCase,
        },
      });
      toast({ title: submitToastTitle, description: submitToastDescription });
      onRefresh();
    } catch (err) {
      console.error("Submit error:", err);
      toast({ title: "Submit failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleResumeRework = async () => {
    setLoading("ResumeRework");
    try {
      await backend.cases.update(caseData.id, { status: "Hunting Evidence" });
      await backend.audit.log({
        case_id: caseData.id,
        actor_type: "operator",
        actor_name: ACTOR_NAMES[role] ?? role,
        action_type: "action_required_rework_started",
        details_json: { role, rework_reason: caseData.rework_reason ?? null },
      });
      toast({
        title: "Rework started",
        description: "Case moved back into evidence hunting so the response can be rebuilt.",
      });
      onRefresh();
    } catch (err) {
      console.error("Resume rework error:", err);
      toast({ title: "Rework failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const statusColor = (s: string) => {
    if (s === "Approved") return "#10B981";
    if (s === "Rejected") return "#EF4444";
    if (s === "Sent Back") return "#F59E0B";
    if (s === "Pending") return "#3B82F6";
    return "#6B7280";
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {isAcceptCase && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))",
            border: "1px solid rgba(245,158,11,0.24)",
            borderRadius: 10,
            padding: 18,
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#F59E0B", letterSpacing: "0.12em", fontWeight: 700 }}>
            IRREVERSIBLE ACCEPTANCE CONTROL
          </div>
          <div style={{ color: "#FDE7BA", fontSize: 12, lineHeight: 1.6 }}>
            This path should stay review-first. Acceptance acknowledges the dispute as lost, so the app now keeps it
            approval-gated and asks for an explicit final confirmation before recording the mocked action.
          </div>
        </div>
      )}

      <div style={{
        background: "#111318",
        border: "1px solid #2A2D36",
        borderRadius: 10,
        padding: 20,
        display: "flex",
        gap: 20,
        flexWrap: "wrap" as const,
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 4 }}>CASE STATUS</div>
          <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: "#E8EAF0" }}>{caseData.status}</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#2A2D36" }} />
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 4 }}>APPROVAL STATE</div>
          <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: statusColor(caseData.approval_state) }}>
            {caseData.approval_state}
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: "#2A2D36" }} />
        <div style={{ minWidth: 180 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 4 }}>ACTION PATH</div>
          <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: isAcceptCase ? "#F59E0B" : "#8B5CF6" }}>
            {approvalSubject.toUpperCase()}
          </div>
        </div>
        {caseData.rework_reason && (
          <>
            <div style={{ width: 1, height: 36, background: "#2A2D36" }} />
            <div style={{ minWidth: 220 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 4 }}>REWORK REASON</div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: "#F59E0B", lineHeight: 1.4 }}>{caseData.rework_reason}</div>
            </div>
          </>
        )}
        <div style={{ width: 1, height: 36, background: "#2A2D36" }} />
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 4 }}>YOUR DEMO ROLE</div>
          <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>{role}</div>
        </div>
      </div>

      {approvals.length > 0 && (
        <div style={{
          background: "#111318",
          border: "1px solid #2A2D36",
          borderRadius: 10,
          padding: 20,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", marginBottom: 12 }}>APPROVAL HISTORY</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {approvals.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "#0A0C10",
                  borderRadius: 6,
                  border: "1px solid #2A2D36",
                }}
              >
                {a.decision === "Approved" ? <CheckCircle size={16} color="#10B981" /> :
                  a.decision === "Rejected" ? <XCircle size={16} color="#EF4444" /> :
                  <RotateCcw size={16} color="#F59E0B" />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: MONO, fontSize: 12, color: "#E8EAF0", fontWeight: 600 }}>
                    {a.decision} - {a.actor_name} ({a.actor_role})
                  </div>
                  {a.notes && (
                    <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", marginTop: 2 }}>{a.notes}</div>
                  )}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "#3D4251" }}>
                  {new Date(a.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {canApprover && needsApproval && (
        <div style={{
          background: "#111318",
          border: "1px solid #2A2D36",
          borderRadius: 10,
          padding: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Shield size={14} color="#3B82F6" />
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>APPROVER CONTROLS - {approvalSubject.toUpperCase()}</div>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes for this decision..."
            style={{
              width: "100%",
              background: "#0A0C10",
              border: "1px solid #2A2D36",
              borderRadius: 6,
              color: "#E8EAF0",
              fontFamily: MONO,
              fontSize: 12,
              padding: "10px 12px",
              resize: "vertical" as const,
              minHeight: 72,
              outline: "none",
              marginBottom: 12,
              boxSizing: "border-box" as const,
            }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
            <Btn onClick={() => doApproval("Approved")} disabled={!!loading} color="#10B981">
              <CheckCircle size={14} /> {isAcceptCase ? "Approve Acceptance" : isContestCase ? "Approve Contest" : "Approve Review"}
            </Btn>
            <Btn onClick={() => doApproval("Rejected")} disabled={!!loading} color="#EF4444">
              <XCircle size={14} /> {isAcceptCase ? "Reject Acceptance" : isContestCase ? "Reject Contest" : "Reject Review"}
            </Btn>
            <Btn onClick={() => doApproval("Sent Back")} disabled={!!loading} color="#F59E0B">
              <RotateCcw size={14} /> Send Back for Rework
            </Btn>
          </div>
        </div>
      )}

      {canOperator && (
        <div style={{
          background: "#111318",
          border: "1px solid #2A2D36",
          borderRadius: 10,
          padding: 20,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", marginBottom: 16 }}>OPERATOR CONTROLS - {approvalSubject.toUpperCase()}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
            {needsApproval && (
              <Btn
                onClick={handleMarkReady}
                disabled={!!loading || caseData.status === "Approval Pending" || caseData.status === "Submitted" || isActionRequired}
                color="#3B82F6"
              >
                <Clock size={14} /> Send {approvalSubject} for Approval
              </Btn>
            )}
            {isActionRequired && (
              <Btn onClick={handleResumeRework} disabled={!!loading} color="#F59E0B">
                <RotateCcw size={14} /> Resume Evidence Rework
              </Btn>
            )}
            {canSubmit && (
              <Btn onClick={handleSubmit} disabled={!!loading} color="#6366F1">
                <Send size={14} /> {submitLabel}
              </Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
