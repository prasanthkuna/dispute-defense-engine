import { api } from "encore.dev/api";
import db from "../db";

interface IngestEventParams {
  external_event_id: string;
  event_type: string;
  payload_json: Record<string, unknown>;
}

interface IngestEventResponse {
  event_id: string;
  is_duplicate: boolean;
}

// Ingests an external event idempotently, deduplicating by external_event_id.
export const ingestEvent = api<IngestEventParams, IngestEventResponse>(
  { expose: true, method: "POST", path: "/ingest/event" },
  async (params) => {
    const existing = await db.queryRow<{ id: string }>`
      SELECT id FROM events WHERE dedupe_key = ${params.external_event_id}
    `;

    if (existing) {
      return { event_id: existing.id, is_duplicate: true };
    }

    const id = crypto.randomUUID();
    const payloadJson = JSON.stringify(params.payload_json);

    await db.exec`
      INSERT INTO events (id, external_event_id, event_type, payload_json, dedupe_key, processed_at)
      VALUES (${id}, ${params.external_event_id}, ${params.event_type}, ${payloadJson}::jsonb, ${params.external_event_id}, NOW())
    `;

    return { event_id: id, is_duplicate: false };
  }
);
