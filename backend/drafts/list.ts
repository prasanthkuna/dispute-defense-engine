import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { Draft } from "./types";

interface ListDraftsParams {
  case_id: Query<string>;
}

interface ListDraftsResponse {
  drafts: Draft[];
}

// Lists all draft versions for a given case.
export const listDrafts = api<ListDraftsParams, ListDraftsResponse>(
  { expose: true, method: "GET", path: "/drafts" },
  async ({ case_id }) => {
    const draftList = await db.queryAll<Draft>`
      SELECT * FROM drafts WHERE case_id = ${case_id} ORDER BY version DESC
    `;
    return { drafts: draftList };
  }
);
