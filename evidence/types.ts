export type EvidenceStatus = "found" | "missing" | "partial";
export type EvidencePurpose = "dispute_evidence";
export type EvidenceType =
  | "payment_record"
  | "order_details"
  | "awb_tracking"
  | "logistics_status"
  | "proof_of_delivery"
  | "invoice"
  | "customer_communication"
  | "merchant_policy"
  | "document_ocr";

export interface EvidenceItem {
  id: string;
  case_id: string;
  evidence_type: EvidenceType;
  source_name: string;
  title: string;
  summary_text: string;
  raw_content_json: Record<string, unknown>;
  preview_text: string;
  file_url: string | null;
  purpose: EvidencePurpose;
  status: EvidenceStatus;
  confidence: number;
  collected_at: Date;
}

export interface CreateEvidenceItemParams {
  case_id: string;
  evidence_type: EvidenceType;
  source_name: string;
  title: string;
  summary_text: string;
  raw_content_json: Record<string, unknown>;
  preview_text: string;
  file_url?: string;
  purpose?: EvidencePurpose;
  status: EvidenceStatus;
  confidence: number;
}
