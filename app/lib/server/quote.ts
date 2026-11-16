import "server-only";
import { findProduct } from "../../data/products";
import { discountOn, maxQuantity, unitPrice } from "../pricing";

const MAX_LINES = 20;

export interface Quote {
  subtotal: number;
  discount: number;
  total: number;
}

/**
 * Prices a cart from the catalog. Only product ids, options and quantities are
 * taken from the client, never prices. Returns null if anything is invalid.
 */
export function quoteItems(items: unknown, couponPercent: number): Quote | null {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) return null;

  const perProduct = new Map<string, number>();
  let subtotal = 0;

  for (const item of items as Array<Record<string, unknown> | null>) {
    const product = findProduct(item?.id);
    const quantity = item?.quantity;
    if (!product || !Number.isSafeInteger(quantity) || (quantity as number) < 1) return null;
    if (!product.colors.some((c) => c.name === item?.color)) return null;

    const storage = product.storage.find((s) => s.label === item?.storage);
    if (!storage) return null;

    const running = (perProduct.get(product.id) ?? 0) + (quantity as number);
    if (running > maxQuantity(product)) return null;
    perProduct.set(product.id, running);

    subtotal += unitPrice(product, storage.label) * (quantity as number);
  }

  const discount = discountOn(subtotal, couponPercent);
  return { subtotal, discount, total: subtotal - discount };
}
