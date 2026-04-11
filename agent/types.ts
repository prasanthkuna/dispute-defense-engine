export type AgentRunStatus = "running" | "completed" | "failed";
export type TraceStepStatus = "success" | "warning" | "error" | "pending";

export interface AgentRun {
  id: string;
  case_id: string;
  status: AgentRunStatus;
  step_count: number;
  started_at: Date;
  ended_at: Date | null;
  final_summary: string | null;
}

export interface AgentTraceStep {
  id: string;
  agent_run_id: string;
  case_id: string;
  step_number: number;
  action_type: string;
  tool_name: string | null;
  input_json: Record<string, unknown>;
  output_json: Record<string, unknown>;
  observation_text: string;
  status: TraceStepStatus;
  created_at: Date;
}

export interface RunAgentParams {
  case_id: string;
  scenario_type: string;
}

export interface RunAgentResponse {
  run: AgentRun;
  steps: AgentTraceStep[];
}
