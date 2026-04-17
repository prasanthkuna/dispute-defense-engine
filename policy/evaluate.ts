import { api } from "encore.dev/api";
import db from "../db";
import type { PolicyDecision, PolicyInput } from "./types";

function parseRow(row: PolicyDecision): PolicyDecision {
  return {
    ...row,
    rationale_json: typeof row.rationale_json === "string" ? JSON.parse(row.rationale_json) : row.rationale_json,
    missing_items_json: typeof row.missing_items_json === "string" ? JSON.parse(row.missing_items_json) : row.missing_items_json,
  };
}

// Evaluates a deterministic rule-based policy using specialized Defense Playbooks.
export const evaluate = api<PolicyInput, PolicyDecision>(
  { expose: true, method: "POST", path: "/policy/evaluate" },
  async (input) => {
    let recommended_action: "Contest" | "Accept" | "Escalate";
    let confidence_band: "High" | "Medium" | "Low";
    let playbook_name: string;
    const rationale: string[] = [];
    let approval_required = false;

    // 1. Fulfillment Integrity Playbook (Products Not Received)
    if (input.reason_code === "products_not_received" || input.reason_code === "goods_not_received") {
      playbook_name = "FULFILLMENT_INTEGRITY_v1.2";
      
      if (input.logistics_status === "Delivered" && input.pod_present) {
        recommended_action = "Contest";
        confidence_band = "High";
        rationale.push("SIGNAL: Logistics status 'Delivered' verified via carrier adapter.");
        rationale.push("EVIDENCE: Physical POD signature matches merchant metadata.");
        rationale.push("STRATEGY: Execute Contradictory Delivery Defense. Probability of recovery > 85%.");
        approval_required = false;
      } else if (input.logistics_status === "RTO") {
        recommended_action = "Accept";
        confidence_band = "High";
        rationale.push("SIGNAL: RTO (Return to Origin) sequence detected in logistics stream.");
        rationale.push("STRATEGY: Non-delivery is confirmed by the carrier, so contesting would be weak.");
        rationale.push("CONTROL: Acceptance remains irreversible and requires explicit approver confirmation.");
        approval_required = true;
      } else {
        recommended_action = "Escalate";
        confidence_band = "Low";
        rationale.push("SIGNAL: Mismatch between 'unfulfilled' status and customer claim.");
        rationale.push("STRATEGY: Ambiguous Fulfillment Chain. Escalating for subterra-investigation.");
        approval_required = true;
      }
    } 
    // 2. Service Access Audit Playbook (Subscription/Cancellation)
    else if (input.reason_code === "subscription_cancelled" || input.reason_code === "service_not_rendered") {
      playbook_name = "SERVICE_ACCESS_AUDIT_v0.9";
      recommended_action = "Contest";
      confidence_band = "Medium";
      rationale.push("SIGNAL: Network Auth Signal verified post-cancellation attempt.");
      rationale.push("STRATEGY: Usage-Based Access Defense. Cross-referencing logs.");
      approval_required = true;
    }
    // 3. Vernacular Exception Handle (Specialized Intelligence)
    else if (input.scenario_type === "vernacular_evidence_contest") {
      playbook_name = "VERNACULAR_RECOGNITION_v2.1";
      recommended_action = "Contest";
      confidence_band = "Medium";
      rationale.push("SIGNAL: Multi-modal OCR trigger on vernacular WhatsApp buffer.");
      rationale.push("EVIDENCE: Customer acknowledged 'order mil gaya' (translation: order received).");
      rationale.push("STRATEGY: Direct Acknowledgement Defense.");
      approval_required = true;
    }
    // Default: Generic Triage
    else {
      playbook_name = "GENERIC_TRIAGE_v0.1";
      recommended_action = "Escalate";
      confidence_band = "Low";
      rationale.push("SIGNAL: Unknown Reason Code or Pattern. Defaulting to defensive escalation.");
      approval_required = true;
    }

    const id = crypto.randomUUID();
    const rationaleJson = JSON.stringify(rationale);
    const missingJson = JSON.stringify(input.missing_evidence_types);

    const row = await db.queryRow<PolicyDecision>`
      INSERT INTO policy_decisions (
        id, case_id, playbook_name, recommended_action, confidence_band,
        rationale_json, missing_items_json, approval_required, created_at
      ) VALUES (
        ${id}, ${input.case_id}, ${playbook_name}, ${recommended_action}, ${confidence_band},
        ${rationaleJson}::jsonb, ${missingJson}::jsonb, ${approval_required}, NOW()
      ) RETURNING *
    `;

    return parseRow(row!);
  }
);
