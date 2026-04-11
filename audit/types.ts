export type ActorType = "system" | "agent" | "operator" | "approver";

export interface AuditLog {
  id: string;
  case_id: string;
  actor_type: ActorType;
  actor_name: string;
  action_type: string;
  details_json: Record<string, unknown>;
  created_at: Date;
}

export interface CreateAuditLogParams {
  case_id: string;
  actor_type: ActorType;
  actor_name: string;
  action_type: string;
  details_json: Record<string, unknown>;
}
