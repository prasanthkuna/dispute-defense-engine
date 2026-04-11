import { api } from "encore.dev/api";
import db from "../db";
import { SCENARIOS } from "./scenarios";
import { runScenario } from "./simulate";

interface ResetResponse {
  success: boolean;
}

// Truncates all tables and reseeds all demo scenarios.
export const reset = api<void, ResetResponse>(
  { expose: true, method: "POST", path: "/simulation/reset" },
  async () => {
    await db.exec`TRUNCATE TABLE audit_logs, approvals, drafts, policy_decisions, agent_trace_steps, agent_runs, evidence_items, events, cases CASCADE`;

    for (const scenario of SCENARIOS) {
      await runScenario(scenario.type);
    }

    return { success: true };
  }
);
