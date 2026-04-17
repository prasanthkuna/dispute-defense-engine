import { api } from "encore.dev/api";
import db from "../db";
import { agent, audit, ingest } from "~encore/clients";
import { SCENARIOS, type ScenarioDefinition } from "./scenarios";
import type { Case } from "../cases/types";
import type { DisputeWebhookPayload, RazorpayDisputeEventType } from "../ingest/types";

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

function buildWebhookPayload(params: {
  scenario: ScenarioDefinition;
  disputeId: string;
  respondBy: string;
  eventType: RazorpayDisputeEventType;
  externalStatus?: string;
  amountDeducted?: number;
  actionRequiredReason?: string;
}): DisputeWebhookPayload {
  const createdAtUnix = Math.floor(Date.now() / 1000);
  return {
    entity: "event",
    account_id: "acc_dde_demo",
    event: params.eventType,
    contains: ["dispute"],
    payload: {
      dispute: {
        id: params.disputeId,
        payment_id: params.scenario.payment_id,
        amount: Math.round(params.scenario.amount * 100),
        amount_deducted: Math.round((params.amountDeducted ?? params.scenario.amount_deducted) * 100),
        currency: "INR",
        reason_code: params.scenario.reason_code,
        respond_by: params.respondBy,
        status: params.externalStatus ?? params.scenario.external_status,
        phase: params.scenario.phase,
        network: params.scenario.network,
        merchant_name: params.scenario.merchant_name,
        merchant_reference: params.scenario.merchant_reference,
        action_required_reason: params.actionRequiredReason,
        created_at: createdAtUnix,
      },
    },
    created_at: createdAtUnix,
  } as any;
}

export async function runScenario(scenario_type: ScenarioType): Promise<SimulateResponse> {
  const scenario = SCENARIOS.find((item) => item.type === scenario_type);
  if (!scenario) throw new Error(`Unknown scenario: ${scenario_type}`);

  const disputeId = `DISP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const respondBy = isoFromOffset(scenario.respond_by_offset_hours);

  const eventType: RazorpayDisputeEventType = "payment.dispute.created";
  const { case_id: caseId } = await ingest.ingestEvent({
    external_event_id: `${disputeId}:created`,
    event_type: eventType,
    payload: buildWebhookPayload({
      scenario,
      disputeId,
      respondBy,
      eventType,
    }),
  });

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

  if (scenario.lifecycle_events?.length) {
    for (const lifecycleEvent of scenario.lifecycle_events) {
      await ingest.ingestEvent({
        external_event_id: `${disputeId}:${lifecycleEvent.event_type.split(".").pop()}`,
        event_type: lifecycleEvent.event_type as RazorpayDisputeEventType,
        payload: buildWebhookPayload({
          scenario,
          disputeId,
          respondBy,
          eventType: lifecycleEvent.event_type as RazorpayDisputeEventType,
          externalStatus: lifecycleEvent.external_status,
          amountDeducted: lifecycleEvent.amount_deducted ?? scenario.amount_deducted,
          actionRequiredReason: lifecycleEvent.action_required_reason,
        }),
      });
    }
  }

  const caseRow = await db.queryRow<Case>`SELECT * FROM cases WHERE id = ${caseId}`;
  return { case_id: caseId, case: caseRow! };
}

// Runs a full end-to-end simulation for a given scenario type.
export const simulate = api<SimulateParams, SimulateResponse>(
  { expose: true, method: "POST", path: "/simulation/simulate" },
  async ({ scenario_type }) => runScenario(scenario_type)
);
