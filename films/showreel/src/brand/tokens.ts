// Brand tokens: the only place a colour, face or type size is written down. Acts import these;
// scripts/lint-film.mjs fails any hex colour that is not declared here.
//
// The palette is the portfolio's own (supplied by the user's live site, see BRIEF.md): a cream
// stage, deep-green ink and one gold accent. The cream and the gold sit in families the house bans
// would refuse for an invented brand; here the brand wins, and each line says so.
import type React from 'react';
import { safeInsets } from '../lib/safe';
import { H, W } from '../timeline';

export const C = {
  ink: '#002E23', // deep green: type and the lockup
  ink2: '#0F4A3A', // pine: hover-dark surfaces, the window's hairline on cream
  paper: '#F2EEE9', // cinetic:brand-supplied cream stage (the portfolio's page colour)
  surface: '#FAF8F5', // cinetic:brand-supplied cream surface: the empty page, address pill
  chrome: '#E9E4DC', // cinetic:brand-supplied warm chrome: the browser's title bar
  line: '#E2DCD3', // cinetic:brand-supplied warm hairline: borders on cream
  mute: '#5C6B64', // secondary text: 5.1:1 on paper
  sage: '#8FA89A', // quiet UI marks (window dots), never text
  white: '#FFFFFF',
  // The one accent, and what it means: "live" - a page that has just loaded. The portfolio's gold.
  // Graphics only (2.1:1 on cream): the address bar's live dot and the wall's live dots. Never text.
  accent: '#D4A24C', // cinetic:brand-supplied gold accent
};

export const FONT = {
  text: '"Poppins", system-ui, sans-serif', // the portfolio's one sans, every role (brand-supplied)
  mono: '"Poppins", system-ui, sans-serif', // no mono: the film has no code
};

/** Faces the FontGate waits for before anything renders or measures (one entry per weight in use). */
export const FACES = ['300 16px "Poppins"', '600 16px "Poppins"'];

/** Layout unit: 1 at 1080p, scales every size with the short side of the frame (16:9, 9:16, 1:1). */
export const U = Math.min(W, H) / 1080;

// One token per role, reused everywhere (size in px at 1080p). The site's headings are Poppins 600
// at -0.035 em; its quiet lines are Poppins 300.
export const TYPE = {
  display: { size: 104, weight: 600, track: -0.035, lead: 1.0 }, // the name in the lockup
  line: { size: 64, weight: 600, track: -0.03, lead: 1.1 }, // fragment chains above the window
  secondary: { size: 40, weight: 300, track: -0.01, lead: 1.2 }, // the descriptor under the name
  ui: { size: 24, weight: 300, track: 0, lead: 1.3 }, // the address bar's URL
};

/** CSS for a type role at a size (px). Tabular figures always, so numbers never jitter in width. */
export const typeStyle = (role: keyof typeof TYPE, size = TYPE[role].size * U): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: size,
  fontWeight: TYPE[role].weight,
  letterSpacing: `${TYPE[role].track}em`,
  lineHeight: TYPE[role].lead,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'pre',
});

/**
 * Safe margins for a w x h frame as a symmetric envelope: the larger inset of each pair from the
 * frame's safe-zone preset (src/lib/safe.ts), so a centred layout that fits inside clears every
 * side. 96 x 64 px at 1920x1080.
 */
export const safeArea = (w: number, h: number) => {
  const i = safeInsets(undefined, w, h);
  return { x: Math.max(i.left, i.right), y: Math.max(i.top, i.bottom) };
};
/** The film's safe margins; text stays inside them (scripts/layout-audit.sh checks). */
export const SAFE = safeArea(W, H);
