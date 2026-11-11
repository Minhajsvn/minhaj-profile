# Editorial Mono Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pine-green bento look with the Editorial Mono system (ink, paper, acid lime, Geist, Swiss grid) on every page, keeping all content.

**Architecture:** New design tokens are added next to the old ones first, so the site builds after every task. Each task restyles one section or page against a shared `Section` wrapper that fixes its tone (ink or paper). The last task deletes the old tokens, the theme toggle and `next-themes`.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind 3.4, framer-motion 11, Lenis, `next/font/google` (Geist, Geist Mono), Node 24 built-in test runner for pure helpers, Playwright (already a dev dependency) for browser checks.

**Spec:** `docs/superpowers/specs/2026-11-11-editorial-mono-redesign-design.md`

## Global Constraints

- Colours: `ink #0E0E0C`, `paper #EFEDE6`, `lime #C6F432`. Muted text = the text colour at 55%. Rules = the text colour at 15%, 1 px.
- Lime is never text on paper. On paper it is only a fill behind ink text. At most one lime element per screen height.
- No theme toggle. Every section is fixed `ink` or `paper`.
- Fonts: Geist 400/500/600 for display and body; Geist Mono 400 for labels (uppercase, 11–12 px, `tracking-[0.04em]`).
- Display sizes: hero name `clamp(6rem, 24vw, 22rem)`; section titles `clamp(3rem, 10vw, 9rem)`; story years `clamp(4rem, 12vw, 10rem)`; tracking −0.05em, line-height 0.85.
- Body 16–18 px, line-height 1.5, max 60ch.
- Corners square (radius 0) except avatar and cursor dot. Structure from rules and numbering, never cards or shadows.
- 12-column grid; gutter 16 px, 24 px from `md`. Full width, no 1280 px container.
- Avatar/portraits `grayscale`, colour on hover. Project media full colour.
- No WebGL or 3D.
- `prefers-reduced-motion`: no intro, no cursor, no cursor preview, no marquee; reveals become a fade.
- Targets: no horizontal scroll at 375 px; Lighthouse mobile on `/` Performance ≥ 85, Accessibility ≥ 95.
- All content in `lib/data.ts` and `lib/projects.ts` stays visible.
- Copy is unchanged except the hero line (≤ 12 words, from `profile.summary`).

## Review Focus

1. **Touch devices** — cursor dot and cursor video preview must not mount on `(pointer: coarse)`; index rows stay plain tappable links. Test in Task 5.
2. **Project with no `video` or `cover`** — the cursor preview shows the generated `ProjectCover`, never a broken `<video>`. Test in Task 5.
3. **Giant type at 375 px** — "MINHAJ", "Work", "LET'S BUILD" are cropped by design but must never create horizontal page scroll. Test in Tasks 3, 5, 7 and 11.
4. **Intro when `sessionStorage` throws** (private mode, blocked storage) — intro is skipped and the page renders; it never loops or blocks. Test in Task 3.
5. **Clock hydration** — server HTML has no time (placeholder `--:--`); time appears after mount, so no hydration warning in the console. Test in Task 2.

## File map

| File | Responsibility |
|---|---|
| `lib/format.ts` (new) | Pure helpers: `formatDubaiTime`, `indexNumber`, `projectYearLabel` |
| `lib/format.test.ts` (new) | Node test runner tests for `lib/format.ts` |
| `components/Section.tsx` (new) | Wraps a section; sets `data-tone`, bg and text colour |
| `components/DubaiClock.tsx` (new) | Live `HH:MM` Dubai clock, placeholder until mounted |
| `components/Cursor.tsx` (new) | Desktop dot cursor, colour from `data-tone` under pointer |
| `components/Intro.tsx` (new) | Once-per-session intro wipe |
| `components/WorkIndex.tsx` (new) | Numbered project rows |
| `components/CursorPreview.tsx` (new) | Media box that follows the pointer over `WorkIndex` |
| `scripts/check-ui.mjs` (new) | Playwright checks: horizontal scroll, lime-on-paper, console errors, at 3 widths |
| `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx` | Tokens, fonts, utilities |
| `components/*` listed per task | Restyled sections |

---

### Task 0: Branch

- [ ] **Step 1:** `git switch -c redesign/editorial-mono` — expected: `Switched to a new branch`.

### Task 1: Tokens, fonts, Section wrapper, format helpers

**Files:**
- Modify: `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`, `tsconfig.json` (exclude `**/*.test.ts`), `package.json` (add `"test": "node --test lib/"`)
- Create: `lib/format.ts`, `lib/format.test.ts`, `components/Section.tsx`, `scripts/check-ui.mjs`

**Interfaces:**
- Produces:
  - Tailwind colours `ink`, `paper`, `lime`; font families `sans` = Geist var, `mono` = Geist Mono var; utilities `.text-hero` (`clamp(6rem,24vw,22rem)`), `.text-title` (`clamp(3rem,10vw,9rem)`), `.text-year` (`clamp(4rem,12vw,10rem)`), all with `letter-spacing:-0.05em; line-height:.85`; `.label` (mono, uppercase, 12px, tracking 0.04em); `.rule` (`border-color: currentColor` at 15% via `color-mix`); `.muted` (text at 55% via `color-mix`).
  - `type Tone = "ink" | "paper"`
  - `Section({ tone, id?, labelledBy?, className?, children }): JSX` — renders `<section data-tone={tone}>` with `bg-ink text-paper` or `bg-paper text-ink`, `overflow-x-clip`.
  - `formatDubaiTime(date: Date): string` → `"HH:MM"` 24 h in `Asia/Dubai`.
  - `indexNumber(i: number): string` → zero-padded 2 digits from a 0-based index.
  - `projectYearLabel(p: { year?: string; category: Category }): string` → `year` if present, else the category's label from `categories`.
  - Add `year?: string` to `Project` in `lib/projects.ts`.
- Old tokens (`background`, `panel`, `pine` …) stay untouched in this task.

- [ ] **Step 1: Write failing tests** in `lib/format.test.ts` (import from `./format.ts`):
  - `formatDubaiTime(new Date("2026-11-11T10:02:00Z"))` === `"14:02"`
  - `formatDubaiTime(new Date("2026-11-11T20:30:00Z"))` === `"00:30"`
  - `indexNumber(0)` === `"01"`, `indexNumber(9)` === `"10"`
  - `projectYearLabel({ year: "2025", category: "web" })` === `"2025"`
  - `projectYearLabel({ category: "app" })` === `"Apps & platforms"`
- [ ] **Step 2:** `npm test` — expected: FAIL, cannot find `./format.ts`.
- [ ] **Step 3:** Implement `lib/format.ts`. Time: `Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })`. Labels: `import { categories, type Category } from "./projects.ts"` (relative path with extension, so Node's test runner resolves it without the `@/` alias; `lib/projects.ts` has no imports). Add `"allowImportingTsExtensions": true` to `tsconfig.json` so `next build` accepts the `.ts` extension.
- [ ] **Step 4:** `npm test` — expected: 5 pass.
- [ ] **Step 5:** Tokens and fonts. `layout.tsx`: replace Poppins with `Geist` (`variable: "--font-geist"`, weights 400/500/600) and `Geist_Mono` (`--font-geist-mono`, 400); keep `--font-sans` pointing at Geist so old components keep working. `themeColor` → `#0E0E0C`.
- [ ] **Step 6:** Create `components/Section.tsx` and `scripts/check-ui.mjs`. The script takes a base URL (default `http://localhost:3000`) and paths `/ /work /about /work/live-rate-app`; for each at widths 1440, 768, 375 it: fails if `document.documentElement.scrollWidth > innerWidth`; fails if any element whose computed `color` is `rgb(198, 244, 50)` has `closest('[data-tone]')?.dataset.tone === 'paper'`; fails on any `console` error. Prints `PASS`/`FAIL path@width reason`. Exit code 1 on any fail. Add npm script `"check:ui": "node scripts/check-ui.mjs"`.
- [ ] **Step 7:** `npm run build` — expected: success. Dev server up, `npm run check:ui` — expected: runs (old pages may pass or fail; record the baseline).
- [ ] **Step 8: Commit** `feat: add editorial mono tokens, fonts, Section and format helpers`.

### Task 2: Top bar, Dubai clock, cursor

**Files:**
- Create: `components/DubaiClock.tsx`, `components/Cursor.tsx`
- Modify: `components/TopBar.tsx`, `components/Providers.tsx` (mount `<Cursor />`)

**Interfaces:**
- Consumes: `formatDubaiTime`, `.label`.
- Produces: `DubaiClock(): JSX` (renders `--:--` until mounted, then updates every 30 s); `Cursor(): JSX | null`; `TopBar(): JSX`.

- [ ] **Step 1:** Implement `DubaiClock` — `useState<string | null>(null)`, set in `useEffect`, render `value ?? "--:--"` with `aria-label="Dubai time"`.
- [ ] **Step 2:** Rewrite `TopBar` per spec §5: fixed, full width, `mix-blend-difference text-paper`, mono 12 px; left `MINHAJ©26` (links `/`), centre `Work · About · Contact` (`/work`, `/about`, `/#contact`), right `<DubaiClock/>` + lime dot + `Available`. Remove `ThemeToggle` import here.
- [ ] **Step 3:** Implement `Cursor` — returns `null` unless `matchMedia("(pointer: fine)")` and not reduced motion; 10 px round dot following the pointer with a framer `useSpring`; colour lime when `document.elementFromPoint` → `closest('[data-tone]')` is ink, ink when paper; grows to 40 px over `a, button`. `pointer-events-none`, `z-[60]`.
- [ ] **Step 4:** Verify in browser at 1440: top bar readable over both a paper and an ink section; console has **no hydration warning** (Review Focus 5). Emulate mobile (375, touch): no cursor element in DOM (`document.querySelector('[data-cursor]') === null`) (Review Focus 1).
- [ ] **Step 5: Commit** `feat: editorial top bar with Dubai clock and tone-aware cursor`.

### Task 3: Hero and intro

**Files:**
- Create: `components/Intro.tsx`
- Modify: `components/Hero.tsx`, `app/page.tsx` (drop the 1280 container and gaps; sections stack edge to edge), `components/Providers.tsx` (mount `<Intro />`)

**Interfaces:**
- Consumes: `Section`, `SplitReveal`, `.text-hero`, `.label`.
- Produces: `Intro(): JSX | null`.

- [ ] **Step 1:** Rewrite `Hero` as `Section tone="paper"`: 4-cell mono meta grid (role, location, `© 2026`, availability); B/W avatar right (`grayscale hover:grayscale-0`, square crop); hero line ≤ 12 words: "Shopify stores, Next.js sites and real-time apps for GCC brands."; then `<h1 id="hero-title" class="text-hero">MINHAJ</h1>` full width, bottom cropped with negative margin. Drop the stats `dl` from the hero (stats move to Story, Task 6).
- [ ] **Step 2:** Implement `Intro`: on mount, read `sessionStorage.getItem("intro-seen")` inside `try/catch`; if seen, reduced motion, or storage throws → render nothing. Else full-screen ink layer, "MINHAJ" with a 000→100 counter, then wipes up; total ≤ 1.2 s; any click or key skips; set `intro-seen` in `try/catch`. Content underneath is rendered normally (not hidden) so no-JS and crawlers see it.
- [ ] **Step 3:** Verify: first load shows intro once, reload in same tab does not; in console run `Object.defineProperty(window, 'sessionStorage', { get(){ throw new Error('blocked') } })` before the component mounts (use Playwright `addInitScript`) → page renders, no intro, no error (Review Focus 4). At 375: `scrollWidth === innerWidth` (Review Focus 3).
- [ ] **Step 4: Commit** `feat: editorial hero and once-per-session intro`.

### Task 4: Clients line and showreel

**Files:** Modify `components/Clients.tsx`, `components/Showreel.tsx`.

- [ ] **Step 1:** `Clients` as `Section tone="paper"`: one line of `clients` names at `text-[clamp(2rem,6vw,5rem)]`, joined by ` / `, duplicated for the existing `animate-marquee`; `motion-reduce:animate-none` and wraps instead.
- [ ] **Step 2:** `Showreel` as `Section tone="ink"`: label `SHOWREEL — 2026` top-left; video in `ScrollScale` changed to scale `0.7 → 1`; `ProjectVideo` pause button restyled square, `bg-ink/80 text-paper` (update the class in `components/ProjectVideo.tsx`).
- [ ] **Step 3:** Verify at 1440 and 375; reduced-motion emulation: marquee static.
- [ ] **Step 4: Commit** `feat: editorial clients line and full-bleed showreel`.

### Task 5: Work index with cursor preview

**Files:**
- Create: `components/WorkIndex.tsx`, `components/CursorPreview.tsx`
- Modify: `components/Work.tsx` (keep `HOME_PICKS`)

**Interfaces:**
- Consumes: `Project`, `indexNumber`, `projectYearLabel`, `ProjectVideo`, `ProjectCover`.
- Produces: `WorkIndex({ items: Project[]; tone: Tone }): JSX` — `<ol>` of rows `01 · title · type · yearLabel →`, each row a `Link` to `/work/[slug]`, 1 px rules, hover text lime only when `tone==="ink"` (on paper hover = ink block with paper text). `CursorPreview({ project: Project | null }): JSX | null` — 320×200 box, follows pointer with spring, shows `ProjectVideo playing` if `project.video`, else `ProjectCover`.

- [ ] **Step 1:** Implement both. `CursorPreview` mounts only on `(pointer: fine)` and not reduced motion.
- [ ] **Step 2:** `Work` as `Section tone="ink"`: giant `Work` in `.text-title`, `WorkIndex` with the six picks, then link `All projects →` with `projects.length`.
- [ ] **Step 3:** Verify: hover a row with video → video plays in preview; temporarily point a row at a project without `video`/`cover` (or test `/work` list in Task 8 which includes such projects) → generated cover shows, no `<video>` element (Review Focus 2). Mobile emulation: no preview in DOM, rows navigate on tap (Review Focus 1). 375: no horizontal scroll, long titles wrap (Review Focus 3).
- [ ] **Step 4: Commit** `feat: numbered work index with cursor video preview`.

### Task 6: Story and services

**Files:** Modify `components/Story.tsx`, `components/Services.tsx` (remove `SectionLabel` export only after Task 10 stops using it).

- [ ] **Step 1:** `Story` as `Section tone="paper"`: `story.intro` then each chapter as a 12-col row — year in `.text-year`, place in `.label`, title + body in cols 7–12; `stats` as a 3-up row of giant numbers with rules.
- [ ] **Step 2:** `Services` as `Section tone="paper"` (separated from Story by a full-width rule): numbered rows, title cols 1–5, body cols 7–12; no icons.
- [ ] **Step 3:** Verify 1440 / 375.
- [ ] **Step 4: Commit** `feat: editorial story timeline and services list`.

### Task 7: Contact footer

**Files:** Modify `components/Contact.tsx`, `components/CopyEmail.tsx` (square button).

- [ ] **Step 1:** `Section tone="ink" id="contact"`: lime band full width with ink "LET'S BUILD →" in `.text-title`, linking to `mailto:`; below in a 12-col grid: email + `CopyEmail`, WhatsApp link (`https://wa.me/${profile.whatsapp}`), CV download, `socials`, `DubaiClock`.
- [ ] **Step 2:** Verify: band is the only lime block on screen; 375 no horizontal scroll (Review Focus 3); copy button works.
- [ ] **Step 3: Commit** `feat: lime band contact footer`.

### Task 8: `/work` page

**Files:** Modify `app/work/page.tsx`, `components/WorkGrid.tsx`, `components/ProjectCover.tsx`, `components/PageHeader.tsx`.

**Interfaces:**
- Consumes: `WorkIndex`, `categories`.
- Produces: `PageHeader({ title: string; intro?: string; tone?: Tone }): JSX` — giant `.text-title` heading (replaces the `parts` API; update every caller).

- [ ] **Step 1:** `PageHeader` per interface. `WorkGrid` becomes the client component holding filter state: mono text toggles `All / Shopify / Websites / Apps & platforms` (active = ink block, `aria-pressed`), a `List / Grid` toggle, renders `WorkIndex` (list) or a 2-col square-corner cover grid (grid). `ProjectCover` radius 0.
- [ ] **Step 2:** Verify: each filter shows the right count; grid view at 375 is 1 column; projects without video show covers.
- [ ] **Step 3: Commit** `feat: editorial work page with filters and list/grid views`.

### Task 9: `/work/[slug]` case pages

**Files:** Modify `app/work/[slug]/page.tsx`.

- [ ] **Step 1:** Ink header `Section`: title `.text-title`, mono meta row (type, category label, `projectYearLabel`, first 4 tags). Full-width cover/video. Paper body: problem/solution side by side; architecture as a ruled table (part / stack / does); engineering numbered; `numbers` on an ink band as giant figures with a 2 px lime underline; `phases` as numbered list. Next project (by array order, wraps) as a giant title link. Projects without `caseStudy` show `summary` + `highlights` only.
- [ ] **Step 2:** Verify on `live-rate-app` (has case study) and one project without `caseStudy`.
- [ ] **Step 3: Commit** `feat: editorial case study pages`.

### Task 10: `/about`

**Files:** Modify `app/about/page.tsx`, `components/Experience.tsx`.

- [ ] **Step 1:** Paper `PageHeader title="The full picture."`, B/W portrait, CV download as an ink square button. `Experience`: ruled table (years / company / role / body), education and `skills` as mono lists. Same `Contact` footer.
- [ ] **Step 2:** Verify 1440 / 375.
- [ ] **Step 3: Commit** `feat: editorial about page`.

### Task 11: Remove old system and full verification

**Files:** Modify `app/globals.css`, `tailwind.config.ts`, `components/Providers.tsx`, `package.json`, `components/Services.tsx`; delete `components/ThemeToggle.tsx`, `components/Tags.tsx` if unused.

- [ ] **Step 1:** Remove `next-themes` (`npm uninstall next-themes`), `ThemeProvider`, the `.dark` block and old tokens (`background, surface, border, foreground, muted, primary*, accent, tag*, pine, sage, panel`, `.btn-*` that use them). `grep -rn "bg-background\|text-muted\|rounded-panel\|pine\|sage\|dark:" app components` — expected: no matches.
- [ ] **Step 2:** `npm test` — 5 pass. `npm run build` — success, no type errors.
- [ ] **Step 3:** With dev server up: `npm run check:ui` — expected: all `PASS` for 4 paths × 3 widths.
- [ ] **Step 4:** Reduced motion: run `check:ui` with Playwright `reducedMotion: "reduce"` (add `--reduced` flag to the script) — all PASS, and no `[data-cursor]`, no intro layer.
- [ ] **Step 5:** `npm run build && npm start`, then `npx lighthouse@12 http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility --quiet --chrome-flags="--headless"` — expected: Performance ≥ 85, Accessibility ≥ 95. If below, fix and re-run before closing.
- [ ] **Step 6:** Screenshots of all 4 pages at 1440 and 375 for the owner.
- [ ] **Step 7: Commit** `chore: remove old theme system`.
