import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { ApprovalState, Case, CaseStatus, ConfidenceBand, Recommendation } from "./types";

interface UpdateCaseParams {
  id: string;
  status?: CaseStatus;
  recommendation?: Recommendation;
  confidence_band?: ConfidenceBand;
  evidence_completeness_score?: number;
  approval_state?: ApprovalState;
}

const VALID_STATUS_TRANSITIONS: Partial<Record<CaseStatus, CaseStatus[]>> = {
  "New": ["Hunting Evidence"],
  "Hunting Evidence": ["Ready for Review"],
  "Ready for Review": ["Approval Pending", "Ready to Submit", "Submitted"],
  "Approval Pending": ["Ready for Review", "Ready to Submit"],
  "Ready to Submit": ["Submitted", "Ready for Review"],
  "Submitted": ["Action Required", "Closed"],
  "Action Required": ["Hunting Evidence", "Ready for Review"],
  "Closed": [],
};

const VALID_RECOMMENDATIONS: Recommendation[] = ["Contest", "Accept", "Escalate"];
const VALID_CONFIDENCE_BANDS: ConfidenceBand[] = ["High", "Medium", "Low"];
const VALID_APPROVAL_STATES: ApprovalState[] = ["Not Needed", "Pending", "Approved", "Rejected", "Sent Back"];

function canTransition(from: CaseStatus, to: CaseStatus) {
  return from === to || (VALID_STATUS_TRANSITIONS[from] ?? []).includes(to);
}

// Updates a dispute case's status, recommendation, or other mutable fields.
export const update = api<UpdateCaseParams, Case>(
  { expose: true, method: "PUT", path: "/cases/:id" },
  async ({ id, ...fields }) => {
    const existing = await db.queryRow<Case>`SELECT * FROM cases WHERE id = ${id}`;
    if (!existing) throw APIError.notFound("case not found");

    if (fields.status !== undefined && !canTransition(existing.status, fields.status)) {
      throw APIError.invalidArgument(`invalid status transition: ${existing.status} -> ${fields.status}`);
    }

    if (fields.recommendation !== undefined && !VALID_RECOMMENDATIONS.includes(fields.recommendation)) {
      throw APIError.invalidArgument("invalid recommendation");
    }

    if (fields.confidence_band !== undefined && !VALID_CONFIDENCE_BANDS.includes(fields.confidence_band)) {
      throw APIError.invalidArgument("invalid confidence band");
    }

    if (fields.approval_state !== undefined && !VALID_APPROVAL_STATES.includes(fields.approval_state)) {
      throw APIError.invalidArgument("invalid approval state");
    }

    if (fields.evidence_completeness_score !== undefined) {
      const score = fields.evidence_completeness_score;
      if (score < 0 || score > 1) {
        throw APIError.invalidArgument("evidence completeness score must be between 0 and 1");
      }
    }

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

    if (fields.status === "Ready to Submit") {
      await db.exec`
        UPDATE drafts
        SET draft_status = 'ready', updated_at = NOW()
        WHERE id = (
          SELECT id FROM drafts
          WHERE case_id = ${id}
          ORDER BY version DESC
          LIMIT 1
        )
      `;
    }

    if (fields.status === "Submitted") {
      await db.exec`
        UPDATE drafts
        SET draft_status = 'submitted', updated_at = NOW()
        WHERE id = (
          SELECT id FROM drafts
          WHERE case_id = ${id}
          ORDER BY version DESC
          LIMIT 1
        )
      `;
    }

    return row;
  }
);
