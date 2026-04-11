export interface ScenarioDefinition {
  type: "slam_dunk_contest" | "vernacular_evidence_contest" | "rto_accept" | "weak_evidence_escalate";
  label: string;
  merchant_name: string;
  amount: number;
  description: string;
  expected_recommendation: "Contest" | "Accept" | "Escalate";
  expected_confidence: "High" | "Medium" | "Low";
  evidence_score: number;
  highlights: string[];
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    type: "slam_dunk_contest",
    label: "Slam Dunk Contest",
    merchant_name: "Urban Cart",
    amount: 2499,
    description: "All 8 evidence types found. Shiprocket POD with signature. Customer complaint in Hindi translated. Clear contest case.",
    expected_recommendation: "Contest",
    expected_confidence: "High",
    evidence_score: 1.0,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-4521)",
      "AWB SHP789012 — Delivered",
      "POD signed by P. Sharma",
      "Invoice INV-4521 (₹2,499)",
      "Hindi complaint translated",
      "Merchant policy: Contest",
    ],
  },
  {
    type: "vernacular_evidence_contest",
    label: "Vernacular Evidence Contest",
    merchant_name: "House of Sarees",
    amount: 5899,
    description: "WhatsApp OCR extracts Hindi delivery acknowledgement from customer. 7/8 evidence. Missing formal invoice — approval required.",
    expected_recommendation: "Contest",
    expected_confidence: "Medium",
    evidence_score: 0.875,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-7832)",
      "AWB SHP345678 — Delivered",
      "POD signed by M. Iyer",
      "WhatsApp OCR: 'haan, order mil gaya'",
      "Invoice MISSING",
      "Approval required",
    ],
  },
  {
    type: "rto_accept",
    label: "RTO Accept",
    merchant_name: "Gadget Lane",
    amount: 14999,
    description: "Shiprocket tracking shows RTO — customer refused delivery. Policy mandates immediate acceptance.",
    expected_recommendation: "Accept",
    expected_confidence: "High",
    evidence_score: 0.5,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-2291)",
      "DHL AWB — RTO Initiated",
      "Customer refused delivery",
      "No POD available",
      "Policy: Accept RTO immediately",
    ],
  },
  {
    type: "weak_evidence_escalate",
    label: "Weak Evidence Escalate",
    merchant_name: "Fresh Nest",
    amount: 899,
    description: "Order unfulfilled. No AWB, no tracking, no POD, no invoice. 2/8 evidence. Escalate to human review.",
    expected_recommendation: "Escalate",
    expected_confidence: "Low",
    evidence_score: 0.25,
    highlights: [
      "Payment captured (Razorpay)",
      "Order UNFULFILLED (Shopify ORD-8801)",
      "No AWB assigned",
      "No logistics tracking",
      "No POD",
      "No invoice",
      "No support record",
    ],
  },
];
