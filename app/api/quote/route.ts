import type { NextRequest } from "next/server";
import { guardJsonPost, jsonResponse } from "../../lib/server/guard";
import { lookupCoupon } from "../../lib/server/coupons";
import { quoteItems } from "../../lib/server/quote";

export async function POST(request: NextRequest) {
  const { body, error } = await guardJsonPost(request, "quote", 20);
  if (error) return error;

  const coupon = lookupCoupon(body.coupon);
  if (!coupon) return jsonResponse({ error: "That code isn't valid." }, 422);

  const quote = quoteItems(body.items, coupon.percent);
  if (!quote) return jsonResponse({ error: "Your cart has changed. Refresh and try again." }, 422);

  return jsonResponse({ coupon, ...quote });
}
