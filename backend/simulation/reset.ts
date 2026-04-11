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
    // Use DELETE instead of TRUNCATE because the runtime DB role in Encore Cloud
    // may not own every table and therefore can lack TRUNCATE privileges.
    await db.exec`DELETE FROM events`;
    await db.exec`DELETE FROM cases`;

    for (const scenario of SCENARIOS) {
      await runScenario(scenario.type);
    }

    return { success: true };
  }
);
