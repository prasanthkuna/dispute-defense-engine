import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { AuditLog } from "./types";

interface ListAuditParams {
  case_id: Query<string>;
}

interface ListAuditResponse {
  logs: AuditLog[];
}

function parseRow(row: AuditLog): AuditLog {
  return {
    ...row,
    details_json: typeof row.details_json === "string" ? JSON.parse(row.details_json) : row.details_json,
  };
}

// Retrieves the full audit trail for a given case.
export const listAudit = api<ListAuditParams, ListAuditResponse>(
  { expose: true, method: "GET", path: "/audit" },
  async ({ case_id }) => {
    const rows = await db.queryAll<AuditLog>`
      SELECT * FROM audit_logs WHERE case_id = ${case_id} ORDER BY created_at ASC
    `;
    return { logs: rows.map(parseRow) };
  }
);
