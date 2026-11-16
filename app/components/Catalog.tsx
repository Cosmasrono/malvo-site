"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { PRODUCTS, type Product } from "../data/products";
import ProductCard from "./ProductCard";
import ProductPhoto from "./ProductPhoto";
import { scrollToCollection } from "./HeaderControls";

const TABS = [
  { key: "all", label: "All products", title: "Computers and phones" },
  { key: "laptops", label: "Laptops", title: "Laptop computers", category: "laptop" },
  { key: "desktops", label: "Desktops", title: "Desktop computers", category: "desktop" },
  { key: "monitors", label: "Monitors", title: "Computer monitors", category: "monitor" },
  { key: "phones", label: "Phones", title: "Mobile phones", category: "phone" },
] as const;

const PRICES = [
  { key: "under-30k", label: "Under Ksh 30,000", min: 0, max: 30000 },
  { key: "30k-100k", label: "Ksh 30,000 to 100,000", min: 30000, max: 100000 },
  { key: "over-100k", label: "Over Ksh 100,000", min: 100000, max: Infinity },
];

const SORTS: Record<string, { label: string; compare: (a: Product, b: Product) => number }> = {
  featured: { label: "Featured", compare: () => 0 },
  "price-asc": { label: "Price: low to high", compare: (a, b) => (a.priceSoon ? 1 : b.priceSoon ? -1 : a.price - b.price) },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.price - a.price },
};

type Tab = (typeof TABS)[number];
const inTab = (t: Tab) => PRODUCTS.filter((p) => !("category" in t) || p.category === t.category);

export default function Catalog() {
  const params = useSearchParams();
  // Phones only: the filter list folds away behind a button.
  const [filtersOpen, setFiltersOpen] = useState(false);

  const tab = TABS.find((t) => t.key === params.get("category")) ?? TABS[0];
  const q = (params.get("q") ?? "").slice(0, 80);
  const rawSort = params.get("sort") ?? "";
  const sort = Object.hasOwn(SORTS, rawSort) ? rawSort : "featured";
  const price = PRICES.find((p) => p.key === params.get("price"));

  const department = inTab(tab);
  const brands = [...new Set(department.map((p) => p.brand))];
  const selectedBrands = (params.get("brand") ?? "").split(",").filter((b) => brands.some((brand) => brand === b));

  const update = (change: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(change)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const search = next.toString();
    window.history.replaceState(null, "", search ? `/?${search}` : "/");
  };

  // Changing department or picking a tile brings the product section into view.
  const goTo = (change: Record<string, string>) => {
    update(change);
    scrollToCollection();
  };

  const toggleBrand = (brand: string) => {
    const next = selectedBrands.includes(brand) ? selectedBrands.filter((b) => b !== brand) : [...selectedBrands, brand];
    update({ brand: next.join(",") });
  };

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const products = department
    .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter((p) => !price || (!p.priceSoon && p.price >= price.min && p.price < price.max))
    .filter((p) => {
      const text = [p.name, p.brand, p.headline, p.specs.processor].join(" ").toLowerCase();
      return words.every((word) => text.includes(word));
    })
    .sort(SORTS[sort].compare);

  const filtered = Boolean(q || price || selectedBrands.length);
  const activeFilters = selectedBrands.length + (price ? 1 : 0);
  const clearFilters = () => update({ q: "", brand: "", price: "" });

  const tiles =
    tab.key === "all"
      ? TABS.slice(1).map((t) => ({ key: t.key, label: t.label, image: inTab(t)[0].image, onClick: () => goTo({ category: t.key, brand: "" }) }))
      : brands.length > 1
        ? brands.map((brand) => ({
            key: brand,
            label: brand,
            image: department.find((p) => p.brand === brand)!.image,
            onClick: () => goTo({ brand }),
          }))
        : [];

  return (
    <div className="shop">
      <button className="filters-toggle" aria-expanded={filtersOpen} aria-controls="shop-filters" onClick={() => setFiltersOpen((open) => !open)}>
        <SlidersHorizontal size={17} aria-hidden="true" />
        {filtersOpen ? "Hide filters" : "Filters"}
        {activeFilters > 0 && <b>{activeFilters}</b>}
      </button>
      <aside id="shop-filters" className={filtersOpen ? "shop-side open" : "shop-side"} aria-label="Filters">
        <div>
          <h3>Department</h3>
          <ul className="dept">
            {TABS.map((t) => (
              <li key={t.key}>
                <button aria-current={t.key === tab.key ? "true" : undefined} onClick={() => goTo({ category: t.key === "all" ? "" : t.key, brand: "" })}>
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Brands</h3>
          <ul className="checks">
            {brands.map((brand) => (
              <li key={brand}>
                <label>
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Price</h3>
          <ul className="checks">
            <li>
              <label>
                <input type="radio" name="price" checked={!price} onChange={() => update({ price: "" })} />
                Any price
              </label>
            </li>
            {PRICES.map((p) => (
              <li key={p.key}>
                <label>
                  <input type="radio" name="price" checked={price?.key === p.key} onChange={() => update({ price: p.key })} />
                  {p.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {filtered && (
          <button className="count-clear" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </aside>

      <div className="shop-main">
        <h2 className="shop-title">{q ? `Results for “${q}”` : tab.title}</h2>
        <div className="shop-banner">{tab.label}</div>

        {tiles.length > 0 && (
          <div className="tiles">
            {tiles.map((tile) => (
              <button key={tile.key} className="tile" onClick={tile.onClick}>
                <span className="tile-photo">
                  <ProductPhoto src={tile.image} sizes="(max-width: 680px) 45vw, 220px" />
                </span>
                <strong>{tile.label}</strong>
                <span className="tile-link">Shop now</span>
              </button>
            ))}
          </div>
        )}

        <div className="shop-bar">
          <p className="muted" aria-live="polite">
            {products.length} {products.length === 1 ? "result" : "results"}
          </p>
          <label>
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? "" : e.target.value })}>
              {Object.entries(SORTS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {products.length > 0 ? (
          <div className="grid">
            {products.map((p, index) => (
              <ProductCard key={p.id} product={p} preload={index < 3} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p className="muted">Nothing matches those filters.</p>
            <button className="btn" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
