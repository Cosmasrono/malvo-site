import type { Metadata } from "next";
import Link from "next/link";
import CompareTable from "../components/CompareTable";

export const metadata: Metadata = {
  title: "Compare",
  description: "Laptop and phone specifications side by side.",
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ type?: string | string[] }> }) {
  const category = (await searchParams).type === "phones" ? "phone" : "laptop";

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>Compare</h1>
        <nav className="tabs" aria-label="Product type">
          <Link href="/compare" aria-current={category === "laptop" ? "page" : undefined}>
            Laptops
          </Link>
          <Link href="/compare?type=phones" aria-current={category === "phone" ? "page" : undefined}>
            Phones
          </Link>
        </nav>
      </div>
      <CompareTable key={category} category={category} />
    </div>
  );
}
