"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useStore } from "../context/StoreContext";
import { WHATSAPP_DISPLAY } from "../lib/whatsapp";

const EMPTY_FORM = { name: "", email: "", address: "", city: "", postal: "", country: "" };
type Field = keyof typeof EMPTY_FORM;

const FIELDS: { name: Field; label: string; autoComplete: string; type?: string; maxLength: number }[] = [
  { name: "name", label: "Full name", autoComplete: "name", maxLength: 80 },
  { name: "email", label: "Email", autoComplete: "email", type: "email", maxLength: 254 },
  { name: "address", label: "Street address", autoComplete: "street-address", maxLength: 120 },
  { name: "city", label: "City", autoComplete: "address-level2", maxLength: 80 },
  { name: "postal", label: "Postal code", autoComplete: "postal-code", maxLength: 16 },
  { name: "country", label: "Country", autoComplete: "country-name", maxLength: 60 },
];

interface PreparedOrder {
  reference: string;
  total: number;
  firstName: string;
  whatsappUrl: string;
}

export default function CheckoutForm() {
  const store = useStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [preparedOrder, setPreparedOrder] = useState<PreparedOrder | null>(null);

  if (preparedOrder) {
    return (
      <section className="receipt">
        <h2>Your order is ready, {preparedOrder.firstName}.</h2>
        <p>Send the prepared message to {WHATSAPP_DISPLAY} in WhatsApp to request your order. Malvo will confirm availability, delivery charges and payment there.</p>
        <p>Your order has not been sent or paid for yet. Your cart is saved if you need to make changes.</p>
        <dl className="sums">
          <div>
            <dt>Reference</dt>
            <dd>{preparedOrder.reference}</dd>
          </div>
          <div className="sums-total">
            <dt>Total</dt>
            <dd>{store.format(preparedOrder.total)}</dd>
          </div>
        </dl>
        <div className="order-actions">
          <a className="btn btn-solid" href={preparedOrder.whatsappUrl} rel="noreferrer">Open WhatsApp</a>
          <button className="btn" onClick={() => setPreparedOrder(null)}>Edit order</button>
        </div>
      </section>
    );
  }

  if (store.lines.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty.</h2>
        <Link className="btn" href="/">
          Go to the shop
        </Link>
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError("");
    setFieldErrors({});
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: store.rows,
          coupon: store.coupon?.code ?? null,
          expectedTotal: store.total,
          contact: form,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "We couldn't prepare your order. Try again.");
        setFieldErrors(data.fieldErrors ?? {});
        return;
      }
      setPreparedOrder({
        reference: data.reference,
        total: data.total,
        firstName: form.name.trim().split(/\s+/)[0],
        whatsappUrl: data.whatsappUrl,
      });
      window.location.assign(data.whatsappUrl);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="checkout-grid" onSubmit={submit}>
      <div>
        <p className="checkout-note">Checkout continues on WhatsApp with Malvo at {WHATSAPP_DISPLAY}. Review your details below, then send the prepared message to confirm availability and delivery.</p>
        <h2>Delivery details</h2>
        <div className="fields">
          {FIELDS.map((field) => (
            <label key={field.name} className={`field field-${field.name}`}>
              {field.label}
              <input
                required
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                maxLength={field.maxLength}
                aria-invalid={Boolean(fieldErrors[field.name])}
                value={form[field.name]}
                onChange={(e) => setForm((previous) => ({ ...previous, [field.name]: e.target.value }))}
              />
              {fieldErrors[field.name] && <em>{fieldErrors[field.name]}</em>}
            </label>
          ))}
        </div>
      </div>

      <aside className="summary">
        <h2>Your order</h2>
        <ul>
          {store.lines.map((line) => (
            <li key={`${line.id}-${line.color}-${line.storage}`}>
              <span>
                {line.quantity} x {line.product.name}
                <small>
                  {line.color}, {line.storage}
                </small>
              </span>
              <strong>{store.format(line.unit * line.quantity)}</strong>
            </li>
          ))}
        </ul>
        <dl className="sums">
          <div>
            <dt>Subtotal</dt>
            <dd>{store.format(store.subtotal)}</dd>
          </div>
          {store.discount > 0 && (
            <div className="sums-off">
              <dt>{store.coupon?.code}</dt>
              <dd>−{store.format(store.discount)}</dd>
            </div>
          )}
          <div className="sums-total">
            <dt>Total</dt>
            <dd>{store.format(store.total)}</dd>
          </div>
        </dl>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-solid btn-wide" type="submit" disabled={sending}>
          {sending ? "Preparing your order..." : "Continue on WhatsApp"}
        </button>
        <p className="fine">Your order and delivery details will be included in the WhatsApp message. Tap Send there to submit your request. No payment is taken on this site.</p>
      </aside>
    </form>
  );
}
