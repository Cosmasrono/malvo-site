import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuyBox from "../../components/BuyBox";
import Gallery from "../../components/Gallery";
import ProductCard from "../../components/ProductCard";
import { findProduct, PRODUCTS } from "../../data/products";
import { SITE_URL } from "../../lib/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = findProduct((await params).id);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}: ${product.headline}. ${product.description}`,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = findProduct((await params).id);
  if (!product) notFound();

  const isLaptop = product.category === "laptop";
  const LABELS = { laptop: "Laptops", phone: "Phones", desktop: "Desktops", monitor: "Monitors" } as const;
  const specs: [string, string][] = product.customSpecs ?? [
    ["Processor", product.specs.processor],
    ["Memory", product.specs.ram],
    ["Storage", product.specs.storage],
    ["Display", product.specs.display],
    [isLaptop ? "Graphics" : "Camera", product.specs.graphicsOrCamera],
    ["Battery", product.specs.battery],
    ["Software", product.specs.os],
    ["Weight and build", product.specs.weightOrBuild],
  ];
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    ...(product.priceSoon
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "KES",
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/product/${product.id}`,
          },
        }),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <section className="stage" id="product">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/?category=${LABELS[product.category].toLowerCase()}#collection`}>{LABELS[product.category]}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <div className="product">
            <Gallery images={product.gallery ?? [product.image]} alt={product.imageAlt} />
            <div>
              <p className="product-brand">{product.brand}</p>
              <h1>{product.name}</h1>
              <p className="product-text">{product.description}</p>
              <BuyBox productId={product.id} />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap product-more">
        <h2>Specifications</h2>
        <dl className="specs">
          {specs.filter(([, value]) => value !== "Not listed").map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="highlights">
          {product.keyFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="wrap related">
          <h2>More {LABELS[product.category].toLowerCase()}</h2>
          <div className="grid three">
            {related.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
