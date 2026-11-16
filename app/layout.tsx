import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { StoreProvider } from "./context/StoreContext";
import { CURRENCY_COOKIE, isCurrency } from "./lib/currency";
import { SITE_NAME, SITE_URL } from "./lib/site";
import "./globals.css";

const inter = Inter({ variable: "--f-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Zero Gravity Tech: laptops, desktops, monitors and phones", template: `%s | ${SITE_NAME}` },
  description: "Laptops, desktops, monitors and phones, priced in Kenyan shillings.",
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const saved = (await cookies()).get(CURRENCY_COOKIE)?.value;

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <StoreProvider initialCurrency={isCurrency(saved) ? saved : "KES"}>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
