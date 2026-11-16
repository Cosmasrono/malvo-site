# Zero Gravity Tech

Storefront for flagship laptops and phones, built with Next.js 16 and React 19.

## Run it

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `STORE_COUPONS` | Discount codes as `CODE:PERCENT`, comma separated. Server only. |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links and the sitemap. Set it before building. |

## How it fits together

- Pages are server-rendered. Home page search, filters and sorting update instantly and stay in the URL.
- `app/data/products.ts` is the catalog: prices, stock, variants and specs.
- `POST /api/quote` validates discount codes. `POST /api/orders` validates and reprices an order, then prepares a WhatsApp message.
  Neither trusts a price sent by the browser. See `app/lib/server/`.
- `proxy.ts` sets a per-request Content-Security-Policy. Other security headers are in `next.config.ts`.

## WhatsApp checkout

Checkout opens a prepared order message to 0725 830 546 (+254 725 830 546). The customer must tap
Send in WhatsApp. The message includes products, options, quantities, validated prices, discounts
and delivery details. Availability, delivery charges and payment are confirmed in chat.

The site does not charge payments, store orders or confirm that a WhatsApp message was sent.
The cart stays saved when WhatsApp opens. The recipient is configured in `app/lib/whatsapp.ts`.
Use a shared rate-limit store if the site runs on more than one server.
