import { api } from "encore.dev/api";
import { seedScenario } from "./factory";
import db from "../db";

interface RunSimParams {
  scenario_index: number;
}

interface RunSimResponse {
  case_id: string;
}

// Runs a specific simulation scenario.
export const runSim = api<RunSimParams, RunSimResponse>(
  { expose: true, method: "POST", path: "/simulation/run" },
  async ({ scenario_index }) => {
    const res = await seedScenario(scenario_index);
    return { case_id: res.case_id };
  }
);
