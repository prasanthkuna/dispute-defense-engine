import { api } from "encore.dev/api";
import db from "../db";

interface ResetResponse {
  success: boolean;
}

// Clears all generated demo data so the environment is empty again.
export const reset = api<void, ResetResponse>(
  { expose: true, method: "POST", path: "/simulation/reset" },
  async () => {
    // Use DELETE instead of TRUNCATE because the runtime DB role in Encore Cloud
    // may not own every table and therefore can lack TRUNCATE privileges.
    await db.exec`DELETE FROM events`;
    await db.exec`DELETE FROM cases`;

    return { success: true };
  }
);
