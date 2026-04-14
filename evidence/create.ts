import { api } from "encore.dev/api";
import db from "../db";
import type { EvidenceItem, CreateEvidenceItemParams } from "./types";

function parseRow(row: EvidenceItem): EvidenceItem {
  return {
    ...row,
    raw_content_json: typeof row.raw_content_json === "string" ? JSON.parse(row.raw_content_json) : row.raw_content_json,
  };
}

// Creates a new evidence item for a case.
export const createEvidence = api<CreateEvidenceItemParams, EvidenceItem>(
  { expose: true, method: "POST", path: "/evidence" },
  async (params) => {
    const id = crypto.randomUUID();
    const rawJson = JSON.stringify(params.raw_content_json);

    const row = await db.queryRow<EvidenceItem>`
      INSERT INTO evidence_items (
        id, case_id, evidence_type, source_name, title,
        summary_text, raw_content_json, preview_text, file_url, purpose,
        status, confidence
      ) VALUES (
        ${id}, ${params.case_id}, ${params.evidence_type}, ${params.source_name}, ${params.title},
        ${params.summary_text}, ${rawJson}::jsonb, ${params.preview_text}, ${params.file_url ?? null}, ${params.purpose ?? "dispute_evidence"},
        ${params.status}, ${params.confidence}
      ) RETURNING *
    `;
    return parseRow(row!);
  }
);
