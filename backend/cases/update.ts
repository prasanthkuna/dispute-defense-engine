import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Case } from "./types";

interface UpdateCaseParams {
  id: string;
  status?: string;
  recommendation?: string;
  confidence_band?: string;
  evidence_completeness_score?: number;
  approval_state?: string;
}

// Updates a dispute case's status, recommendation, or other mutable fields.
export const update = api<UpdateCaseParams, Case>(
  { expose: true, method: "PUT", path: "/cases/:id" },
  async ({ id, ...fields }) => {
    const existing = await db.queryRow<Case>`SELECT * FROM cases WHERE id = ${id}`;
    if (!existing) throw APIError.notFound("case not found");

    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let idx = 1;

    if (fields.status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(fields.status);
    }
    if (fields.recommendation !== undefined) {
      updates.push(`recommendation = $${idx++}`);
      values.push(fields.recommendation);
    }
    if (fields.confidence_band !== undefined) {
      updates.push(`confidence_band = $${idx++}`);
      values.push(fields.confidence_band);
    }
    if (fields.evidence_completeness_score !== undefined) {
      updates.push(`evidence_completeness_score = $${idx++}`);
      values.push(fields.evidence_completeness_score);
    }
    if (fields.approval_state !== undefined) {
      updates.push(`approval_state = $${idx++}`);
      values.push(fields.approval_state);
    }

    if (updates.length === 0) return existing;

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE cases SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`;
    const row = await db.rawQueryRow<Case>(query, ...values);
    if (!row) throw APIError.internal("update failed");
    return row;
  }
);
