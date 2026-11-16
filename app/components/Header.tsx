import { Suspense } from "react";
import Link from "next/link";
import { MessageCircle, Banknote } from "lucide-react";
import { CartButton, HeaderSearch, HeaderShell, MainNav, MobileBar } from "./HeaderControls";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "../lib/whatsapp";

export default function Header() {
  return (
    <>
      <div className="topbar">
        <div className="wrap topbar-row">
          <p>
            <MessageCircle size={15} aria-hidden="true" />
            <span>
              Order on WhatsApp: <a href={WHATSAPP_URL} rel="noreferrer">{WHATSAPP_DISPLAY}</a>
            </span>
          </p>
          <p>
            <Banknote size={15} aria-hidden="true" />
            <span>All prices in Kenyan shillings</span>
          </p>
        </div>
      </div>
      <HeaderShell>
        <div className="wrap header-row">
          <Link className="logo" href="/" aria-label="Zero Gravity Tech home">
            Zero Gravity<span> Tech</span>
          </Link>
          <Suspense>
            <HeaderSearch />
          </Suspense>
          <CartButton />
        </div>
        <div className="nav-strip">
          <div className="wrap">
            <Suspense>
              <MainNav />
            </Suspense>
          </div>
        </div>
      </HeaderShell>
      <MobileBar />
    </>
  );
}
