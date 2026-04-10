import React, { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, Send, Clock, Shield } from "lucide-react";
import { useRole } from "../../hooks/useRole";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { Case } from "~backend/cases/types";
import type { Approval } from "~backend/approvals/types";
import type { Draft } from "~backend/drafts/types";

const MONO = "'IBM Plex Mono', monospace";

interface Props {
  caseData: Case;
  approvals: Approval[];
  drafts: Draft[];
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
      toast({ title: `Decision: ${decision}`, description: "Approval recorded and case updated." });
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
      await backend.cases.update({ id: caseData.id, status: "Approval Pending", approval_state: "Pending" });
      await backend.audit.log({
        case_id: caseData.id,
        actor_type: "operator",
        actor_name: ACTOR_NAMES[role] ?? role,
        action_type: "sent_for_approval",
        details_json: { role, note: "Marked ready and sent for approval" },
      });
      toast({ title: "Sent for approval", description: "Case is now pending approval." });
      onRefresh();
    } catch (err) {
      console.error("Mark ready error:", err);
      toast({ title: "Failed", description: String(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async () => {
    setLoading("Submit");
    try {
      await backend.cases.update({ id: caseData.id, status: "Submitted" });
      await backend.audit.log({
        case_id: caseData.id,
        actor_type: "operator",
        actor_name: ACTOR_NAMES[role] ?? role,
        action_type: "case_submitted",
        details_json: { role, submitted_at: new Date().toISOString() },
      });
      toast({ title: "Case submitted", description: "Dispute response sent to bank." });
      onRefresh();
    } catch (err) {
      console.error("Submit error:", err);
      toast({ title: "Submit failed", description: String(err), variant: "destructive" });
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
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#6B7280", marginBottom: 4 }}>YOUR ROLE</div>
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
              <div key={a.id} style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "10px 14px",
                background: "#0A0C10",
                borderRadius: 6,
                border: "1px solid #2A2D36",
              }}>
                {a.decision === "Approved" ? <CheckCircle size={16} color="#10B981" /> :
                  a.decision === "Rejected" ? <XCircle size={16} color="#EF4444" /> :
                  <RotateCcw size={16} color="#F59E0B" />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: MONO, fontSize: 12, color: "#E8EAF0", fontWeight: 600 }}>
                    {a.decision} — {a.actor_name} ({a.actor_role})
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

      {canApprover && (
        <div style={{
          background: "#111318",
          border: "1px solid #2A2D36",
          borderRadius: 10,
          padding: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Shield size={14} color="#3B82F6" />
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280" }}>APPROVER CONTROLS</div>
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
              <CheckCircle size={14} /> Approve
            </Btn>
            <Btn onClick={() => doApproval("Rejected")} disabled={!!loading} color="#EF4444">
              <XCircle size={14} /> Reject
            </Btn>
            <Btn onClick={() => doApproval("Sent Back")} disabled={!!loading} color="#F59E0B">
              <RotateCcw size={14} /> Send Back
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
          <div style={{ fontFamily: MONO, fontSize: 11, color: "#6B7280", marginBottom: 16 }}>OPERATOR CONTROLS</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
            <Btn
              onClick={handleMarkReady}
              disabled={!!loading || caseData.status === "Approval Pending" || caseData.status === "Submitted"}
              color="#3B82F6"
            >
              <Clock size={14} /> Send for Approval
            </Btn>
            {(caseData.approval_state === "Approved" || role === "Admin") && (
              <Btn
                onClick={handleSubmit}
                disabled={!!loading || caseData.status === "Submitted"}
                color="#6366F1"
              >
                <Send size={14} /> Mock Submit to Bank
              </Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
