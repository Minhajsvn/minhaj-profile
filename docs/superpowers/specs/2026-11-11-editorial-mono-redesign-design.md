# Editorial Mono redesign — design spec

Date: 2026-11-11
Status: draft, waiting for owner review

## 1. Why

The owner is not happy with the current look: dark pine-green, rounded "panel" cards, Poppins. It reads as a
bento template. A moodboard of 122 references (Awwwards winners Sep–Nov 2026 + Dribbble) was sorted into six
styles; the owner picked 13. Those picks (6 Swiss editorial, 5 dark cinematic minimal, 2 HUD, 1 bento) set
the direction.

Reference picks (moodboard ids): #3 John Bolster, #8 Douglus Nguyen, #14 Fragment, #19 Blue Square X,
#32 Daksh Gajjar, #33 Daniele Buser, #63, #64, #103, #110, #114 Kinetiq, #120, #121.
Moodboard: `design-research/index.html` (run `moodboard` from `.claude/launch.json`).

## 2. Goal and success criteria

A visitor (client, recruiter, agency) should, within 5 seconds, know who Minhaj is, what he builds and that
the work is premium — and the site should look designed, not templated.

Done means:
- Every page (home, `/work`, `/work/[slug]`, `/about`) uses the new system. No rounded panels or pine green left.
- All existing content and data in `lib/data.ts` and `lib/projects.ts` still shows. No content is lost.
- Lighthouse on the home page, mobile: Performance ≥ 85, Accessibility ≥ 95.
- Works at 375 px width with no horizontal scroll.
- `prefers-reduced-motion` turns off all reveals, marquee and cursor preview.

## 3. Visual system

### Colour
Three colours only. No theme toggle: each section is fixed as ink or paper, and the page alternates.

| Token | Value | Use |
|---|---|---|
| `ink` | `#0E0E0C` | dark sections, text on paper |
| `paper` | `#EFEDE6` | light sections, text on ink |
| `lime` | `#C6F432` | the one accent |
| `ink-muted` | `#0E0E0C` at 55% | secondary text on paper |
| `paper-muted` | `#EFEDE6` at 55% | secondary text on ink |
| `rule` | current text colour at 15% | 1 px hairlines |

Lime rules (it fails contrast as text on paper):
- On ink: lime may be text, fill or line.
- On paper: lime only as a **fill behind ink text** (a highlight block, a band, a button). Never lime text on paper.
- At most one lime element per screen height.

### Type
- Display and body: **Geist** (`next/font/google`, weights 400, 500, 600). Replaces Poppins.
- Labels and meta: **Geist Mono** 400, uppercase, 11–12 px, letter-spacing +0.04em.
- Display sizes are fluid: hero name `clamp(6rem, 24vw, 22rem)`, section titles `clamp(3rem, 10vw, 9rem)`,
  tracking −0.05em, line-height 0.85. Giant words may be cropped by the page edge on purpose.
- Body 16–18 px, line-height 1.5, max 60ch.

### Grid and shape
- 12-column grid, 16 px gutter on mobile, 24 px from `md`. Full width, no 1280 px rounded container.
- Square corners everywhere (radius 0), except the round lime cursor dot and avatar.
- Structure comes from 1 px rules and numbering (01, 02 …), not cards or shadows.

### Imagery
- Portrait/avatar shown in black and white (CSS `grayscale`), full colour on hover.
- Project covers and videos stay full colour; they are the only colour besides lime.

## 4. Motion

Keep: Lenis smooth scroll, `SplitReveal`, `PageTransition`, `ScrollProgress`, `Magnetic` (restyled).
Change or add:
- **Line reveal**: headings rise line by line from a mask (existing `SplitReveal`, retuned to 0.9 s, ease-out-expo).
- **Intro** (first visit per session only, ≤ 1.2 s, skippable): ink screen, "MINHAJ" counts in, wipes up to the hero.
  Inspired by #114 Kinetiq.
- **Cursor video preview** on the Work index: hovering a row shows that project's `.mp4` in a 320×200 box
  following the cursor. Desktop pointer only.
- **Custom cursor**: small lime dot on ink sections, ink dot on paper. Desktop pointer only.
- Reduced motion: no intro, no cursor preview, no marquee, reveals become a simple fade.

No WebGL or 3D. That keeps the bundle small and mobile fast.

## 5. Pages and sections

### Top bar (all pages)
Mono, 12 px, on the section colour below it (mix-blend difference so it reads on both). Left: `MINHAJ©26`.
Centre: `Work · About · Contact`. Right: Dubai local time (live clock, `Asia/Dubai`) and a lime dot + "Available".
Replaces `TopBar.tsx` and removes `ThemeToggle.tsx`.

### Home (`app/page.tsx`), top to bottom
1. **Hero — paper.** Meta grid of four mono cells: role, location, current year, availability. B/W avatar right.
   Short line (≤ 12 words) from `profile.summary`. Giant "MINHAJ" across the full width, cropped at the bottom edge.
   Ref #121, #33.
2. **Clients — paper.** One line of client names in large text scrolling slowly, separated by `/`.
   Replaces the card marquee. Ref #3.
3. **Showreel — ink.** Full-bleed, video scales from 70% to 100% width on scroll (`ScrollScale`). Mono label
   `SHOWREEL — 2026` top-left. Ref #8, #19.
4. **Selected work — ink.** Title "Work" giant. Numbered index rows: `01 · Title · Type · Year →`, 1 px rules.
   Hover: row text goes lime, cursor video preview appears. Click opens `/work/[slug]`. Shows the six projects in the existing
   `HOME_PICKS` list (`components/Work.tsx`), then "All projects →" with the live count. Ref #33, #110.
5. **Story — paper.** The four `story.chapters` laid on the grid: year huge (`clamp(4rem,12vw,10rem)`),
   place in mono, title and body beside. Ref #120.
6. **Services — paper.** Numbered list, title left, body right, 1 px rules. No icons.
7. **Contact footer — ink.** Giant "LET'S BUILD" on a lime band (ink text). Below: email with copy button,
   WhatsApp, CV download, socials, Dubai time. Ref #110, #32.

### `/work`
Paper. Giant "Work" title. Category filter as mono text toggles (`All / Shopify / Websites / Apps`), active one
in an ink block. List view (same index rows as home, with cursor preview) plus a grid toggle that shows covers
in a 2-col, square-corner grid.

### `/work/[slug]`
Ink header with giant title and a mono meta row (type, category, year, stack). Full-width cover/video.
Case-study sections on paper in the 12-col grid: problem/solution side by side, architecture as a table with
rules, engineering notes numbered, `numbers` as giant figures with lime underline on ink. Next-project link at
the bottom as a giant title.

### `/about`
Paper hero "The full picture." giant. B/W portrait. Experience as a table (years / company / role) with rules.
Education and skills as mono lists. CV download as an ink button. Same contact footer.

## 6. Code changes

- `app/layout.tsx`: Geist + Geist Mono instead of Poppins; `themeColor` → `#0E0E0C`.
- `app/globals.css` + `tailwind.config.ts`: replace the token set with `ink`, `paper`, `lime`; add
  `font-mono`; remove `panel` radius, `pine`, `sage`; add fluid display sizes as utilities.
- Remove `next-themes`, `Providers` theme wrapper and `ThemeToggle.tsx`.
- Rewrite: `TopBar`, `Hero`, `Clients`, `Showreel`, `Work`, `WorkGrid`, `Story`, `Services`, `Contact`,
  `PageHeader`, `Experience`, `ProjectCover`.
- New: `components/WorkIndex.tsx` (numbered rows + preview), `components/CursorPreview.tsx`,
  `components/Cursor.tsx`, `components/Intro.tsx`, `components/DubaiClock.tsx`, `components/Section.tsx`
  (sets ink/paper and the top-bar colour).
- Keep data files unchanged except a new optional `year?: string` on `Project`. Rows without a year show
  the category label instead.
- Hugeicons stay only where an icon is needed (copy, arrow, download).

## 7. Testing

- `npm run build` passes with no type errors.
- Browser check at 1440, 768 and 375 px on all four pages: screenshots, no console errors, no horizontal scroll.
- Reduced-motion check via emulation.
- Lighthouse mobile on home against the targets in §2.
- Contrast check: no lime text on paper anywhere (grep for lime text classes inside paper sections).

## 8. Out of scope

- Live gold (XAU) rate in the hero. It was removed in an earlier commit on purpose; add back only if the owner asks.
- New content or copywriting beyond shortening the hero line.
- The public inspiration-gallery product idea (separate project).
- A CMS.
