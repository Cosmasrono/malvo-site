import type { Metadata } from "next";
import CheckoutForm from "../components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="wrap page">
      <h1>Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
