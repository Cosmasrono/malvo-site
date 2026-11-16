"use client";

import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { findProduct } from "../data/products";
import { unitPrice } from "../lib/pricing";

export default function BuyBox({ productId }: { productId: string }) {
  const product = findProduct(productId)!;
  const { add, format, setCartOpen } = useStore();
  const [color, setColor] = useState(product.colors[0].name);
  const [storage, setStorage] = useState(product.storage[0].label);
  const unit = unitPrice(product, storage);
  const was = unit + product.originalPrice - product.price;
  const showColors = product.colors.length > 1;
  const showStorage = product.storage.length > 1;

  if (product.priceSoon) {
    return (
      <div className="buybox">
        <p className="price">
          <strong>Pricing unavailable</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="buybox">
      <p className="price" key={unit}>
        <strong>{format(unit)}</strong>
        {was > unit && <del>{format(was)}</del>}
      </p>

      {showColors && (
        <fieldset>
          <legend>
            Color: <span>{color}</span>
          </legend>
          <div className="swatches">
            {product.colors.map((c) => (
              <label key={c.name} className="swatch" title={c.name}>
                <input type="radio" name="color" checked={color === c.name} onChange={() => setColor(c.name)} />
                <span style={{ background: c.hex }} />
                <span className="sr-only">{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {showStorage && (
        <fieldset>
          <legend>Storage</legend>
          <div className="choices">
            {product.storage.map((s) => (
              <label key={s.label} className="choice">
                <input type="radio" name="storage" checked={storage === s.label} onChange={() => setStorage(s.label)} />
                <span>
                  {s.label}
                  {s.extra > 0 && <small>+{format(s.extra)}</small>}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <button
        className="btn btn-primary btn-wide btn-large"
        disabled={!product.inStock}
        onClick={() => {
          add(product, color, storage);
          setCartOpen(true);
        }}
      >
        {product.inStock ? "Add to cart" : "Sold out"}
      </button>
      <p className={product.stockCount < 10 ? "stock low" : "stock"}>
        {!product.inStock ? "Sold out" : product.stockCount < 10 ? `Only ${product.stockCount} left` : "In stock"}
      </p>
    </div>
  );
}
