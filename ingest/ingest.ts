import { api } from "encore.dev/api";
import db from "../db";
import type { DisputeWebhookPayload } from "./types";

export interface IngestEventParams {
  external_event_id: string;
  event_type: string;
  payload: DisputeWebhookPayload;
}

export interface IngestEventResponse {
  case_id: string;
  is_duplicate_event: boolean;
}

// Ingests a Razorpay dispute event, updating the case lifecycle idempotently.
export const ingestEvent = api<IngestEventParams, IngestEventResponse>(
  { expose: true, method: "POST", path: "/ingest/event" },
  async (params) => {
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
    const respondByDate =
      typeof dispute.respond_by === "number"
        ? new Date(dispute.respond_by * 1000).toISOString()
        : new Date(dispute.respond_by).toISOString();

    const caseRow = await db.queryRow<{ id: string }>`
      INSERT INTO cases (
        id, dispute_id, payment_id, merchant_name, amount, currency,
        reason_code, respond_by, status, external_status, phase, network, amount_deducted,
        updated_at
      ) VALUES (
        ${crypto.randomUUID()}, ${dispute.id}, ${dispute.payment_id}, ${dispute.merchant_name ?? "Demo Merchant"},
        ${dispute.amount / 100}, ${dispute.currency},
        ${dispute.reason_code}, ${respondByDate}, 'New', ${dispute.status}, ${dispute.phase}, ${dispute.network ?? null},
        ${dispute.amount_deducted / 100},
        NOW()
      )
      ON CONFLICT (dispute_id) DO UPDATE SET
        payment_id = EXCLUDED.payment_id,
        external_status = EXCLUDED.external_status,
        phase = EXCLUDED.phase,
        network = EXCLUDED.network,
        respond_by = EXCLUDED.respond_by,
        amount_deducted = EXCLUDED.amount_deducted,
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
