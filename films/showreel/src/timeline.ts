// The single source of truth for time. Picture (src/acts), sound (src/sync.ts -> out/cues.json)
// and QA (scripts/grid-check.ts) all import this file, so a change here moves everything together.
// Think in bars and beats, never in seconds. Keep this file free of React and CSS imports:
// Node scripts load it directly.
import { holdFor, PACE, readingWindows, revealFor, wordCount, type PaceName } from './lib/pace';

export { PACE } from './lib/pace'; // grid-check checks COPY against the film's own pace numbers

export const FPS = 60;
export const BPM = 100;
export const W = 1920;
export const H = 1080;
/**
 * The film's pace (src/lib/pace.ts). calm: text arrives as short fragments that take turns with
 * the picture, held about 1-1.5 s (the default for text-led films, at 90-100 BPM). crisp: the
 * denser launch-film tempo, for briefs that ask for energy (at 120 BPM).
 */
export const PACE_NAME: PaceName = 'calm';

/** Frames per beat. Must be a whole number (grid-check fails otherwise): 60 fps -> 90, 100, 120, 144, 150 BPM. */
export const BEAT = (60 / BPM) * FPS;
export const BAR = BEAT * 4;
/**
 * Absolute frame of a grid position: bar is 1-based, beat 0-3, sub = 16ths within the beat.
 * b(3) is the downbeat of bar 3; b(2, 1, 2) is the "and" of beat 2 in bar 2.
 */
export const b = (bar: number, beat = 0, sub = 0) => Math.round(((bar - 1) * 4 + beat) * BEAT + sub * (BEAT / 4));

/**
 * A choreography length written in 60 fps frames (the unit every number in the cinetic
 * references uses), converted to this film's fps. Cues come from b(); durations inside a move
 * use f60(), so the film keeps its timing if --fps changes.
 */
export const f60 = (frames: number) => Math.round((frames * FPS) / 60);

/** After the last bar the picture holds while the audio decays to digital silence. */
export const TAIL = FPS;

// Acts: contiguous, bar-aligned, [from, from + dur). Each act is its own composition in Root.tsx.
// One browser window is the film's device: it opens on its address bar, navigates through the
// live sites, becomes one tile of the wall, and hands off to the avatar.
export const ACT = {
  address: { from: b(1), dur: b(4) - b(1) }, // tight on an empty address bar; a domain is typed; the page loads; pull back
  sites: { from: b(4), dur: b(10) - b(4) }, // the window navigates: page wipes up, URL rolls
  wall: { from: b(10), dur: b(13) - b(10) }, // pull back to the wall of live sites; velocity handoff out
  lockup: { from: b(13), dur: b(15) - b(13) }, // the avatar brakes in; the name; the descriptor; the living hold
};

export const TOTAL = b(15); // the lockup's living hold carries the tail (the master is silent)

// Named sync points (absolute frames), all on the 16th grid. Picture code reads these.
export const CUE = {
  // act: address
  type: b(1, 0, 1), // the film opens typing: "bluedia" at a human 14 cps, the camera already creeping
  fragA: b(1, 0, 3), // "A website" rises while the domain is typed, and is read while the cursor waits
  ghost: b(1, 3, 3), // the browser suggests the rest of the domain in mute, with an Enter chip
  accept: b(2, 0, 2), // Enter: the suggestion inks in, the live dot lights, the page wipes up
  fragB: b(2, 1, 3), // "is a shopfront." completes the line over the loaded page
  pull: b(3, 2), // after the line has left: pull back from the bar to the whole window
  pullEnd: b(4), // ...at rest on the act seam
  push: b(4, 2), // a slow push toward the page begins while it scrolls
  // act: sites (each navigation: the URL rolls, the page wipes up, the live dot relights)
  // each navigation: the loading line runs under the chrome and completes half a bar later, when
  // the live dot turns gold (the accent means "live")
  navHiLife: b(5),
  liveHiLife: b(5, 2),
  navAurify: b(6),
  liveAurify: b(6, 2),
  navPromise: b(7),
  slotA: b(7, 1), // "For refineries" lands after Promise's page has
  livePromise: b(7, 2, 1),
  navBlackMamba: b(8),
  slotB: b(8, 1), // "real estate." lands after BlackMamba's page has
  liveBlackMamba: b(8, 2),
  nav3R: b(9),
  live3R: b(9, 1),
  navInsight: b(9, 2),
  liveInsight: b(9, 3),
  // act: wall
  wallPull: b(10), // the window pulls back into one tile of the wall
  wallRest: b(10, 2), // the wall is at rest; the camera breathes from here
  keepA: b(10, 3, 1), // "Shopfronts" (the refrain of "is a shopfront.")
  liveDots: b(11, 2), // after it has been read: each tile's live dot lights in turn (picture beat)
  keepB: b(11, 2, 3), // "that earn their keep." (the payoff)
  ramp: b(12, 3, 2), // after the line has been read: the wall accelerates left into the cut (velocity handoff)
  // act: lockup
  handoff: b(13), // the avatar enters already moving left and brakes; its picture rises into the circle
  name: b(13, 1), // the name
  role: b(14), // the descriptor, once the name has been read
};

export type Copy = {
  id: string;
  text: string; // exactly what is on screen (\n separates lines)
  in: number; // first frame any of it is visible
  resolved: number; // first frame it is fully readable
  out: number; // first frame it starts to leave (TOTAL if it stays)
  kind?: 'copy' | 'ui'; // 'ui': a string the product shows (a typed command, code, a URL, an app label); not budgeted
  chain?: string; // the thought this fragment belongs to (fx/Chain renders a chain; grid-check checks its gaps)
  mode?: 'build' | 'replace'; // build: fragments append to one held line; replace: each takes the last one's place
};

const pace = PACE[PACE_NAME];

/**
 * One line of copy revealed word by word with this film's pace (the numbers <Words> uses), so
 * `resolved` is the frame its last word is fully in. `out` defaults to the pace's hold.
 */
export const line = (id: string, text: string, inF: number, out?: number): Copy => {
  const n = wordCount(text);
  const resolved = inF + f60(revealFor(n, pace));
  return { id, text, in: inF, resolved, out: out ?? resolved + f60(holdFor(n, pace)) };
};

/**
 * One thought as a chain of fragments, one COPY entry each (`<id>.1`, `<id>.2`, ...), rendered by
 * fx/Chain. A thought longer than 4 words arrives this way: 1-4 words per fragment, never a whole
 * sentence at once, with a picture beat between fragments (the product does what the fragment set
 * up). Give each fragment its first frame; `resolved` follows from the pace.
 *   build    fragments append to one held line, which re-centres; the line clears as a whole, at
 *            `out` (default: the last fragment's resolve plus the hold of the full line)
 *   replace  each fragment leaves (as a whole, over pace.exitDur: 24 f when calm) and has gone
 *            6 f before the next one rises in its place, so two fragments never share the spot;
 *            the last one leaves at `out` (default: its resolve plus its hold)
 * grid-check checks the result: every fragment is read before the next arrives, the picture beat
 * between them, the words on screen at once and the copy rate.
 */
export const chain = (id: string, mode: 'build' | 'replace', fragments: [text: string, inF: number][], o: { out?: number } = {}): Copy[] => {
  const base = fragments.map(([text, inF], i) => ({ id: `${id}.${i + 1}`, text, in: inF, resolved: inF + f60(revealFor(wordCount(text), pace)), chain: id, mode }));
  const last = base[base.length - 1];
  if (!last) throw new Error(`timeline: chain "${id}" has no fragments`);
  const words = (list: { text: string }[]) => list.reduce((n, c) => n + wordCount(c.text), 0);
  if (mode === 'build') {
    const out = o.out ?? last.resolved + f60(holdFor(words(base), pace));
    return base.map((c) => ({ ...c, out }));
  }
  // replace: the outgoing fragment's exit (exitDur) is over 6 f before the next one starts to rise
  const leave = f60(pace.exitDur) + f60(6);
  return base.map((c, i) => ({ ...c, out: base[i + 1] ? base[i + 1].in - leave : (o.out ?? c.resolved + f60(holdFor(wordCount(c.text), pace))) }));
};

// Every on-screen word: the word budget (kind: 'ui' entries are counted apart), the hold check,
// and the text-flow checks (fragments, words on screen at once, copy rate, text share) read this.
export const COPY: Copy[] = [
  // "A website" -> the domain is typed and accepted, the page loads -> "is a shopfront."
  ...chain('web', 'build', [['A website', CUE.fragA], ['is a shopfront.', CUE.fragB]]),
  // Who it is for, each half landing after its site's page has: Promise, then BlackMamba.
  ...chain('for', 'replace', [['For refineries', CUE.slotA], ['real estate.', CUE.slotB]]),
  // The refrain pays off the opening metaphor: a shopfront -> shopfronts that earn their keep.
  ...chain('keep', 'build', [['Shopfronts', CUE.keepA], ['that earn their keep.', CUE.keepB]]),
  { ...line('wordmark', 'Mohammad Minhaj', CUE.name), out: TOTAL },
  { ...line('role', 'Full-stack developer, Dubai.', CUE.role), out: TOTAL },
];

/**
 * When each COPY entry is being read: [from, to) frame ranges by id (src/lib/pace.ts
 * readingWindows(): from `resolved` for at most readMax, an earlier fragment of a build chain only
 * for its own hold, then the whole line again). The one rule every check uses: export-cues.ts
 * writes it into out/cues.json, and grid-check, layout-audit, measure-speed and forensics read it.
 * Nothing new should start inside a window: the read happens in the quiet.
 */
export const READ = readingWindows(COPY, pace, FPS, TOTAL);

/** One COPY entry by id; acts read their text and timing from here so the budget stays true. */
export const copy = (id: string): Copy => {
  const c = COPY.find((x) => x.id === id);
  if (!c) throw new Error(`timeline: no COPY entry "${id}"`);
  return c;
};

/** The fragments of one chain, in order of arrival. */
export const chainOf = (id: string): Copy[] => {
  const list = COPY.filter((x) => x.chain === id).sort((p, q) => p.in - q.in);
  if (!list.length) throw new Error(`timeline: no COPY chain "${id}"`);
  return list;
};
