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
  merchant_name: string;
  amount: number;
  currency: string;
  dispute_reason: string;
  status: CaseStatus;
  recommendation: Recommendation | null;
  confidence_band: ConfidenceBand | null;
  evidence_completeness_score: number;
  approval_state: ApprovalState;
  scenario_type: ScenarioType;
  created_at: Date;
  updated_at: Date;
}

export interface CaseStats {
  total: number;
  ready_for_review: number;
  approval_pending: number;
  submitted: number;
  auto_complete_rate: number;
}
