import type { Product } from "../data/products";

/** Most of one product a single order can hold, across all its variants. */
export const MAX_PER_PRODUCT = 5;

export function maxQuantity(product: Product): number {
  return product.inStock ? Math.min(product.stockCount, MAX_PER_PRODUCT) : 0;
}

export function unitPrice(product: Product, storageLabel: string): number {
  const option = product.storage.find((s) => s.label === storageLabel);
  return product.price + (option?.extra ?? 0);
}

export function discountOn(subtotal: number, percent: number): number {
  return Math.round(subtotal * percent) / 100;
}
