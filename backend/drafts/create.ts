import { api } from "encore.dev/api";
import db from "../db";
import { getDraftText } from "../agent/draft_templates";
import type { Draft, CreateDraftParams } from "./types";

// Generates a bank-facing dispute response draft for a case.
export const createDraft = api<CreateDraftParams, Draft>(
  { expose: true, method: "POST", path: "/drafts" },
  async ({ case_id }) => {
    const caseRow = await db.queryRow<{ merchant_name: string; amount: number; currency: string; dispute_id: string; scenario_type: string }>`
      SELECT merchant_name, amount, currency, dispute_id, scenario_type FROM cases WHERE id = ${case_id}
    `;

    const latestVersion = await db.queryRow<{ max_version: number | null }>`
      SELECT MAX(version) AS max_version FROM drafts WHERE case_id = ${case_id}
    `;

    const version = (latestVersion?.max_version ?? 0) + 1;
    const scenario = caseRow?.scenario_type ?? "slam_dunk_contest";
    const content = getDraftText(scenario, caseRow?.dispute_id ?? "disp_unknown", caseRow ?? { merchant_name: "Merchant", amount: 0, currency: "INR" });

    const id = crypto.randomUUID();
    const attachJson = JSON.stringify(content.attachments);

    const row = await db.queryRow<Draft>`
      INSERT INTO drafts (id, case_id, version, summary_text, response_text, attachments_json)
      VALUES (${id}, ${case_id}, ${version}, ${content.summary}, ${content.response}, ${attachJson}::jsonb)
      RETURNING *
    `;
    return row!;
  }
);
