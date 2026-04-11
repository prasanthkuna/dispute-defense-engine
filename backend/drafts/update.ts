import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Draft, UpdateDraftParams } from "./types";

function parseRow(row: Draft): Draft {
  return {
    ...row,
    attachments_json: typeof row.attachments_json === "string" ? JSON.parse(row.attachments_json) : row.attachments_json,
  };
}

// Updates the text content of a draft response.
export const updateDraft = api<UpdateDraftParams, Draft>(
  { expose: true, method: "PUT", path: "/drafts/:id" },
  async ({ id, summary_text, response_text }) => {
    const existing = await db.queryRow<Draft>`SELECT * FROM drafts WHERE id = ${id}`;
    if (!existing) throw APIError.notFound("draft not found");

    const parsedExisting = parseRow(existing);
    const newSummary = summary_text ?? parsedExisting.summary_text;
    const newResponse = response_text ?? parsedExisting.response_text;

    const row = await db.queryRow<Draft>`
      UPDATE drafts SET summary_text = ${newSummary}, response_text = ${newResponse}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return parseRow(row!);
  }
);
