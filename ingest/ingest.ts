import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { CaseStatus } from "../cases/types";
import {
  RAZORPAY_DISPUTE_EVENT_TYPES,
  type DisputeWebhookPayload,
  type RazorpayDisputePayload,
  type RazorpayDisputeEventType,
  type RazorpayPaymentEntity,
  type RazorpayWebhookEnvelope,
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

function isWebhookEnvelope(payload: DisputeWebhookPayload): payload is RazorpayWebhookEnvelope {
  return (payload as RazorpayWebhookEnvelope)?.entity === "event";
}

function getDisputeEntity(payload: DisputeWebhookPayload): RazorpayDisputePayload | null {
  if (isWebhookEnvelope(payload)) {
    return payload.payload?.dispute?.entity ?? null;
  }

  return payload.dispute ?? null;
}

function getPaymentEntity(payload: DisputeWebhookPayload): RazorpayPaymentEntity | null {
  if (!isWebhookEnvelope(payload)) return null;
  return payload.payload?.payment?.entity ?? null;
}

function getPaymentNotes(payment: RazorpayPaymentEntity | null): Record<string, unknown> {
  if (!payment?.notes || Array.isArray(payment.notes)) return {};
  return payment.notes;
}

function getMerchantName(dispute: RazorpayDisputePayload, payment: RazorpayPaymentEntity | null): string {
  const notes = getPaymentNotes(payment);
  const noteValue = notes.merchant_name;
  return typeof dispute.merchant_name === "string" && dispute.merchant_name.trim().length > 0
    ? dispute.merchant_name
    : typeof noteValue === "string" && noteValue.trim().length > 0
      ? noteValue
      : "Merchant of record unavailable";
}

function getDerivedNetwork(dispute: RazorpayDisputePayload, payment: RazorpayPaymentEntity | null): string | null {
  if (dispute.network) return dispute.network;
  if (payment?.card?.network) return payment.card.network;
  if (payment?.bank && payment.method === "netbanking") return payment.bank;
  if (payment?.method) return payment.method;
  return null;
}

function getApprovalState(eventType: RazorpayDisputeEventType, existingApprovalState?: string | null): string {
  switch (eventType) {
    case "payment.dispute.action_required":
      return "Sent Back";
    case "payment.dispute.under_review":
    case "payment.dispute.won":
    case "payment.dispute.lost":
    case "payment.dispute.closed":
      return "Approved";
    default:
      return existingApprovalState ?? "Not Needed";
  }
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

    if (isWebhookEnvelope(params.payload) && params.payload.event !== params.event_type) {
      throw APIError.invalidArgument("payload.event must match event_type");
    }

    const dispute = getDisputeEntity(params.payload);
    const payment = getPaymentEntity(params.payload);

    if (!dispute?.id || !dispute.payment_id) {
      throw APIError.invalidArgument("payload.dispute.id and payload.dispute.payment_id are required");
    }

    const existingEvent = await db.queryRow<{ id: string }>`
      SELECT id FROM events WHERE dedupe_key = ${params.external_event_id}
    `;
    if (existingEvent) {
      const existingCase = await db.queryRow<{ id: string }>`
        SELECT id FROM cases WHERE dispute_id = ${dispute.id}
      `;
      return { case_id: existingCase?.id ?? "unknown", is_duplicate_event: true };
    }

    const existingCase = await db.queryRow<{ id: string; status: CaseStatus | null; approval_state: string | null }>`
      SELECT id, status, approval_state FROM cases WHERE dispute_id = ${dispute.id}
    `;
    const internalStatus = mapInternalStatus(params.event_type, existingCase?.status ?? null);
    const reworkReason =
      params.event_type === "payment.dispute.action_required"
        ? dispute.action_required_reason ?? "Razorpay marked the submitted evidence as requiring rework."
        : null;
    const approvalState = getApprovalState(params.event_type, existingCase?.approval_state ?? null);
    const respondByDate =
      typeof dispute.respond_by === "number"
        ? new Date(dispute.respond_by * 1000).toISOString()
        : new Date(dispute.respond_by).toISOString();
    const merchantName = getMerchantName(dispute, payment);
    const network = getDerivedNetwork(dispute, payment);

    const caseRow = await db.queryRow<{ id: string }>`
      INSERT INTO cases (
        id, dispute_id, payment_id, merchant_name, amount, currency,
        reason_code, respond_by, status, external_status, phase, network, amount_deducted,
        approval_state, last_webhook_at, rework_reason, updated_at
      ) VALUES (
        ${crypto.randomUUID()}, ${dispute.id}, ${dispute.payment_id}, ${merchantName},
        ${dispute.amount / 100}, ${dispute.currency},
        ${dispute.reason_code}, ${respondByDate}, ${internalStatus}, ${dispute.status}, ${dispute.phase}, ${network},
        ${dispute.amount_deducted / 100},
        ${approvalState}, NOW(), ${reworkReason},
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
        approval_state = ${approvalState},
        rework_reason = EXCLUDED.rework_reason,
        last_webhook_at = NOW(),
        updated_at = NOW()
      RETURNING id
    `;

    const caseId = caseRow!.id;

    if (params.event_type !== "payment.dispute.created") {
      await db.exec`
        UPDATE drafts
        SET draft_status = 'submitted'
        WHERE case_id = ${caseId} AND draft_status <> 'submitted'
      `;
    }

    await db.exec`
      INSERT INTO events (id, external_event_id, case_id, event_type, payload_json, dedupe_key, processed_at)
      VALUES (${crypto.randomUUID()}, ${params.external_event_id}, ${caseId}, ${params.event_type}, ${JSON.stringify(params.payload)}::jsonb, ${params.external_event_id}, NOW())
    `;

    return { case_id: caseId, is_duplicate_event: false };
  }
);
