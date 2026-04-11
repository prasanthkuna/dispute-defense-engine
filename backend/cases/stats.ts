import { api } from "encore.dev/api";
import db from "../db";
import type { CaseStats } from "./types";

// Returns aggregate statistics for the cases dashboard.
export const stats = api<void, CaseStats>(
  { expose: true, method: "GET", path: "/cases/stats" },
  async () => {
    const totalRow = await db.queryRow<{ count: number }>`SELECT COUNT(*)::int AS count FROM cases`;
    const total = totalRow?.count ?? 0;

    const rfr = await db.queryRow<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM cases WHERE status = 'Ready for Review'
    `;
    const ap = await db.queryRow<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM cases WHERE status = 'Approval Pending'
    `;
    const sub = await db.queryRow<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM cases WHERE status = 'Submitted'
    `;
    const defendedRow = await db.queryRow<{ total: number }>`
      SELECT COALESCE(SUM(amount), 0)::double precision AS total FROM cases
    `;

    const autoComplete = total > 0 ? ((rfr?.count ?? 0) / total) * 100 : 0;

    return {
      total,
      ready_for_review: rfr?.count ?? 0,
      approval_pending: ap?.count ?? 0,
      submitted: sub?.count ?? 0,
      auto_complete_rate: Math.round(autoComplete),
      defended_value: Math.round(defendedRow?.total ?? 0),
    };
  }
);
