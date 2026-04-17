import type { DisputePhase } from "../cases/types";

export const RAZORPAY_DISPUTE_EVENT_TYPES = [
  "payment.dispute.created",
  "payment.dispute.action_required",
  "payment.dispute.under_review",
  "payment.dispute.won",
  "payment.dispute.lost",
  "payment.dispute.closed",
] as const;

export type RazorpayDisputeEventType =
  | "payment.dispute.created"
  | "payment.dispute.action_required"
  | "payment.dispute.under_review"
  | "payment.dispute.won"
  | "payment.dispute.lost"
  | "payment.dispute.closed";

export interface RazorpayDisputeEvidencePayload {
  amount: number;
  summary: string | null;
  shipping_proof: string[] | null;
  billing_proof: string[] | null;
  cancellation_proof: string[] | null;
  customer_communication: string[] | null;
  proof_of_service: string[] | null;
  explanation_letter: string[] | null;
  refund_confirmation: string[] | null;
  access_activity_log: string[] | null;
  refund_cancellation_policy: string[] | null;
  term_and_conditions: string[] | null;
  others: Array<string | Record<string, unknown>> | null;
  submitted_at: number | string | null;
}

export interface RazorpayDisputePayload {
  id: string;
  entity?: "dispute";
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
  action_required_reason?: string;
  evidence?: RazorpayDisputeEvidencePayload;
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: "payment";
  amount: number;
  currency: string;
  base_amount?: number;
  status: string;
  order_id: string | null;
  invoice_id?: string | null;
  international?: boolean;
  method?: string | null;
  amount_refunded?: number;
  amount_transferred?: number;
  refund_status?: string | null;
  captured?: boolean;
  description?: string | null;
  card_id?: string | null;
  bank?: string | null;
  wallet?: string | null;
  vpa?: string | null;
  email?: string | null;
  contact?: string | null;
  notes?: Record<string, unknown> | unknown[];
  fee?: number | null;
  tax?: number | null;
  error_code?: string | null;
  error_description?: string | null;
  error_source?: string | null;
  error_step?: string | null;
  error_reason?: string | null;
  acquirer_data?: Record<string, unknown>;
  card?: {
    network?: string | null;
  } | null;
  created_at: number;
}

export interface LegacyDisputeWebhookPayload {
  dispute: RazorpayDisputePayload;
}

export interface RazorpayWebhookEnvelope {
  entity: "event";
  account_id: string;
  event: RazorpayDisputeEventType;
  contains: string[];
  payload: {
    payment?: {
      entity: RazorpayPaymentEntity;
    };
    dispute: {
      entity: RazorpayDisputePayload;
    };
  };
  created_at: number;
}

export type DisputeWebhookPayload = LegacyDisputeWebhookPayload | RazorpayWebhookEnvelope;

export interface IngestedEvent {
  id: string;
  external_event_id: string;
  case_id: string | null;
  event_type: RazorpayDisputeEventType;
  processed_at: string | null;
  payload_json: DisputeWebhookPayload;
}
