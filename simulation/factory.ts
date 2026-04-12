import { runScenario } from "./simulate";
import { SCENARIOS } from "./scenarios";

// Synthetic data factory used by the run API and demo controls.
export async function seedScenario(index: number) {
  const scenario = SCENARIOS[index % SCENARIOS.length];
  return await runScenario(scenario.type);
}
