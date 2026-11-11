// Regression checks from the final review. Usage: node scripts/check-a11y.mjs [baseUrl]
import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const b = await chromium.launch();
let failed = 0;
const report = (ok, name, info = "") => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"} ${name} ${info}`); };

// 1. Intro must clear on a first visit even under React StrictMode (dev double-runs effects).
{ const p = await (await b.newContext()).newPage();
  await p.goto(base + "/", { waitUntil: "domcontentloaded" });
  const appeared = await p.waitForSelector("[data-intro]", { timeout: 5000 }).then(() => true, () => false);
  await p.waitForTimeout(2500);
  const cleared = (await p.$("[data-intro]")) === null;
  report(appeared && cleared, "intro appears then clears on first visit", JSON.stringify({ appeared, cleared })); await p.close(); }

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { sessionStorage.setItem("intro-seen", "1"); } catch {} });

// 2. Focus ring visible on an ink-filled control inside a paper section.
{ const p = await ctx.newPage(); await p.goto(base + "/work", { waitUntil: "networkidle" });
  await p.focus('[aria-label="Filter projects"] button[aria-pressed="true"]');
  await p.keyboard.press("Shift+Tab"); await p.keyboard.press("Tab");
  const r = await p.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); const bg = getComputedStyle(el.closest("[data-tone]")).backgroundColor; return { outline: cs.outlineColor, style: cs.outlineStyle, bg }; });
  report(r.style !== "none" && r.outline !== r.bg, "focus ring visible on pressed toggle", JSON.stringify(r)); await p.close(); }

// 3. Skip link is on top when focused.
{ const p = await ctx.newPage(); await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  const ok = await p.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return a.textContent.includes("Skip") && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === a; });
  report(ok, "skip link visible above top bar"); await p.close(); }

// 4. Keyboard focus on a work row must not park the preview in the corner.
{ const p = await ctx.newPage(); await p.goto(base + "/work", { waitUntil: "networkidle" });
  await p.focus('main ol a'); await p.waitForTimeout(400);
  const shown = await p.evaluate(() => !!document.querySelector("[data-cursor-preview] > *"));
  report(!shown, "no preview on keyboard focus"); await p.close(); }

await b.close();
process.exit(failed ? 1 : 0);
