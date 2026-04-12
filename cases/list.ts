import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { Case } from "./types";

interface ListCasesParams {
  status?: Query<string>;
  recommendation?: Query<string>;
  scenario_type?: Query<string>;
  reason_code?: Query<string>;
  phase?: Query<string>;
  sla_bucket?: Query<string>;
}

interface ListCasesResponse {
  cases: Case[];
}

// Lists all dispute cases with optional filters.
export const list = api<ListCasesParams, ListCasesResponse>(
  { expose: true, method: "GET", path: "/cases" },
  async (params) => {
    const conditions: string[] = [];
    const values: (string | number | boolean)[] = [];
    let idx = 1;

    if (params.status) {
      conditions.push(`status = $${idx++}`);
      values.push(params.status);
    }
    if (params.recommendation) {
      conditions.push(`recommendation = $${idx++}`);
      values.push(params.recommendation);
    }
    if (params.scenario_type) {
      conditions.push(`scenario_type = $${idx++}`);
      values.push(params.scenario_type);
    }
    if (params.reason_code) {
      conditions.push(`reason_code = $${idx++}`);
      values.push(params.reason_code);
    }
    if (params.phase) {
      conditions.push(`phase = $${idx++}`);
      values.push(params.phase);
    }
    if (params.sla_bucket === "overdue") {
      conditions.push("respond_by < NOW()");
    }
    if (params.sla_bucket === "due_24h") {
      conditions.push("respond_by >= NOW() AND respond_by < NOW() + INTERVAL '24 hours'");
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT * FROM cases ${where} ORDER BY respond_by ASC NULLS LAST, created_at DESC`;

    const rows = await db.rawQueryAll<Case>(query, ...values);
    return { cases: rows };
  }
);
