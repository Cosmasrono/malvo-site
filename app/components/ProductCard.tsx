import ProductPhoto from "./ProductPhoto";
import Link from "next/link";
import type { Product } from "../data/products";
import Price from "./Price";
import QuickAdd from "./QuickAdd";

export default function ProductCard({ product, preload = false }: { product: Product; preload?: boolean }) {
  return (
    <article className="card">
      <Link href={`/product/${product.id}#product`} className="card-link">
        <div className="card-photo">
          <ProductPhoto src={product.image} sizes="(max-width: 680px) 50vw, (max-width: 1000px) 33vw, 300px" preload={preload} />
        </div>
        <p className="card-brand">{product.brand}</p>
        <h2>{product.name}</h2>
        <p className="card-chips">
          {product.headline.split(", ").map((part) => (
            <span key={part}>{part}</span>
          ))}
        </p>
      </Link>
      <p className="card-price">{product.priceSoon ? "Pricing unavailable" : <Price usd={product.price} />}</p>
      <QuickAdd productId={product.id} label={product.name} />
    </article>
  );
}
