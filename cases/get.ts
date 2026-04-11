import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Case } from "./types";

interface GetCaseParams {
  id: string;
}

// Retrieves a single dispute case by ID.
export const get = api<GetCaseParams, Case>(
  { expose: true, method: "GET", path: "/cases/:id" },
  async ({ id }) => {
    const row = await db.queryRow<Case>`SELECT * FROM cases WHERE id = ${id}`;
    if (!row) throw APIError.notFound("case not found");
    return row;
  }
);
