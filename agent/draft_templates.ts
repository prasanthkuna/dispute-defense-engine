export function getDraftText(
  scenarioType: string,
  disputeId: string,
  caseData: { merchant_name: string; amount: number; currency: string }
): { summary: string; response: string; attachments: string[] } {
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
        "Merchant_Dispute_Policy_UrbanCart.pdf",
      ],
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
        "Merchant_Policy_HouseOfSarees.pdf",
      ],
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
        "Merchant_Policy_GadgetLane.pdf",
      ],
    };
  }

  // weak_evidence_escalate
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
      "Razorpay_Payment_pay_jkl012.pdf",
    ],
  };
}

