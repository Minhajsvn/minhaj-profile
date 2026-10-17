export const profile = {
  name: "Mohammad Minhaj",
  firstName: "Minhaj",
  role: "Full-Stack Developer",
  location: "Dubai, UAE",
  email: "minhajrafeeq7@gmail.com",
  whatsapp: "971509572939",
  cv: "/Mohammad_Minhaj_Resume.pdf",
  summary:
    "Full-Stack Developer in Dubai building Shopify stores and apps, Next.js and React websites, and Node.js backends for jewellery, precious-metals and real estate brands across the UAE and GCC.",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/Minhajsvn" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mohammadminhaj" },
];

export const clients = [
  "Blue Diamond Jewellery",
  "Faqeesh Jewelry",
  "Kiora Gold & Diamonds",
  "Dyra Diamonds",
  "Promise Gold Refinery",
  "MAC & RO Capital",
  "SiraMamba Refinery",
  "Aurify Technology",
  "Insight Edge Global",
  "Sulthan Bullion",
];

export const stats = [
  { value: "20+", label: "Production projects shipped" },
  { value: "~2 yrs", label: "Building for UAE & GCC clients" },
  { value: "9", label: "Brands in jewellery & bullion" },
];

export type ServiceIcon = "store" | "layout" | "server" | "search";

export const services: { icon: ServiceIcon; title: string; body: string }[] = [
  {
    icon: "store",
    title: "Shopify Stores & Apps",
    body: "Custom Liquid themes, Online Store 2.0 sections and embedded apps on the Admin GraphQL API.",
  },
  {
    icon: "layout",
    title: "Web Apps & Websites",
    body: "Fast, responsive Next.js and React builds turned pixel-true from Figma, in English and Arabic.",
  },
  {
    icon: "server",
    title: "Backends & Real-time",
    body: "Node.js APIs, PostgreSQL and serverless Workers, plus live price feeds over WebSockets.",
  },
  {
    icon: "search",
    title: "SEO & Analytics",
    body: "Metadata, JSON-LD, sitemaps and prerendering, with GTM, GA and Meta Pixel wired in.",
  },
];

export const experience = [
  {
    role: "Full-Stack Developer · Shopify Developer",
    company: "3R Creative",
    place: "Dubai, UAE (Remote)",
    period: "May 2025 — Present",
    points: [
      "Delivered 20+ production websites, Shopify stores and web apps while running 2–3 client projects at a time.",
      "Launched Shopify stores for 4 jewellery brands with multi-currency markets, mega menus, filters and wishlists.",
      "Built automated variant repricing from live gold rates, purity and weight for Faqeesh Jewelry.",
      "Shipped SEO-ready sites for 5 precious-metals firms with live gold feeds, TradingView charts and JSON-LD.",
      "Mentored junior developers and ran code reviews to raise release quality.",
    ],
  },
  {
    role: "Freelance Frontend Developer",
    company: "Sulthan Bullion International",
    place: "Jewellery Trading",
    period: "Nov 2023 — Feb 2024",
    points: ["Launched a responsive 5-page website showing live gold rates in AED and USD from a REST rates API."],
  },
];

export const education = [
  {
    title: "Bachelor of Computer Applications (AI)",
    org: "Yeldo Mar Baselios College, Kochi",
    period: "2020 — 2023",
  },
  { title: "Fellowship in Full Stack Development", org: "Crio.Do", period: "" },
];

export const skills = [
  {
    group: "Frontend",
    items: ["TypeScript", "React", "Next.js", "React Router", "Redux Toolkit", "Tailwind CSS", "GSAP", "Framer Motion", "i18next (RTL)"],
  },
  {
    group: "Shopify",
    items: ["Liquid", "Online Store 2.0", "Polaris", "App Bridge", "Theme App Extensions", "Admin GraphQL", "Bulk Operations", "Metafields", "Markets"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Prisma", "MongoDB", "Socket.IO", "Cloudflare Workers", "Resend"],
  },
  {
    group: "DevOps & SEO",
    items: ["AWS Lightsail", "nginx", "PM2", "Vercel", "Turborepo", "JSON-LD", "Sitemaps", "GTM / GA", "Figma"],
  },
];
