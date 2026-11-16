"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { findProduct, type Product } from "../data/products";
import { CURRENCY_COOKIE, formatMoney, type Currency } from "../lib/currency";
import { discountOn, maxQuantity, unitPrice } from "../lib/pricing";

const STORAGE_KEY = "malvo_cart_v2";

/** What is saved and sent to the server. Prices are always looked up. */
export interface CartRow {
  id: string;
  color: string;
  storage: string;
  quantity: number;
}

export interface CartLine extends CartRow {
  product: Product;
  unit: number;
}

interface StoreValue {
  rows: CartRow[];
  lines: CartLine[];
  add: (product: Product, color?: string, storage?: string, quantity?: number) => void;
  setQuantity: (row: CartRow, quantity: number) => void;
  clear: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  format: (amountInUSD: number) => string;
  coupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => Promise<string | null>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  total: number;
  count: number;
}

const StoreContext = createContext<StoreValue | undefined>(undefined);

function roomFor(rows: CartRow[], product: Product, skip?: CartRow): number {
  const used = rows.filter((r) => r.id === product.id && r !== skip).reduce((sum, r) => sum + r.quantity, 0);
  return Math.max(0, maxQuantity(product) - used);
}

function restoreRows(raw: unknown): CartRow[] {
  if (!Array.isArray(raw)) return [];
  const rows: CartRow[] = [];
  for (const item of raw) {
    const product = findProduct(item?.id);
    if (!product || !Number.isSafeInteger(item.quantity) || item.quantity < 1) continue;
    if (!product.colors.some((c) => c.name === item.color)) continue;
    if (!product.storage.some((s) => s.label === item.storage)) continue;
    const quantity = Math.min(item.quantity, roomFor(rows, product));
    if (quantity > 0) rows.push({ id: product.id, color: item.color, storage: item.storage, quantity });
  }
  return rows;
}

export function StoreProvider({ children, initialCurrency }: { children: ReactNode; initialCurrency: Currency }) {
  const [rows, setRows] = useState<CartRow[]>([]);
  const [restored, setRestored] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);
  const [coupon, setCoupon] = useState<StoreValue["coupon"]>(null);

  // Restore before saving so the first render cannot overwrite a saved cart.
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        setRows(restoreRows(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")));
      } catch {
        // Blocked storage or a corrupt entry just means an empty cart.
      }
      setRestored(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      // The cart still works for this visit.
    }
  }, [rows, restored]);

  const add: StoreValue["add"] = (product, color = product.colors[0].name, storage = product.storage[0].label, quantity = 1) => {
    setRows((prev) => {
      const existing = prev.find((r) => r.id === product.id && r.color === color && r.storage === storage);
      const next = Math.min(roomFor(prev, product, existing), (existing?.quantity ?? 0) + quantity);
      if (next <= 0) return prev;
      return existing
        ? prev.map((r) => (r === existing ? { ...r, quantity: next } : r))
        : [...prev, { id: product.id, color, storage, quantity: next }];
    });
  };

  const setQuantity: StoreValue["setQuantity"] = (row, quantity) => {
    setRows((prev) => {
      const current = prev.find((r) => r.id === row.id && r.color === row.color && r.storage === row.storage);
      const product = findProduct(row.id);
      if (!current || !product) return prev;
      if (quantity <= 0) return prev.filter((r) => r !== current);
      return prev.map((r) => (r === current ? { ...r, quantity: Math.min(quantity, roomFor(prev, product, current)) } : r));
    });
  };

  const clear = () => {
    setRows([]);
    setCoupon(null);
  };

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    const secure = location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${CURRENCY_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax${secure}`;
  };

  const applyCoupon: StoreValue["applyCoupon"] = async (code) => {
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: rows, coupon: code }),
      });
      const data = await response.json();
      if (!response.ok) return data.error ?? "Couldn't check that code. Try again.";
      setCoupon(data.coupon);
      return null;
    } catch {
      return "Couldn't check that code. Try again.";
    }
  };

  const lines: CartLine[] = rows.flatMap((row) => {
    const product = findProduct(row.id);
    return product ? [{ ...row, product, unit: unitPrice(product, row.storage) }] : [];
  });
  const subtotal = lines.reduce((sum, line) => sum + line.unit * line.quantity, 0);
  const discount = discountOn(subtotal, coupon?.percent ?? 0);

  const value: StoreValue = {
    rows,
    lines,
    add,
    setQuantity,
    clear,
    isCartOpen,
    setCartOpen,
    currency,
    setCurrency,
    format: formatMoney,
    coupon,
    applyCoupon,
    removeCoupon: () => setCoupon(null),
    subtotal,
    discount,
    total: subtotal - discount,
    count: rows.reduce((sum, r) => sum + r.quantity, 0),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
