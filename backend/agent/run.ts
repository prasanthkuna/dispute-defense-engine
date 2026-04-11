import { api } from "encore.dev/api";
import db from "../db";
import { cases, policy, drafts, audit } from "~encore/clients";
import type { RunAgentParams, RunAgentResponse, AgentRun, AgentTraceStep } from "./types";
import {
  getSlamDunkSteps,
  getVernacularSteps,
  getRtoSteps,
  getWeakEvidenceSteps,
} from "./scenario_steps";
import {
  getSlamDunkEvidence,
  getVernacularEvidence,
  getRtoEvidence,
  getWeakEvidence,
} from "./evidence_factory";
import { getDraftText } from "./draft_templates";

function parseStep(row: AgentTraceStep): AgentTraceStep {
  return {
    ...row,
    input_json: typeof row.input_json === "string" ? JSON.parse(row.input_json) : row.input_json,
    output_json: typeof row.output_json === "string" ? JSON.parse(row.output_json) : row.output_json,
  };
}

function getStepsForScenario(caseId: string, scenarioType: string) {
  switch (scenarioType) {
    case "slam_dunk_contest": return getSlamDunkSteps(caseId);
    case "vernacular_evidence_contest": return getVernacularSteps(caseId);
    case "rto_accept": return getRtoSteps(caseId);
    case "weak_evidence_escalate": return getWeakEvidenceSteps(caseId);
    default: return getSlamDunkSteps(caseId);
  }
}

function getEvidenceForScenario(caseId: string, scenarioType: string) {
  switch (scenarioType) {
    case "slam_dunk_contest": return getSlamDunkEvidence(caseId);
    case "vernacular_evidence_contest": return getVernacularEvidence(caseId);
    case "rto_accept": return getRtoEvidence(caseId);
    case "weak_evidence_escalate": return getWeakEvidence(caseId);
    default: return getSlamDunkEvidence(caseId);
  }
}

function getScoreForScenario(scenarioType: string): number {
  switch (scenarioType) {
    case "slam_dunk_contest": return 1.0;
    case "vernacular_evidence_contest": return 0.875;
    case "rto_accept": return 0.5;
    case "weak_evidence_escalate": return 0.25;
    default: return 0.5;
  }
}

// Executes the autonomous evidence-gathering agent for a dispute case.
export const runAgent = api<RunAgentParams, RunAgentResponse>(
  { expose: true, method: "POST", path: "/agent/run" },
  async ({ case_id, scenario_type }) => {
    const runId = crypto.randomUUID();

    await db.exec`
      INSERT INTO agent_runs (id, case_id, status, step_count)
      VALUES (${runId}, ${case_id}, 'running', 0)
    `;

    await cases.update({ id: case_id, status: "Hunting Evidence" });

    await audit.log({
      case_id,
      actor_type: "agent",
      actor_name: "DDE Agent",
      action_type: "agent_run_started",
      details_json: { run_id: runId, scenario_type },
    });

    const stepDefs = getStepsForScenario(case_id, scenario_type);
    const insertedSteps: AgentTraceStep[] = [];

    for (let i = 0; i < stepDefs.length; i++) {
      const step = stepDefs[i];
      const stepId = crypto.randomUUID();
      const inputJson = JSON.stringify(step.input_json);
      const outputJson = JSON.stringify(step.output_json);

      const row = await db.queryRow<AgentTraceStep>`
        INSERT INTO agent_trace_steps (
          id, agent_run_id, case_id, step_number, action_type,
          tool_name, input_json, output_json, observation_text, status
        ) VALUES (
          ${stepId}, ${runId}, ${case_id}, ${i + 1}, ${step.action_type},
          ${step.tool_name ?? null}, ${inputJson}::jsonb, ${outputJson}::jsonb,
          ${step.observation_text}, ${step.status}
        ) RETURNING *
      `;
      if (row) insertedSteps.push(parseStep(row));
    }

    // Insert evidence items
    const evidenceItems = getEvidenceForScenario(case_id, scenario_type);
    for (const item of evidenceItems) {
      const evidenceId = crypto.randomUUID();
      const rawJson = JSON.stringify(item.raw_content_json);
      await db.exec`
        INSERT INTO evidence_items (
          id, case_id, evidence_type, source_name, title,
          summary_text, raw_content_json, preview_text, file_url,
          status, confidence
        ) VALUES (
          ${evidenceId}, ${item.case_id}, ${item.evidence_type}, ${item.source_name}, ${item.title},
          ${item.summary_text}, ${rawJson}::jsonb, ${item.preview_text}, ${item.file_url ?? null},
          ${item.status}, ${item.confidence}
        )
      `;
    }

    const score = getScoreForScenario(scenario_type);

    // Run policy evaluation
    const logisticsStatus = scenario_type === "rto_accept" ? "RTO" : "Delivered";
    const podPresent = scenario_type === "slam_dunk_contest" || scenario_type === "vernacular_evidence_contest";
    const invoicePresent = scenario_type !== "weak_evidence_escalate" && scenario_type !== "vernacular_evidence_contest";
    const missingItems: string[] = [];
    if (scenario_type === "vernacular_evidence_contest") missingItems.push("invoice");
    if (scenario_type === "rto_accept") missingItems.push("proof_of_delivery", "customer_communication");
    if (scenario_type === "weak_evidence_escalate") missingItems.push("awb_tracking", "logistics_status", "proof_of_delivery", "invoice", "customer_communication", "merchant_policy");

    const policyResult = await policy.evaluate({
      case_id,
      scenario_type,
      logistics_status: logisticsStatus,
      pod_present: podPresent,
      invoice_present: invoicePresent,
      customer_communication_state: scenario_type === "weak_evidence_escalate" ? "none" : "found",
      evidence_completeness_score: score,
      missing_evidence_types: missingItems,
    });

    // Update case
    await cases.update({
      id: case_id,
      status: "Ready for Review",
      recommendation: policyResult.recommended_action,
      confidence_band: policyResult.confidence_band,
      evidence_completeness_score: score,
      approval_state: policyResult.approval_required ? "Pending" : "Not Needed",
    });

    // Generate draft
    const caseRow = await db.queryRow<{ merchant_name: string; amount: number; currency: string; dispute_id: string }>`
      SELECT merchant_name, amount, currency, dispute_id FROM cases WHERE id = ${case_id}
    `;
    if (caseRow) {
      const draftContent = getDraftText(scenario_type, caseRow.dispute_id, caseRow);
      const draftId = crypto.randomUUID();
      const attachJson = JSON.stringify(draftContent.attachments);
      await db.exec`
        INSERT INTO drafts (id, case_id, version, summary_text, response_text, attachments_json)
        VALUES (${draftId}, ${case_id}, 1, ${draftContent.summary}, ${draftContent.response}, ${attachJson}::jsonb)
      `;
    }

    const finalSummary = `Agent completed. Scenario: ${scenario_type}. Evidence score: ${Math.round(score * 100)}%. Recommendation: ${policyResult.recommended_action} (${policyResult.confidence_band} confidence). ${missingItems.length} missing items.`;

    await db.exec`
      UPDATE agent_runs
      SET status = 'completed', step_count = ${stepDefs.length}, ended_at = NOW(), final_summary = ${finalSummary}
      WHERE id = ${runId}
    `;

    await audit.log({
      case_id,
      actor_type: "agent",
      actor_name: "DDE Agent",
      action_type: "agent_run_completed",
      details_json: { run_id: runId, recommendation: policyResult.recommended_action, score },
    });

    const run = await db.queryRow<AgentRun>`SELECT * FROM agent_runs WHERE id = ${runId}`;

    return { run: run!, steps: insertedSteps };
  }
);
