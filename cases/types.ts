export type CaseStatus =
  | "New"
  | "Hunting Evidence"
  | "Ready for Review"
  | "Approval Pending"
  | "Ready to Submit"
  | "Submitted"
  | "Closed";

export type Recommendation = "Contest" | "Accept" | "Escalate";
export type ApprovalState = "Not Needed" | "Pending" | "Approved" | "Rejected" | "Sent Back";
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
  phase: string | null;
  network: string | null;
  amount_deducted: number | null;
  recommendation: Recommendation | null;
  confidence_band: ConfidenceBand | null;
  evidence_completeness_score: number;
  approval_state: ApprovalState;
  scenario_type: ScenarioType;
  created_at: string;
  updated_at: string;
}

export interface CaseStats {
  total: number;
  ready_for_review: number;
  approval_pending: number;
  submitted: number;
  auto_complete_rate: number;
  defended_value: number;
}
