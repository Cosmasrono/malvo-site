import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { guardJsonPost, jsonResponse } from "../../lib/server/guard";
import { lookupCoupon } from "../../lib/server/coupons";
import { quoteItems } from "../../lib/server/quote";
import { findProduct } from "../../data/products";
import { formatMoney } from "../../lib/currency";
import { unitPrice } from "../../lib/pricing";
import { WHATSAPP_URL } from "../../lib/whatsapp";

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FIELDS = {
  name: { min: 2, max: 80, message: "Enter your full name." },
  email: { min: 6, max: 254, message: "Enter a valid email address." },
  address: { min: 3, max: 120, message: "Enter your street address." },
  city: { min: 1, max: 80, message: "Enter your city." },
  postal: { min: 2, max: 16, message: "Enter your postal code." },
  country: { min: 2, max: 60, message: "Enter your country." },
} as const;

function validateContact(contact: unknown): Record<string, string> {
  const source = (contact && typeof contact === "object" ? contact : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  for (const [field, rule] of Object.entries(FIELDS)) {
    const raw = source[field];
    const value = typeof raw === "string" ? raw.trim() : "";
    const valid =
      value.length >= rule.min &&
      value.length <= rule.max &&
      !CONTROL_CHARS.test(value) &&
      (field !== "email" || EMAIL.test(value));
    if (!valid) errors[field] = rule.message;
  }
  return errors;
}

// Prepare a WhatsApp enquiry without charging, storing or logging customer details.
export async function POST(request: NextRequest) {
  const { body, error } = await guardJsonPost(request, "orders", 10);
  if (error) return error;

  const fieldErrors = validateContact(body.contact);
  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse({ error: "Check the highlighted fields.", fieldErrors }, 422);
  }

  const coupon = body.coupon == null ? null : lookupCoupon(body.coupon);
  if (body.coupon != null && !coupon) return jsonResponse({ error: "That code isn't valid." }, 422);

  const quote = quoteItems(body.items, coupon?.percent ?? 0);
  if (!quote) return jsonResponse({ error: "Your cart has changed. Refresh and try again." }, 422);

  if (body.expectedTotal !== quote.total) {
    return jsonResponse({ error: "Prices have changed. Refresh and review your cart." }, 409);
  }

  const reference = `ZGT-${randomBytes(4).toString("hex").toUpperCase()}`;
  const contact = Object.fromEntries(
    Object.keys(FIELDS).map((field) => [field, (body.contact as Record<string, string>)[field].trim()]),
  ) as Record<keyof typeof FIELDS, string>;
  const items = body.items as { id: string; color: string; storage: string; quantity: number }[];
  const lines = items.map((item, index) => {
    const product = findProduct(item.id)!;
    return `${index + 1}. ${product.name}\n   ${item.color} / ${item.storage}\n   ${item.quantity} x ${formatMoney(unitPrice(product, item.storage))} = ${formatMoney(unitPrice(product, item.storage) * item.quantity)}`;
  });
  const message = [
    `Hello Zero Gravity Tech, I'd like to order.\nReference: ${reference}`,
    lines.join("\n\n"),
    [
      `Subtotal: ${formatMoney(quote.subtotal)}`,
      ...(coupon ? [`Discount (${coupon.code}): -${formatMoney(quote.discount)}`] : []),
      `Total: ${formatMoney(quote.total)}`,
    ].join("\n"),
    `Customer: ${contact.name}\nEmail: ${contact.email}\nDelivery: ${contact.address}, ${contact.city}, ${contact.postal}, ${contact.country}`,
    "Please confirm availability, delivery charges and payment arrangements.",
  ].join("\n\n");

  return jsonResponse({
    reference,
    ...quote,
    whatsappUrl: `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`,
  });
}
