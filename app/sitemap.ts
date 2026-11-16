import type { MetadataRoute } from "next";
import { PRODUCTS } from "./data/products";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/compare", ...PRODUCTS.map((p) => `/product/${p.id}`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
