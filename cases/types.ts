export type CaseStatus =
  | "New"
  | "Hunting Evidence"
  | "Ready for Review"
  | "Approval Pending"
  | "Ready to Submit"
  | "Submitted"
  | "Action Required"
  | "Closed";

export type Recommendation = "Contest" | "Accept" | "Escalate";
export type ApprovalState = "Not Needed" | "Pending" | "Approved" | "Rejected" | "Sent Back";
export type DisputePhase = "retrieval" | "chargeback" | "pre_arbitration";
export type ScenarioType =
  | "slam_dunk_contest"
  | "vernacular_evidence_contest"
  | "rto_accept"
  | "weak_evidence_escalate";
export type ConfidenceBand = "High" | "Medium" | "Low";

export interface Case {
  id: string;
  dispute_id: string;
  payment_id: string | null;
  merchant_name: string;
  amount: number;
  currency: string;
  reason_code: string | null;
  dispute_reason: string;
  respond_by: string | null;
  status: CaseStatus;
  external_status: string | null;
  phase: DisputePhase | null;
  network: string | null;
  amount_deducted: number | null;
  recommendation: Recommendation | null;
  confidence_band: ConfidenceBand | null;
  evidence_completeness_score: number;
  approval_state: ApprovalState;
  scenario_type: ScenarioType;
  last_webhook_at: string;
  rework_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStats {
  total_cases: number;
  total_disputed_amount: number;
  contestable_amount: number;
  acceptance_amount: number;
  escalated_amount: number;
  overdue_count: number;
  due_in_24h_count: number;
}
