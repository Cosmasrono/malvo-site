import "server-only";

export interface Coupon {
  code: string;
  percent: number;
}

// STORE_COUPONS looks like "FLAGSHIP10:10,VIP20:20". Only the code advertised
// on the site has a default, so private codes never live in the source.
function loadCoupons(): Map<string, number> {
  const coupons = new Map<string, number>();
  for (const entry of (process.env.STORE_COUPONS ?? "FLAGSHIP10:10").split(",")) {
    const match = /^([A-Z0-9]{3,24}):(\d{1,2})$/.exec(entry.trim().toUpperCase());
    const percent = match ? Number(match[2]) : 0;
    if (match && percent >= 1 && percent <= 50) coupons.set(match[1], percent);
  }
  return coupons;
}

const coupons = loadCoupons();

export function lookupCoupon(code: unknown): Coupon | null {
  if (typeof code !== "string" || code.length > 24) return null;
  const normalized = code.trim().toUpperCase();
  const percent = coupons.get(normalized);
  return percent ? { code: normalized, percent } : null;
}
