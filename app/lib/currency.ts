export type Currency = "KES";

export const CURRENCY_COOKIE = "malvo_currency";

export function isCurrency(value: unknown): value is Currency {
  return value === "KES";
}

export function formatMoney(amount: number): string {
  return `Ksh ${Math.round(amount).toLocaleString("en-US")}`;
}
