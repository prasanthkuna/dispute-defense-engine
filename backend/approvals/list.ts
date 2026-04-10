import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { Approval } from "./types";

interface ListApprovalsParams {
  case_id: Query<string>;
}

interface ListApprovalsResponse {
  approvals: Approval[];
}

// Lists all approval records for a given case.
export const listApprovals = api<ListApprovalsParams, ListApprovalsResponse>(
  { expose: true, method: "GET", path: "/approvals" },
  async ({ case_id }) => {
    const approvalList = await db.queryAll<Approval>`
      SELECT * FROM approvals WHERE case_id = ${case_id} ORDER BY created_at DESC
    `;
    return { approvals: approvalList };
  }
);
