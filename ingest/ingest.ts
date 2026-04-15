import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { CaseStatus } from "../cases/types";
import {
  RAZORPAY_DISPUTE_EVENT_TYPES,
  type DisputeWebhookPayload,
  type RazorpayDisputeEventType,
} from "./types";

export interface IngestEventParams {
  external_event_id: string;
  event_type: RazorpayDisputeEventType;
  payload: DisputeWebhookPayload;
}

export interface IngestEventResponse {
  case_id: string;
  is_duplicate_event: boolean;
}

function isValidEventType(value: string): value is RazorpayDisputeEventType {
  return (RAZORPAY_DISPUTE_EVENT_TYPES as readonly string[]).includes(value);
}

function mapInternalStatus(eventType: RazorpayDisputeEventType, existingStatus?: CaseStatus | null): CaseStatus {
  switch (eventType) {
    case "payment.dispute.created":
      return existingStatus ?? "New";
    case "payment.dispute.action_required":
      return "Action Required";
    case "payment.dispute.under_review":
      return "Submitted";
    case "payment.dispute.won":
    case "payment.dispute.lost":
    case "payment.dispute.closed":
      return "Closed";
    default:
      return existingStatus ?? "New";
  }
}

// Ingests a Razorpay dispute event, updating the case lifecycle idempotently.
export const ingestEvent = api<IngestEventParams, IngestEventResponse>(
  { expose: true, method: "POST", path: "/ingest/event" },
  async (params) => {
    if (!isValidEventType(params.event_type)) {
      throw APIError.invalidArgument("invalid Razorpay dispute event_type");
    }

    if (!params.payload?.dispute?.id || !params.payload.dispute.payment_id) {
      throw APIError.invalidArgument("payload.dispute.id and payload.dispute.payment_id are required");
    }

    const existingEvent = await db.queryRow<{ id: string }>`
      SELECT id FROM events WHERE dedupe_key = ${params.external_event_id}
    `;
    if (existingEvent) {
      const existingCase = await db.queryRow<{ id: string }>`
        SELECT id FROM cases WHERE dispute_id = ${params.payload.dispute.id}
      `;
      return { case_id: existingCase?.id ?? "unknown", is_duplicate_event: true };
    }

    const { dispute } = params.payload;
    const existingCase = await db.queryRow<{ id: string; status: CaseStatus | null }>`
      SELECT id, status FROM cases WHERE dispute_id = ${dispute.id}
    `;
    const internalStatus = mapInternalStatus(params.event_type, existingCase?.status ?? null);
    const reworkReason =
      params.event_type === "payment.dispute.action_required"
        ? dispute.action_required_reason ?? "Razorpay marked the submitted evidence as requiring rework."
        : null;
    const approvalState =
      params.event_type === "payment.dispute.action_required" ? "Sent Back" : null;
    const respondByDate =
      typeof dispute.respond_by === "number"
        ? new Date(dispute.respond_by * 1000).toISOString()
        : new Date(dispute.respond_by).toISOString();

    const caseRow = await db.queryRow<{ id: string }>`
      INSERT INTO cases (
        id, dispute_id, payment_id, merchant_name, amount, currency,
        reason_code, respond_by, status, external_status, phase, network, amount_deducted,
        approval_state, last_webhook_at, rework_reason, updated_at
      ) VALUES (
        ${crypto.randomUUID()}, ${dispute.id}, ${dispute.payment_id}, ${dispute.merchant_name ?? "Demo Merchant"},
        ${dispute.amount / 100}, ${dispute.currency},
        ${dispute.reason_code}, ${respondByDate}, ${internalStatus}, ${dispute.status}, ${dispute.phase}, ${dispute.network ?? null},
        ${dispute.amount_deducted / 100},
        ${approvalState ?? "Not Needed"}, NOW(), ${reworkReason},
        NOW()
      )
      ON CONFLICT (dispute_id) DO UPDATE SET
        merchant_name = EXCLUDED.merchant_name,
        amount = EXCLUDED.amount,
        currency = EXCLUDED.currency,
        payment_id = EXCLUDED.payment_id,
        reason_code = EXCLUDED.reason_code,
        status = EXCLUDED.status,
        external_status = EXCLUDED.external_status,
        phase = EXCLUDED.phase,
        network = EXCLUDED.network,
        respond_by = EXCLUDED.respond_by,
        amount_deducted = EXCLUDED.amount_deducted,
        approval_state = COALESCE(${approvalState}, cases.approval_state),
        rework_reason = EXCLUDED.rework_reason,
        last_webhook_at = NOW(),
        updated_at = NOW()
      RETURNING id
    `;

    const caseId = caseRow!.id;

    await db.exec`
      INSERT INTO events (id, external_event_id, case_id, event_type, payload_json, dedupe_key, processed_at)
      VALUES (${crypto.randomUUID()}, ${params.external_event_id}, ${caseId}, ${params.event_type}, ${JSON.stringify(params.payload)}::jsonb, ${params.external_event_id}, NOW())
    `;

    return { case_id: caseId, is_duplicate_event: false };
  }
);
