import { api } from "encore.dev/api";
import db from "../db";
import type { CaseStats } from "./types";

// Returns aggregate statistics for the cases dashboard.
export const stats = api<void, CaseStats>(
  { expose: true, method: "GET", path: "/cases/stats" },
  async () => {
    const row = await db.queryRow<CaseStats>`
      SELECT
        COUNT(*)::int AS total_cases,
        COALESCE(SUM(amount), 0)::double precision AS total_disputed_amount,
        COALESCE(SUM(amount) FILTER (WHERE recommendation = 'Contest'), 0)::double precision AS contestable_amount,
        COALESCE(SUM(amount) FILTER (WHERE recommendation = 'Accept'), 0)::double precision AS acceptance_amount,
        COALESCE(SUM(amount) FILTER (WHERE recommendation = 'Escalate'), 0)::double precision AS escalated_amount,
        COUNT(*) FILTER (WHERE respond_by IS NOT NULL AND respond_by < NOW())::int AS overdue_count,
        COUNT(*) FILTER (
          WHERE respond_by IS NOT NULL
            AND respond_by >= NOW()
            AND respond_by < NOW() + INTERVAL '24 hours'
        )::int AS due_in_24h_count
      FROM cases
    `;

    return row ?? {
      total_cases: 0,
      total_disputed_amount: 0,
      contestable_amount: 0,
      acceptance_amount: 0,
      escalated_amount: 0,
      overdue_count: 0,
      due_in_24h_count: 0,
    };
  }
);
