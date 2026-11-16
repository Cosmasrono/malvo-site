"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import { findProduct } from "../data/products";
import { maxQuantity } from "../lib/pricing";

export default function QuickAdd({ productId, label }: { productId: string; label: string }) {
  const { add, rows } = useStore();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const product = findProduct(productId);
  if (!product) return null;

  const inCart = rows.filter((r) => r.id === productId).reduce((sum, r) => sum + r.quantity, 0);
  const full = inCart >= maxQuantity(product);

  const onClick = () => {
    add(product);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  let text = "Add to cart";
  if (added) text = "Added";
  else if (product.priceSoon) text = "Unavailable";
  else if (!product.inStock) text = "Sold out";
  else if (full) text = "Limit reached";

  return (
    <button className={added ? "quick-add is-added" : "quick-add"} disabled={!added && full} aria-label={added ? `${label} added to cart` : `Add ${label} to cart`} onClick={onClick}>
      {text}
    </button>
  );
}
