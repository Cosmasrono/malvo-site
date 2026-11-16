"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="wrap status-page">
      <h1>Something went wrong on our side.</h1>
      <p>Your cart is saved. Reload the page to carry on.</p>
      <Link className="btn btn-solid" href="/">
        Back to the home page
      </Link>
    </div>
  );
}
