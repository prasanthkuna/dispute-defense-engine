import { api } from "encore.dev/api";
import db from "../db";
import { agent, audit, ingest } from "~encore/clients";
import { SCENARIOS } from "./scenarios";
import type { Case } from "../cases/types";

interface SimulateParams {
  scenario_type: string;
}

interface SimulateResponse {
  case_id: string;
  case: Case;
}

// Runs a full end-to-end simulation for a given scenario type.
export const simulate = api<SimulateParams, SimulateResponse>(
  { expose: true, method: "POST", path: "/simulation/simulate" },
  async ({ scenario_type }) => {
    const scenario = SCENARIOS.find((s) => s.type === scenario_type);
    if (!scenario) throw new Error(`Unknown scenario: ${scenario_type}`);

    const caseId = crypto.randomUUID();
    const disputeId = `DISP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    await db.exec`
      INSERT INTO cases (id, dispute_id, merchant_name, amount, currency, dispute_reason, status, scenario_type)
      VALUES (
        ${caseId}, ${disputeId}, ${scenario.merchant_name}, ${scenario.amount},
        'INR', 'item_not_received', 'New', ${scenario_type}
      )
    `;

    await ingest.ingestEvent({
      external_event_id: disputeId,
      event_type: "dispute.created",
      payload_json: { case_id: caseId, scenario_type, merchant_name: scenario.merchant_name },
    });

    await audit.log({
      case_id: caseId,
      actor_type: "system",
      actor_name: "DDE System",
      action_type: "case_created",
      details_json: { dispute_id: disputeId, scenario_type, merchant_name: scenario.merchant_name, amount: scenario.amount },
    });

    await agent.runAgent({ case_id: caseId, scenario_type });

    const caseRow = await db.queryRow<Case>`SELECT * FROM cases WHERE id = ${caseId}`;

    return { case_id: caseId, case: caseRow! };
  }
);
