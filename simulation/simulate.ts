import { api } from "encore.dev/api";
import db from "../db";
import { agent, audit, ingest } from "~encore/clients";
import { SCENARIOS, type ScenarioDefinition } from "./scenarios";
import type { Case } from "../cases/types";
import type {
  DisputeWebhookPayload,
  RazorpayDisputeEventType,
  RazorpayDisputeEvidencePayload,
  RazorpayPaymentEntity,
} from "../ingest/types";

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

function buildEvidencePayload(amountPaise: number, submittedAt: string | null): RazorpayDisputeEvidencePayload {
  return {
    amount: amountPaise,
    summary: null,
    shipping_proof: null,
    billing_proof: null,
    cancellation_proof: null,
    customer_communication: null,
    proof_of_service: null,
    explanation_letter: null,
    refund_confirmation: null,
    access_activity_log: null,
    refund_cancellation_policy: null,
    term_and_conditions: null,
    others: null,
    submitted_at: submittedAt,
  };
}

function buildPaymentEntity(
  scenario: ScenarioDefinition,
  createdAtUnix: number,
  amountPaise: number
): RazorpayPaymentEntity {
  const orderId = `order_${scenario.merchant_reference.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  return {
    id: scenario.payment_id,
    entity: "payment",
    amount: amountPaise,
    currency: "INR",
    base_amount: amountPaise,
    status: "captured",
    order_id: orderId,
    invoice_id: null,
    international: false,
    method: scenario.payment_method,
    amount_refunded: 0,
    amount_transferred: 0,
    refund_status: null,
    captured: true,
    description: `${scenario.label} demo payment`,
    card_id: scenario.payment_method === "card" ? `card_${scenario.payment_id.slice(-6)}` : null,
    bank: scenario.payment_method === "netbanking" ? "HDFC" : null,
    wallet: null,
    vpa: scenario.payment_method === "upi" ? "customer@okhdfcbank" : null,
    email: "ops-demo@example.com",
    contact: "+919900000000",
    notes: {
      merchant_name: scenario.merchant_name,
      merchant_reference: scenario.merchant_reference,
    },
    fee: 0,
    tax: 0,
    error_code: null,
    error_description: null,
    error_source: null,
    error_step: null,
    error_reason: null,
    acquirer_data: {},
    card: scenario.payment_method === "card" ? { network: scenario.network } : null,
    created_at: createdAtUnix,
  };
}

function buildWebhookPayload(params: {
  scenario: ScenarioDefinition;
  disputeId: string;
  respondBy: string;
  eventType: RazorpayDisputeEventType;
  externalStatus: string;
  amountDeducted: number;
  actionRequiredReason?: string;
}): DisputeWebhookPayload {
  const { scenario, disputeId, respondBy, eventType, externalStatus, amountDeducted, actionRequiredReason } = params;
  const createdAtUnix = Math.floor(Date.now() / 1000);
  const amountPaise = Math.round(scenario.amount * 100);
  const submittedAt =
    eventType === "payment.dispute.created" ? null : new Date(createdAtUnix * 1000).toISOString();

  return {
    entity: "event",
    account_id: "acc_DDEDemoRazorpay",
    event: eventType,
    contains: ["payment", "dispute"],
    payload: {
      payment: {
        entity: buildPaymentEntity(scenario, createdAtUnix, amountPaise),
      },
      dispute: {
        entity: {
          id: disputeId,
          entity: "dispute",
          payment_id: scenario.payment_id,
          amount: amountPaise,
          amount_deducted: Math.round(amountDeducted * 100),
          currency: "INR",
          reason_code: scenario.reason_code,
          respond_by: Math.floor(new Date(respondBy).getTime() / 1000),
          status: externalStatus,
          phase: scenario.phase,
          network: scenario.network,
          action_required_reason: actionRequiredReason,
          evidence: buildEvidencePayload(amountPaise, submittedAt),
          created_at: createdAtUnix,
        },
      },
    },
    created_at: createdAtUnix,
  };
}

export async function runScenario(scenario_type: ScenarioType): Promise<SimulateResponse> {
  const scenario = SCENARIOS.find((item) => item.type === scenario_type);
  if (!scenario) throw new Error(`Unknown scenario: ${scenario_type}`);

  const disputeId = `DISP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const respondBy = isoFromOffset(scenario.respond_by_offset_hours);

  const eventType: RazorpayDisputeEventType = "payment.dispute.created";
  const ingestResult = await ingest.ingestEvent({
    external_event_id: `${disputeId}:created`,
    event_type: eventType,
    payload: buildWebhookPayload({
      scenario,
      disputeId,
      respondBy,
      eventType,
      externalStatus: scenario.external_status,
      amountDeducted: scenario.amount_deducted,
    }),
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

  if (scenario.lifecycle_events?.length) {
    for (const lifecycleEvent of scenario.lifecycle_events) {
      await ingest.ingestEvent({
        external_event_id: `${disputeId}:${lifecycleEvent.event_type.split(".").pop()}`,
        event_type: lifecycleEvent.event_type,
        payload: buildWebhookPayload({
          scenario,
          disputeId,
          respondBy,
          eventType: lifecycleEvent.event_type,
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
