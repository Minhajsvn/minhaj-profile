// Records a short scrolling clip and a poster frame for each live project site.
//
//   node scripts/capture-sites.mjs            # all sites
//   node scripts/capture-sites.mjs aurify     # only slugs containing "aurify"
//
// Output: public/media/<slug>.mp4 (muted, ≤8.5 s loop, 1440×900) and public/media/<slug>.webp (poster).
// Pages render at 1.5× pixel density and are captured via the DevTools screencast (see lib/screencast.mjs),
// so text stays sharp. Cookie banners, pop-ups and chat widgets are hidden with CSS — nothing is clicked.

import { chromium } from "playwright";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ffmpeg, launchBrowser, startScreencast } from "./lib/screencast.mjs";

const SITES = [
  { slug: "hi-life-furniture-rentals", url: "https://hilife-website.minhaj-a2a.workers.dev/" },
  { slug: "blue-diamond-jewellery", url: "https://www.bluediamondjewellery.com/", scroll: 0.5 }, // stay above the footer
  { slug: "3r-creative", url: "https://creative3r.com/", settle: 6000 },
  { slug: "aurify-technology", url: "https://aurify.global/", clock: false }, // steps cleanly in virtual time
  { slug: "promise-gold-refinery", url: "https://www.promisegoldrefinery.com/" },
  {
    slug: "blackmamba-real-estate",
    url: "https://www.blackmamba.realestate/",
    // The live hero is HEVC, which desktop Chromium can't decode; record it as Safari shows it.
    hevcVideos: ["https://www.blackmamba.realestate/images/hero-video.mp4"],
    scroll: 0.7, // short page — stop before the footer
  },
  {
    slug: "insight-edge-global",
    url: "https://insightedge.global/",
    clock: false, // its hero slider never loads the next slide under the fake clock
  },
];

const W = 1440; // CSS viewport
const H = 900;
const DPR = 1.5; // captured at 2160×1350, encoded at 1440×900
const OUT_W = 1440;
const OUT_H = 900;
const MAX_SECONDS = 8.5; // hover previews rarely play longer
const OUT = join(process.cwd(), "public", "media");

const HIDE_CSS = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [id*="gdpr" i], [class*="gdpr" i], #onetrust-banner-sdk, #onetrust-consent-sdk,
  .klaviyo-form, [class*="kl-private" i], [id*="privy" i], [class*="newsletter-popup" i],
  [class*="popup-overlay" i], [id*="tidio" i], [id*="crisp" i], [class*="intercom" i],
  #shopify-pc__banner, #preview-bar-iframe, iframe[title*="chat" i]
  { display: none !important; visibility: hidden !important; }
`;

const kb = (p) => Math.round(statSync(p).size / 1024);

/** Download an HEVC video and transcode it to H.264 so Chromium can play it during capture. */
async function toH264(src, dir, i) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`${src} ${res.status}`);
  const raw = join(dir, `hevc-${i}.mp4`);
  const out = join(dir, `h264-${i}.mp4`);
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  ffmpeg("-i", raw, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out);
  return out;
}

/**
 * Frame-exact capture (--det): the page's clock advances exactly one frame (1/fps) between
 * screenshots, so the site's own animations and smooth-scroll libraries step evenly; background
 * videos are paused and seeked to the matching time each frame; the scroll is one small wheel
 * event per frame on a sine velocity profile. Every frame is captured, none repeated or dropped,
 * so the clip has a perfect cadence without any interpolation.
 */
async function captureDeterministic(context, page, dir, scroll, clock) {
  const fps = OPTS.fps;
  const total = Math.round(OPTS.max * fps);
  const distance = 4300 * scroll; // px scrolled over the clip
  // Velocity never drops below a quarter of its peak: a page scrolled slower than ~1.5 px a frame
  // advances in whole-pixel stops (repeated frames). The film cuts into and out of these clips, so
  // they need no rest at either end.
  const shape = (i) => 0.25 + 0.75 * Math.sin((Math.PI * (i + 0.5)) / total);
  let norm = 0;
  for (let i = 0; i < total; i++) norm += shape(i);
  const cdp = await context.newCDPSession(page);
  await page.mouse.move(W / 2, H / 2);
  // Lazy images would pop in mid-scroll (they decode on the real clock): load them all up front.
  await Promise.race([
    page.evaluate(() =>
      Promise.all(
        [...document.images].map((img) => {
          img.loading = "eager";
          return img.complete ? null : new Promise((r) => img.addEventListener("load", r, { once: true }) || img.addEventListener("error", r, { once: true }));
        }),
      ),
    ),
    new Promise((r) => setTimeout(r, 15_000)),
  ]);
  // Background videos start from their first frame, so none wraps its loop inside the clip.
  await page.evaluate(() => {
    window.__vids = [...document.querySelectorAll("video")].map((v) => {
      v.pause();
      return { v, t: 0 };
    });
  });
  // Two clocks: the page's own fake clock by default (page.clock drives requestAnimationFrame,
  // timers and performance.now); Chrome's virtual time when a site opts in with clock: false. Most
  // sites lock up while virtual time is paused (GSAP, Lenis), so no screenshot ever returns.
  if (!clock) await cdp.send("Emulation.setVirtualTimePolicy", { policy: "pause" });
  const advance = clock
    ? async () => {
        await page.clock.runFor(1000 / fps);
        // CSS animations and transitions run on the real clock, which a slow capture makes several
        // times too fast; hold each one and step it by exactly one frame.
        await page.evaluate((dt) => {
          for (const a of document.getAnimations()) {
            if (a.__t === undefined) {
              a.pause();
              a.__t = a.currentTime ?? 0;
            } else a.__t += dt;
            a.currentTime = a.__t;
          }
        }, 1000 / fps);
      }
    : () =>
        new Promise((res) => {
          cdp.once("Emulation.virtualTimeBudgetExpired", res);
          cdp.send("Emulation.setVirtualTimePolicy", { policy: "advance", budget: 1000 / fps }).catch(res);
        });
  const seekVideos = (i) =>
    Promise.race([
      page.evaluate(
        ({ i, fps }) =>
          Promise.all(
            window.__vids.map(
              ({ v, t }) =>
                new Promise((r) => {
                  const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 1e9;
                  const nt = (t + i / fps) % d;
                  if (Math.abs(v.currentTime - nt) < 1e-3) return r();
                  v.addEventListener("seeked", () => r(), { once: true });
                  v.currentTime = nt;
                }),
            ),
          ),
        { i, fps },
      ),
      new Promise((r) => setTimeout(r, 800)),
    ]);
  for (let i = 0; i < total; i++) {
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: W / 2, y: H / 2, deltaX: 0, deltaY: (distance * shape(i)) / norm });
    if (i % 60 === 0) console.log(`  frame ${i}/${total}`);
    await advance();
    await seekVideos(i);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 94 });
    writeFileSync(join(dir, `f${String(i).padStart(5, "0")}.jpg`), Buffer.from(data, "base64"));
  }
  if (!clock) await cdp.send("Emulation.setVirtualTimePolicy", { policy: "advance" }).catch(() => {});
  return total;
}

async function capture(browser, { slug, url, settle = 3000, hevcVideos = [], scroll = 1, clock = true, prep }) {
  const tmp = mkdtempSync(join(tmpdir(), "capture-"));
  const swaps = await Promise.all(hevcVideos.map(async (src, i) => [src, await toH264(src, tmp, i)]));
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: DPR,
    colorScheme: "light",
    locale: "en-US",
  });
  for (const [src, file] of swaps) {
    await context.route(src, (route) => route.fulfill({ status: 200, contentType: "video/mp4", body: readFileSync(file) }));
  }
  const page = await context.newPage();
  const fake = OPTS.det && clock;
  if (fake) await page.clock.install();

  await page.goto(url, { waitUntil: "load", timeout: 90_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.addStyleTag({ content: HIDE_CSS });
  if (fake) await page.clock.runFor(settle);
  else await page.waitForTimeout(settle);
  if (prep) await page.evaluate(prep);

  const posterPng = join(tmp, "poster.png");
  await page.screenshot({ path: posterPng });

  if (OPTS.det) {
    const mp4 = join(OPTS.out, `${slug}.mp4`);
    const poster = join(OPTS.out, `${slug}.webp`);
    const n = await captureDeterministic(context, page, tmp, scroll, fake);
    ffmpeg(
      "-framerate", String(OPTS.fps), "-i", join(tmp, "f%05d.jpg"),
      "-vf", `scale=${OUT_W}:${OUT_H}:flags=lanczos`, "-c:v", "libx264", "-preset", "slow", "-crf", String(OPTS.crf),
      "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4,
    );
    await context.close();
    ffmpeg("-i", posterPng, "-vf", `scale=${OUT_W}:-2:flags=lanczos`, "-quality", "86", poster);
    rmSync(tmp, { recursive: true, force: true });
    console.log(`✓ ${slug.padEnd(28)} ${(n / OPTS.fps).toFixed(1)} s · ${n} frames (deterministic) · video ${kb(mp4)} KB · poster ${kb(poster)} KB`);
    return;
  }

  const stop = await startScreencast(page, { maxWidth: W * DPR, maxHeight: H * DPR });
  await page.waitForTimeout(400); // a still beat on the hero before moving

  // Smooth wheel scroll so smooth-scroll libraries (Lenis etc.) and scroll animations behave naturally.
  await page.mouse.move(W / 2, H / 2);
  // Each step costs ~100 ms while the screencast runs, so ~95 steps ≈ 10 s of scrolling.
  const steps = 95;
  for (let i = 0; i < steps; i++) {
    const ease = Math.sin((i / steps) * Math.PI); // slow in, fast middle, slow out
    await page.mouse.wheel(0, (16 + ease * 54) * scroll);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(900);

  const mp4 = join(OPTS.out, `${slug}.mp4`);
  const poster = join(OPTS.out, `${slug}.webp`);
  const { frames, seconds } = await stop(mp4, { width: OUT_W, height: OUT_H, crf: OPTS.crf, fps: OPTS.fps, maxSeconds: OPTS.max });
  await context.close();

  ffmpeg("-i", posterPng, "-vf", `scale=${OUT_W}:-2:flags=lanczos`, "-quality", "86", poster);
  rmSync(tmp, { recursive: true, force: true });

  console.log(`✓ ${slug.padEnd(28)} ${seconds.toFixed(1)} s · ${frames} frames · video ${kb(mp4)} KB · poster ${kb(poster)} KB`);
}

// Options for film-grade sources (e.g. the cinetic showreel):
//   --out <dir>  --fps 60  --crf 16  --max 12   (defaults: public/media, 30, 26, 8.5)
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const OPTS = {
  out: opt("out", OUT),
  fps: Number(opt("fps", 30)),
  crf: Number(opt("crf", 26)),
  max: Number(opt("max", MAX_SECONDS)),
  det: argv.includes("--det"), // frame-exact virtual-time capture (film sources)
};
const filter = argv.find((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--")));
const targets = filter ? SITES.filter((s) => s.slug.includes(filter)) : SITES;
mkdirSync(OPTS.out, { recursive: true });

const browser = await launchBrowser(chromium);
for (const site of targets) {
  try {
    await capture(browser, site);
  } catch (err) {
    console.error(`✗ ${site.slug}: ${err.message.split("\n")[0]}`);
  }
}
await browser.close();
