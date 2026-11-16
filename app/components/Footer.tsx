import Link from "next/link";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "../lib/whatsapp";

export default function Footer() {
  return (
    <footer className="footer">
      <a href="#top" className="back-top">Back to top</a>
      <div className="wrap footer-main">
        <div><Link href="/" className="logo">Zero Gravity<span> Tech</span></Link><p>Laptops, desktops, monitors and phones, priced in Kenyan shillings. Questions? Chat with us on <a href={WHATSAPP_URL} rel="noreferrer">WhatsApp: {WHATSAPP_DISPLAY}</a>.</p></div>
        <nav aria-label="Explore"><Link href="/#collection">The collection</Link><Link href="/compare">Compare devices</Link></nav>
        <nav aria-label="Shopping help"><Link href="/#shopping-help">Shopping questions</Link><Link href="/#shopping-help">Delivery & returns</Link></nav>
      </div>
      <div className="wrap footer-row">
        <span>© {new Date().getFullYear()} Zero Gravity Tech. Order on WhatsApp. Availability and delivery confirmed in chat.</span>
        <nav aria-label="Footer">
          <Link href="/">Shop</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/image-credits">Image credits</Link>
        </nav>
      </div>
    </footer>
  );
}
