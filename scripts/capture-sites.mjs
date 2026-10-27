// Records a short scrolling clip and a poster frame for each live project site.
//
//   node scripts/capture-sites.mjs            # all sites
//   node scripts/capture-sites.mjs aurify     # only slugs containing "aurify"
//
// Output: public/media/<slug>.mp4 (muted, ~10 s loop) and public/media/<slug>.webp (poster).
// Cookie banners, pop-ups and chat widgets are hidden with CSS — nothing on the site is clicked.

import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SITES = [
  { slug: "hi-life-furniture-rentals", url: "https://hilife-website.minhaj-a2a.workers.dev/" },
  { slug: "blue-diamond-jewellery", url: "https://www.bluediamondjewellery.com/" },
  { slug: "3r-creative", url: "https://creative3r.com/", settle: 6000 },
  { slug: "aurify-technology", url: "https://aurify.global/" },
  { slug: "promise-gold-refinery", url: "https://www.promisegoldrefinery.com/" },
  {
    slug: "blackmamba-real-estate",
    url: "https://www.blackmamba.realestate/",
    // The live hero is HEVC, which desktop Chromium can't decode; record it as Safari shows it.
    hevcVideos: ["https://www.blackmamba.realestate/images/hero-video.mp4"],
    scroll: 0.7, // short page — stop before the footer
  },
  { slug: "insight-edge-global", url: "https://insightedge.global/" },
];

const W = 1440;
const H = 900;
const CLIP_SECONDS = 10.5;
const OUT = join(process.cwd(), "public", "media");

const HIDE_CSS = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [id*="gdpr" i], [class*="gdpr" i], #onetrust-banner-sdk, #onetrust-consent-sdk,
  .klaviyo-form, [class*="kl-private" i], [id*="privy" i], [class*="newsletter-popup" i],
  [class*="popup-overlay" i], [id*="tidio" i], [id*="crisp" i], [class*="intercom" i],
  #shopify-pc__banner, #preview-bar-iframe, iframe[title*="chat" i]
  { display: none !important; visibility: hidden !important; }
`;

const ffmpeg = (...args) => execFileSync(ffmpegPath, ["-y", "-loglevel", "error", ...args]);
const kb = (p) => Math.round(statSync(p).size / 1024);

/** Download an HEVC video and transcode it to H.264 so Chromium can play it during capture. */
async function toH264(src, dir, i) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`${src} ${res.status}`);
  const raw = join(dir, `hevc-${i}.mp4`);
  const out = join(dir, `h264-${i}.mp4`);
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  ffmpeg("-i", raw, "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out);
  return out;
}

async function capture(browser, { slug, url, settle = 3000, hevcVideos = [], scroll = 1 }) {
  const tmp = mkdtempSync(join(tmpdir(), "capture-"));
  const swaps = await Promise.all(hevcVideos.map(async (src, i) => [src, await toH264(src, tmp, i)]));
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    colorScheme: "light",
    locale: "en-US",
    recordVideo: { dir: tmp, size: { width: W, height: H } },
  });
  for (const [src, file] of swaps) {
    await context.route(src, (route) =>
      route.fulfill({ status: 200, contentType: "video/mp4", body: readFileSync(file) }),
    );
  }
  const t0 = Date.now();
  const page = await context.newPage();

  await page.goto(url, { waitUntil: "load", timeout: 90_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.addStyleTag({ content: HIDE_CSS });
  await page.waitForTimeout(settle);

  const posterPng = join(tmp, "poster.png");
  await page.screenshot({ path: posterPng });

  // Smooth wheel scroll so smooth-scroll libraries (Lenis etc.) and scroll animations behave naturally.
  const start = (Date.now() - t0) / 1000;
  await page.mouse.move(W / 2, H / 2);
  const steps = 190;
  for (let i = 0; i < steps; i++) {
    const ease = Math.sin((i / steps) * Math.PI); // slow in, fast middle, slow out
    await page.mouse.wheel(0, (8 + ease * 27) * scroll);
    await page.waitForTimeout(48);
  }
  await page.waitForTimeout(900);

  const video = page.video();
  await context.close();
  const webm = await video.path();

  const mp4 = join(OUT, `${slug}.mp4`);
  const poster = join(OUT, `${slug}.webp`);
  ffmpeg(
    "-ss", Math.max(0, start - 0.2).toFixed(2), "-t", String(CLIP_SECONDS), "-i", webm,
    "-vf", "scale=1280:-2,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "30",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4,
  );
  ffmpeg("-i", posterPng, "-vf", "scale=1280:-2", "-quality", "78", poster);
  rmSync(tmp, { recursive: true, force: true });

  console.log(`✓ ${slug.padEnd(28)} video ${kb(mp4)} KB · poster ${kb(poster)} KB`);
}

const filter = process.argv[2];
const targets = filter ? SITES.filter((s) => s.slug.includes(filter)) : SITES;
mkdirSync(OUT, { recursive: true });

// Bundled Chromium can't play H.264, so sites with background videos record as grey boxes.
// Prefer installed Edge/Chrome (which ship the codec) and fall back to bundled Chromium.
async function launch() {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel });
    } catch {}
  }
  return chromium.launch();
}
const browser = await launch();
for (const site of targets) {
  try {
    await capture(browser, site);
  } catch (err) {
    console.error(`✗ ${site.slug}: ${err.message.split("\n")[0]}`);
  }
}
await browser.close();
