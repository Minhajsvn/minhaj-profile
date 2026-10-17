export type Category = "shopify" | "web" | "app";

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shopify", label: "Shopify" },
  { id: "web", label: "Websites" },
  { id: "app", label: "Apps & platforms" },
];

/** A highlight is a sentence, optionally followed by a short sub-list. */
export type Highlight = string | { text: string; sub: string[] };

export type CaseStudy = {
  problem: string;
  solution: string;
  architecture: { part: string; stack: string; does: string }[];
  engineering: { title: string; body: string }[];
  numbers: { value: string; label: string }[];
  phases: string[];
};

export type Project = {
  slug: string;
  title: string;
  type: string;
  category: Category;
  summary: string;
  tags: string[];
  highlights: Highlight[];
  meta?: string;
  featured?: boolean;
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "live-rate-app",
    title: "Live Rate App",
    type: "Real-time gold & silver pricing for Shopify jewellery stores",
    category: "app",
    featured: true,
    meta: "Sole engineer · Sep – Oct 2026 · Production-ready, rolling out to a pilot store",
    summary:
      "A Shopify app that keeps jewellery prices in step with live gold and silver markets. It prices each product from weight, karat, making charges and stones, previews every change in a dry run, writes approved prices to the catalog, and updates customers' open pages in real time.",
    tags: ["TypeScript", "React Router 7", "Polaris", "App Bridge", "Node.js 22", "Admin GraphQL", "Prisma", "PostgreSQL", "Socket.IO", "Liquid", "AWS Lightsail", "nginx", "PM2", "Resend"],
    highlights: [
      "Prices every product from metal, weight, karat or purity, making charge, diamonds and stones, plus the store's premium and margin.",
      "Writes prices straight to the Shopify catalog so storefront, cart and checkout always match on non-Plus plans.",
      "Dry-run-first sync engine with approval holds on moves over 10% and CSV plans for client sign-off.",
      "Live storefront updates on any theme through the Section Rendering API, including re-pricing open carts.",
      "AES-256-GCM token encryption, GDPR webhooks, minute-by-minute alerts and nightly backups.",
    ],
    caseStudy: {
      problem:
        "Jewellery stores in the UAE have to reprice their whole catalog every time gold and silver move. Gold jewellery follows the daily Dubai Jewellery Group (DJG) retail rate per karat; bullion and silver follow the live international market. On non-Plus Shopify plans checkout always charges the catalog price — so if the storefront shows one price and the catalog holds another, customers are charged the wrong amount.",
      solution:
        "An embedded Shopify app that prices every product from its metal, weight, karat or purity, making charge, diamonds and stones, plus the store's premium and margin — and writes those prices straight to the catalog. Storefront, cart and checkout always agree, and visitors' open pages update live without reloading.",
      architecture: [
        {
          part: "Shopify embedded app",
          stack: "React Router 7 · Polaris · App Bridge",
          does: "OAuth install, admin screens for rates, settings, product fields, price preview and sync, plus webhooks and scheduled jobs.",
        },
        {
          part: "@live-rate/pricing",
          stack: "Pure TypeScript",
          does: "The pricing engine — no I/O, fully tested, and the only place the pricing formulas live.",
        },
        {
          part: "Rate hub",
          stack: "Node.js · Socket.IO",
          does: "Holds one upstream market-feed connection and fans live rates out to every storefront in a room per store, with authenticated internal endpoints.",
        },
        {
          part: "Theme app extension",
          stack: "Liquid · JavaScript",
          does: "A live rate bar and in-page price updates that work with any theme.",
        },
      ],
      engineering: [
        {
          title: "Safe sync, dry run first",
          body: "Every change is planned and sorted into change, held (moves over 10%), can't be priced (with the reason), unchanged or not live-priced. Every run is recorded, and clients sign off a CSV of the plan before live mode can be enabled. A product with a missing input is skipped — never priced from a guess.",
        },
        {
          title: "Bulk catalog handling",
          body: "Bulk Operations build a local cache of every variant, kept current by product webhooks and fully reloaded nightly. Prices are written with productVariantsBulkUpdate, up to 100 variants per call, with backoff when throttled — one rejected product never blocks the rest.",
        },
        {
          title: "Market-aware scheduling",
          body: "Bullion and silver re-sync every few minutes while the market trades and once more at the close, only from ticks under two minutes old. Jewellery re-syncs whenever new DJG rates are published.",
        },
        {
          title: "Live updates on any theme",
          body: "The storefront script re-renders only affected sections through the Section Rendering API, in the visitor's currency, and swaps just the changed numbers. Setting and clearing a hidden cart attribute forces Shopify to re-price cached carts.",
        },
        {
          title: "Security",
          body: "Access and refresh tokens are encrypted at rest with AES-256-GCM in a versioned format that migrates old plaintext tokens. Mandatory GDPR webhooks are handled, internal endpoints use bearer keys, and only ports 22, 80 and 443 are open.",
        },
        {
          title: "Auditable rate history",
          body: "DJG rates go through a validated API that checks every karat is present, ordered and sane, warning on moves over 5%. Rate sets are append-only, so they can be audited and rolled back.",
        },
        {
          title: "Operations",
          body: "Alerts are checked every minute and emailed on open and clear — hub down, stale prices, sync or write failures, and held prices awaiting approval.",
        },
        {
          title: "Production",
          body: "One Lightsail instance runs the app, hub and PostgreSQL behind nginx with TLS, managed by PM2 with nightly backups and one-command updates. Includes a deploy guide, rollout runbook and Shopify app review pack.",
        },
      ],
      numbers: [
        { value: "~7.2k", label: "Lines of TS, TSX & Liquid" },
        { value: "13", label: "Test files" },
        { value: "5", label: "Prisma migrations" },
        { value: "100", label: "Variants per write call" },
      ],
      phases: ["Foundation", "Dry-run sync", "Live pilot", "Production rollout"],
    },
  },

  // ——— Shopify ———
  {
    slug: "blue-diamond-jewellery",
    title: "Blue Diamond Jewellery",
    type: "Full-featured Shopify jewellery e-commerce store",
    category: "shopify",
    summary:
      "A complete jewellery storefront built with the UI/UX designer — from custom theme sections and mega menus to international markets, payments and tracking.",
    tags: ["Shopify", "Liquid", "JavaScript", "CSS", "Shopify Markets"],
    highlights: [
      "Customised the Shopify theme with Liquid, HTML, CSS, JavaScript and sections, converting design layouts into responsive storefront pages.",
      "Built product listing, product detail, collection and search pages with filters, navigation and mega menus.",
      "Configured cart, checkout, customer accounts, wishlist, quick view and related products.",
      "Set up international markets, country selection, currencies, shipping, taxes and payment gateways.",
      "Customised header, footer, announcement bar, banners, promotional sections and mobile navigation.",
      "Organised products, collections, variants, pricing and inventory, plus order, shipping and customer management.",
      "SEO-friendly page structure, metadata, performance improvements, analytics and tracking.",
    ],
  },
  {
    slug: "faqeesh-jewelry",
    title: "Faqeesh Jewelry",
    type: "Shopify jewellery & bullion store with dynamic gold pricing",
    category: "shopify",
    summary:
      "A jewellery and bullion store whose prices follow the gold market automatically — every variant re-priced from live rates, purity and weight.",
    tags: ["Shopify", "Liquid", "JavaScript", "Admin API", "Live gold rates"],
    highlights: [
      "Built the full storefront: products, collections, cart, checkout, payments, shipping and customer accounts.",
      "Added jewellery and bullion categories with variants, specifications, images, pricing and inventory.",
      "Integrated live gold-rate updates for bullion products.",
      "Built a price updater that automatically re-prices jewellery products and variants from the latest gold rates.",
      "Configured pricing logic for different gold purities, weights and variants, with automated catalog sync.",
      "Customised theme design, product cards, banners, promotional sections and mobile layouts.",
      "Added SEO structure, store settings and Shopify administration support.",
    ],
  },
  {
    slug: "kiora-gold-diamonds",
    title: "Kiora Gold & Diamonds",
    type: "Shopify jewellery catalogue with WhatsApp enquiry flow",
    category: "shopify",
    summary:
      "A brand-focused catalogue that swaps online checkout for one-tap WhatsApp enquiries, pre-filled with the product the customer is viewing.",
    tags: ["Shopify", "Liquid", "JavaScript", "WhatsApp"],
    highlights: [
      "Customised the storefront into a jewellery-focused product catalogue.",
      "Replaced the standard payment flow with WhatsApp-based product enquiries.",
      "Added product-level WhatsApp buttons that open a pre-filled conversation in one tap.",
      "Built responsive product listing, product detail, navigation, search and collection browsing.",
      "Customised layout, banners, header, footer and mobile interface.",
      "Set up products, collections, variants, specifications and inventory management.",
    ],
  },
  {
    slug: "dyra-diamonds",
    title: "Dyra Diamonds",
    type: "Shopify diamond & jewellery store",
    category: "shopify",
    summary: "Storefront development and theme customisation for a diamond and jewellery brand.",
    tags: ["Shopify", "Liquid", "CSS"],
    highlights: [
      "Customised the theme with brand-specific banners, promotional content, header, footer and product presentation.",
      "Built responsive layouts for desktop, tablet and mobile.",
      "Configured navigation, collection browsing, cart, checkout, inventory and the customer shopping flow.",
    ],
  },
  {
    slug: "aura-shopify-theme",
    title: "Aura",
    type: "Custom Shopify theme for a luxury jeweller",
    category: "shopify",
    summary:
      "A custom theme on Dawn with 15+ editor-configurable sections, a Build Your Ring flow, live bullion pricing, comparison and wishlist.",
    tags: ["Liquid", "JavaScript (ES6)", "CSS", "GSAP", "Socket.IO", "Shopify CLI"],
    highlights: [
      {
        text: "Added 15+ custom sections, each configurable in the theme editor:",
        sub: ["Animated hero & video banner", "Shop by category & top picks", "Brand showcase & feature split", "Boutique visit"],
      },
      "Multi-step Build Your Ring flow — choose a setting, pair a diamond, review, add to cart — with state persisted across pages and both items added as linked line items.",
      "Live gold and silver pricing from a Socket.IO rate feed, calculated by purity, weight, VAT and currency, re-rendered via Dawn's pub/sub events and a MutationObserver, with a price-tolerance setting and labelled mock mode.",
      "Product comparison (card toggle, bottom tray, comparison page) and a wishlist for products and ring builds, both toggleable in theme settings.",
      "GSAP ScrollTrigger and SplitText animations, a consistent brand colour system, configurable header and responsive footer grid.",
    ],
  },

  // ——— Websites ———
  {
    slug: "mac-ro-capital",
    title: "MAC & RO Capital",
    type: "Multilingual precious-metals corporate site",
    category: "web",
    summary:
      "A corporate site in English, Arabic (RTL) and Italian with a physical-gold catalogue, live gold prices over Socket.IO and TradingView charts.",
    tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "React Router", "i18next", "Socket.IO", "TradingView", "Puppeteer"],
    highlights: [
      "English, Arabic RTL and Italian support with currency selection, nested menus and animated sections.",
      "Company, services, accreditations, governance, news, blog, FAQ, contact and legal pages.",
      "Physical gold catalogue with specifications, certifications, related products and enquiries.",
      "Dedicated pages for the Deluxe, MAC & RO, Key Man and End of Treatment Payment metal accounts.",
      "Real-time gold prices via Socket.IO and live TradingView charts in per-ounce and per-gram views.",
      "Validated contact form with phone-country selection, UAE/Italy branch choice and preferred contact method.",
      "Downloadable policies, team profiles with vCard download and sharing, click-to-call, email and WhatsApp.",
      "SEO metadata, canonical URLs, Open Graph, sitemap, lazy loading, code splitting and Puppeteer prerendering.",
    ],
  },
  {
    slug: "promise-gold-refinery",
    title: "Promise Gold Refinery",
    type: "Next.js corporate refinery website",
    category: "web",
    summary:
      "A premium corporate site for a UAE gold refinery — services, a bar and grain catalogue, and downloadable ISO accreditations.",
    tags: ["Next.js", "React", "TypeScript"],
    highlights: [
      "Service sections for high-purity refining, certified assaying, sustainable recycling and precious-metal processing.",
      "Product catalogue for gold bars, silver bars, TT bars and grains with purity, weight, dimensions and specs.",
      "Accreditation section with downloadable ISO documents.",
      "About, contact and legal pages with premium UI, refinery photography, SEO metadata and clear content structure.",
    ],
  },
  {
    slug: "siramamba-refinery",
    title: "SiraMamba Gold Refinery",
    type: "React & Vite refinery website",
    category: "web",
    summary:
      "An 11-page refinery site with a product catalogue, a 27-image gallery with lightbox and operational videos, and downloadable compliance documents.",
    tags: ["React", "Vite", "Tailwind CSS", "React Router", "Framer Motion"],
    highlights: [
      "Home, about, services, products, gallery, accreditations, sustainability, contact and legal pages with custom Product Sans branding.",
      {
        text: "Refinery service sections covering:",
        sub: ["Gold refining & purification", "Assaying & testing", "Smelting & casting", "Minting & custom bullion"],
      },
      "Catalogue and detail pages for 995 and 999.9 kilo bars, TT bars and 999 silver, with WhatsApp enquiries.",
      "Gallery of 27 images with animated loading and lightbox, plus four operational videos.",
      "Downloadable ISO, Chamber of Commerce, Gold Supply Chain Policy and Grievance Mechanism documents.",
      "Contact form with international phone selector, branch choice and validation; route-specific SEO, sitemap and redirects.",
    ],
  },
  {
    slug: "blackmamba-real-estate",
    title: "BlackMamba Real Estate",
    type: "Next.js luxury real-estate web app",
    category: "web",
    summary:
      "A Dubai property platform for buying, renting and short stays — with search, filters, rich listing pages, floor-plan zoom and maps.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "React Zoom Pan Pinch"],
    highlights: [
      "Video hero, property carousels, featured listings, amenities and contact sections.",
      "Property discovery for buy, rent and short stay with price, location, rooms, area and availability.",
      "Search with filters for type, bedrooms, city and price, sorting, mobile filter controls and result counts.",
      "Listing pages with fullscreen galleries, keyboard controls, thumbnail navigation and floor-plan zoom.",
      "Google Maps, Airbnb links, WhatsApp, enquiry and availability-notification actions.",
      "Newsletter via a Google Apps Script API, plus structured real-estate data, GA and Meta Pixel.",
    ],
  },
  {
    slug: "3r-creative",
    title: "3R Creative",
    type: "Next.js creative agency website",
    category: "web",
    summary:
      "A premium agency site with a 3D service carousel, GSAP motion, smooth scrolling, a portfolio of case studies and the LS Connect product page.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Lenis", "Nodemailer"],
    highlights: [
      "Animated hero video, 3D service carousel, custom cursor, splash screen and hover sound effects.",
      "Dynamic service pages for ten disciplines, from branding to technology integration.",
      "Portfolio with dynamic case-study pages, media lightbox, impact metrics and previous/next navigation.",
      "LS Connect WhatsApp Business landing page with feature showcases and legal pages.",
      "Contact form with searchable phone input, SMTP delivery, admin notification and auto-reply.",
      "Team profile pages with contact cards and sharing; GTM, GA, Meta Pixel and security headers.",
    ],
  },
  {
    slug: "insight-edge-global",
    title: "Insight Edge Global",
    type: "Audit & advisory website for the precious-metals industry",
    category: "web",
    summary:
      "A content-rich advisory site with nine service areas, a blog, gated brochure downloads and employee profile cards.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Lenis", "Resend"],
    highlights: [
      {
        text: "Dynamic service pages with sub-services, checklists, FAQs and timelines, including:",
        sub: ["Audit & assurance", "Compliance & responsible business", "Corporate tax & e-invoicing", "Bullion tokenisation & tech governance"],
      },
      "Animated navigation, smooth scrolling and page transitions.",
      "Contact form with Resend email delivery and a thank-you flow.",
      "Downloadable brochure behind email capture via Google Apps Script.",
      "Blog with categories, reading time and service CTAs.",
      "Profile cards with call, WhatsApp, socials, share link and vCard.",
      "Page-level metadata, Open Graph, Twitter cards, sitemap and llms.txt.",
    ],
  },
  {
    slug: "aurify-technology",
    title: "Aurify Technology",
    type: "Next.js corporate & product website",
    category: "web",
    summary:
      "A product site for four bullion and refinery software products, a WhatsApp Business showcase and a webinar registration system.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Resend", "Google Sheets"],
    highlights: [
      "Product pages for Bullion Pro, Refine X, Aurify RMS and Aurify IQ with module explorers, process flows and architecture.",
      "Aurify Connect showcase for WhatsApp Business: inbox, chatbots, templates, broadcasts and compliance.",
      "Webinar registration with conditional fields, phone validation, consent and anti-spam.",
      "Registrations stored via Google Sheets webhook; confirmation emails via Resend with idempotency protection.",
      "Interactive marquees, reveal effects and reduced-motion support with accessible, keyboard-friendly forms.",
    ],
  },
  {
    slug: "digital-profiles",
    title: "Digital Profiles",
    type: "Multi-brand digital business cards",
    category: "web",
    summary:
      "Branded profile sites for Signature, Parpia, Aurify and 3R Creative, served from one React app through domain-based routing.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    highlights: [
      "Reusable profile templates with distinct branding, layouts and colours per company.",
      "Quick actions for call, email, WhatsApp, LinkedIn, Instagram and website.",
      "Save Contact downloads a .vcf file; sharing uses the Web Share API with clipboard fallback.",
      "Domain-based routing serves many individual profiles from a single application.",
    ],
  },

  // ——— Apps & platforms ———
  {
    slug: "hi-life-furniture-rentals",
    title: "Hi-Life Furniture Rentals",
    type: "Marketing website & leads platform",
    category: "app",
    summary:
      "A Next.js 16 marketing site and a Cloudflare Workers leads platform with a secure staff admin for a UAE event-furniture rental company.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "GSAP", "Cloudflare Workers", "D1", "R2", "Resend"],
    highlights: [
      "Full marketing site — portfolio, events, furniture catalogue, quote and contact — served from Cloudflare as a static export.",
      "Scroll-driven GSAP and Lenis motion across about 14 animated components.",
      "Serverless leads backend storing submissions in D1 and floor plans or mood boards (up to 10 MB) in R2; a lead is saved even if email fails.",
      "Staff dashboard tracking leads through New, Contacted, Quote sent, Won or Lost, with every change recorded as a note.",
      "PBKDF2-SHA256 hashing (210k iterations), 12-hour signed sessions, honeypot, rate limiting and hashed visitor IPs.",
      "Migrations, a staff-account CLI, single-command deploys and separate type-checking for site and Worker.",
    ],
  },
  {
    slug: "bijouq-feedback",
    title: "Bijouq Customer Feedback",
    type: "Full-stack survey & feedback platform",
    category: "app",
    summary:
      "A bilingual seven-step feedback form with duplicate-preventing lookup, plus a secure admin portal with analytics, CSV export and inventory.",
    tags: ["React", "Vite", "Express", "PostgreSQL", "JWT", "Tailwind CSS", "Turborepo"],
    highlights: [
      "Seven-step customer form with progress tracking, validation and confetti confirmation.",
      "English and Arabic with RTL layout, country detection and country-specific branch lists.",
      "Phone-based lookup that prefills returning customers and prevents duplicate surveys.",
      "Admin portal with bcrypt, JWT sessions, protected routes, Helmet, CORS and rate limiting.",
      "Analytics for submissions, languages, weekly and monthly activity, countries and branches.",
      "Survey management with search, filters, sorting, pagination and CSV export, plus an inventory manager.",
    ],
  },
  {
    slug: "3r-qr-generator",
    title: "3R QR Generator",
    type: "Dynamic QR codes with scan analytics",
    category: "app",
    summary:
      "QR codes whose destination can change without reprinting, with per-scan analytics and PNG, SVG and PDF export.",
    tags: ["Next.js", "React", "TypeScript", "MongoDB", "Mongoose", "Recharts"],
    highlights: [
      "Trackable redirect links using unique slugs so printed codes never need replacing.",
      "Downloads in PNG, SVG and PDF.",
      "Admin dashboard to search, edit, enable, disable and delete codes.",
      "Scan tracking by time, device, browser, OS, country and city.",
      "Daily scan charts with device and country breakdowns.",
    ],
  },
  {
    slug: "gold-rate-updater",
    title: "Gold Rate Updater",
    type: "Admin dashboard & Shopify pricing automation",
    category: "app",
    summary:
      "A dashboard for daily DJG gold rates that pushes updates to a Railway API to re-price Shopify variants, with a full jewellery price calculator.",
    tags: ["React 19", "Vite", "TypeScript", "Tailwind CSS", "Railway"],
    highlights: [
      "Manage 24K, 22K, 21K, 18K and 14K rates in AED per gram, with save, reset and status indicators.",
      "Pushes updated rates to a Railway API that automatically re-prices Shopify product variants.",
      "Price calculator covering gold weight, karat, diamond carats, stones, making charges and UAE VAT.",
      "Detailed price breakdown rounded to the nearest AED, plus a tab documenting the formula.",
      "Rate history with timestamps and one-click config export for the server.",
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
