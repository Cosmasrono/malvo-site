import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, SlidersHorizontal, Banknote, MessageCircle } from "lucide-react";
import Catalog from "./components/Catalog";
import Price from "./components/Price";
import { PRODUCTS } from "./data/products";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "./lib/whatsapp";

export default function Home() {
  return (
    <>
      <div className="hero-backdrop">
        <Image className="hero-background" src="/products/workspace-background.webp" alt="" fill sizes="100vw" preload />
      <section className="wrap hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">Good tech.<br /><span>Better everyday.</span></h1>
          <p className="hero-description">A little more power for whatever comes next. Find your next laptop, phone, or workspace upgrade, all in one place.</p>
          <div className="hero-actions">
            <a href="#collection" className="btn btn-primary">Explore the collection <ArrowDown size={17} aria-hidden="true" /></a>
            <Link href="/compare" className="text-link">Compare devices <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="hero-note">
            <span><MessageCircle size={16} aria-hidden="true" />Order on WhatsApp</span>
            <span><Banknote size={16} aria-hidden="true" />Priced in Ksh</span>
            <span><SlidersHorizontal size={16} aria-hidden="true" />Compare before you buy</span>
          </div>
        </div>
        <Link className="hero-feature" href="/product/dell-p2726deb#product" aria-label="Explore the Dell 27-inch 2K Monitor">
          <div className="feature-caption"><Image src="/products/dell-p2726deb-front.jpg" alt="" width={70} height={70} className="feature-thumb" /><div><h2>Dell 27-inch 2K Monitor</h2><p><Price usd={PRODUCTS[0].price} /></p></div><span className="feature-arrow"><ArrowUpRight size={24} aria-hidden="true" /></span></div>
        </Link>
      </section>
      </div>
      <section className="wrap collection-section" id="collection" aria-label="Products">
        <Suspense><Catalog /></Suspense>
      </section>
      <section className="wrap shopping-help" id="shopping-help" aria-labelledby="help-title">
        <div><h2 id="help-title">Before you<br />make it yours.</h2><p>A few things to know about shopping with Zero Gravity Tech.</p></div>
        <div className="faq-list">
          <details><summary>How do I place an order?</summary><p>Add your products to the cart and continue to checkout. Enter your delivery details, then continue on WhatsApp and tap Send to request your order. Zero Gravity Tech will confirm availability, delivery and payment in chat.</p></details>
          <details><summary>What about delivery, warranty and returns?</summary><p>Ask Zero Gravity Tech on WhatsApp to confirm delivery charges, warranty coverage and returns terms for your device before arranging payment.</p></details>
          <details><summary>How do I choose the right device?</summary><p>Open a product to see its specifications, photos and available options. For laptops and phones, use <Link href="/compare">Compare devices</Link> to view the details side by side.</p></details>
          <details><summary>How can I contact Zero Gravity Tech?</summary><p>Chat with Zero Gravity Tech on <a href={WHATSAPP_URL} rel="noreferrer">WhatsApp: {WHATSAPP_DISPLAY}</a> for product questions and order enquiries.</p></details>
        </div>
      </section>
    </>
  );
}
