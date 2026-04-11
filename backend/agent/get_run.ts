import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { AgentRun, AgentTraceStep } from "./types";

interface GetRunParams {
  id: string;
}

interface GetRunResponse {
  run: AgentRun;
  steps: AgentTraceStep[];
}

function parseStep(row: AgentTraceStep): AgentTraceStep {
  return {
    ...row,
    input_json: typeof row.input_json === "string" ? JSON.parse(row.input_json) : row.input_json,
    output_json: typeof row.output_json === "string" ? JSON.parse(row.output_json) : row.output_json,
  };
}

// Retrieves an agent run with all trace steps.
export const getAgentRun = api<GetRunParams, GetRunResponse>(
  { expose: true, method: "GET", path: "/agent/runs/:id" },
  async ({ id }) => {
    const run = await db.queryRow<AgentRun>`SELECT * FROM agent_runs WHERE id = ${id}`;
    if (!run) throw APIError.notFound("agent run not found");

    const rows = await db.queryAll<AgentTraceStep>`
      SELECT * FROM agent_trace_steps WHERE agent_run_id = ${id} ORDER BY step_number ASC
    `;
    return { run, steps: rows.map(parseStep) };
  }
);
