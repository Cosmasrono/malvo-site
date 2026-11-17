import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Only product photos and the logo can be resized, which limits abuse of the optimizer.
    localPatterns: [
      { pathname: "/products/**", search: "" },
      { pathname: "/brand/**", search: "" },
    ],
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: false,
    minimumCacheTTL: 86400,
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/", permanent: false },
      { source: "/shop/laptops", destination: "/?category=laptops", permanent: false },
      { source: "/shop/phones", destination: "/?category=phones", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
