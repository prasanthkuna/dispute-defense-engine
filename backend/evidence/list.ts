import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { EvidenceItem } from "./types";

interface ListEvidenceParams {
  case_id: Query<string>;
}

interface ListEvidenceResponse {
  items: EvidenceItem[];
}

// Lists all evidence items for a given case.
export const listEvidence = api<ListEvidenceParams, ListEvidenceResponse>(
  { expose: true, method: "GET", path: "/evidence" },
  async ({ case_id }) => {
    const items = await db.queryAll<EvidenceItem>`
      SELECT * FROM evidence_items WHERE case_id = ${case_id} ORDER BY collected_at ASC
    `;
    return { items };
  }
);
