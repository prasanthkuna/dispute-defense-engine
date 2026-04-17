export interface ScenarioDefinition {
  type: "slam_dunk_contest" | "vernacular_evidence_contest" | "rto_accept" | "weak_evidence_escalate";
  label: string;
  merchant_name: string;
  amount: number;
  amount_deducted: number;
  payment_id: string;
  reason_code: string;
  phase: string;
  external_status: string;
  network: string;
  merchant_reference: string;
  respond_by_offset_hours: number;
  description: string;
  expected_recommendation: "Contest" | "Accept" | "Escalate";
  expected_confidence: "High" | "Medium" | "Low";
  evidence_score: number;
  highlights: string[];
  payment_method: "upi" | "netbanking" | "card";
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    type: "slam_dunk_contest",
    label: "Delivered Order Counter-Dispute",
    merchant_name: "Urban Cart",
    amount: 2499,
    amount_deducted: 0,
    payment_id: "pay_abc123",
    reason_code: "products_not_received",
    phase: "chargeback",
    external_status: "open",
    network: "UPI",
    merchant_reference: "ORD-4521",
    respond_by_offset_hours: 18,
    description: "Chargeback intake opens with no deduction yet; the case becomes a strong contest once delivery, POD, invoice, and translated complaint evidence are assembled.",
    expected_recommendation: "Contest",
    expected_confidence: "High",
    evidence_score: 1.0,
    payment_method: "upi",
    highlights: [
      "Webhook arrives as payment.dispute.created",
      "Status open | phase chargeback | amount_deducted Rs 0",
      "AWB SHP789012 delivered with signed POD",
      "POD signed by P. Sharma",
      "Invoice INV-4521 (Rs 2,499)",
      "Hindi complaint translated",
      "Evidence pack supports contest submission",
    ],
  },
  {
    type: "vernacular_evidence_contest",
    label: "Vernacular Evidence Recovery",
    merchant_name: "House of Sarees",
    amount: 5899,
    amount_deducted: 0,
    payment_id: "pay_def456",
    reason_code: "products_not_received",
    phase: "pre_arbitration",
    external_status: "open",
    network: "NetBanking",
    merchant_reference: "ORD-7832",
    respond_by_offset_hours: 32,
    description: "Pre-arbitration intake starts open, then moves to under_review after a translated WhatsApp acknowledgement and supporting delivery evidence are assembled.",
    expected_recommendation: "Contest",
    expected_confidence: "Medium",
    evidence_score: 0.875,
    payment_method: "netbanking",
    highlights: [
      "Webhook opens in pre_arbitration phase",
      "WhatsApp OCR + translation capture customer acknowledgement",
      "AWB SHP345678 delivered with POD",
      "POD signed by M. Iyer",
      "Invoice missing keeps confidence at medium",
      "Invoice missing",
      "Follow-up webhook moves dispute to under_review",
    ],
  },
  {
    type: "rto_accept",
    label: "RTO Refund Decision",
    merchant_name: "Gadget Lane",
    amount: 14999,
    amount_deducted: 0,
    payment_id: "pay_ghi789",
    reason_code: "products_not_received",
    phase: "chargeback",
    external_status: "open",
    network: "Visa",
    merchant_reference: "ORD-2291",
    respond_by_offset_hours: 6,
    description: "Chargeback opens with the payment captured but not yet deducted; carrier telemetry shows RTO after customer refusal, so acceptance is recommended but must stay approver-confirmed.",
    expected_recommendation: "Accept",
    expected_confidence: "High",
    evidence_score: 0.5,
    payment_method: "card",
    highlights: [
      "Webhook arrives as payment.dispute.created",
      "Status open | amount_deducted Rs 0 until a lost outcome",
      "DHL AWB shows customer refused delivery",
      "Customer refused delivery",
      "No POD available",
      "Acceptance remains irreversible and approval-gated",
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
    external_status: "open",
    network: "UPI",
    merchant_reference: "ORD-8801",
    respond_by_offset_hours: -6,
    description: "Retrieval-phase dispute opens with almost no merchant artifacts; once an incomplete packet is sent, Razorpay requests rework and the case loops back for escalation.",
    expected_recommendation: "Escalate",
    expected_confidence: "Low",
    evidence_score: 0.25,
    payment_method: "upi",
    highlights: [
      "Webhook opens in retrieval phase with overdue SLA",
      "Order remains unfulfilled and no AWB is assigned",
      "No AWB assigned",
      "No logistics tracking",
      "No POD",
      "No invoice",
      "Follow-up action_required event sends the case back for rework",
    ],
  },
];
