import React, { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, Send, Clock, Shield, User, AlertTriangle } from "lucide-react";
import { useRole } from "../../hooks/useRole";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

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
  const submitLabel = isAcceptCase ? "Confirm Final Acceptance" : isContestCase ? "Submit Official Contest" : "Submit Bank Response";
  const submitToastTitle = isAcceptCase ? "Acceptance confirmed" : isContestCase ? "Contest submitted" : "Case submitted";
  const approvalPrompt = isAcceptCase
    ? "Acceptance is irreversible. This confirms the dispute as lost. Continue?"
    : "Submit the current response packet to the bank?";

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
      toast({ title: "Failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async () => {
    if (isAcceptCase && !window.confirm(approvalPrompt)) return;
    setLoading("Submit");
    try {
      await backend.cases.update(caseData.id, { status: "Submitted" });
      await backend.audit.log({
        case_id: caseData.id,
        actor_type: "operator",
        actor_name: ACTOR_NAMES[role] ?? role,
        action_type: isAcceptCase ? "acceptance_confirmed" : isContestCase ? "contest_submitted" : "case_submitted",
        details_json: { role, submitted_at: new Date().toISOString() },
      });
      toast({ title: submitToastTitle, description: "Action recorded successfully." });
      onRefresh();
    } catch (err) {
      toast({ title: "Submit failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleResumeRework = async () => {
    setLoading("ResumeRework");
    try {
      await backend.cases.update(caseData.id, { status: "Hunting Evidence" });
      onRefresh();
    } catch (err) {
      toast({ title: "Rework failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Approved": return "text-signal-green";
      case "Rejected": return "text-destructive";
      case "Sent Back": return "text-hazard-orange";
      case "Pending": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-stagger">
      {/* Risk Alert */}
      {isAcceptCase && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-5 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2.5 font-mono text-[10px] text-destructive font-bold uppercase tracking-widest">
            <AlertTriangle size={14} />
            High-Risk Path Detected
          </div>
          <p className="m-0 text-[13px] text-foreground/80 leading-relaxed font-medium">
            Acceptance acknowledges the dispute as lost. This path is strictly approval-gated and requires explicit senior confirmation.
          </p>
        </div>
      )}

      {/* Case Overview Summary */}
      <div className="bg-card border border-border rounded-lg p-5 grid grid-cols-2 lg:grid-cols-4 gap-6 items-center shadow-sm">
        <div className="space-y-1">
          <div className="font-mono text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Internal Status</div>
          <div className="font-display text-[15px] font-bold text-foreground">{caseData.status}</div>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Approval State</div>
          <div className={`font-display text-[15px] font-bold ${getStatusColor(caseData.approval_state)}`}>
            {caseData.approval_state}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Subject Path</div>
          <div className="font-display text-[15px] font-bold text-primary">{approvalSubject}</div>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Session Role</div>
          <div className="flex items-center gap-2 font-display text-[15px] font-bold text-accent-foreground">
            <User size={14} className="text-primary" />
            {role}
          </div>
        </div>
      </div>

      {/* History */}
      {approvals.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <div className="font-mono text-[10px] text-muted-foreground font-bold mb-4 uppercase tracking-widest">
            Approval Log
          </div>
          <div className="space-y-3">
            {approvals.map((a) => (
              <div key={a.id} className="flex gap-4 items-center p-3.5 bg-secondary/20 border border-border/40 rounded-lg group hover:border-border transition-colors">
                <div className={`shrink-0 ${getStatusColor(a.decision)}`}>
                  {a.decision === "Approved" ? <CheckCircle size={18} /> :
                   a.decision === "Rejected" ? <XCircle size={18} /> : <RotateCcw size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-[13px] font-bold text-foreground">
                      {a.decision} <span className="text-muted-foreground font-medium text-[11px] mx-1">by</span> {a.actor_name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {a.notes && <p className="m-0 text-[12px] text-muted-foreground italic truncate">"{a.notes}"</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Controls */}
      {canApprover && needsApproval && (
        <div className="bg-card border border-border rounded-lg p-5 shadow-xl ring-1 ring-primary/10">
          <div className="flex items-center gap-2.5 mb-4">
            <Shield size={16} className="text-primary" />
            <span className="font-mono text-[11px] text-foreground font-bold uppercase tracking-widest">
              Senior Review Decision
            </span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide context for your decision (required for rejections)..."
            className="w-full bg-background/50 border border-border rounded-lg p-4 text-[13px] text-foreground font-medium placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/30 focus:border-primary/30 outline-none transition-all mb-4 min-h-[100px]"
          />
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => doApproval("Approved")} 
              disabled={!!loading}
              className="bg-signal-green text-white font-bold font-mono text-[11px] uppercase px-5 py-2.5 rounded-md hover:bg-signal-green/90 transition-all shadow-md shadow-signal-green/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle size={14} /> Approve Path
            </button>
            <button 
              onClick={() => doApproval("Rejected")} 
              disabled={!!loading}
              className="bg-destructive text-white font-bold font-mono text-[11px] uppercase px-5 py-2.5 rounded-md hover:bg-destructive/90 transition-all shadow-md shadow-destructive/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <XCircle size={14} /> Deny Path
            </button>
            <button 
              onClick={() => doApproval("Sent Back")} 
              disabled={!!loading}
              className="bg-hazard-orange text-white font-bold font-mono text-[11px] uppercase px-5 py-2.5 rounded-md hover:bg-hazard-orange/90 transition-all shadow-md shadow-hazard-orange/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw size={14} /> Request Rework
            </button>
          </div>
        </div>
      )}

      {/* Operator Actions */}
      {canOperator && (
        <div className="bg-secondary/30 border border-border rounded-lg p-5">
          <div className="font-mono text-[10px] text-muted-foreground font-bold mb-4 uppercase tracking-widest">
            Operator Controls
          </div>
          <div className="flex flex-wrap gap-3">
            {needsApproval && (
              <button
                onClick={handleMarkReady}
                disabled={!!loading || caseData.status === "Approval Pending" || caseData.status === "Submitted" || isActionRequired}
                className="bg-primary text-white font-bold font-mono text-[11px] uppercase px-5 py-2.5 rounded-md hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Clock size={14} /> Finalize & Send for Review
              </button>
            )}
            {isActionRequired && (
              <button 
                onClick={handleResumeRework} 
                disabled={!!loading}
                className="bg-hazard-orange text-white font-bold font-mono text-[11px] uppercase px-5 py-2.5 rounded-md hover:bg-hazard-orange/90 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-hazard-orange/20"
              >
                <RotateCcw size={14} /> Restart Workflow
              </button>
            )}
            {canSubmit && (
              <button 
                onClick={handleSubmit} 
                disabled={!!loading}
                className="bg-accent-foreground text-white font-bold font-mono text-[11px] uppercase px-5 py-2.5 rounded-md hover:bg-accent-foreground/90 transition-all shadow-md shadow-accent-foreground/20 flex items-center gap-2 cursor-pointer"
              >
                <Send size={14} /> {submitLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
