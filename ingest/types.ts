import type { DisputePhase } from "../cases/types";

export interface RazorpayDisputePayload {
  id: string;
  payment_id: string;
  amount: number;
  currency: string;
  amount_deducted: number;
  reason_code: string;
  respond_by: number | string;
  status: string;
  phase: DisputePhase | string;
  network?: string;
  merchant_name?: string;
  merchant_reference?: string;
  created_at: number;
}

export interface DisputeWebhookPayload {
  dispute: RazorpayDisputePayload;
}

export interface IngestedEvent {
  id: string;
  external_event_id: string;
  case_id: string | null;
  event_type: string;
  processed_at: string | null;
  payload_json: DisputeWebhookPayload;
}
