import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Draft, UpdateDraftParams } from "./types";

// Updates the text content of a draft response.
export const updateDraft = api<UpdateDraftParams, Draft>(
  { expose: true, method: "PUT", path: "/drafts/:id" },
  async ({ id, summary_text, response_text }) => {
    const existing = await db.queryRow<Draft>`SELECT * FROM drafts WHERE id = ${id}`;
    if (!existing) throw APIError.notFound("draft not found");

    const newSummary = summary_text ?? existing.summary_text;
    const newResponse = response_text ?? existing.response_text;

    const row = await db.queryRow<Draft>`
      UPDATE drafts SET summary_text = ${newSummary}, response_text = ${newResponse}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return row!;
  }
);
