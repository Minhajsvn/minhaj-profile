# BRIEF: Mohammad Minhaj — portfolio showreel

**Spec:** `1920x1080@60, 29.8s, 100BPM, pace: calm, audio: none (silent master)` · **Format:** launch film structure, adapted as a portfolio showreel · **Engine:** Remotion 4.0.529

## What it is
A 30-second film for the homepage of Mohammad Minhaj's portfolio (Full-stack developer, Dubai). It shows seven live client websites he built — Blue Diamond Jewellery, Hi-Life Furniture Rentals, BlackMamba Real Estate, Promise Gold Refinery, 3R Creative, Aurify Technology, Insight Edge Global — so that a visiting client or recruiter believes: *he builds real, polished sites for brands like mine.*

## Where it is shown (the destination decides)
- **Muted** autoplay inside the portfolio homepage (section between the client strip and "Selected work"), with a pause/play control. It must read with the sound off.
- **Plays once, then rests on its final frame** — the final frame is the poster and must carry the avatar and the name.
- 16:9 only. No 9:16 / 1:1 re-layouts (the destination is the website, not social feeds).

## Assumptions (inferred, not told)
- The user invoked cinetic to raise the existing HTML-recorded showreel to film grade; the content (seven sites, end line "Stores and sites that earn their keep.") carries over from the approved site copy.
- **Silent master**: the homepage plays muted and the earshot sound kit is not installed on this machine, so no soundtrack is made. The picture carries the rhythm (100 BPM grid).
- Footage: the scrolling clips are re-captured from the live sites at 1.5× pixel density, 60 fps, near-lossless (`scripts/capture-sites.mjs` in the site repo).

## Brand (supplied — the brand wins)
The portfolio's own identity, already live on the site:
- Paper `#F2EEE9` (cream), surface `#FAF8F5`, border `#E2DCD3`, ink `#002E23` (deep green), mute `#5C6B64`, pine `#0F4A3A`, sage `#8FA89A`.
- Accent `#D4A24C` (gold) — means **"live"**: a site that has just gone live / loaded.
- Type: **Poppins** (static weights 300 / 600), the site's only face.
- Mark: Minhaj's 3D illustrated avatar (aviators, small gold crown) in a circle, plus the name "Mohammad Minhaj".

## Hard bans (from cinetic SKILL.md — the QA contract)
- Words: no eyebrow/kicker labels above a headline; no stacked taglines; no "Introducing…"; no full sentence dumped at once (copy arrives as fragments of ≤ 4 words with picture between); no text walls or filler text (decorative captions, fake metrics, labels nobody needs).
- Type: no serif, no italic/oblique (or skew faking one). One sans.
- Colour: no orange/amber/beige/cream/tan/sand; no neon, glow, bloom, halo; no purple/violet/indigo or multi-hue gradients; no glassmorphism.
- Decoration: no emoji, stock icons, AI sparkles, particles, confetti, lens flares, code rain; no bouncy overshoot except a true landing; no overshoot or per-letter trick on copy.

## Brand-supplied exceptions (not to be flagged)
- **Cream paper `#F2EEE9`** and **warm neutrals** (`#FAF8F5`, `#E2DCD3`): the portfolio's stage colour. Marked `// cinetic:brand-supplied cream stage`.
- **Gold accent `#D4A24C`** (amber family): the portfolio's accent. Marked `// cinetic:brand-supplied gold accent`. Used only to mean "live", ≤ 8% of pixels, never as text on cream (contrast).
- **The client sites' own content** inside the browser window (their logos, serif headlines, photography, colours) is product footage, not the film's invented look.
