import { api } from "encore.dev/api";
import db from "../db";
import { simulation } from "~encore/clients";

interface ResetResponse {
  success: boolean;
}

// Truncates all tables and reseeds all demo scenarios.
export const reset = api<void, ResetResponse>(
  { expose: true, method: "POST", path: "/simulation/reset" },
  async () => {
    await db.exec`TRUNCATE TABLE audit_logs, approvals, drafts, policy_decisions, agent_trace_steps, agent_runs, evidence_items, events, cases CASCADE`;

    for (const type of ["slam_dunk_contest", "vernacular_evidence_contest", "rto_accept", "weak_evidence_escalate"]) {
      await simulation.simulate({ scenario_type: type });
    }

    return { success: true };
  }
);
