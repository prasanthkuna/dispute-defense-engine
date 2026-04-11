import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { AgentTraceStep } from "./types";

interface ListStepsParams {
  case_id: Query<string>;
}

interface ListStepsResponse {
  steps: AgentTraceStep[];
}

function parseStep(row: AgentTraceStep): AgentTraceStep {
  return {
    ...row,
    input_json: typeof row.input_json === "string" ? JSON.parse(row.input_json) : row.input_json,
    output_json: typeof row.output_json === "string" ? JSON.parse(row.output_json) : row.output_json,
  };
}

// Lists all agent trace steps for a given case.
export const listAgentSteps = api<ListStepsParams, ListStepsResponse>(
  { expose: true, method: "GET", path: "/agent/steps" },
  async ({ case_id }) => {
    const rows = await db.queryAll<AgentTraceStep>`
      SELECT * FROM agent_trace_steps WHERE case_id = ${case_id} ORDER BY step_number ASC
    `;
    return { steps: rows.map(parseStep) };
  }
);
