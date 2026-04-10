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

// Lists all agent trace steps for a given case.
export const listAgentSteps = api<ListStepsParams, ListStepsResponse>(
  { expose: true, method: "GET", path: "/agent/steps" },
  async ({ case_id }) => {
    const steps = await db.queryAll<AgentTraceStep>`
      SELECT * FROM agent_trace_steps WHERE case_id = ${case_id} ORDER BY step_number ASC
    `;
    return { steps };
  }
);
