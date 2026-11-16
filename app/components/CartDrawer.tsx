"use client";

import { useState, type FormEvent } from "react";
import ProductPhoto from "./ProductPhoto";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { maxQuantity } from "../lib/pricing";
import StoreDialog from "./StoreDialog";

export default function CartDrawer() {
  const store = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  if (!store.isCartOpen) return null;

  const close = () => store.setCartOpen(false);

  const submitCoupon = async (event: FormEvent) => {
    event.preventDefault();
    setChecking(true);
    const problem = await store.applyCoupon(code);
    setChecking(false);
    setError(problem ?? "");
    if (!problem) setCode("");
  };

  const footer = store.lines.length > 0 && (
    <>
      {store.coupon ? (
        <p className="coupon-on">
          <span>
            {store.coupon.code}: {store.coupon.percent}% off
          </span>
          <button onClick={store.removeCoupon}>Remove</button>
        </p>
      ) : (
        <form className="coupon" onSubmit={submitCoupon}>
          <label htmlFor="coupon-code" className="sr-only">
            Discount code
          </label>
          <input id="coupon-code" placeholder="Discount code" maxLength={24} autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} required />
          <button type="submit" disabled={checking}>
            Apply
          </button>
        </form>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <dl className="sums">
        <div>
          <dt>Subtotal</dt>
          <dd>{store.format(store.subtotal)}</dd>
        </div>
        {store.discount > 0 && (
          <div className="sums-off">
            <dt>Discount</dt>
            <dd>−{store.format(store.discount)}</dd>
          </div>
        )}
        <div className="sums-total">
          <dt>Total</dt>
          <dd>{store.format(store.total)}</dd>
        </div>
      </dl>
      <Link className="btn btn-solid btn-wide" href="/checkout" onClick={close}>
        Go to checkout
      </Link>
    </>
  );

  return (
    <StoreDialog title={`Cart (${store.count})`} onClose={close} className="drawer" footer={footer}>
      {store.lines.length === 0 ? (
        <div className="empty">
          <h3>Your cart is empty.</h3>
          <Link className="btn" href="/" onClick={close}>
            Go to the shop
          </Link>
        </div>
      ) : (
        store.lines.map((line) => (
          <div className="line" key={`${line.id}-${line.color}-${line.storage}`}>
            <div className="line-photo">
              <ProductPhoto src={line.product.image} sizes="88px" />
            </div>
            <div className="line-info">
              <h3>{line.product.name}</h3>
              <p>
                {line.color}, {line.storage}
              </p>
              <div className="line-actions">
                <div className="qty">
                  <button aria-label={`Decrease quantity of ${line.product.name}`} onClick={() => store.setQuantity(line, line.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{line.quantity}</span>
                  <button aria-label={`Increase quantity of ${line.product.name}`} disabled={line.quantity >= maxQuantity(line.product)} onClick={() => store.setQuantity(line, line.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <button className="line-remove" aria-label={`Remove ${line.product.name}`} onClick={() => store.setQuantity(line, 0)}>
                  Remove
                </button>
              </div>
            </div>
            <strong>{store.format(line.unit * line.quantity)}</strong>
          </div>
        ))
      )}
    </StoreDialog>
  );
}
