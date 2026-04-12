import { api, Query } from "encore.dev/api";
import db from "../db";
import type { IngestedEvent } from "./types";

interface ListEventsParams {
  case_id?: Query<string>;
}

interface ListEventsResponse {
  events: IngestedEvent[];
}

// Returns recent webhook events, optionally filtered to a single case.
export const list = api<ListEventsParams, ListEventsResponse>(
  { expose: true, method: "GET", path: "/ingest/events" },
  async (params) => {
    const values: string[] = [];
    let query = `
      SELECT id, external_event_id, case_id, event_type, processed_at, payload_json
      FROM events
    `;

    if (params.case_id) {
      query += ` WHERE case_id = $1`;
      values.push(params.case_id);
    }

    query += ` ORDER BY processed_at DESC NULLS LAST LIMIT 50`;

    const rows = await db.rawQueryAll<IngestedEvent>(query, ...values);
    return { events: rows };
  }
);
