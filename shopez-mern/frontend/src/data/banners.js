export const BANNERS = [
  {
    id: 1,
    title: "Big Billion Days Sale",
    subtitle: "Up to 80% off on Electronics & Fashion",
    bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
    accent: "#e94560",
    emoji: "⚡",
    promo: { type: "big-billion", categories: ["electronics", "fashion"], minDiscount: 30, title: "Big Billion Days Sale" },
  },
  {
    id: 2,
    title: "Fashion Week Fiesta",
    subtitle: "Trendy styles starting ₹299 • Free delivery",
    bg: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
    accent: "#ffd700",
    emoji: "👗",
    promo: { type: "fashion-week", categories: ["fashion"], minDiscount: 20, tags: ["trending"], title: "Fashion Week Fiesta" },
  },
  {
    id: 3,
    title: "Home Makeover Sale",
    subtitle: "Transform your space and save big today!",
    bg: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)",
    accent: "#fff",
    emoji: "🏠",
    promo: { type: "home-makeover", categories: ["home"], minDiscount: 25, title: "Home Makeover Sale" },
  },
];
