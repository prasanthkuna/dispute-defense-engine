export interface StepDef {
  action_type: string;
  tool_name: string | null;
  input_json: Record<string, unknown>;
  output_json: Record<string, unknown>;
  observation_text: string;
  status: "success" | "warning" | "error" | "pending";
}

export function getSlamDunkSteps(caseId: string): StepDef[] {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute. Starting evidence collection for Item Not Received claim. Initialising tool-use chain.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_slam001", payment_id: "pay_abc123" },
      output_json: { payment_id: "pay_abc123", amount: 249900, currency: "INR", status: "captured", captured_at: "2026-03-25T10:15:00Z", method: "upi", vpa: "priya.sharma@okicici" },
      observation_text: "Payment pay_abc123 found. Status: captured. Amount: ₹2,499. Method: UPI. Evidence recorded.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-4521", merchant: "urbancart" },
      output_json: { order_id: "ORD-4521", customer_name: "Priya Sharma", customer_email: "priya.sharma@gmail.com", shipping_address: "42, Sector 14, Gurugram, Haryana 122001", fulfillment_status: "shipped", awb: "SHP789012", carrier: "Shiprocket", line_items: [{ sku: "UC-TSHIRT-L-BLK", name: "Urban Cart Premium T-Shirt (L, Black)", qty: 1, price: 2499 }] },
      observation_text: "Order ORD-4521 retrieved. Fulfillment status: Shipped. AWB: SHP789012 via Shiprocket. Customer: Priya Sharma, Gurugram.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: "SHP789012", carrier: "Shiprocket" },
      output_json: { awb: "SHP789012", status: "Delivered", delivered_at: "2026-03-28T14:30:00Z", pod_available: true, pod_signature: "P. Sharma", delivery_location: "42, Sector 14, Gurugram", tracking_history: [{ ts: "2026-03-26T08:00:00Z", event: "Picked Up" }, { ts: "2026-03-27T11:30:00Z", event: "In Transit - Delhi Hub" }, { ts: "2026-03-28T14:30:00Z", event: "Delivered" }] },
      observation_text: "Shiprocket AWB SHP789012: Status DELIVERED on 2026-03-28T14:30Z. POD available with signature. Tracking history: 3 events.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_invoice_record",
      input_json: { order_id: "ORD-4521", merchant: "urbancart" },
      output_json: { invoice_id: "INV-4521", order_id: "ORD-4521", issued_at: "2026-03-25T10:16:00Z", amount: 2499, gst_number: "06AABCU9603R1ZP", hsn_code: "61091000", line_items: [{ description: "Urban Cart Premium T-Shirt (L, Black)", qty: 1, rate: 2118.64, gst_18_pct: 380.36, total: 2499 }] },
      observation_text: "Tax invoice INV-4521 found. Amount ₹2,499, GST compliant. HSN 61091000. Issued 2026-03-25.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_support_transcript",
      input_json: { customer_email: "priya.sharma@gmail.com", order_id: "ORD-4521" },
      output_json: { ticket_id: "TKT-98234", channel: "email", created_at: "2026-03-29T09:00:00Z", messages: [{ role: "customer", ts: "2026-03-29T09:00:00Z", text: "mujhe order nahi mila. maine payment kar diya tha." }, { role: "agent", ts: "2026-03-29T09:15:00Z", text: "We are checking your order status." }], language_detected: "hi" },
      observation_text: "Support ticket TKT-98234 found. Customer complaint in Hindi: 'mujhe order nahi mila'. Language: hi. Requires translation.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "translate_text",
      input_json: { text: "mujhe order nahi mila. maine payment kar diya tha.", source_lang: "hi", target_lang: "en" },
      output_json: { translated: "I did not receive my order. I had already made the payment.", confidence: 0.98, engine: "indicTrans2" },
      observation_text: "Translation complete: 'I did not receive my order. I had already made the payment.' — Customer claim contradicted by Shiprocket POD.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_merchant_policy",
      input_json: { merchant: "urbancart", policy_type: "dispute" },
      output_json: { return_window_days: 7, dispute_policy: "Contest all INR disputes with POD", pod_requirement: "mandatory", refund_eligibility: "Only if non-delivery confirmed by carrier", contact_email: "disputes@urbancart.in" },
      observation_text: "Merchant policy retrieved. Urban Cart policy: contest all INR disputes with POD. 7-day return window. POD mandatory.",
      status: "success",
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { evidence_count: 8, found: 8, missing: 0, score: 1.0 },
      observation_text: "Evidence collection complete. Score: 8/8 (100%). All critical evidence found. POD signature confirmed. Handing off to deterministic policy engine.",
      status: "success",
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { recommended_action: "Contest", confidence_band: "High", approval_required: false },
      observation_text: "Policy engine returned: CONTEST (High confidence). All 8 evidence types collected. POD available. Generating bank-facing draft response.",
      status: "success",
    },
  ];
}

export function getVernacularSteps(caseId: string): StepDef[] {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute for House of Sarees. Starting evidence collection. Customer communication in vernacular — activating OCR + translation tools.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_vern002", payment_id: "pay_def456" },
      output_json: { payment_id: "pay_def456", amount: 589900, currency: "INR", status: "captured", captured_at: "2026-03-20T14:22:00Z", method: "netbanking", bank: "HDFC" },
      observation_text: "Payment pay_def456 found. Status: captured. Amount: ₹5,899. Method: NetBanking (HDFC).",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-7832", merchant: "houseofsarees" },
      output_json: { order_id: "ORD-7832", customer_name: "Meenakshi Iyer", fulfillment_status: "shipped", awb: "SHP345678", carrier: "Delhivery", line_items: [{ sku: "HOS-SILK-001", name: "Kanjivaram Silk Saree - Maroon Gold Border", qty: 1, price: 5899 }] },
      observation_text: "Order ORD-7832 found. AWB: SHP345678 via Delhivery. Customer: Meenakshi Iyer.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: "SHP345678", carrier: "Delhivery" },
      output_json: { awb: "SHP345678", status: "Delivered", delivered_at: "2026-03-24T11:00:00Z", pod_available: true, pod_signature: "M. Iyer" },
      observation_text: "AWB SHP345678: DELIVERED on 2026-03-24T11:00Z. POD available. Signature: M. Iyer.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_support_transcript",
      input_json: { customer_email: "meenakshi.iyer@yahoo.co.in", order_id: "ORD-7832" },
      output_json: { ticket_id: "TKT-78901", channel: "whatsapp", created_at: "2026-03-25T16:00:00Z", has_screenshot: true, screenshot_url: "https://storage.internal/whatsapp_ss_TKT78901.jpg" },
      observation_text: "Support contact found via WhatsApp. Screenshot available. Activating OCR parser.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "parse_chat_screenshot",
      input_json: { screenshot_url: "https://storage.internal/whatsapp_ss_TKT78901.jpg", ocr_engine: "tesseract-indicv2" },
      output_json: { extracted_text: "haan, order mil gaya. bahut sundar saree hai!", language_detected: "hi", confidence: 0.94 },
      observation_text: "OCR extracted: 'haan, order mil gaya. bahut sundar saree hai!' Language: Hindi. Confidence: 94%.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "translate_text",
      input_json: { text: "haan, order mil gaya. bahut sundar saree hai!", source_lang: "hi", target_lang: "en" },
      output_json: { translated: "Yes, the order arrived. Very beautiful saree!", confidence: 0.97 },
      observation_text: "Translation: 'Yes, the order arrived. Very beautiful saree!' — Customer acknowledges receipt. Strong counter-evidence to INR claim.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_merchant_policy",
      input_json: { merchant: "houseofsarees", policy_type: "dispute" },
      output_json: { return_window_days: 3, dispute_policy: "Contest with delivery proof and customer acknowledgement", pod_requirement: "mandatory" },
      observation_text: "Merchant policy retrieved. 3-day return window. Contest with POD and customer acknowledgement.",
      status: "warning",
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { evidence_count: 7, found: 7, missing: 1, missing_items: ["invoice"], score: 0.875 },
      observation_text: "Evidence collection complete. Score: 7/8 (87.5%). Missing: formal tax invoice. WhatsApp delivery acknowledgement captured. Handing off to policy engine.",
      status: "warning",
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { recommended_action: "Contest", confidence_band: "Medium", approval_required: true },
      observation_text: "Policy engine returned: CONTEST (Medium confidence). Vernacular acknowledgement as key evidence. Approval required due to missing invoice. Draft being generated.",
      status: "success",
    },
  ];
}

export function getRtoSteps(caseId: string): StepDef[] {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute for Gadget Lane. Starting evidence collection.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_rto003", payment_id: "pay_ghi789" },
      output_json: { payment_id: "pay_ghi789", amount: 1499900, currency: "INR", status: "captured", captured_at: "2026-03-10T09:00:00Z", method: "card", card_network: "Visa" },
      observation_text: "Payment pay_ghi789 found. Status: captured. Amount: ₹14,999. Method: Visa card.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-2291", merchant: "gadgetlane" },
      output_json: { order_id: "ORD-2291", customer_name: "Rohit Verma", fulfillment_status: "shipped", awb: "DHL909876", carrier: "DHL", line_items: [{ sku: "GL-PHONE-X15", name: "Smartphone ProMax X15 128GB", qty: 1, price: 14999 }] },
      observation_text: "Order ORD-2291 found. AWB: DHL909876 via DHL.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: "DHL909876", carrier: "DHL" },
      output_json: { awb: "DHL909876", status: "RTO", rto_initiated_at: "2026-03-14T08:00:00Z", rto_reason: "Customer refused delivery", delivered_at: null, pod_available: false, tracking_history: [{ ts: "2026-03-11T10:00:00Z", event: "Picked Up" }, { ts: "2026-03-13T14:00:00Z", event: "Out for Delivery" }, { ts: "2026-03-13T17:30:00Z", event: "Delivery Failed - Customer Refused" }, { ts: "2026-03-14T08:00:00Z", event: "RTO Initiated" }] },
      observation_text: "CRITICAL: AWB DHL909876 status is RTO (Return to Origin). Customer refused delivery on 2026-03-13. No POD. Recommend ACCEPT.",
      status: "warning",
    },
    {
      action_type: "tool_call",
      tool_name: "get_invoice_record",
      input_json: { order_id: "ORD-2291", merchant: "gadgetlane" },
      output_json: { invoice_id: "INV-2291", amount: 14999, issued_at: "2026-03-10T09:01:00Z" },
      observation_text: "Invoice INV-2291 found. Amount ₹14,999.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_merchant_policy",
      input_json: { merchant: "gadgetlane", policy_type: "dispute" },
      output_json: { dispute_policy: "Accept RTO disputes immediately. Initiate refund per RTO SLA.", rto_sla_days: 7 },
      observation_text: "Merchant policy: Accept all RTO disputes immediately. Refund per 7-day RTO SLA.",
      status: "success",
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { recommended_action: "Accept", confidence_band: "High", logistics_status: "RTO", approval_required: false },
      observation_text: "Policy engine returned: ACCEPT (High confidence). Logistics status is RTO — non-delivery confirmed by carrier. No contest warranted. Audit log updated.",
      status: "success",
    },
  ];
}

export function getWeakEvidenceSteps(caseId: string): StepDef[] {
  return [
    {
      action_type: "observe",
      tool_name: null,
      input_json: { case_id: caseId, dispute_reason: "item_not_received" },
      output_json: {},
      observation_text: "Received INR dispute for Fresh Nest. Starting evidence collection.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_razorpay_payment",
      input_json: { dispute_id: "disp_weak004", payment_id: "pay_jkl012" },
      output_json: { payment_id: "pay_jkl012", amount: 89900, currency: "INR", status: "captured", captured_at: "2026-03-18T11:00:00Z", method: "upi", vpa: "amit.joshi@paytm" },
      observation_text: "Payment pay_jkl012 found. Amount: ₹899. Method: UPI.",
      status: "success",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shopify_order",
      input_json: { order_id: "ORD-8801", merchant: "freshnest" },
      output_json: { order_id: "ORD-8801", customer_name: "Amit Joshi", fulfillment_status: "unfulfilled", awb: null, carrier: null, line_items: [{ sku: "FN-PLANT-001", name: "Indoor Plant Combo Set", qty: 1, price: 899 }] },
      observation_text: "Order ORD-8801 found but UNFULFILLED. No AWB assigned. Cannot fetch tracking data.",
      status: "error",
    },
    {
      action_type: "tool_call",
      tool_name: "get_shiprocket_tracking",
      input_json: { awb: null, carrier: null },
      output_json: { error: "No AWB found for order ORD-8801", status: "not_found" },
      observation_text: "Shiprocket tracking failed: No AWB available. Cannot confirm delivery status.",
      status: "error",
    },
    {
      action_type: "tool_call",
      tool_name: "get_support_transcript",
      input_json: { customer_email: "amit.joshi@email.com", order_id: "ORD-8801" },
      output_json: { ticket_id: null, error: "No support ticket found for this order" },
      observation_text: "No support transcript found. Customer has not contacted support via tracked channels.",
      status: "warning",
    },
    {
      action_type: "observe",
      tool_name: null,
      input_json: {},
      output_json: { evidence_count: 2, found: 2, missing: 6, score: 0.25, missing_items: ["awb_tracking", "logistics_status", "proof_of_delivery", "invoice", "customer_communication", "merchant_policy"] },
      observation_text: "Evidence collection complete. Score: 2/8 (25%). CRITICAL: No AWB, no tracking, no POD, no invoice, no support record. Escalating — insufficient evidence to contest or accept.",
      status: "error",
    },
  ];
}
