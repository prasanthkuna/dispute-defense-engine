import { api, APIError } from "encore.dev/api";
import db from "../db";
import { cases, audit } from "~encore/clients";
import type { Approval, CreateApprovalParams } from "./types";

// Records an approval decision and updates the case status accordingly.
export const createApproval = api<CreateApprovalParams, Approval>(
  { expose: true, method: "POST", path: "/approvals" },
  async (params) => {
    if (params.actor_role !== "Approver" && params.actor_role !== "Admin") {
      throw APIError.invalidArgument("only Approver or Admin can record approval decisions");
    }

    const caseRow = await db.queryRow<{ status: string; approval_state: string }>`
      SELECT status, approval_state FROM cases WHERE id = ${params.case_id}
    `;
    if (!caseRow) throw APIError.notFound("case not found");

    if (caseRow.status !== "Approval Pending" || caseRow.approval_state !== "Pending") {
      throw APIError.invalidArgument("case is not currently awaiting approval");
    }

    const id = crypto.randomUUID();

    const row = await db.queryRow<Approval>`
      INSERT INTO approvals (id, case_id, draft_id, actor_role, actor_name, decision, notes)
      VALUES (
        ${id}, ${params.case_id}, ${params.draft_id ?? null},
        ${params.actor_role}, ${params.actor_name}, ${params.decision}, ${params.notes ?? null}
      ) RETURNING *
    `;

    let newStatus = "Approval Pending";
    let newApprovalState = params.decision;

    if (params.decision === "Approved") {
      newStatus = "Ready to Submit";
      newApprovalState = "Approved";
    } else if (params.decision === "Rejected") {
      newStatus = "Ready for Review";
      newApprovalState = "Rejected";
    } else if (params.decision === "Sent Back") {
      newStatus = "Ready for Review";
      newApprovalState = "Sent Back";
    }

    await cases.update({
      id: params.case_id,
      status: newStatus as any,
      approval_state: newApprovalState as any,
    });

    if (params.draft_id) {
      const draftStatus = params.decision === "Approved" ? "ready" : "draft";
      await db.exec`
        UPDATE drafts
        SET draft_status = ${draftStatus}, updated_at = NOW()
        WHERE id = ${params.draft_id}
      `;
    }

    await audit.log({
      case_id: params.case_id,
      actor_type: "approver",
      actor_name: params.actor_name,
      action_type: "approval_decision",
      details_json: {
        decision: params.decision,
        actor_role: params.actor_role,
        notes: params.notes ?? null,
        new_status: newStatus,
      },
    });

    return row!;
  }
);
