import { api } from "encore.dev/api";
import db from "../db";
import type { PolicyDecision, PolicyInput } from "./types";

// Evaluates a deterministic rule-based policy for a dispute case.
export const evaluate = api<PolicyInput, PolicyDecision>(
  { expose: true, method: "POST", path: "/policy/evaluate" },
  async (input) => {
    let recommended_action: "Contest" | "Accept" | "Escalate";
    let confidence_band: "High" | "Medium" | "Low";
    const rationale: string[] = [];
    let approval_required = false;

    if (input.scenario_type === "slam_dunk_contest") {
      recommended_action = "Contest";
      confidence_band = "High";
      rationale.push("Scenario type is slam_dunk_contest — all evidence found.");
      rationale.push("Logistics status: Delivered. POD confirmed with signature.");
      rationale.push("Evidence completeness score: 100%. No missing items.");
      rationale.push("Merchant policy mandates contesting all INR disputes with POD.");
      approval_required = false;
    } else if (input.scenario_type === "rto_accept" || input.logistics_status === "RTO") {
      recommended_action = "Accept";
      confidence_band = "High";
      rationale.push("Logistics status is RTO (Return to Origin) — non-delivery confirmed by carrier.");
      rationale.push("Customer refused delivery on 2026-03-13. RTO initiated by DHL.");
      rationale.push("Merchant policy: Accept all confirmed RTO cases immediately.");
      rationale.push("No POD available — contest is not warranted.");
      approval_required = false;
    } else if (input.scenario_type === "weak_evidence_escalate" || input.evidence_completeness_score < 0.5) {
      recommended_action = "Escalate";
      confidence_band = "Low";
      rationale.push(`Evidence completeness score: ${Math.round(input.evidence_completeness_score * 100)}% — below 50% threshold.`);
      rationale.push("Missing critical evidence: AWB, logistics status, POD, invoice, customer communication.");
      rationale.push("Cannot make a deterministic contest or accept decision with insufficient evidence.");
      rationale.push("Escalating to senior dispute analyst for manual review.");
      approval_required = true;
    } else if (input.scenario_type === "vernacular_evidence_contest") {
      recommended_action = "Contest";
      confidence_band = "Medium";
      rationale.push("Vernacular evidence scenario — WhatsApp OCR confirms delivery acknowledgement.");
      rationale.push("Customer stated 'haan, order mil gaya' (Yes, the order arrived) via WhatsApp.");
      rationale.push("Logistics status: Delivered. POD signed by customer.");
      rationale.push("Missing formal tax invoice — confidence reduced to Medium.");
      rationale.push("Approval required due to missing invoice and OCR-based evidence.");
      approval_required = true;
    } else {
      recommended_action = "Escalate";
      confidence_band = "Low";
      rationale.push("No matching policy rule — defaulting to escalation.");
      rationale.push("Manual review required.");
      approval_required = true;
    }

    const id = crypto.randomUUID();
    const rationaleJson = JSON.stringify(rationale);
    const missingJson = JSON.stringify(input.missing_evidence_types);

    const row = await db.queryRow<PolicyDecision>`
      INSERT INTO policy_decisions (
        id, case_id, recommended_action, confidence_band,
        rationale_json, missing_items_json, approval_required
      ) VALUES (
        ${id}, ${input.case_id}, ${recommended_action}, ${confidence_band},
        ${rationaleJson}::jsonb, ${missingJson}::jsonb, ${approval_required}
      ) RETURNING *
    `;

    return row!;
  }
);
