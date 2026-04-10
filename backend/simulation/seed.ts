import { api } from "encore.dev/api";
import { simulation } from "~encore/clients";
import { SCENARIOS } from "./scenarios";

interface SeedResponse {
  cases_created: number;
}

// Seeds all 4 demo scenarios for the dispute defense engine.
export const seed = api<void, SeedResponse>(
  { expose: true, method: "POST", path: "/simulation/seed" },
  async () => {
    let count = 0;
    for (const scenario of SCENARIOS) {
      await simulation.simulate({ scenario_type: scenario.type });
      count++;
    }
    return { cases_created: count };
  }
);
