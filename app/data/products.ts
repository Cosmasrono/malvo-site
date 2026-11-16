export interface ProductSpec {
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphicsOrCamera: string;
  battery: string;
  os: string;
  weightOrBuild: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface StorageOption {
  label: string;
  /** Added to the base price, in USD. */
  extra: number;
}

export interface Product {
  id: string;
  name: string;
  brand: "Apple" | "Samsung" | "ASUS" | "Dell" | "Google" | "Razer" | "HP";
  category: "laptop" | "phone" | "desktop" | "monitor";
  /** In Kenyan shillings. */
  price: number;
  originalPrice: number;
  image: string;
  imageAlt: string;
  inStock: boolean;
  stockCount: number;
  colors: ProductColor[];
  storage: StorageOption[];
  /** One line shown on product cards and in the price list. */
  headline: string;
  description: string;
  specs: ProductSpec;
  keyFeatures: string[];
  /** Extra photos for the product page, including the main image. */
  gallery?: string[];
  /** Replaces the standard spec rows, for products such as monitors. */
  customSpecs?: [string, string][];
  /** Listed, but cannot be bought until a price is set. */
  priceSoon?: boolean;
}

const NOT_LISTED = "Not listed";
const NO_SPECS: ProductSpec = {
  processor: "",
  ram: "",
  storage: "",
  display: "",
  graphicsOrCamera: "",
  battery: "",
  os: "",
  weightOrBuild: "",
};

const STOCK_ITEMS: Product[] = [
  {
    id: "dell-p2726deb",
    name: "Dell 27-inch 2K Monitor",
    brand: "Dell",
    category: "monitor",
    price: 20000,
    originalPrice: 20000,
    image: "/products/dell-p2726deb-front.jpg",
    imageAlt: "Dell 27-inch monitor on its stand, showing a sports car on screen",
    gallery: [
      "/products/dell-p2726deb-front.jpg",
      "/products/dell-p2726deb-portrait.jpg",
      "/products/dell-p2726deb-ports.jpg",
      "/products/dell-p2726deb-back.jpg",
    ],
    inStock: true,
    stockCount: 10,
    colors: [{ name: "Black and silver", hex: "#2b2d31" }],
    storage: [{ label: "27-inch", extra: 0 }],
    headline: "2560 x 1440, daisy chaining, rotatable stand",
    description: "A 27-inch 2K display with daisy chaining and a stand that rotates into portrait.",
    specs: NO_SPECS,
    customSpecs: [
      ["Model", "P2726DEB"],
      ["Screen size", "27 inch"],
      ["Resolution", "2K (2560 x 1440)"],
      ["Daisy chaining", "Available"],
      ["Video ports", "2 DisplayPort (in and out), Mini DP, HDMI"],
      ["USB", "USB upstream and USB ports"],
      ["Stand", "Rotatable"],
    ],
    keyFeatures: ["Daisy chain more than one display", "Rotates into portrait", "DisplayPort in and out"],
  },
  {
    id: "hp-elitebook-x360-1040-g10",
    name: "HP EliteBook x360 1040 G10",
    brand: "HP",
    category: "laptop",
    price: 71999,
    originalPrice: 71999,
    image: "/products/hp-x360-reference.webp",
    imageAlt: "Illustrative photo of a silver HP EliteBook x360 1020 G2; actual 1040 G10 model may differ",
    inStock: true,
    stockCount: 10,
    colors: [{ name: "Standard", hex: "#2b2d31" }],
    storage: [{ label: "256GB SSD", extra: 0 }],
    headline: "Core i7-1355U, 16GB DDR5, 14-inch touch",
    description: "A 2-in-1 business laptop with a touchscreen that folds all the way round. Condition: perfect.",
    specs: {
      processor: "Intel Core i7-1355U, 10 cores / 12 threads",
      ram: "16GB DDR5",
      storage: "256GB SSD",
      display: "14 inch, 1920 x 1200, touchscreen, x360",
      graphicsOrCamera: NOT_LISTED,
      battery: "Perfect",
      os: NOT_LISTED,
      weightOrBuild: NOT_LISTED,
    },
    keyFeatures: ["2-in-1 x360 hinge", "Touchscreen", "Condition: perfect"],
  },
  {
    id: "hp-745-g5",
    name: "HP 745 G5",
    brand: "HP",
    category: "laptop",
    price: 28000,
    originalPrice: 28000,
    image: "/products/hp-elitebook-reference.webp",
    imageAlt: "Illustrative photo of a silver HP EliteBook 850 G5; actual 745 G5 model may differ",
    inStock: true,
    stockCount: 10,
    colors: [{ name: "Standard", hex: "#2b2d31" }],
    storage: [{ label: "256GB SSD", extra: 0 }],
    headline: "AMD Ryzen 5, 8GB RAM, 2GB AMD graphics",
    description: "A 14-inch AMD Ryzen 5 laptop with dedicated graphics. Comes with a free sleeve bag.",
    specs: {
      processor: "AMD Ryzen 5",
      ram: "8GB",
      storage: "256GB SSD",
      display: "14 inch",
      graphicsOrCamera: "2GB AMD dedicated graphics",
      battery: NOT_LISTED,
      os: NOT_LISTED,
      weightOrBuild: NOT_LISTED,
    },
    keyFeatures: ["Free sleeve bag", "Dedicated AMD graphics", "Price is fixed"],
  },
  {
    id: "hp-elitedesk-mini",
    name: "HP EliteDesk Mini PC",
    brand: "HP",
    category: "desktop",
    price: 0,
    originalPrice: 0,
    priceSoon: true,
    image: "/products/hp-elitedesk-stack.jpg",
    imageAlt: "Five HP EliteDesk mini PCs stacked on a wooden table",
    gallery: [
      "/products/hp-elitedesk-stack.jpg",
      "/products/hp-elitedesk-front.jpg",
      "/products/hp-elitedesk-rear-stack.jpg",
      "/products/hp-elitedesk-rear.jpg",
    ],
    inStock: false,
    stockCount: 0,
    colors: [{ name: "Standard", hex: "#2b2d31" }],
    storage: [{ label: "Standard", extra: 0 }],
    headline: "Compact business desktop",
    description: "A small HP business desktop with plenty of ports. Full specifications and pricing are not listed.",
    specs: NO_SPECS,
    customSpecs: [
      ["Front ports", "USB-C, 2 USB-A, headset and microphone jacks"],
      ["Rear ports", "3 DisplayPort, 4 USB-A, Ethernet"],
    ],
    keyFeatures: ["Small enough to sit behind a monitor", "Three DisplayPort outputs", "USB-C on the front"],
  },
];

const SAMPLE_ITEMS_USD: Product[] = [
  {
    id: "macbook-pro-16-m4max",
    name: "MacBook Pro 16\" M4 Max",
    brand: "Apple",
    category: "laptop",
    price: 3499,
    originalPrice: 3899,
    image: "/products/macbook-pro.jpg",
    imageAlt: "MacBook Pro 16-inch, open on a dark glass surface",
    inStock: true,
    stockCount: 14,
    colors: [
      { name: "Space Black", hex: "#1f232b" },
      { name: "Silver", hex: "#e2e8f0" },
    ],
    storage: [
      { label: "1TB", extra: 0 },
      { label: "2TB", extra: 400 },
      { label: "4TB", extra: 1000 },
      { label: "8TB", extra: 2200 },
    ],
    headline: "16-core CPU, 40-core GPU, 64GB memory",
    description:
      "The laptop to buy if your work is 8K timelines, large 3D scenes or local machine learning. It holds full speed on battery, which most Windows workstations can't do.",
    specs: {
      processor: "Apple M4 Max, 16-core CPU (12 performance, 4 efficiency)",
      ram: "64GB unified memory, 546GB/s",
      storage: "1TB to 8TB SSD",
      display: "16.2\" Liquid Retina XDR, 3456 x 2234, 120Hz, 1600 nits peak HDR",
      graphicsOrCamera: "40-core GPU with hardware ray tracing, 16-core Neural Engine",
      battery: "100Wh, up to 21 hours video, 140W MagSafe 3",
      os: "macOS",
      weightOrBuild: "2.16 kg, aluminum",
    },
    keyFeatures: [
      "Three Thunderbolt 5 ports, HDMI, SDXC and MagSafe 3",
      "Six-speaker sound system with force-cancelling woofers",
      "Three-mic array with directional beamforming",
    ],
  },
  {
    id: "rog-zephyrus-g16-2025",
    name: "ASUS ROG Zephyrus G16 OLED",
    brand: "ASUS",
    category: "laptop",
    price: 2899,
    originalPrice: 3299,
    image: "/products/rog-zephyrus.jpg",
    imageAlt: "ASUS ROG Zephyrus G16 gaming laptop, seen from the side",
    inStock: true,
    stockCount: 9,
    colors: [
      { name: "Eclipse Gray", hex: "#2b2d35" },
      { name: "Platinum White", hex: "#f1f5f9" },
    ],
    storage: [
      { label: "1TB", extra: 0 },
      { label: "2TB", extra: 180 },
      { label: "4TB", extra: 480 },
    ],
    headline: "Ryzen AI 9 HX 370, RTX 4070, 240Hz OLED",
    description:
      "A gaming laptop you can take into a meeting. At 1.85 kg and under 15 mm thick, it's one of the lightest ways to get a 240Hz OLED panel.",
    specs: {
      processor: "AMD Ryzen AI 9 HX 370, 12 cores / 24 threads, up to 5.1GHz",
      ram: "32GB LPDDR5X 7500MHz",
      storage: "1TB to 4TB PCIe 4.0 NVMe",
      display: "16\" 2560 x 1600 ROG Nebula OLED, 240Hz, 0.2ms, G-Sync",
      graphicsOrCamera: "NVIDIA GeForce RTX 4070 8GB GDDR6",
      battery: "90Wh, 200W adapter, 100W USB-C charging",
      os: "Windows 11 Pro",
      weightOrBuild: "1.85 kg, CNC aluminum",
    },
    keyFeatures: [
      "Programmable Slash Lighting on the lid",
      "Vapor chamber with Arc Flow fans",
      "Wi-Fi 7",
    ],
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "phone",
    price: 1399,
    originalPrice: 1549,
    image: "/products/iphone-16-pro.jpg",
    imageAlt: "iPhone 16 Pro Max, front and back",
    inStock: true,
    stockCount: 38,
    colors: [
      { name: "Desert Titanium", hex: "#c5b39e" },
      { name: "Natural Titanium", hex: "#9e9a93" },
      { name: "Black Titanium", hex: "#22252a" },
      { name: "White Titanium", hex: "#e5e7eb" },
    ],
    storage: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 200 },
      { label: "1TB", extra: 400 },
    ],
    headline: "A18 Pro, 6.9\" display, 5x telephoto",
    description:
      "The longest battery life of any iPhone, plus 4K 120fps video that holds up next to a dedicated camera.",
    specs: {
      processor: "Apple A18 Pro, 6-core CPU, 6-core GPU",
      ram: "8GB",
      storage: "256GB to 1TB",
      display: "6.9\" Super Retina XDR OLED, 2868 x 1320, 1-120Hz, 2000 nits peak",
      graphicsOrCamera: "48MP main, 48MP ultra wide, 12MP 5x telephoto",
      battery: "Up to 33 hours video, 25W MagSafe, USB-C",
      os: "iOS",
      weightOrBuild: "227 g, titanium frame, Ceramic Shield",
    },
    keyFeatures: [
      "Camera Control button for zoom and exposure",
      "ProRes 4K at 120fps to external storage",
      "Action button you can assign to camera, shortcuts or flashlight",
    ],
  },
  {
    id: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    category: "phone",
    price: 1349,
    originalPrice: 1499,
    image: "/products/galaxy-ultra.jpg",
    imageAlt: "Samsung Galaxy S25 Ultra with S Pen",
    inStock: true,
    stockCount: 22,
    colors: [
      { name: "Titanium Black", hex: "#1c1e22" },
      { name: "Titanium Silver", hex: "#c9cbce" },
      { name: "Titanium Blue", hex: "#3b556e" },
    ],
    storage: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 120 },
      { label: "1TB", extra: 360 },
    ],
    headline: "Snapdragon 8 Elite, 200MP camera, S Pen",
    description:
      "The anti-reflective screen is the reason to choose this one: it stays readable in direct sun when most phones wash out. Seven years of updates means you can keep it.",
    specs: {
      processor: "Qualcomm Snapdragon 8 Elite for Galaxy, up to 4.47GHz",
      ram: "12GB LPDDR5X",
      storage: "256GB to 1TB UFS 4.0",
      display: "6.8\" Dynamic AMOLED 2X, 3120 x 1440, 1-120Hz, 2600 nits peak",
      graphicsOrCamera: "200MP main, 50MP 5x, 10MP 3x, 50MP ultra wide",
      battery: "5000 mAh, 45W wired, 15W wireless",
      os: "Android with One UI, seven years of OS updates",
      weightOrBuild: "218 g, titanium frame, IP68",
    },
    keyFeatures: [
      "Built-in S Pen",
      "Corning Gorilla Armor 2 anti-reflective glass",
      "Two optical telephoto lenses, 3x and 5x",
    ],
  },
  {
    id: "dell-xps-16-9640",
    name: "Dell XPS 16 (9640)",
    brand: "Dell",
    category: "laptop",
    price: 2499,
    originalPrice: 2899,
    image: "/products/dell-xps.jpg",
    imageAlt: "Dell XPS 16 on a desk by a window",
    inStock: true,
    stockCount: 8,
    colors: [
      { name: "Graphite", hex: "#292a2e" },
      { name: "Platinum", hex: "#e5e7eb" },
    ],
    storage: [
      { label: "1TB", extra: 0 },
      { label: "2TB", extra: 220 },
      { label: "4TB", extra: 560 },
    ],
    headline: "Core Ultra 9, RTX 4070, 4K+ OLED touch",
    description:
      "A quiet-looking Windows laptop with enough graphics power for video work and a touchscreen that's better than it needs to be.",
    specs: {
      processor: "Intel Core Ultra 9 185H, 16 cores / 22 threads, up to 5.1GHz",
      ram: "32GB LPDDR5X 7467MHz",
      storage: "1TB to 4TB PCIe 4.0 NVMe",
      display: "16.3\" 3840 x 2400 OLED touch, 90Hz, 100% DCI-P3",
      graphicsOrCamera: "NVIDIA GeForce RTX 4070 8GB GDDR6",
      battery: "99.5Wh, 130W USB-C",
      os: "Windows 11 Pro",
      weightOrBuild: "2.13 kg, CNC aluminum and Gorilla Glass",
    },
    keyFeatures: [
      "Edge-to-edge glass palm rest with a haptic touchpad",
      "Capacitive function row",
      "Thunderbolt 4 at 40Gbps",
    ],
  },
  {
    id: "razer-blade-16-dual-mode",
    name: "Razer Blade 16 Dual Mini-LED",
    brand: "Razer",
    category: "laptop",
    price: 3699,
    originalPrice: 4099,
    image: "/products/razer-blade.jpg",
    imageAlt: "Razer Blade 16 laptop showing a game on screen",
    inStock: true,
    stockCount: 6,
    colors: [{ name: "Matte Black", hex: "#141517" }],
    storage: [
      { label: "2TB", extra: 0 },
      { label: "4TB", extra: 320 },
      { label: "8TB", extra: 900 },
    ],
    headline: "Core i9, RTX 4090, 4K 120Hz or FHD+ 240Hz",
    description:
      "One screen, two native modes: 4K at 120Hz for creative work, FHD+ at 240Hz for competitive games. The RTX 4090 runs at its full 175W.",
    specs: {
      processor: "Intel Core i9-13950HX, 24 cores / 32 threads, up to 5.5GHz",
      ram: "32GB DDR5 5600MHz, upgradable",
      storage: "2TB to 8TB PCIe 4.0 NVMe, two M.2 slots",
      display: "16\" dual-mode Mini-LED, 4K 120Hz or FHD+ 240Hz, 1000 nits HDR",
      graphicsOrCamera: "NVIDIA GeForce RTX 4090 16GB GDDR6, 175W",
      battery: "95.2Wh, 330W GaN adapter",
      os: "Windows 11 Home",
      weightOrBuild: "2.45 kg, anodized aluminum",
    },
    keyFeatures: [
      "Switch display modes in Razer Synapse",
      "Per-key Chroma RGB keyboard",
      "Vapor chamber cooling",
    ],
  },
  {
    id: "pixel-9-pro-xl",
    name: "Google Pixel 9 Pro XL",
    brand: "Google",
    category: "phone",
    price: 1099,
    originalPrice: 1249,
    image: "/products/pixel-pro.jpg",
    imageAlt: "Google Pixel 9 Pro XL resting on dark stone",
    inStock: true,
    stockCount: 19,
    colors: [
      { name: "Hazel", hex: "#7a8277" },
      { name: "Obsidian", hex: "#222428" },
      { name: "Porcelain", hex: "#f3f0e8" },
      { name: "Rose Quartz", hex: "#e8ccd3" },
    ],
    storage: [
      { label: "128GB", extra: 0 },
      { label: "256GB", extra: 100 },
      { label: "512GB", extra: 220 },
      { label: "1TB", extra: 460 },
    ],
    headline: "Tensor G4, 16GB memory, 5x telephoto",
    description:
      "The easiest phone here for taking good photos without thinking about it. The on-device Gemini features are useful, and Google supports it for seven years.",
    specs: {
      processor: "Google Tensor G4 with Titan M2 security chip",
      ram: "16GB LPDDR5X",
      storage: "128GB to 1TB",
      display: "6.8\" Super Actua LTPO OLED, 2992 x 1344, 1-120Hz, 3000 nits peak",
      graphicsOrCamera: "50MP main, 48MP ultra wide, 48MP 5x telephoto",
      battery: "5060 mAh, 37W wired, Qi wireless",
      os: "Android, seven years of OS updates",
      weightOrBuild: "221 g, matte glass and metal, IP68",
    },
    keyFeatures: [
      "42MP autofocus front camera",
      "Add Me merges two group shots",
      "Satellite SOS in supported countries",
    ],
  },
  {
    id: "galaxy-z-fold6",
    name: "Samsung Galaxy Z Fold6",
    brand: "Samsung",
    category: "phone",
    price: 1899,
    originalPrice: 2199,
    image: "/products/galaxy-z-fold.jpg",
    imageAlt: "Samsung Galaxy Z Fold6, unfolded",
    inStock: true,
    stockCount: 11,
    colors: [
      { name: "Silver Shadow", hex: "#bcbfc4" },
      { name: "Navy", hex: "#1f2d42" },
      { name: "Crafted Black", hex: "#1a1a1a" },
    ],
    storage: [
      { label: "256GB", extra: 0 },
      { label: "512GB", extra: 120 },
      { label: "1TB", extra: 360 },
    ],
    headline: "Snapdragon 8 Gen 3, 7.6\" folding display",
    description:
      "A phone that opens into a small tablet. Three apps side by side is a real way to work, and at 239 g it no longer feels like a compromise in the pocket.",
    specs: {
      processor: "Qualcomm Snapdragon 8 Gen 3 for Galaxy",
      ram: "12GB LPDDR5X",
      storage: "256GB to 1TB UFS 4.0",
      display: "Main 7.6\" 2160 x 1856 Dynamic AMOLED 2X, cover 6.3\" AMOLED",
      graphicsOrCamera: "50MP main, 10MP 3x telephoto, 12MP ultra wide",
      battery: "4400 mAh dual cell, 25W wired, fast wireless",
      os: "Android with One UI 6.1.1 at launch",
      weightOrBuild: "239 g, Armor Aluminum, Gorilla Glass Victus 2",
    },
    keyFeatures: [
      "Flex Mode for hands-free camera and calls",
      "S Pen Fold Edition support, sold separately",
      "IP48 water resistance",
    ],
  },
];

// Placeholder conversion for the sample items, which are not real stock.
const SAMPLE_KES_PER_USD = 130;
const sampleInKes = (product: Product): Product => ({
  ...product,
  price: product.price * SAMPLE_KES_PER_USD,
  originalPrice: product.originalPrice * SAMPLE_KES_PER_USD,
  storage: product.storage.map((s) => ({ ...s, extra: s.extra * SAMPLE_KES_PER_USD })),
});

export const PRODUCTS: Product[] = [...STOCK_ITEMS, ...SAMPLE_ITEMS_USD.map(sampleInKes)];

export function findProduct(id: unknown): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export const BRANDS = [...new Set(PRODUCTS.map((product) => product.brand))];
