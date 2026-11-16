"use client";

import { useState } from "react";
import ProductPhoto from "./ProductPhoto";
import Link from "next/link";
import { PRODUCTS, type ProductSpec } from "../data/products";
import Price from "./Price";
import QuickAdd from "./QuickAdd";

export default function CompareTable({ category }: { category: "laptop" | "phone" }) {
  const all = PRODUCTS.filter((p) => p.category === category);
  const [hidden, setHidden] = useState<string[]>([]);
  const shown = all.filter((p) => !hidden.includes(p.id));

  const rows: [string, keyof ProductSpec][] = [
    ["Processor", "processor"],
    ["Memory", "ram"],
    ["Storage", "storage"],
    ["Display", "display"],
    [category === "phone" ? "Camera" : "Graphics", "graphicsOrCamera"],
    ["Battery", "battery"],
    ["Software", "os"],
    ["Weight and build", "weightOrBuild"],
  ];

  const toggle = (id: string) => setHidden((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <>
      <div className="pickers" role="group" aria-label="Choose products to compare">
        {all.map((p) => {
          const isShown = !hidden.includes(p.id);
          return (
            <button key={p.id} aria-pressed={isShown} disabled={isShown && shown.length <= 2} onClick={() => toggle(p.id)}>
              {p.name}
            </button>
          );
        })}
      </div>

      <div className="table-scroll" tabIndex={0} role="region" aria-label="Comparison table">
        <table style={{ minWidth: 130 + shown.length * 210 }}>
          <thead>
            <tr>
              <td />
              {shown.map((p) => (
                <th key={p.id} scope="col" className="appear">
                  <div className="table-photo">
                    <ProductPhoto src={p.image} sizes="280px" />
                  </div>
                  <Link href={`/product/${p.id}#product`}>{p.name}</Link>
                  <span>
                    <Price usd={p.price} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, key]) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                {shown.map((p) => (
                  <td key={p.id}>{p.specs[key]}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td />
              {shown.map((p) => (
                <td key={p.id}>
                  <QuickAdd productId={p.id} label={p.name} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
