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

// Retrieves all policy decisions for a given case.
export const getDecisions = api<GetDecisionsParams, GetDecisionsResponse>(
  { expose: true, method: "GET", path: "/policy/decisions" },
  async ({ case_id }) => {
    const decisions = await db.queryAll<PolicyDecision>`
      SELECT * FROM policy_decisions WHERE case_id = ${case_id} ORDER BY created_at DESC
    `;
    return { decisions };
  }
);
