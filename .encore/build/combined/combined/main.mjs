// This file was bundled by Encore v1.53.6
//
// https://encore.dev
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// encore.gen/internal/entrypoints/combined/main.ts
import { registerGateways, registerHandlers, run } from "encore.dev/internal/codegen/appinit";

// agent/get_run.ts
import { api, APIError } from "encore.dev/api";

// db/index.ts
import { SQLDatabase } from "encore.dev/storage/sqldb";
var db_default = new SQLDatabase("db", { migrations: "./migrations" });

// agent/get_run.ts
function parseStep(row) {
  return {
    ...row,
    input_json: typeof row.input_json === "string" ? JSON.parse(row.input_json) : row.input_json,
    output_json: typeof row.output_json === "string" ? JSON.parse(row.output_json) : row.output_json
  };
}
var getAgentRun = api(
  { expose: true, method: "GET", path: "/agent/runs/:id" },
  async ({ id }) => {
    const run2 = await db_default.queryRow`SELECT * FROM agent_runs WHERE id = ${id}`;
    if (!run2)
      throw APIError.notFound("agent run not found");
    const rows = await db_default.queryAll`
      SELECT * FROM agent_trace_steps WHERE agent_run_id = ${id} ORDER BY step_number ASC
    `;
    return { run: run2, steps: rows.map(parseStep) };
  }
);

// agent/list_steps.ts
import { api as api2 } from "encore.dev/api";
function parseStep2(row) {
  return {
    ...row,
    input_json: typeof row.input_json === "string" ? JSON.parse(row.input_json) : row.input_json,
    output_json: typeof row.output_json === "string" ? JSON.parse(row.output_json) : row.output_json
  };
}
var listAgentSteps = api2(
  { expose: true, method: "GET", path: "/agent/steps" },
  async ({ case_id }) => {
    const rows = await db_default.queryAll`
      SELECT * FROM agent_trace_steps WHERE case_id = ${case_id} ORDER BY step_number ASC
    `;
    return { steps: rows.map(parseStep2) };
  }
);

// agent/run.ts
import { api as api3 } from "encore.dev/api";

// encore.gen/internal/clients/agent/endpoints.js
var endpoints_exports = {};
__export(endpoints_exports, {
  Client: () => Client,
  getAgentRun: () => getAgentRun2,
  listAgentSteps: () => listAgentSteps2,
  ref: () => ref,
  runAgent: () => runAgent
});
import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS = false ? await null : null;
async function getAgentRun2(params, opts) {
  if (false) {
    return TEST_ENDPOINTS.getAgentRun(params, opts);
  }
  return apiCall("agent", "getAgentRun", params, opts);
}
async function listAgentSteps2(params, opts) {
  if (false) {
    return TEST_ENDPOINTS.listAgentSteps(params, opts);
  }
  return apiCall("agent", "listAgentSteps", params, opts);
}
async function runAgent(params, opts) {
  if (false) {
    return TEST_ENDPOINTS.runAgent(params, opts);
  }
  return apiCall("agent", "runAgent", params, opts);
}
var Client = class {
  constructor() {
    this.getAgentRun = getAgentRun2;
    this.listAgentSteps = listAgentSteps2;
    this.runAgent = runAgent;
  }
};
var _client_instance;
function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}

// encore.gen/internal/clients/approvals/endpoints.js
import { apiCall as apiCall2, streamIn as streamIn2, streamOut as streamOut2, streamInOut as streamInOut2 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS2 = false ? await null : null;

// encore.gen/internal/clients/audit/endpoints.js
var endpoints_exports2 = {};
__export(endpoints_exports2, {
  Client: () => Client2,
  listAudit: () => listAudit,
  log: () => log,
  ref: () => ref2
});
import { apiCall as apiCall3, streamIn as streamIn3, streamOut as streamOut3, streamInOut as streamInOut3 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS3 = false ? await null : null;
async function listAudit(params, opts) {
  if (false) {
    return TEST_ENDPOINTS3.listAudit(params, opts);
  }
  return apiCall3("audit", "listAudit", params, opts);
}
async function log(params, opts) {
  if (false) {
    return TEST_ENDPOINTS3.log(params, opts);
  }
  return apiCall3("audit", "log", params, opts);
}
var Client2 = class {
  constructor() {
    this.listAudit = listAudit;
    this.log = log;
  }
};
var _client_instance2;
function ref2() {
  if (!_client_instance2) {
    _client_instance2 = new Client2();
  }
  return _client_instance2;
}

// encore.gen/internal/clients/cases/endpoints.js
var endpoints_exports3 = {};
__export(endpoints_exports3, {
  Client: () => Client3,
  get: () => get,
  list: () => list,
  ref: () => ref3,
  stats: () => stats,
  update: () => update
});
import { apiCall as apiCall4, streamIn as streamIn4, streamOut as streamOut4, streamInOut as streamInOut4 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS4 = false ? await null : null;
async function get(params, opts) {
  if (false) {
    return TEST_ENDPOINTS4.get(params, opts);
  }
  return apiCall4("cases", "get", params, opts);
}
async function list(params, opts) {
  if (false) {
    return TEST_ENDPOINTS4.list(params, opts);
  }
  return apiCall4("cases", "list", params, opts);
}
async function stats(opts) {
  const params = void 0;
  if (false) {
    return TEST_ENDPOINTS4.stats(params, opts);
  }
  return apiCall4("cases", "stats", params, opts);
}
async function update(params, opts) {
  if (false) {
    return TEST_ENDPOINTS4.update(params, opts);
  }
  return apiCall4("cases", "update", params, opts);
}
var Client3 = class {
  constructor() {
    this.get = get;
    this.list = list;
    this.stats = stats;
    this.update = update;
  }
};
var _client_instance3;
function ref3() {
  if (!_client_instance3) {
    _client_instance3 = new Client3();
  }
  return _client_instance3;
}

// encore.gen/internal/clients/drafts/endpoints.js
import { apiCall as apiCall5, streamIn as streamIn5, streamOut as streamOut5, streamInOut as streamInOut5 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS5 = false ? await null : null;

// encore.gen/internal/clients/evidence/endpoints.js
import { apiCall as apiCall6, streamIn as streamIn6, streamOut as streamOut6, streamInOut as streamInOut6 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS6 = false ? await null : null;

// encore.gen/internal/clients/ingest/endpoints.js
var endpoints_exports4 = {};
__export(endpoints_exports4, {
  Client: () => Client4,
  ingestEvent: () => ingestEvent,
  list: () => list2,
  ref: () => ref4
});
import { apiCall as apiCall7, streamIn as streamIn7, streamOut as streamOut7, streamInOut as streamInOut7 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS7 = false ? await null : null;
async function ingestEvent(params, opts) {
  if (false) {
    return TEST_ENDPOINTS7.ingestEvent(params, opts);
  }
  return apiCall7("ingest", "ingestEvent", params, opts);
}
async function list2(params, opts) {
  if (false) {
    return TEST_ENDPOINTS7.list(params, opts);
  }
  return apiCall7("ingest", "list", params, opts);
}
var Client4 = class {
  constructor() {
    this.ingestEvent = ingestEvent;
    this.list = list2;
  }
};
var _client_instance4;
function ref4() {
  if (!_client_instance4) {
    _client_instance4 = new Client4();
  }
  return _client_instance4;
}

// encore.gen/internal/clients/policy/endpoints.js
var endpoints_exports5 = {};
__export(endpoints_exports5, {
  Client: () => Client5,
  evaluate: () => evaluate,
  getDecisions: () => getDecisions,
  ref: () => ref5
});
import { apiCall as apiCall8, streamIn as streamIn8, streamOut as streamOut8, streamInOut as streamInOut8 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS8 = false ? await null : null;
async function evaluate(params, opts) {
  if (false) {
    return TEST_ENDPOINTS8.evaluate(params, opts);
  }
  return apiCall8("policy", "evaluate", params, opts);
}
async function getDecisions(params, opts) {
  if (false) {
    return TEST_ENDPOINTS8.getDecisions(params, opts);
  }
  return apiCall8("policy", "getDecisions", params, opts);
}
var Client5 = class {
  constructor() {
    this.evaluate = evaluate;
    this.getDecisions = getDecisions;
  }
};
var _client_instance5;
function ref5() {
  if (!_client_instance5) {
    _client_instance5 = new Client5();
  }
  return _client_instance5;
}

// encore.gen/internal/clients/simulation/endpoints.js
import { apiCall as apiCall9, streamIn as streamIn9, streamOut as streamOut9, streamInOut as streamInOut9 } from "encore.dev/internal/codegen/api";
var TEST_ENDPOINTS9 = false ? await null : null;

// agent/scenario_steps.ts
function getSlamDunkSteps(caseId) {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute. Starting evidence collection for Item Not Received claim. Initialising tool-use chain.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_slam001", payment_id: "pay_abc123" },
      output_json: { payment_id: "pay_abc123", amount: 249900, currency: "INR", status: "captured", captured_at: "2026-03-25T10:15:00Z", method: "upi", vpa: "priya.sharma@okicici" },
      observation_text: "Payment pay_abc123 found. Status: captured. Amount: Rs 2,499. Method: UPI. Evidence recorded.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-4521", merchant: "urbancart" },
      output_json: { order_id: "ORD-4521", customer_name: "Priya Sharma", customer_email: "priya.sharma@gmail.com", shipping_address: "42, Sector 14, Gurugram, Haryana 122001", fulfillment_status: "shipped", awb: "SHP789012", carrier: "Shiprocket", line_items: [{ sku: "UC-TSHIRT-L-BLK", name: "Urban Cart Premium T-Shirt (L, Black)", qty: 1, price: 2499 }] },
      observation_text: "Order ORD-4521 retrieved. Fulfillment status: Shipped. AWB: SHP789012 via Shiprocket. Customer: Priya Sharma, Gurugram.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: "SHP789012", carrier: "Shiprocket" },
      output_json: { awb: "SHP789012", status: "Delivered", delivered_at: "2026-03-28T14:30:00Z", pod_available: true, pod_signature: "P. Sharma", delivery_location: "42, Sector 14, Gurugram", tracking_history: [{ ts: "2026-03-26T08:00:00Z", event: "Picked Up" }, { ts: "2026-03-27T11:30:00Z", event: "In Transit - Delhi Hub" }, { ts: "2026-03-28T14:30:00Z", event: "Delivered" }] },
      observation_text: "Shiprocket AWB SHP789012: Status DELIVERED on 2026-03-28T14:30Z. POD available with signature. Tracking history: 3 events.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_invoice_record",
      input_json: { order_id: "ORD-4521", merchant: "urbancart" },
      output_json: { invoice_id: "INV-4521", order_id: "ORD-4521", issued_at: "2026-03-25T10:16:00Z", amount: 2499, gst_number: "06AABCU9603R1ZP", hsn_code: "61091000", line_items: [{ description: "Urban Cart Premium T-Shirt (L, Black)", qty: 1, rate: 2118.64, gst_18_pct: 380.36, total: 2499 }] },
      observation_text: "Tax invoice INV-4521 found. Amount Rs 2,499, GST compliant. HSN 61091000. Issued 2026-03-25.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_support_transcript",
      input_json: { customer_email: "priya.sharma@gmail.com", order_id: "ORD-4521" },
      output_json: { ticket_id: "TKT-98234", channel: "email", created_at: "2026-03-29T09:00:00Z", messages: [{ role: "customer", ts: "2026-03-29T09:00:00Z", text: "mujhe order nahi mila. maine payment kar diya tha." }, { role: "agent", ts: "2026-03-29T09:15:00Z", text: "We are checking your order status." }], language_detected: "hi" },
      observation_text: "Support ticket TKT-98234 found. Customer complaint in Hindi: 'mujhe order nahi mila'. Language: hi. Requires translation.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "translate_text",
      input_json: { text: "mujhe order nahi mila. maine payment kar diya tha.", source_lang: "hi", target_lang: "en" },
      output_json: { translated: "I did not receive my order. I had already made the payment.", confidence: 0.98, engine: "indicTrans2" },
      observation_text: "Translation complete: 'I did not receive my order. I had already made the payment.' - Customer claim contradicted by Shiprocket POD.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_merchant_policy",
      input_json: { merchant: "urbancart", policy_type: "dispute" },
      output_json: { return_window_days: 7, dispute_policy: "Contest all INR disputes with POD", pod_requirement: "mandatory", refund_eligibility: "Only if non-delivery confirmed by carrier", contact_email: "disputes@urbancart.in" },
      observation_text: "Merchant policy retrieved. Urban Cart policy: contest all INR disputes with POD. 7-day return window. POD mandatory.",
      status: "success"
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { evidence_count: 8, found: 8, missing: 0, score: 1 },
      observation_text: "Evidence collection complete. Score: 8/8 (100%). All critical evidence found. POD signature confirmed. Handing off to deterministic policy engine.",
      status: "success"
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { recommended_action: "Contest", confidence_band: "High", approval_required: false },
      observation_text: "Policy engine returned: CONTEST (High confidence). All 8 evidence types collected. POD available. Generating bank-facing draft response.",
      status: "success"
    }
  ];
}
function getVernacularSteps(caseId) {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute for House of Sarees. Starting evidence collection. Customer communication in vernacular - activating OCR + translation tools.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_vern002", payment_id: "pay_def456" },
      output_json: { payment_id: "pay_def456", amount: 589900, currency: "INR", status: "captured", captured_at: "2026-03-20T14:22:00Z", method: "netbanking", bank: "HDFC" },
      observation_text: "Payment pay_def456 found. Status: captured. Amount: Rs 5,899. Method: NetBanking (HDFC).",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-7832", merchant: "houseofsarees" },
      output_json: { order_id: "ORD-7832", customer_name: "Meenakshi Iyer", fulfillment_status: "shipped", awb: "SHP345678", carrier: "Delhivery", line_items: [{ sku: "HOS-SILK-001", name: "Kanjivaram Silk Saree - Maroon Gold Border", qty: 1, price: 5899 }] },
      observation_text: "Order ORD-7832 found. AWB: SHP345678 via Delhivery. Customer: Meenakshi Iyer.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: "SHP345678", carrier: "Delhivery" },
      output_json: { awb: "SHP345678", status: "Delivered", delivered_at: "2026-03-24T11:00:00Z", pod_available: true, pod_signature: "M. Iyer" },
      observation_text: "AWB SHP345678: DELIVERED on 2026-03-24T11:00Z. POD available. Signature: M. Iyer.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_support_transcript",
      input_json: { customer_email: "meenakshi.iyer@yahoo.co.in", order_id: "ORD-7832" },
      output_json: { ticket_id: "TKT-78901", channel: "whatsapp", created_at: "2026-03-25T16:00:00Z", has_screenshot: true, screenshot_url: "https://storage.internal/whatsapp_ss_TKT78901.jpg" },
      observation_text: "Support contact found via WhatsApp. Screenshot available. Activating OCR parser.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "parse_chat_screenshot",
      input_json: { screenshot_url: "https://storage.internal/whatsapp_ss_TKT78901.jpg", ocr_engine: "tesseract-indicv2" },
      output_json: { extracted_text: "haan, order mil gaya. bahut sundar saree hai!", language_detected: "hi", confidence: 0.94 },
      observation_text: "OCR extracted: 'haan, order mil gaya. bahut sundar saree hai!' Language: Hindi. Confidence: 94%.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "translate_text",
      input_json: { text: "haan, order mil gaya. bahut sundar saree hai!", source_lang: "hi", target_lang: "en" },
      output_json: { translated: "Yes, the order arrived. Very beautiful saree!", confidence: 0.97 },
      observation_text: "Translation: 'Yes, the order arrived. Very beautiful saree!' - Customer acknowledges receipt. Strong counter-evidence to INR claim.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_merchant_policy",
      input_json: { merchant: "houseofsarees", policy_type: "dispute" },
      output_json: { return_window_days: 3, dispute_policy: "Contest with delivery proof and customer acknowledgement", pod_requirement: "mandatory" },
      observation_text: "Merchant policy retrieved. 3-day return window. Contest with POD and customer acknowledgement.",
      status: "warning"
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { evidence_count: 7, found: 7, missing: 1, missing_items: ["invoice"], score: 0.875 },
      observation_text: "Evidence collection complete. Score: 7/8 (87.5%). Missing: formal tax invoice. WhatsApp delivery acknowledgement captured. Handing off to policy engine.",
      status: "warning"
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { recommended_action: "Contest", confidence_band: "Medium", approval_required: true },
      observation_text: "Policy engine returned: CONTEST (Medium confidence). Vernacular acknowledgement as key evidence. Approval required due to missing invoice. Draft being generated.",
      status: "success"
    }
  ];
}
function getRtoSteps(caseId) {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute for Gadget Lane. Starting evidence collection.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_rto003", payment_id: "pay_ghi789" },
      output_json: { payment_id: "pay_ghi789", amount: 1499900, currency: "INR", status: "captured", captured_at: "2026-03-10T09:00:00Z", method: "card", card_network: "Visa" },
      observation_text: "Payment pay_ghi789 found. Status: captured. Amount: Rs 14,999. Method: Visa card.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-2291", merchant: "gadgetlane" },
      output_json: { order_id: "ORD-2291", customer_name: "Rohit Verma", fulfillment_status: "shipped", awb: "DHL909876", carrier: "DHL", line_items: [{ sku: "GL-PHONE-X15", name: "Smartphone ProMax X15 128GB", qty: 1, price: 14999 }] },
      observation_text: "Order ORD-2291 found. AWB: DHL909876 via DHL.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: "DHL909876", carrier: "DHL" },
      output_json: { awb: "DHL909876", status: "RTO", rto_initiated_at: "2026-03-14T08:00:00Z", rto_reason: "Customer refused delivery", delivered_at: null, pod_available: false, tracking_history: [{ ts: "2026-03-11T10:00:00Z", event: "Picked Up" }, { ts: "2026-03-13T14:00:00Z", event: "Out for Delivery" }, { ts: "2026-03-13T17:30:00Z", event: "Delivery Failed - Customer Refused" }, { ts: "2026-03-14T08:00:00Z", event: "RTO Initiated" }] },
      observation_text: "CRITICAL: AWB DHL909876 status is RTO (Return to Origin). Customer refused delivery on 2026-03-13. No POD. Recommend ACCEPT.",
      status: "warning"
    },
    {
      action_type: "tool_call",
      tool_name: "get_invoice_record",
      input_json: { order_id: "ORD-2291", merchant: "gadgetlane" },
      output_json: { invoice_id: "INV-2291", amount: 14999, issued_at: "2026-03-10T09:01:00Z" },
      observation_text: "Invoice INV-2291 found. Amount Rs 14,999.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_merchant_policy",
      input_json: { merchant: "gadgetlane", policy_type: "dispute" },
      output_json: { dispute_policy: "Accept RTO disputes immediately. Initiate refund per RTO SLA.", rto_sla_days: 7 },
      observation_text: "Merchant policy: Accept all RTO disputes immediately. Refund per 7-day RTO SLA.",
      status: "success"
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { recommended_action: "Accept", confidence_band: "High", logistics_status: "RTO", approval_required: false },
      observation_text: "Policy engine returned: ACCEPT (High confidence). Logistics status is RTO - non-delivery confirmed by carrier. No contest warranted. Audit log updated.",
      status: "success"
    }
  ];
}
function getWeakEvidenceSteps(caseId) {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute for Fresh Nest. Starting evidence collection.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_weak004", payment_id: "pay_jkl012" },
      output_json: { payment_id: "pay_jkl012", amount: 89900, currency: "INR", status: "captured", captured_at: "2026-03-18T11:00:00Z", method: "upi", vpa: "amit.joshi@paytm" },
      observation_text: "Payment pay_jkl012 found. Amount: Rs 899. Method: UPI.",
      status: "success"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-8801", merchant: "freshnest" },
      output_json: { order_id: "ORD-8801", customer_name: "Amit Joshi", fulfillment_status: "unfulfilled", awb: null, carrier: null, line_items: [{ sku: "FN-PLANT-001", name: "Indoor Plant Combo Set", qty: 1, price: 899 }] },
      observation_text: "Order ORD-8801 found but UNFULFILLED. No AWB assigned. Cannot fetch tracking data.",
      status: "error"
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: null, carrier: null },
      output_json: { error: "No AWB found for order ORD-8801", status: "not_found" },
      observation_text: "Shiprocket tracking failed: No AWB available. Cannot confirm delivery status.",
      status: "error"
    },
    {
      action_type: "tool_call",
      tool_name: "get_support_transcript",
      input_json: { customer_email: "amit.joshi@email.com", order_id: "ORD-8801" },
      output_json: { ticket_id: null, error: "No support ticket found for this order" },
      observation_text: "No support transcript found. Customer has not contacted support via tracked channels.",
      status: "warning"
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { evidence_count: 2, found: 2, missing: 6, score: 0.25, missing_items: ["awb_tracking", "logistics_status", "proof_of_delivery", "invoice", "customer_communication", "merchant_policy"] },
      observation_text: "Evidence collection complete. Score: 2/8 (25%). CRITICAL: No AWB, no tracking, no POD, no invoice, no support record. Escalating - insufficient evidence to contest or accept.",
      status: "error"
    }
  ];
}

// agent/evidence_factory.ts
function getSlamDunkEvidence(caseId) {
  return [
    {
      case_id: caseId,
      evidence_type: "payment_record",
      source_name: "Razorpay",
      title: "Payment pay_abc123 - Captured",
      summary_text: "UPI payment of Rs 2,499 captured on 2026-03-25. VPA: priya.sharma@okicici.",
      raw_content_json: { payment_id: "pay_abc123", amount: 2499, status: "captured", method: "upi" },
      preview_text: "pay_abc123 | Rs 2,499 | captured | UPI",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "order_details",
      source_name: "Shopify",
      title: "Order ORD-4521 - Shipped",
      summary_text: "Order ORD-4521 for Priya Sharma. Urban Cart Premium T-Shirt. AWB: SHP789012 via Shiprocket.",
      raw_content_json: { order_id: "ORD-4521", customer: "Priya Sharma", awb: "SHP789012" },
      preview_text: "ORD-4521 | Priya Sharma | AWB: SHP789012",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "awb_tracking",
      source_name: "Shiprocket",
      title: "AWB SHP789012 - Tracking",
      summary_text: "Shipment tracked: Picked up -> In Transit Delhi Hub -> Delivered on 2026-03-28.",
      raw_content_json: { awb: "SHP789012", events: 3, delivered_at: "2026-03-28T14:30:00Z" },
      preview_text: "SHP789012 | 3 tracking events | Delivered 2026-03-28",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "logistics_status",
      source_name: "Shiprocket",
      title: "Logistics Status - Delivered",
      summary_text: "Final logistics status: Delivered on 2026-03-28T14:30Z to 42, Sector 14, Gurugram.",
      raw_content_json: { status: "Delivered", delivered_at: "2026-03-28T14:30:00Z", location: "Gurugram" },
      preview_text: "Delivered | 2026-03-28T14:30Z | Gurugram",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "proof_of_delivery",
      source_name: "Shiprocket",
      title: "Proof of Delivery - Signed",
      summary_text: "POD available. Recipient signature: P. Sharma. Delivered to registered address.",
      raw_content_json: { pod_available: true, signature: "P. Sharma", address_match: true },
      preview_text: "POD: P. Sharma | Address confirmed",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "invoice",
      source_name: "Merchant ERP",
      title: "Tax Invoice INV-4521",
      summary_text: "GST-compliant tax invoice INV-4521 for Rs 2,499. HSN 61091000. GSTIN: 06AABCU9603R1ZP.",
      raw_content_json: { invoice_id: "INV-4521", amount: 2499, gst: 380.36 },
      preview_text: "INV-4521 | Rs 2,499 | GST: Rs 380.36",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "customer_communication",
      source_name: "Support Desk",
      title: "Support Ticket TKT-98234 - Hindi Complaint",
      summary_text: "Customer complaint (Hindi): 'mujhe order nahi mila'. Translation: 'I did not receive my order.' Contradicted by Shiprocket POD.",
      raw_content_json: { ticket_id: "TKT-98234", original: "mujhe order nahi mila", translated: "I did not receive my order", language: "hi" },
      preview_text: "TKT-98234 | 'mujhe order nahi mila' -> 'I did not receive my order'",
      status: "found",
      confidence: 0.98
    },
    {
      case_id: caseId,
      evidence_type: "merchant_policy",
      source_name: "Merchant Policy DB",
      title: "Urban Cart Dispute Policy",
      summary_text: "Contest all INR disputes with POD. 7-day return window. POD mandatory for all claims.",
      raw_content_json: { policy: "Contest all INR disputes with POD", return_window_days: 7 },
      preview_text: "Contest policy | 7-day return window | POD mandatory",
      status: "found",
      confidence: 1
    }
  ];
}
function getVernacularEvidence(caseId) {
  return [
    {
      case_id: caseId,
      evidence_type: "payment_record",
      source_name: "Razorpay",
      title: "Payment pay_def456 - Captured",
      summary_text: "NetBanking payment of Rs 5,899 captured on 2026-03-20. Bank: HDFC.",
      raw_content_json: { payment_id: "pay_def456", amount: 5899, status: "captured", method: "netbanking" },
      preview_text: "pay_def456 | Rs 5,899 | captured | NetBanking",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "order_details",
      source_name: "Shopify",
      title: "Order ORD-7832 - Shipped",
      summary_text: "Order ORD-7832 for Meenakshi Iyer. Kanjivaram Silk Saree. AWB: SHP345678 via Delhivery.",
      raw_content_json: { order_id: "ORD-7832", customer: "Meenakshi Iyer", awb: "SHP345678" },
      preview_text: "ORD-7832 | Meenakshi Iyer | AWB: SHP345678",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "awb_tracking",
      source_name: "Delhivery",
      title: "AWB SHP345678 - Tracking",
      summary_text: "Delivered on 2026-03-24 via Delhivery. Signature: M. Iyer.",
      raw_content_json: { awb: "SHP345678", delivered_at: "2026-03-24T11:00:00Z" },
      preview_text: "SHP345678 | Delivered 2026-03-24",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "logistics_status",
      source_name: "Delhivery",
      title: "Logistics Status - Delivered",
      summary_text: "Final logistics status: Delivered on 2026-03-24T11:00Z.",
      raw_content_json: { status: "Delivered", delivered_at: "2026-03-24T11:00:00Z" },
      preview_text: "Delivered | 2026-03-24T11:00Z",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "proof_of_delivery",
      source_name: "Delhivery",
      title: "Proof of Delivery - Signed",
      summary_text: "POD available. Signature: M. Iyer.",
      raw_content_json: { pod_available: true, signature: "M. Iyer" },
      preview_text: "POD: M. Iyer | Signed",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "invoice",
      source_name: "Merchant ERP",
      title: "Tax Invoice - MISSING",
      summary_text: "Formal tax invoice not found in ERP. Possible manual billing. Evidence marked partial.",
      raw_content_json: { error: "Invoice not found in ERP" },
      preview_text: "Invoice NOT FOUND",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "customer_communication",
      source_name: "WhatsApp OCR",
      title: "WhatsApp Screenshot - Delivery Acknowledgement",
      summary_text: "OCR of WhatsApp screenshot. Customer message: 'haan, order mil gaya.' Translation: 'Yes, the order arrived.' Confidence: 94%.",
      raw_content_json: { ocr_text: "haan, order mil gaya. bahut sundar saree hai!", translated: "Yes, the order arrived. Very beautiful saree!", confidence: 0.94 },
      preview_text: "'haan, order mil gaya' -> 'Yes, the order arrived'",
      status: "found",
      confidence: 0.94
    },
    {
      case_id: caseId,
      evidence_type: "merchant_policy",
      source_name: "Merchant Policy DB",
      title: "House of Sarees Dispute Policy",
      summary_text: "Contest with delivery proof and customer acknowledgement. 3-day return window.",
      raw_content_json: { policy: "Contest with delivery proof and customer acknowledgement", return_window_days: 3 },
      preview_text: "Contest policy | 3-day return window",
      status: "found",
      confidence: 1
    }
  ];
}
function getRtoEvidence(caseId) {
  return [
    {
      case_id: caseId,
      evidence_type: "payment_record",
      source_name: "Razorpay",
      title: "Payment pay_ghi789 - Captured",
      summary_text: "Visa card payment of Rs 14,999 captured on 2026-03-10.",
      raw_content_json: { payment_id: "pay_ghi789", amount: 14999, status: "captured", method: "card" },
      preview_text: "pay_ghi789 | Rs 14,999 | captured | Visa",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "order_details",
      source_name: "Shopify",
      title: "Order ORD-2291 - Shipped",
      summary_text: "Order ORD-2291. Smartphone ProMax X15. AWB: DHL909876.",
      raw_content_json: { order_id: "ORD-2291", awb: "DHL909876" },
      preview_text: "ORD-2291 | Rohit Verma | AWB: DHL909876",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "awb_tracking",
      source_name: "DHL",
      title: "AWB DHL909876 - RTO",
      summary_text: "Shipment tracking: Picked up -> Out for Delivery -> Delivery Failed -> RTO Initiated.",
      raw_content_json: { awb: "DHL909876", events: 4, rto_at: "2026-03-14T08:00:00Z" },
      preview_text: "DHL909876 | 4 events | RTO 2026-03-14",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "logistics_status",
      source_name: "DHL",
      title: "Logistics Status - RTO",
      summary_text: "Final logistics status: RTO (Return to Origin). Reason: Customer refused delivery on 2026-03-13.",
      raw_content_json: { status: "RTO", rto_reason: "Customer refused delivery", rto_initiated_at: "2026-03-14T08:00:00Z" },
      preview_text: "RTO | Customer refused | 2026-03-14",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "proof_of_delivery",
      source_name: "DHL",
      title: "Proof of Delivery - NOT AVAILABLE",
      summary_text: "No POD available. Delivery failed - customer refused at door.",
      raw_content_json: { pod_available: false, reason: "Customer refused delivery" },
      preview_text: "POD: NOT AVAILABLE | Refused delivery",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "invoice",
      source_name: "Merchant ERP",
      title: "Tax Invoice INV-2291",
      summary_text: "Invoice INV-2291 for Rs 14,999.",
      raw_content_json: { invoice_id: "INV-2291", amount: 14999 },
      preview_text: "INV-2291 | Rs 14,999",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "customer_communication",
      source_name: "Support Desk",
      title: "Customer Communication - Not Found",
      summary_text: "No support ticket found. Customer filed dispute directly with bank.",
      raw_content_json: { error: "No support ticket found" },
      preview_text: "No support record",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "merchant_policy",
      source_name: "Merchant Policy DB",
      title: "Gadget Lane Dispute Policy",
      summary_text: "Accept all RTO disputes. Initiate refund per 7-day RTO SLA.",
      raw_content_json: { policy: "Accept RTO disputes immediately", rto_sla_days: 7 },
      preview_text: "Accept RTO | 7-day SLA",
      status: "found",
      confidence: 1
    }
  ];
}
function getWeakEvidence(caseId) {
  return [
    {
      case_id: caseId,
      evidence_type: "payment_record",
      source_name: "Razorpay",
      title: "Payment pay_jkl012 - Captured",
      summary_text: "UPI payment of Rs 899 captured on 2026-03-18.",
      raw_content_json: { payment_id: "pay_jkl012", amount: 899, status: "captured", method: "upi" },
      preview_text: "pay_jkl012 | Rs 899 | captured | UPI",
      status: "found",
      confidence: 1
    },
    {
      case_id: caseId,
      evidence_type: "order_details",
      source_name: "Shopify",
      title: "Order ORD-8801 - Unfulfilled",
      summary_text: "Order ORD-8801: Indoor Plant Combo Set. Status: UNFULFILLED. No AWB assigned.",
      raw_content_json: { order_id: "ORD-8801", fulfillment_status: "unfulfilled", awb: null },
      preview_text: "ORD-8801 | UNFULFILLED | No AWB",
      status: "partial",
      confidence: 0.5
    },
    {
      case_id: caseId,
      evidence_type: "awb_tracking",
      source_name: "Shiprocket",
      title: "AWB Tracking - NOT FOUND",
      summary_text: "No AWB found for order ORD-8801. Cannot fetch tracking data.",
      raw_content_json: { error: "No AWB found", order_id: "ORD-8801" },
      preview_text: "No AWB | Cannot track",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "logistics_status",
      source_name: "Shiprocket",
      title: "Logistics Status - UNKNOWN",
      summary_text: "Cannot determine logistics status without AWB.",
      raw_content_json: { status: "unknown", reason: "No AWB" },
      preview_text: "Status UNKNOWN | No AWB",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "proof_of_delivery",
      source_name: "Shiprocket",
      title: "Proof of Delivery - NOT AVAILABLE",
      summary_text: "No POD. Order not shipped.",
      raw_content_json: { pod_available: false, reason: "Order not shipped" },
      preview_text: "POD: NOT AVAILABLE",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "invoice",
      source_name: "Merchant ERP",
      title: "Tax Invoice - NOT FOUND",
      summary_text: "No invoice found for unfulfilled order ORD-8801.",
      raw_content_json: { error: "Invoice not found", order_id: "ORD-8801" },
      preview_text: "Invoice NOT FOUND",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "customer_communication",
      source_name: "Support Desk",
      title: "Customer Communication - NOT FOUND",
      summary_text: "No support ticket on record. Customer has not engaged via tracked channels.",
      raw_content_json: { error: "No support ticket found" },
      preview_text: "No communication record",
      status: "missing",
      confidence: 0
    },
    {
      case_id: caseId,
      evidence_type: "merchant_policy",
      source_name: "Merchant Policy DB",
      title: "Fresh Nest Dispute Policy - NOT FOUND",
      summary_text: "No formal dispute policy configured for Fresh Nest.",
      raw_content_json: { error: "No policy configured" },
      preview_text: "No policy found",
      status: "missing",
      confidence: 0
    }
  ];
}

// agent/draft_templates.ts
function getDraftText(scenarioType, disputeId, caseData) {
  const amountStr = `Rs ${caseData.amount.toLocaleString("en-IN")}`;
  if (scenarioType === "slam_dunk_contest") {
    return {
      summary: "High-confidence contest: POD confirmed, customer complaint translated from Hindi, all 8 evidence types collected.",
      response: `Dear Nodal Officer,

We are writing to formally contest the chargeback claim ${disputeId} filed for transaction pay_abc123 amounting to ${amountStr}.

Our records conclusively demonstrate that the order was delivered to the customer's registered address on 28th March 2026 at 14:30 IST. The following evidence is enclosed herewith:

1. Shopify Order Confirmation - Order ORD-4521 (Customer: Priya Sharma, 42 Sector 14, Gurugram)
2. Shiprocket Logistics Tracking Report - AWB SHP789012, status: Delivered (3 tracking events)
3. Proof of Delivery (POD) - Signed by P. Sharma at the delivery address
4. Tax Invoice INV-4521 - Rs 2,499, GST compliant, HSN 61091000
5. Customer Support Transcript TKT-98234 - Customer complaint in Hindi: "mujhe order nahi mila" (Translation: "I did not receive my order"), issued on 29th March 2026 - one day after confirmed delivery
6. Merchant Dispute Policy - Urban Cart contests all INR disputes where POD is available

Please note that the customer's complaint was raised the day after delivery was confirmed by our logistics partner with a recipient signature. This pattern is consistent with a fraudulent chargeback rather than a genuine non-delivery.

We respectfully request the immediate reversal of chargeback ${disputeId} and reinstatement of the settled funds.

Sincerely,
Urban Cart Dispute Resolution Team
disputes@urbancart.in`,
      attachments: [
        "Shopify_Order_ORD-4521.pdf",
        "Shiprocket_Tracking_SHP789012.pdf",
        "POD_SHP789012_Signed.pdf",
        "Tax_Invoice_INV-4521.pdf",
        "Support_Transcript_TKT-98234.pdf",
        "Merchant_Dispute_Policy_UrbanCart.pdf"
      ]
    };
  }
  if (scenarioType === "vernacular_evidence_contest") {
    return {
      summary: "Medium-confidence contest: WhatsApp OCR confirms delivery acknowledgement in Hindi. Missing formal invoice - approval required.",
      response: `Dear Nodal Officer,

We are writing to contest the chargeback claim ${disputeId} for transaction pay_def456 amounting to ${amountStr}.

Our evidence demonstrates that the order was delivered and the customer explicitly acknowledged receipt via WhatsApp on 25th March 2026. The following evidence is enclosed:

1. Shopify Order Confirmation - Order ORD-7832 (Customer: Meenakshi Iyer)
2. Delhivery Logistics Tracking - AWB SHP345678, status: Delivered on 24th March 2026
3. Proof of Delivery - Signed by M. Iyer
4. WhatsApp Communication Screenshot (OCR Extracted) - Customer message: "haan, order mil gaya. bahut sundar saree hai!" Translation: "Yes, the order arrived. Very beautiful saree!" - Sent on 25th March 2026 at 16:00 IST
5. House of Sarees Dispute Policy - Contest with delivery proof and customer acknowledgement

The customer's own WhatsApp message, dated one day after delivery and extracted via certified OCR with 94% confidence, directly contradicts the INR claim.

Note: Formal tax invoice could not be retrieved from ERP at time of this filing. Physical invoice available on request.

We respectfully request reversal of chargeback ${disputeId}.

Sincerely,
House of Sarees Dispute Resolution Team`,
      attachments: [
        "Shopify_Order_ORD-7832.pdf",
        "Delhivery_Tracking_SHP345678.pdf",
        "POD_SHP345678_Signed.pdf",
        "WhatsApp_Screenshot_OCR_TKT78901.pdf",
        "Merchant_Policy_HouseOfSarees.pdf"
      ]
    };
  }
  if (scenarioType === "rto_accept") {
    return {
      summary: "High-confidence accept: Logistics status is RTO (Return to Origin). Customer refused delivery. Merchant policy mandates acceptance.",
      response: `Dear Nodal Officer,

With reference to chargeback claim ${disputeId} for transaction pay_ghi789 amounting to ${amountStr}:

We have reviewed the logistics records for order ORD-2291 and confirm the following:

1. Shipment AWB DHL909876 was dispatched and attempted for delivery on 13th March 2026
2. The customer refused delivery at the door on 13th March 2026
3. DHL initiated Return to Origin (RTO) on 14th March 2026
4. The item is currently in transit back to the merchant's warehouse

Given that delivery was attempted and refused by the customer, and our logistics partner DHL has confirmed RTO status, we acknowledge that the customer did not receive the item.

In accordance with our dispute policy (accept all confirmed RTO cases and initiate refund per 7-day SLA), we accept this chargeback.

Please proceed with refund processing for ${amountStr}.

Sincerely,
Gadget Lane Dispute Resolution Team`,
      attachments: [
        "Shopify_Order_ORD-2291.pdf",
        "DHL_Tracking_DHL909876_RTO.pdf",
        "Tax_Invoice_INV-2291.pdf",
        "Merchant_Policy_GadgetLane.pdf"
      ]
    };
  }
  return {
    summary: "Low-confidence escalation: Insufficient evidence. Order unfulfilled, no AWB, no tracking, no POD. Manual review required.",
    response: `Dear Dispute Review Team,

This case requires manual escalation for human review.

Chargeback claim ${disputeId} for transaction pay_jkl012 (${amountStr}) cannot be auto-resolved due to insufficient evidence:

Issues identified:
- Order ORD-8801 shows as UNFULFILLED in Shopify - no AWB assigned
- No logistics tracking data available
- No Proof of Delivery
- No formal tax invoice found
- No customer support interaction on record
- No merchant dispute policy configured

Evidence completeness score: 2/8 (25%)

Recommended action: Human review to determine whether this is a fulfillment failure or a merchant-side data discrepancy before making a contest/accept decision.

Please escalate to Senior Dispute Analyst.

- DDE Automated Triage System`,
    attachments: [
      "Shopify_Order_ORD-8801_Partial.pdf",
      "Razorpay_Payment_pay_jkl012.pdf"
    ]
  };
}

// agent/run.ts
function parseStep3(row) {
  return {
    ...row,
    input_json: typeof row.input_json === "string" ? JSON.parse(row.input_json) : row.input_json,
    output_json: typeof row.output_json === "string" ? JSON.parse(row.output_json) : row.output_json
  };
}
function getStepsForScenario(caseId, scenarioType) {
  switch (scenarioType) {
    case "slam_dunk_contest":
      return getSlamDunkSteps(caseId);
    case "vernacular_evidence_contest":
      return getVernacularSteps(caseId);
    case "rto_accept":
      return getRtoSteps(caseId);
    case "weak_evidence_escalate":
      return getWeakEvidenceSteps(caseId);
    default:
      return getSlamDunkSteps(caseId);
  }
}
function getEvidenceForScenario(caseId, scenarioType) {
  switch (scenarioType) {
    case "slam_dunk_contest":
      return getSlamDunkEvidence(caseId);
    case "vernacular_evidence_contest":
      return getVernacularEvidence(caseId);
    case "rto_accept":
      return getRtoEvidence(caseId);
    case "weak_evidence_escalate":
      return getWeakEvidence(caseId);
    default:
      return getSlamDunkEvidence(caseId);
  }
}
function getScoreForScenario(scenarioType) {
  switch (scenarioType) {
    case "slam_dunk_contest":
      return 1;
    case "vernacular_evidence_contest":
      return 0.875;
    case "rto_accept":
      return 0.5;
    case "weak_evidence_escalate":
      return 0.25;
    default:
      return 0.5;
  }
}
var runAgent2 = api3(
  { expose: true, method: "POST", path: "/agent/run" },
  async ({ case_id, scenario_type }) => {
    const runId = crypto.randomUUID();
    await db_default.exec`
      INSERT INTO agent_runs (id, case_id, status, step_count)
      VALUES (${runId}, ${case_id}, 'running', 0)
    `;
    await endpoints_exports3.update({ id: case_id, status: "Hunting Evidence" });
    await endpoints_exports2.log({
      case_id,
      actor_type: "agent",
      actor_name: "DDE Agent",
      action_type: "agent_run_started",
      details_json: { run_id: runId, scenario_type }
    });
    const stepDefs = getStepsForScenario(case_id, scenario_type);
    const insertedSteps = [];
    for (let i = 0; i < stepDefs.length; i++) {
      const step = stepDefs[i];
      const stepId = crypto.randomUUID();
      const inputJson = JSON.stringify(step.input_json);
      const outputJson = JSON.stringify(step.output_json);
      const row = await db_default.queryRow`
        INSERT INTO agent_trace_steps (
          id, agent_run_id, case_id, step_number, action_type,
          tool_name, input_json, output_json, observation_text, status
        ) VALUES (
          ${stepId}, ${runId}, ${case_id}, ${i + 1}, ${step.action_type},
          ${step.tool_name ?? null}, ${inputJson}::jsonb, ${outputJson}::jsonb,
          ${step.observation_text}, ${step.status}
        ) RETURNING *
      `;
      if (row)
        insertedSteps.push(parseStep3(row));
    }
    const evidenceItems = getEvidenceForScenario(case_id, scenario_type);
    for (const item of evidenceItems) {
      const evidenceId = crypto.randomUUID();
      const rawJson = JSON.stringify(item.raw_content_json);
      await db_default.exec`
        INSERT INTO evidence_items (
          id, case_id, evidence_type, source_name, title,
          summary_text, raw_content_json, preview_text, file_url,
          status, confidence
        ) VALUES (
          ${evidenceId}, ${item.case_id}, ${item.evidence_type}, ${item.source_name}, ${item.title},
          ${item.summary_text}, ${rawJson}::jsonb, ${item.preview_text}, ${item.file_url ?? null},
          ${item.status}, ${item.confidence}
        )
      `;
    }
    const score = getScoreForScenario(scenario_type);
    const caseData = await db_default.queryRow`
      SELECT reason_code, network FROM cases WHERE id = ${case_id}
    `;
    const logisticsStatus = scenario_type === "rto_accept" ? "RTO" : "Delivered";
    const podPresent = scenario_type === "slam_dunk_contest" || scenario_type === "vernacular_evidence_contest";
    const invoicePresent = scenario_type !== "weak_evidence_escalate" && scenario_type !== "vernacular_evidence_contest";
    const missingItems = [];
    if (scenario_type === "vernacular_evidence_contest")
      missingItems.push("invoice");
    if (scenario_type === "rto_accept")
      missingItems.push("proof_of_delivery", "customer_communication");
    if (scenario_type === "weak_evidence_escalate")
      missingItems.push("awb_tracking", "logistics_status", "proof_of_delivery", "invoice", "customer_communication", "merchant_policy");
    const policyResult = await endpoints_exports5.evaluate({
      case_id,
      reason_code: caseData?.reason_code ?? null,
      scenario_type,
      logistics_status: logisticsStatus,
      pod_present: podPresent,
      invoice_present: invoicePresent,
      customer_communication_state: scenario_type === "weak_evidence_escalate" ? "none" : "found",
      evidence_completeness_score: score,
      missing_evidence_types: missingItems,
      network: caseData?.network ?? null
    });
    await endpoints_exports3.update({
      id: case_id,
      status: "Ready for Review",
      recommendation: policyResult.recommended_action,
      confidence_band: policyResult.confidence_band,
      evidence_completeness_score: score,
      approval_state: policyResult.approval_required ? "Pending" : "Not Needed"
    });
    const caseRow = await db_default.queryRow`
      SELECT merchant_name, amount, currency, dispute_id FROM cases WHERE id = ${case_id}
    `;
    if (caseRow) {
      const draftContent = getDraftText(scenario_type, caseRow.dispute_id, caseRow);
      const draftId = crypto.randomUUID();
      const attachJson = JSON.stringify(draftContent.attachments);
      await db_default.exec`
        INSERT INTO drafts (id, case_id, version, summary_text, response_text, attachments_json)
        VALUES (${draftId}, ${case_id}, 1, ${draftContent.summary}, ${draftContent.response}, ${attachJson}::jsonb)
      `;
    }
    const finalSummary = `Agent completed. Scenario: ${scenario_type}. Evidence score: ${Math.round(score * 100)}%. Recommendation: ${policyResult.recommended_action} (${policyResult.confidence_band} confidence). ${missingItems.length} missing items.`;
    await db_default.exec`
      UPDATE agent_runs
      SET status = 'completed', step_count = ${stepDefs.length}, ended_at = NOW(), final_summary = ${finalSummary}
      WHERE id = ${runId}
    `;
    await endpoints_exports2.log({
      case_id,
      actor_type: "agent",
      actor_name: "DDE Agent",
      action_type: "agent_run_completed",
      details_json: { run_id: runId, recommendation: policyResult.recommended_action, score }
    });
    const run2 = await db_default.queryRow`SELECT * FROM agent_runs WHERE id = ${runId}`;
    return { run: run2, steps: insertedSteps };
  }
);

// approvals/create.ts
import { api as api4, APIError as APIError2 } from "encore.dev/api";
var createApproval = api4(
  { expose: true, method: "POST", path: "/approvals" },
  async (params) => {
    if (params.actor_role !== "Approver" && params.actor_role !== "Admin") {
      throw APIError2.invalidArgument("only Approver or Admin can record approval decisions");
    }
    const caseRow = await db_default.queryRow`
      SELECT status, approval_state FROM cases WHERE id = ${params.case_id}
    `;
    if (!caseRow)
      throw APIError2.notFound("case not found");
    if (caseRow.status !== "Approval Pending" || caseRow.approval_state !== "Pending") {
      throw APIError2.invalidArgument("case is not currently awaiting approval");
    }
    const id = crypto.randomUUID();
    const row = await db_default.queryRow`
      INSERT INTO approvals (id, case_id, draft_id, actor_role, actor_name, decision, notes)
      VALUES (
        ${id}, ${params.case_id}, ${params.draft_id ?? null},
        ${params.actor_role}, ${params.actor_name}, ${params.decision}, ${params.notes ?? null}
      ) RETURNING *
    `;
    let newStatus = "Approval Pending";
    let newApprovalState = params.decision;
    if (params.decision === "Approved") {
      newStatus = "Ready to Submit";
      newApprovalState = "Approved";
    } else if (params.decision === "Rejected") {
      newStatus = "Ready for Review";
      newApprovalState = "Rejected";
    } else if (params.decision === "Sent Back") {
      newStatus = "Ready for Review";
      newApprovalState = "Sent Back";
    }
    await endpoints_exports3.update({
      id: params.case_id,
      status: newStatus,
      approval_state: newApprovalState
    });
    await endpoints_exports2.log({
      case_id: params.case_id,
      actor_type: "approver",
      actor_name: params.actor_name,
      action_type: "approval_decision",
      details_json: {
        decision: params.decision,
        actor_role: params.actor_role,
        notes: params.notes ?? null,
        new_status: newStatus
      }
    });
    return row;
  }
);

// approvals/list.ts
import { api as api5 } from "encore.dev/api";
var listApprovals = api5(
  { expose: true, method: "GET", path: "/approvals" },
  async ({ case_id }) => {
    const approvalList = await db_default.queryAll`
      SELECT * FROM approvals WHERE case_id = ${case_id} ORDER BY created_at DESC
    `;
    return { approvals: approvalList };
  }
);

// audit/list.ts
import { api as api6 } from "encore.dev/api";
function parseRow(row) {
  return {
    ...row,
    details_json: typeof row.details_json === "string" ? JSON.parse(row.details_json) : row.details_json
  };
}
var listAudit2 = api6(
  { expose: true, method: "GET", path: "/audit" },
  async ({ case_id }) => {
    const rows = await db_default.queryAll`
      SELECT * FROM audit_logs WHERE case_id = ${case_id} ORDER BY created_at ASC
    `;
    return { logs: rows.map(parseRow) };
  }
);

// audit/log.ts
import { api as api7 } from "encore.dev/api";
function parseRow2(row) {
  return {
    ...row,
    details_json: typeof row.details_json === "string" ? JSON.parse(row.details_json) : row.details_json
  };
}
var log2 = api7(
  { expose: true, method: "POST", path: "/audit" },
  async (params) => {
    const id = crypto.randomUUID();
    const detailsJson = JSON.stringify(params.details_json);
    const row = await db_default.queryRow`
      INSERT INTO audit_logs (id, case_id, actor_type, actor_name, action_type, details_json)
      VALUES (${id}, ${params.case_id}, ${params.actor_type}, ${params.actor_name}, ${params.action_type}, ${detailsJson}::jsonb)
      RETURNING *
    `;
    return parseRow2(row);
  }
);

// cases/get.ts
import { api as api8, APIError as APIError3 } from "encore.dev/api";
var get2 = api8(
  { expose: true, method: "GET", path: "/cases/:id" },
  async ({ id }) => {
    const row = await db_default.queryRow`SELECT * FROM cases WHERE id = ${id}`;
    if (!row)
      throw APIError3.notFound("case not found");
    return row;
  }
);

// cases/list.ts
import { api as api9 } from "encore.dev/api";
var list3 = api9(
  { expose: true, method: "GET", path: "/cases" },
  async (params) => {
    const conditions = [];
    const values = [];
    let idx = 1;
    if (params.status) {
      conditions.push(`status = $${idx++}`);
      values.push(params.status);
    }
    if (params.recommendation) {
      conditions.push(`recommendation = $${idx++}`);
      values.push(params.recommendation);
    }
    if (params.scenario_type) {
      conditions.push(`scenario_type = $${idx++}`);
      values.push(params.scenario_type);
    }
    if (params.reason_code) {
      conditions.push(`reason_code = $${idx++}`);
      values.push(params.reason_code);
    }
    if (params.phase) {
      conditions.push(`phase = $${idx++}`);
      values.push(params.phase);
    }
    if (params.sla_bucket === "overdue") {
      conditions.push("respond_by < NOW()");
    }
    if (params.sla_bucket === "due_24h") {
      conditions.push("respond_by >= NOW() AND respond_by < NOW() + INTERVAL '24 hours'");
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT * FROM cases ${where} ORDER BY respond_by ASC NULLS LAST, created_at DESC`;
    const rows = await db_default.rawQueryAll(query, ...values);
    return { cases: rows };
  }
);

// cases/stats.ts
import { api as api10 } from "encore.dev/api";
var stats2 = api10(
  { expose: true, method: "GET", path: "/cases/stats" },
  async () => {
    const row = await db_default.queryRow`
      SELECT
        COUNT(*)::int AS total_cases,
        COALESCE(SUM(amount), 0)::double precision AS total_disputed_amount,
        COALESCE(SUM(amount) FILTER (WHERE recommendation = 'Contest'), 0)::double precision AS contestable_amount,
        COALESCE(SUM(amount) FILTER (WHERE recommendation = 'Accept'), 0)::double precision AS acceptance_amount,
        COALESCE(SUM(amount) FILTER (WHERE recommendation = 'Escalate'), 0)::double precision AS escalated_amount,
        COUNT(*) FILTER (WHERE respond_by IS NOT NULL AND respond_by < NOW())::int AS overdue_count,
        COUNT(*) FILTER (
          WHERE respond_by IS NOT NULL
            AND respond_by >= NOW()
            AND respond_by < NOW() + INTERVAL '24 hours'
        )::int AS due_in_24h_count
      FROM cases
    `;
    return row ?? {
      total_cases: 0,
      total_disputed_amount: 0,
      contestable_amount: 0,
      acceptance_amount: 0,
      escalated_amount: 0,
      overdue_count: 0,
      due_in_24h_count: 0
    };
  }
);

// cases/update.ts
import { api as api11, APIError as APIError4 } from "encore.dev/api";
var VALID_STATUS_TRANSITIONS = {
  "New": ["Hunting Evidence"],
  "Hunting Evidence": ["Ready for Review"],
  "Ready for Review": ["Approval Pending", "Ready to Submit", "Submitted"],
  "Approval Pending": ["Ready for Review", "Ready to Submit"],
  "Ready to Submit": ["Submitted", "Ready for Review"],
  "Submitted": ["Closed"],
  "Closed": []
};
var VALID_RECOMMENDATIONS = ["Contest", "Accept", "Escalate"];
var VALID_CONFIDENCE_BANDS = ["High", "Medium", "Low"];
var VALID_APPROVAL_STATES = ["Not Needed", "Pending", "Approved", "Rejected", "Sent Back"];
function canTransition(from, to) {
  return from === to || (VALID_STATUS_TRANSITIONS[from] ?? []).includes(to);
}
var update2 = api11(
  { expose: true, method: "PUT", path: "/cases/:id" },
  async ({ id, ...fields }) => {
    const existing = await db_default.queryRow`SELECT * FROM cases WHERE id = ${id}`;
    if (!existing)
      throw APIError4.notFound("case not found");
    if (fields.status !== void 0 && !canTransition(existing.status, fields.status)) {
      throw APIError4.invalidArgument(`invalid status transition: ${existing.status} -> ${fields.status}`);
    }
    if (fields.recommendation !== void 0 && !VALID_RECOMMENDATIONS.includes(fields.recommendation)) {
      throw APIError4.invalidArgument("invalid recommendation");
    }
    if (fields.confidence_band !== void 0 && !VALID_CONFIDENCE_BANDS.includes(fields.confidence_band)) {
      throw APIError4.invalidArgument("invalid confidence band");
    }
    if (fields.approval_state !== void 0 && !VALID_APPROVAL_STATES.includes(fields.approval_state)) {
      throw APIError4.invalidArgument("invalid approval state");
    }
    if (fields.evidence_completeness_score !== void 0) {
      const score = fields.evidence_completeness_score;
      if (score < 0 || score > 1) {
        throw APIError4.invalidArgument("evidence completeness score must be between 0 and 1");
      }
    }
    const updates = [];
    const values = [];
    let idx = 1;
    if (fields.status !== void 0) {
      updates.push(`status = $${idx++}`);
      values.push(fields.status);
    }
    if (fields.recommendation !== void 0) {
      updates.push(`recommendation = $${idx++}`);
      values.push(fields.recommendation);
    }
    if (fields.confidence_band !== void 0) {
      updates.push(`confidence_band = $${idx++}`);
      values.push(fields.confidence_band);
    }
    if (fields.evidence_completeness_score !== void 0) {
      updates.push(`evidence_completeness_score = $${idx++}`);
      values.push(fields.evidence_completeness_score);
    }
    if (fields.approval_state !== void 0) {
      updates.push(`approval_state = $${idx++}`);
      values.push(fields.approval_state);
    }
    if (updates.length === 0)
      return existing;
    updates.push(`updated_at = NOW()`);
    values.push(id);
    const query = `UPDATE cases SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`;
    const row = await db_default.rawQueryRow(query, ...values);
    if (!row)
      throw APIError4.internal("update failed");
    return row;
  }
);

// drafts/create.ts
import { api as api12 } from "encore.dev/api";
function parseRow3(row) {
  return {
    ...row,
    attachments_json: typeof row.attachments_json === "string" ? JSON.parse(row.attachments_json) : row.attachments_json
  };
}
var createDraft = api12(
  { expose: true, method: "POST", path: "/drafts" },
  async ({ case_id }) => {
    const caseRow = await db_default.queryRow`
      SELECT merchant_name, amount, currency, dispute_id, scenario_type FROM cases WHERE id = ${case_id}
    `;
    const latestVersion = await db_default.queryRow`
      SELECT MAX(version) AS max_version FROM drafts WHERE case_id = ${case_id}
    `;
    const version = (latestVersion?.max_version ?? 0) + 1;
    const scenario = caseRow?.scenario_type ?? "slam_dunk_contest";
    const content = getDraftText(scenario, caseRow?.dispute_id ?? "disp_unknown", caseRow ?? { merchant_name: "Merchant", amount: 0, currency: "INR" });
    const id = crypto.randomUUID();
    const attachJson = JSON.stringify(content.attachments);
    const row = await db_default.queryRow`
      INSERT INTO drafts (id, case_id, version, summary_text, response_text, attachments_json)
      VALUES (${id}, ${case_id}, ${version}, ${content.summary}, ${content.response}, ${attachJson}::jsonb)
      RETURNING *
    `;
    return parseRow3(row);
  }
);

// drafts/list.ts
import { api as api13 } from "encore.dev/api";
function parseRow4(row) {
  return {
    ...row,
    attachments_json: typeof row.attachments_json === "string" ? JSON.parse(row.attachments_json) : row.attachments_json
  };
}
var listDrafts = api13(
  { expose: true, method: "GET", path: "/drafts" },
  async ({ case_id }) => {
    const rows = await db_default.queryAll`
      SELECT * FROM drafts WHERE case_id = ${case_id} ORDER BY version DESC
    `;
    return { drafts: rows.map(parseRow4) };
  }
);

// drafts/update.ts
import { api as api14, APIError as APIError5 } from "encore.dev/api";
function parseRow5(row) {
  return {
    ...row,
    attachments_json: typeof row.attachments_json === "string" ? JSON.parse(row.attachments_json) : row.attachments_json
  };
}
var updateDraft = api14(
  { expose: true, method: "PUT", path: "/drafts/:id" },
  async ({ id, summary_text, response_text }) => {
    const existing = await db_default.queryRow`SELECT * FROM drafts WHERE id = ${id}`;
    if (!existing)
      throw APIError5.notFound("draft not found");
    const parsedExisting = parseRow5(existing);
    const newSummary = summary_text ?? parsedExisting.summary_text;
    const newResponse = response_text ?? parsedExisting.response_text;
    const row = await db_default.queryRow`
      UPDATE drafts SET summary_text = ${newSummary}, response_text = ${newResponse}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return parseRow5(row);
  }
);

// evidence/create.ts
import { api as api15 } from "encore.dev/api";
function parseRow6(row) {
  return {
    ...row,
    raw_content_json: typeof row.raw_content_json === "string" ? JSON.parse(row.raw_content_json) : row.raw_content_json
  };
}
var createEvidence = api15(
  { expose: true, method: "POST", path: "/evidence" },
  async (params) => {
    const id = crypto.randomUUID();
    const rawJson = JSON.stringify(params.raw_content_json);
    const row = await db_default.queryRow`
      INSERT INTO evidence_items (
        id, case_id, evidence_type, source_name, title,
        summary_text, raw_content_json, preview_text, file_url,
        status, confidence
      ) VALUES (
        ${id}, ${params.case_id}, ${params.evidence_type}, ${params.source_name}, ${params.title},
        ${params.summary_text}, ${rawJson}::jsonb, ${params.preview_text}, ${params.file_url ?? null},
        ${params.status}, ${params.confidence}
      ) RETURNING *
    `;
    return parseRow6(row);
  }
);

// evidence/list.ts
import { api as api16 } from "encore.dev/api";
function parseRow7(row) {
  return {
    ...row,
    raw_content_json: typeof row.raw_content_json === "string" ? JSON.parse(row.raw_content_json) : row.raw_content_json
  };
}
var listEvidence = api16(
  { expose: true, method: "GET", path: "/evidence" },
  async ({ case_id }) => {
    const rows = await db_default.queryAll`
      SELECT * FROM evidence_items WHERE case_id = ${case_id} ORDER BY collected_at ASC
    `;
    return { items: rows.map(parseRow7) };
  }
);

// ingest/ingest.ts
import { api as api17 } from "encore.dev/api";
var ingestEvent2 = api17(
  { expose: true, method: "POST", path: "/ingest/event" },
  async (params) => {
    const existingEvent = await db_default.queryRow`
      SELECT id FROM events WHERE dedupe_key = ${params.external_event_id}
    `;
    if (existingEvent) {
      const existingCase = await db_default.queryRow`
        SELECT id FROM cases WHERE dispute_id = ${params.payload.dispute.id}
      `;
      return { case_id: existingCase?.id ?? "unknown", is_duplicate_event: true };
    }
    const { dispute } = params.payload;
    const respondByDate = typeof dispute.respond_by === "number" ? new Date(dispute.respond_by * 1e3).toISOString() : new Date(dispute.respond_by).toISOString();
    const caseRow = await db_default.queryRow`
      INSERT INTO cases (
        id, dispute_id, payment_id, merchant_name, amount, currency,
        reason_code, respond_by, status, external_status, phase, network, amount_deducted,
        updated_at
      ) VALUES (
        ${crypto.randomUUID()}, ${dispute.id}, ${dispute.payment_id}, ${dispute.merchant_name ?? "Demo Merchant"},
        ${dispute.amount / 100}, ${dispute.currency},
        ${dispute.reason_code}, ${respondByDate}, 'New', ${dispute.status}, ${dispute.phase}, ${dispute.network ?? null},
        ${dispute.amount_deducted / 100},
        NOW()
      )
      ON CONFLICT (dispute_id) DO UPDATE SET
        payment_id = EXCLUDED.payment_id,
        external_status = EXCLUDED.external_status,
        phase = EXCLUDED.phase,
        network = EXCLUDED.network,
        respond_by = EXCLUDED.respond_by,
        amount_deducted = EXCLUDED.amount_deducted,
        updated_at = NOW()
      RETURNING id
    `;
    const caseId = caseRow.id;
    await db_default.exec`
      INSERT INTO events (id, external_event_id, case_id, event_type, payload_json, dedupe_key, processed_at)
      VALUES (${crypto.randomUUID()}, ${params.external_event_id}, ${caseId}, ${params.event_type}, ${JSON.stringify(params.payload)}::jsonb, ${params.external_event_id}, NOW())
    `;
    return { case_id: caseId, is_duplicate_event: false };
  }
);

// ingest/list.ts
import { api as api18 } from "encore.dev/api";
var list4 = api18(
  { expose: true, method: "GET", path: "/ingest/events" },
  async (params) => {
    const values = [];
    let query = `
      SELECT id, external_event_id, case_id, event_type, processed_at, payload_json
      FROM events
    `;
    if (params.case_id) {
      query += ` WHERE case_id = $1`;
      values.push(params.case_id);
    }
    query += ` ORDER BY processed_at DESC NULLS LAST LIMIT 50`;
    const rows = await db_default.rawQueryAll(query, ...values);
    return { events: rows };
  }
);

// policy/evaluate.ts
import { api as api19 } from "encore.dev/api";
function parseRow8(row) {
  return {
    ...row,
    rationale_json: typeof row.rationale_json === "string" ? JSON.parse(row.rationale_json) : row.rationale_json,
    missing_items_json: typeof row.missing_items_json === "string" ? JSON.parse(row.missing_items_json) : row.missing_items_json
  };
}
var evaluate2 = api19(
  { expose: true, method: "POST", path: "/policy/evaluate" },
  async (input) => {
    let recommended_action;
    let confidence_band;
    let playbook_name;
    const rationale = [];
    let approval_required = false;
    if (input.reason_code === "products_not_received" || input.reason_code === "goods_not_received") {
      playbook_name = "FULFILLMENT_INTEGRITY_v1.2";
      if (input.logistics_status === "Delivered" && input.pod_present) {
        recommended_action = "Contest";
        confidence_band = "High";
        rationale.push("SIGNAL: Logistics status 'Delivered' verified via carrier adapter.");
        rationale.push("EVIDENCE: Physical POD signature matches merchant metadata.");
        rationale.push("STRATEGY: Execute Contradictory Delivery Defense. Probability of recovery > 85%.");
        approval_required = false;
      } else if (input.logistics_status === "RTO") {
        recommended_action = "Accept";
        confidence_band = "High";
        rationale.push("SIGNAL: RTO (Return to Origin) sequence detected in logistics stream.");
        rationale.push("STRATEGY: Automated Recovery Compliance. No contest warranted.");
        approval_required = false;
      } else {
        recommended_action = "Escalate";
        confidence_band = "Low";
        rationale.push("SIGNAL: Mismatch between 'unfulfilled' status and customer claim.");
        rationale.push("STRATEGY: Ambiguous Fulfillment Chain. Escalating for subterra-investigation.");
        approval_required = true;
      }
    } else if (input.reason_code === "subscription_cancelled" || input.reason_code === "service_not_rendered") {
      playbook_name = "SERVICE_ACCESS_AUDIT_v0.9";
      recommended_action = "Contest";
      confidence_band = "Medium";
      rationale.push("SIGNAL: Network Auth Signal verified post-cancellation attempt.");
      rationale.push("STRATEGY: Usage-Based Access Defense. Cross-referencing logs.");
      approval_required = true;
    } else if (input.scenario_type === "vernacular_evidence_contest") {
      playbook_name = "VERNACULAR_RECOGNITION_v2.1";
      recommended_action = "Contest";
      confidence_band = "Medium";
      rationale.push("SIGNAL: Multi-modal OCR trigger on vernacular WhatsApp buffer.");
      rationale.push("EVIDENCE: Customer acknowledged 'order mil gaya' (translation: order received).");
      rationale.push("STRATEGY: Direct Acknowledgement Defense.");
      approval_required = true;
    } else {
      playbook_name = "GENERIC_TRIAGE_v0.1";
      recommended_action = "Escalate";
      confidence_band = "Low";
      rationale.push("SIGNAL: Unknown Reason Code or Pattern. Defaulting to defensive escalation.");
      approval_required = true;
    }
    const id = crypto.randomUUID();
    const rationaleJson = JSON.stringify(rationale);
    const missingJson = JSON.stringify(input.missing_evidence_types);
    const row = await db_default.queryRow`
      INSERT INTO policy_decisions (
        id, case_id, playbook_name, recommended_action, confidence_band,
        rationale_json, missing_items_json, approval_required, created_at
      ) VALUES (
        ${id}, ${input.case_id}, ${playbook_name}, ${recommended_action}, ${confidence_band},
        ${rationaleJson}::jsonb, ${missingJson}::jsonb, ${approval_required}, NOW()
      ) RETURNING *
    `;
    return parseRow8(row);
  }
);

// policy/get.ts
import { api as api20 } from "encore.dev/api";
function parseRow9(row) {
  return {
    ...row,
    rationale_json: typeof row.rationale_json === "string" ? JSON.parse(row.rationale_json) : row.rationale_json,
    missing_items_json: typeof row.missing_items_json === "string" ? JSON.parse(row.missing_items_json) : row.missing_items_json
  };
}
var getDecisions2 = api20(
  { expose: true, method: "GET", path: "/policy/decisions" },
  async ({ case_id }) => {
    const rows = await db_default.queryAll`
      SELECT * FROM policy_decisions WHERE case_id = ${case_id} ORDER BY created_at DESC
    `;
    return { decisions: rows.map(parseRow9) };
  }
);

// simulation/api.ts
import { api as api22 } from "encore.dev/api";

// simulation/simulate.ts
import { api as api21 } from "encore.dev/api";

// simulation/scenarios.ts
var SCENARIOS = [
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
    evidence_score: 1,
    highlights: [
      "Payment captured (Razorpay)",
      "Order shipped (Shopify ORD-4521)",
      "AWB SHP789012 - Delivered",
      "POD signed by P. Sharma",
      "Invoice INV-4521 (Rs 2,499)",
      "Hindi complaint translated",
      "Merchant policy: Contest"
    ]
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
      "Approval required"
    ]
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
      "Policy: Accept RTO immediately"
    ]
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
      "No support record"
    ]
  }
];

// simulation/simulate.ts
function isoFromOffset(hoursFromNow) {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1e3).toISOString();
}
async function runScenario(scenario_type) {
  const scenario = SCENARIOS.find((item) => item.type === scenario_type);
  if (!scenario)
    throw new Error(`Unknown scenario: ${scenario_type}`);
  const disputeId = `DISP-${Date.now()}-${Math.floor(Math.random() * 9e3 + 1e3)}`;
  const respondBy = isoFromOffset(scenario.respond_by_offset_hours);
  const payload = {
    dispute: {
      id: disputeId,
      payment_id: scenario.payment_id,
      amount: Math.round(scenario.amount * 100),
      amount_deducted: Math.round(scenario.amount_deducted * 100),
      currency: "INR",
      reason_code: scenario.reason_code,
      respond_by: respondBy,
      status: scenario.external_status,
      phase: scenario.phase,
      network: scenario.network,
      merchant_name: scenario.merchant_name,
      merchant_reference: scenario.merchant_reference,
      created_at: Math.floor(Date.now() / 1e3)
    }
  };
  const ingestResult = await endpoints_exports4.ingestEvent({
    external_event_id: disputeId,
    event_type: "dispute.created",
    payload
  });
  const caseId = ingestResult.case_id;
  await db_default.exec`
    UPDATE cases
    SET scenario_type = ${scenario_type}
    WHERE id = ${caseId}
  `;
  await endpoints_exports2.log({
    case_id: caseId,
    actor_type: "system",
    actor_name: "DDE System",
    action_type: "case_normalized",
    details_json: {
      dispute_id: disputeId,
      payment_id: scenario.payment_id,
      scenario_type,
      merchant_name: scenario.merchant_name,
      amount: scenario.amount,
      phase: scenario.phase,
      respond_by: respondBy
    }
  });
  await endpoints_exports.runAgent({ case_id: caseId, scenario_type });
  const caseRow = await db_default.queryRow`SELECT * FROM cases WHERE id = ${caseId}`;
  return { case_id: caseId, case: caseRow };
}
var simulate = api21(
  { expose: true, method: "POST", path: "/simulation/simulate" },
  async ({ scenario_type }) => runScenario(scenario_type)
);

// simulation/factory.ts
async function seedScenario(index) {
  const scenario = SCENARIOS[index % SCENARIOS.length];
  return await runScenario(scenario.type);
}

// simulation/api.ts
var runSim = api22(
  { expose: true, method: "POST", path: "/simulation/run" },
  async ({ scenario_index }) => {
    const res = await seedScenario(scenario_index);
    return { case_id: res.case_id };
  }
);

// simulation/reset.ts
import { api as api23 } from "encore.dev/api";
var reset = api23(
  { expose: true, method: "POST", path: "/simulation/reset" },
  async () => {
    await db_default.exec`DELETE FROM events`;
    await db_default.exec`DELETE FROM cases`;
    return { success: true };
  }
);

// simulation/seed.ts
import { api as api24 } from "encore.dev/api";
var seed = api24(
  { expose: true, method: "POST", path: "/simulation/seed" },
  async () => {
    let count = 0;
    for (const scenario of SCENARIOS) {
      await runScenario(scenario.type);
      count++;
    }
    return { cases_created: count };
  }
);

// evidence/encore.service.ts
import { Service } from "encore.dev/service";
var encore_service_default = new Service("evidence");

// drafts/encore.service.ts
import { Service as Service2 } from "encore.dev/service";
var encore_service_default2 = new Service2("drafts");

// simulation/encore.service.ts
import { Service as Service3 } from "encore.dev/service";
var encore_service_default3 = new Service3("simulation");

// audit/encore.service.ts
import { Service as Service4 } from "encore.dev/service";
var encore_service_default4 = new Service4("audit");

// cases/encore.service.ts
import { Service as Service5 } from "encore.dev/service";
var encore_service_default5 = new Service5("cases");

// approvals/encore.service.ts
import { Service as Service6 } from "encore.dev/service";
var encore_service_default6 = new Service6("approvals");

// ingest/encore.service.ts
import { Service as Service7 } from "encore.dev/service";
var encore_service_default7 = new Service7("ingest");

// agent/encore.service.ts
import { Service as Service8 } from "encore.dev/service";
var encore_service_default8 = new Service8("agent");

// policy/encore.service.ts
import { Service as Service9 } from "encore.dev/service";
var encore_service_default9 = new Service9("policy");

// encore.gen/internal/entrypoints/combined/main.ts
var gateways = [];
var handlers = [
  {
    apiRoute: {
      service: "agent",
      name: "getAgentRun",
      handler: getAgentRun,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default8.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "agent",
      name: "listAgentSteps",
      handler: listAgentSteps,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default8.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "agent",
      name: "runAgent",
      handler: runAgent2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default8.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "approvals",
      name: "createApproval",
      handler: createApproval,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default6.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "approvals",
      name: "listApprovals",
      handler: listApprovals,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default6.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "audit",
      name: "listAudit",
      handler: listAudit2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default4.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "audit",
      name: "log",
      handler: log2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default4.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "cases",
      name: "get",
      handler: get2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default5.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "cases",
      name: "list",
      handler: list3,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default5.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "cases",
      name: "stats",
      handler: stats2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default5.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "cases",
      name: "update",
      handler: update2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default5.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "drafts",
      name: "createDraft",
      handler: createDraft,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "drafts",
      name: "listDrafts",
      handler: listDrafts,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "drafts",
      name: "updateDraft",
      handler: updateDraft,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "evidence",
      name: "createEvidence",
      handler: createEvidence,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "evidence",
      name: "listEvidence",
      handler: listEvidence,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "ingest",
      name: "ingestEvent",
      handler: ingestEvent2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default7.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "ingest",
      name: "list",
      handler: list4,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default7.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "policy",
      name: "evaluate",
      handler: evaluate2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default9.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "policy",
      name: "getDecisions",
      handler: getDecisions2,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default9.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "simulation",
      name: "runSim",
      handler: runSim,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "simulation",
      name: "reset",
      handler: reset,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "simulation",
      name: "seed",
      handler: seed,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "simulation",
      name: "simulate",
      handler: simulate,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  }
];
registerGateways(gateways);
registerHandlers(handlers);
await run(import.meta.url);
//# sourceMappingURL=main.mjs.map
