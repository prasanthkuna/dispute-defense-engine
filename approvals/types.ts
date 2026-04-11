export type ApprovalDecision = "Approved" | "Rejected" | "Sent Back";

export interface Approval {
  id: string;
  case_id: string;
  draft_id: string | null;
  actor_role: string;
  actor_name: string;
  decision: ApprovalDecision;
  notes: string | null;
  created_at: Date;
}

export interface CreateApprovalParams {
  case_id: string;
  draft_id?: string;
  actor_role: string;
  actor_name: string;
  decision: ApprovalDecision;
  notes?: string;
}
