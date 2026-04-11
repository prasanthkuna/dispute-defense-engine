import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { PolicyDecision } from "./types";

interface GetDecisionsParams {
  case_id: Query<string>;
}

interface GetDecisionsResponse {
  decisions: PolicyDecision[];
}

function parseRow(row: PolicyDecision): PolicyDecision {
  return {
    ...row,
    rationale_json: typeof row.rationale_json === "string" ? JSON.parse(row.rationale_json) : row.rationale_json,
    missing_items_json: typeof row.missing_items_json === "string" ? JSON.parse(row.missing_items_json) : row.missing_items_json,
  };
}

// Retrieves all policy decisions for a given case.
export const getDecisions = api<GetDecisionsParams, GetDecisionsResponse>(
  { expose: true, method: "GET", path: "/policy/decisions" },
  async ({ case_id }) => {
    const rows = await db.queryAll<PolicyDecision>`
      SELECT * FROM policy_decisions WHERE case_id = ${case_id} ORDER BY created_at DESC
    `;
    return { decisions: rows.map(parseRow) };
  }
);
