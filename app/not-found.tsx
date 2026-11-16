import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap status-page">
      <h1>We can&apos;t find that page.</h1>
      <p>The link may be old, or the product may have been taken off sale.</p>
      <Link className="btn btn-solid" href="/">
        Go to the shop
      </Link>
    </div>
  );
}
