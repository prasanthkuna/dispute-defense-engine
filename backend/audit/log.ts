import { api } from "encore.dev/api";
import db from "../db";
import type { AuditLog, CreateAuditLogParams } from "./types";

function parseRow(row: AuditLog): AuditLog {
  return {
    ...row,
    details_json: typeof row.details_json === "string" ? JSON.parse(row.details_json) : row.details_json,
  };
}

// Creates an immutable audit log entry.
export const log = api<CreateAuditLogParams, AuditLog>(
  { expose: true, method: "POST", path: "/audit" },
  async (params) => {
    const id = crypto.randomUUID();
    const detailsJson = JSON.stringify(params.details_json);

    const row = await db.queryRow<AuditLog>`
      INSERT INTO audit_logs (id, case_id, actor_type, actor_name, action_type, details_json)
      VALUES (${id}, ${params.case_id}, ${params.actor_type}, ${params.actor_name}, ${params.action_type}, ${detailsJson}::jsonb)
      RETURNING *
    `;
    return parseRow(row!);
  }
);
