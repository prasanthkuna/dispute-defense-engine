export type DraftStatus = "draft" | "ready" | "submitted";

export interface Draft {
  id: string;
  case_id: string;
  version: number;
  draft_status: DraftStatus;
  summary_text: string;
  response_text: string;
  attachments_json: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateDraftParams {
  case_id: string;
}

export interface UpdateDraftParams {
  id: string;
  summary_text?: string;
  response_text?: string;
}
