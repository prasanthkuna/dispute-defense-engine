import { api } from "encore.dev/api";
import db from "../db";

interface EventLog {
  id: string;
  external_event_id: string;
  event_type: string;
  processed_at: string;
  payload_json: any;
}

interface ListEventsResponse {
  events: EventLog[];
}

// Returns the most recent 50 webhook events for the Live Console.
export const list = api<void, ListEventsResponse>(
  { expose: true, method: "GET", path: "/ingest/events" },
  async () => {
    const rows = db.query<EventLog>`
      SELECT id, external_event_id, event_type, processed_at, payload_json
      FROM events
      ORDER BY processed_at DESC
      LIMIT 50
    `;
    const events: EventLog[] = [];
    for await (const row of rows) {
      events.push(row);
    }
    return { events };
  }
);
