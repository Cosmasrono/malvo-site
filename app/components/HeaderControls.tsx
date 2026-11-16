"use client";

import { useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { Home, LayoutGrid, MessageCircle, Search, ShoppingBag } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../context/StoreContext";
import { WHATSAPP_URL } from "../lib/whatsapp";

export function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return <header className={scrolled || pathname !== "/" ? "header solid" : "header"}>{children}</header>;
}

export function HeaderSearch() {
  const router = useRouter();
  const q = useSearchParams().get("q") ?? "";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    const text = typeof value === "string" ? value.trim().slice(0, 80) : "";
    router.push(text ? `/?q=${encodeURIComponent(text)}#collection` : "/#collection");
  };

  return (
    <form className="site-search" role="search" onSubmit={onSubmit}>
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <input key={q} id="site-search" name="q" type="search" maxLength={80} defaultValue={q} placeholder="Search laptops, monitors, phones" />
      <button type="submit" aria-label="Search">
        <Search size={19} aria-hidden="true" />
      </button>
    </form>
  );
}

const SECTIONS = [
  { key: "", label: "All products" },
  { key: "laptops", label: "Laptops" },
  { key: "desktops", label: "Desktops" },
  { key: "monitors", label: "Monitors" },
  { key: "phones", label: "Phones" },
];

/** How much of the top of the screen the pinned header or menu strip covers. */
function coveredTop() {
  let covered = 0;
  for (const el of document.querySelectorAll<HTMLElement>(".header, .nav-strip")) {
    const style = getComputedStyle(el);
    if (style.position === "sticky" || style.position === "fixed") {
      covered = Math.max(covered, el.offsetHeight + (parseFloat(style.top) || 0));
    }
  }
  return covered;
}

/** Glides the products section into view, up or down, once the list has re-rendered. */
export function scrollToCollection() {
  setTimeout(() => {
    const section = document.getElementById("collection");
    if (!section) return;
    const targetY = () => Math.max(0, section.getBoundingClientRect().top + window.scrollY - coveredTop());
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: targetY(), behavior: reduce ? "instant" : "smooth" });
    // Some phones skip or interrupt smooth scrolling; make sure the page still ends up on the products.
    setTimeout(() => {
      const target = targetY();
      if (Math.abs(window.scrollY - target) > 4) window.scrollTo({ top: target, behavior: "instant" });
    }, 900);
  }, 80);
}

export function MainNav() {
  const pathname = usePathname();
  const category = useSearchParams().get("category");
  const isHome = pathname === "/";

  const go = (event: MouseEvent<HTMLAnchorElement>, key: string) => {
    // On another page the link loads the home page and its #collection anchor does the work.
    if (!isHome || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    // Same as the sidebar: change the URL in place so the list updates without reloading.
    window.history.replaceState(null, "", key ? `/?category=${key}` : "/");
    scrollToCollection();
  };

  return (
    <nav className="nav" aria-label="Main">
      {SECTIONS.map((s) => (
        <Link
          key={s.label}
          href={s.key ? `/?category=${s.key}#collection` : "/#collection"}
          aria-current={isHome && (category ?? "") === s.key ? "page" : undefined}
          onClick={(event) => go(event, s.key)}
        >
          {s.label}
        </Link>
      ))}
      <Link href="/compare" aria-current={pathname === "/compare" ? "page" : undefined}>
        Compare
      </Link>
    </nav>
  );
}

export function CartButton() {
  const { count, setCartOpen } = useStore();
  return (
    <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}>
      <ShoppingBag size={18} aria-hidden="true" /><span>Cart</span>
      <b key={count} className="cart-count">
        {count}
      </b>
    </button>
  );
}

export function MobileBar() {
  const { count, setCartOpen } = useStore();
  return (
    <nav className="mobile-bar" aria-label="Quick links">
      <Link href="/">
        <Home size={20} aria-hidden="true" />
        Home
      </Link>
      <Link href="/#collection">
        <LayoutGrid size={20} aria-hidden="true" />
        Shop
      </Link>
      <a href={WHATSAPP_URL} rel="noreferrer">
        <MessageCircle size={20} aria-hidden="true" />
        WhatsApp
      </a>
      <button onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}>
        <ShoppingBag size={20} aria-hidden="true" />
        Cart{count > 0 && <b>{count}</b>}
      </button>
    </nav>
  );
}
