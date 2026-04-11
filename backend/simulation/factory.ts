import { ingestEvent, type IngestEventResponse } from "../ingest/ingest";

// The Synthetic Data Factory generates production-spec Razorpay payloads
// to simulate high-stakes dispute operations without a real merchant account.

interface Scenario {
  name: string;
  eventType: string;
  disputeId: string;
  paymentId: string;
  amount: number;
  reasonCode: string;
  respondByDays: number;
  status: string;
  phase: string;
}

const SCENARIOS: Scenario[] = [
  {
    name: "Slam Dunk Defense (UPI)",
    eventType: "payment.dispute.created",
    disputeId: "disp_JkiLz8vRjFv8X1",
    paymentId: "pay_JkiLxvRjFv8X1",
    amount: 249900,
    reasonCode: "products_not_received",
    respondByDays: 7,
    status: "open",
    phase: "chargeback"
  },
  {
    name: "Vernacular OCR Evidence",
    eventType: "payment.dispute.created",
    disputeId: "disp_JkiLz8vRjFv8X2",
    paymentId: "pay_JkiLxvRjFv8X2",
    amount: 589900,
    reasonCode: "products_not_received",
    respondByDays: 3,
    status: "open",
    phase: "pre_arbitration"
  },
  {
    name: "RTO Recovery",
    eventType: "payment.dispute.created",
    disputeId: "disp_JkiLz8vRjFv8X3",
    paymentId: "pay_JkiLxvRjFv8X3",
    amount: 1499900,
    reasonCode: "products_not_received",
    respondByDays: 5,
    status: "open",
    phase: "chargeback"
  },
  {
    name: "Subscription Cancellation",
    eventType: "payment.dispute.created",
    disputeId: "disp_JkiLz8vRjFv8X4",
    paymentId: "pay_JkiLxvRjFv8X4",
    amount: 199900,
    reasonCode: "subscription_cancelled",
    respondByDays: 10,
    status: "open",
    phase: "chargeback"
  }
];

export async function seedScenario(index: number) {
  const s = SCENARIOS[index % SCENARIOS.length];
  const respondBy = Math.floor(Date.now() / 1000) + (s.respondByDays * 86400);

  const payload = {
    external_event_id: `evt_${crypto.randomUUID().slice(0, 8)}`,
    event_type: s.eventType,
    payload: {
      dispute: {
        id: s.disputeId,
        payment_id: s.paymentId,
        amount: s.amount,
        currency: "INR",
        amount_deducted: s.amount,
        reason_code: s.reasonCode,
        respond_by: respondBy,
        status: s.status,
        phase: s.phase,
        created_at: Math.floor(Date.now() / 1000)
      }
    }
  };

  return await ingestEvent(payload);
}
