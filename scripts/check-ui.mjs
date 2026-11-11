// UI guard rails for the Editorial Mono redesign.
// Usage: node scripts/check-ui.mjs [baseUrl] [--reduced]
// Fails on: horizontal page scroll, lime text on a paper section, console errors.
import { chromium } from "playwright";

const args = process.argv.slice(2);
const reduced = args.includes("--reduced");
const base = args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000";
const paths = ["/", "/work", "/about", "/work/live-rate-app"];
const widths = [1440, 768, 375];

const browser = await chromium.launch();
let failed = 0;

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  // Skip the intro so checks see the page itself.
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
  });
  for (const path of paths) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + path, { waitUntil: "networkidle" });
    // Scroll through so in-view content mounts.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    const result = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const limeOnPaper = [...document.querySelectorAll("body *")]
        .filter((el) => getComputedStyle(el).color === "rgb(198, 244, 50)" && el.textContent?.trim())
        .filter((el) => el.closest("[data-tone]")?.getAttribute("data-tone") === "paper")
        .map((el) => el.tagName.toLowerCase() + ":" + el.textContent.trim().slice(0, 30));
      return { overflow, limeOnPaper };
    });
    const reasons = [];
    if (result.overflow > 0) reasons.push(`horizontal scroll ${result.overflow}px`);
    if (result.limeOnPaper.length) reasons.push(`lime text on paper: ${result.limeOnPaper.join(", ")}`);
    if (errors.length) reasons.push(`console: ${errors.join(" | ").slice(0, 300)}`);
    if (reasons.length) {
      failed++;
      console.log(`FAIL ${path}@${width} ${reasons.join("; ")}`);
    } else {
      console.log(`PASS ${path}@${width}`);
    }
    await page.close();
  }
  await context.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
