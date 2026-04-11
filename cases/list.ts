import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { Case } from "./types";

interface ListCasesParams {
  status?: Query<string>;
  recommendation?: Query<string>;
  scenario_type?: Query<string>;
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

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT * FROM cases ${where} ORDER BY created_at DESC`;

    const rows = await db.rawQueryAll<Case>(query, ...values);
    return { cases: rows };
  }
);
