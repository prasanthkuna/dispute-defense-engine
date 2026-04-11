export interface PolicyDecision {
  id: string;
  case_id: string;
  playbook_name: string;
  recommended_action: "Contest" | "Accept" | "Escalate";
  confidence_band: "High" | "Medium" | "Low";
  rationale_json: string[];
  missing_items_json: string[];
  approval_required: boolean;
  created_at: string;
}

export interface PolicyInput {
  case_id: string;
  reason_code: string | null;
  scenario_type: string;
  logistics_status: string;
  pod_present: boolean;
  invoice_present: boolean;
  customer_communication_state: string;
  evidence_completeness_score: number;
  missing_evidence_types: string[];
  network: string | null;
}
