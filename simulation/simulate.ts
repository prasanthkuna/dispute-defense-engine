import { api } from "encore.dev/api";
import db from "../db";
import { agent, audit, ingest } from "~encore/clients";
import { SCENARIOS, type ScenarioDefinition } from "./scenarios";
import type { Case } from "../cases/types";
import type { DisputeWebhookPayload } from "../ingest/types";

interface SimulateParams {
  scenario_type: ScenarioType;
}

interface SimulateResponse {
  case_id: string;
  case: Case;
}

export type ScenarioType = ScenarioDefinition["type"];

function isoFromOffset(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

export async function runScenario(scenario_type: ScenarioType): Promise<SimulateResponse> {
  const scenario = SCENARIOS.find((item) => item.type === scenario_type);
  if (!scenario) throw new Error(`Unknown scenario: ${scenario_type}`);

  const disputeId = `DISP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const respondBy = isoFromOffset(scenario.respond_by_offset_hours);

  const payload: DisputeWebhookPayload = {
    dispute: {
      id: disputeId,
      payment_id: scenario.payment_id,
      amount: Math.round(scenario.amount * 100),
      amount_deducted: Math.round(scenario.amount_deducted * 100),
      currency: "INR",
      reason_code: scenario.reason_code,
      respond_by: respondBy,
      status: scenario.external_status,
      phase: scenario.phase,
      network: scenario.network,
      merchant_name: scenario.merchant_name,
      merchant_reference: scenario.merchant_reference,
      created_at: Math.floor(Date.now() / 1000),
    },
  };

  const ingestResult = await ingest.ingestEvent({
    external_event_id: disputeId,
    event_type: "dispute.created",
    payload,
  });

  const caseId = ingestResult.case_id;

  await db.exec`
    UPDATE cases
    SET scenario_type = ${scenario_type}
    WHERE id = ${caseId}
  `;

  await audit.log({
    case_id: caseId,
    actor_type: "system",
    actor_name: "DDE System",
    action_type: "case_normalized",
    details_json: {
      dispute_id: disputeId,
      payment_id: scenario.payment_id,
      scenario_type,
      merchant_name: scenario.merchant_name,
      amount: scenario.amount,
      phase: scenario.phase,
      respond_by: respondBy,
    },
  });

  await agent.runAgent({ case_id: caseId, scenario_type });

  const caseRow = await db.queryRow<Case>`SELECT * FROM cases WHERE id = ${caseId}`;

  return { case_id: caseId, case: caseRow! };
}

// Runs a full end-to-end simulation for a given scenario type.
export const simulate = api<SimulateParams, SimulateResponse>(
  { expose: true, method: "POST", path: "/simulation/simulate" },
  async ({ scenario_type }) => runScenario(scenario_type)
);
