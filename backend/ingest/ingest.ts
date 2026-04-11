import { api } from "encore.dev/api";
import db from "../db";

interface RazorpayDisputePayload {
  id: string;
  payment_id: string;
  amount: number;
  currency: string;
  amount_deducted: number;
  reason_code: string;
  respond_by: number;
  status: string;
  phase: string;
  created_at: number;
}

export interface IngestEventParams {
  external_event_id: string; // The webhook ID (e.g., evt_...)
  event_type: string;        // e.g., payment.dispute.created
  payload: {
    dispute: RazorpayDisputePayload;
  };
}

export interface IngestEventResponse {
  case_id: string;
  is_duplicate_event: boolean;
}

// Ingests a Razorpay dispute event, updating the case lifecycle idempotently.
export const ingestEvent = api<IngestEventParams, IngestEventResponse>(
  { expose: true, method: "POST", path: "/ingest/event" },
  async (params) => {
    // 1. Check for event-level duplicate
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
    const respondByDate = new Date(dispute.respond_by * 1000).toISOString();
    
    // 2. Upsert the Case
    // We use the dispute_id as the anchor for the domain entity.
    const caseRow = await db.queryRow<{ id: string }>`
      INSERT INTO cases (
        id, dispute_id, payment_id, merchant_name, amount, currency,
        reason_code, respond_by, status, external_status, phase, amount_deducted,
        updated_at
      ) VALUES (
        ${crypto.randomUUID()}, ${dispute.id}, ${dispute.payment_id}, 'Merchant', ${dispute.amount / 100}, ${dispute.currency},
        ${dispute.reason_code}, ${respondByDate}, 'New', ${dispute.status}, ${dispute.phase}, ${dispute.amount_deducted / 100},
        NOW()
      )
      ON CONFLICT (dispute_id) DO UPDATE SET
        external_status = EXCLUDED.external_status,
        phase = EXCLUDED.phase,
        respond_by = EXCLUDED.respond_by,
        amount_deducted = EXCLUDED.amount_deducted,
        updated_at = NOW()
      RETURNING id
    `;

    const caseId = caseRow!.id;

    // 3. Log the Event
    await db.exec`
      INSERT INTO events (id, external_event_id, case_id, event_type, payload_json, dedupe_key, processed_at)
      VALUES (${crypto.randomUUID()}, ${params.external_event_id}, ${caseId}, ${params.event_type}, ${JSON.stringify(params.payload)}::jsonb, ${params.external_event_id}, NOW())
    `;

    return { case_id: caseId, is_duplicate_event: false };
  }
);
