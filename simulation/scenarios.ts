import type { DisputePhase } from "../cases/types";

export interface ScenarioDefinition {
  type: "slam_dunk_contest" | "vernacular_evidence_contest" | "rto_accept" | "weak_evidence_escalate";
  label: string;
  merchant_name: string;
  amount: number;
  amount_deducted: number;
  payment_id: string;
  reason_code: string;
  phase: DisputePhase;
  external_status: string;
  network: string;
  merchant_reference: string;
  respond_by_offset_hours: number;
  description: string;
  expected_recommendation: "Contest" | "Accept" | "Escalate";
  expected_confidence: "High" | "Medium" | "Low";
  evidence_score: number;
  highlights: string[];
  lifecycle_events?: {
    event_type: string;
    external_status: string;
    amount_deducted?: number;
    action_required_reason?: string;
  }[];
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    type: "slam_dunk_contest",
    label: "Delivered Order Counter-Dispute",
    merchant_name: "Urban Cart",
    amount: 2499,
    amount_deducted: 2499,
    payment_id: "pay_abc123",
    reason_code: "products_not_received",
    phase: "chargeback",
    external_status: "needs_response",
    network: "UPI",
    merchant_reference: "ORD-4521",
    respond_by_offset_hours: 18,
    description: "High-confidence INR defense with delivered tracking, signed POD, invoice, and translated customer complaint.",
    expected_recommendation: "Contest",
    expected_confidence: "High",
    evidence_score: 1.0,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-4521)",
      "AWB SHP789012 - Delivered",
      "POD signed by P. Sharma",
      "Invoice INV-4521 (Rs 2,499)",
      "Hindi complaint translated",
      "Merchant policy: Contest",
    ],
  },
  {
    type: "vernacular_evidence_contest",
    label: "Vernacular Evidence Recovery",
    merchant_name: "House of Sarees",
    amount: 5899,
    amount_deducted: 5899,
    payment_id: "pay_def456",
    reason_code: "products_not_received",
    phase: "pre_arbitration",
    external_status: "under_review",
    network: "NetBanking",
    merchant_reference: "ORD-7832",
    respond_by_offset_hours: 32,
    description: "Medium-confidence defense driven by WhatsApp OCR and translation, with invoice missing and approval required.",
    expected_recommendation: "Contest",
    expected_confidence: "Medium",
    evidence_score: 0.875,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-7832)",
      "AWB SHP345678 - Delivered",
      "POD signed by M. Iyer",
      "WhatsApp OCR: 'haan, order mil gaya'",
      "Invoice missing",
      "Approval required",
    ],
    lifecycle_events: [
      {
        event_type: "payment.dispute.action_required",
        external_status: "action_required",
        action_required_reason: "Submit additional counter-evidence in English or translated from vernacular.",
      },
    ],
  },
  {
    type: "rto_accept",
    label: "RTO Refund Decision",
    merchant_name: "Gadget Lane",
    amount: 14999,
    amount_deducted: 14999,
    payment_id: "pay_ghi789",
    reason_code: "products_not_received",
    phase: "chargeback",
    external_status: "needs_response",
    network: "Visa",
    merchant_reference: "ORD-2291",
    respond_by_offset_hours: 6,
    description: "High-confidence acceptance because the shipment went RTO after the customer refused delivery.",
    expected_recommendation: "Accept",
    expected_confidence: "High",
    evidence_score: 0.5,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-2291)",
      "DHL AWB - RTO initiated",
      "Customer refused delivery",
      "No POD available",
      "Policy: Accept RTO immediately",
    ],
  },
  {
    type: "weak_evidence_escalate",
    label: "Low-Evidence Manual Review",
    merchant_name: "Fresh Nest",
    amount: 899,
    amount_deducted: 0,
    payment_id: "pay_jkl012",
    reason_code: "products_not_received",
    phase: "retrieval",
    external_status: "needs_response",
    network: "UPI",
    merchant_reference: "ORD-8801",
    respond_by_offset_hours: -6,
    description: "Low-confidence case with poor fulfillment telemetry and missing merchant artifacts, requiring human review.",
    expected_recommendation: "Escalate",
    expected_confidence: "Low",
    evidence_score: 0.25,
    highlights: [
      "Payment captured (Razorpay)",
      "Order unfulfilled (Shopify ORD-8801)",
      "No AWB assigned",
      "No logistics tracking",
      "No POD",
      "No invoice",
      "No support record",
    ],
  },
];
