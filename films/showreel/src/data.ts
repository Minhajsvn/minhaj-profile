// Product truth: the live sites, their real domains and when each one is in the window. Acts read
// this module only; the asserts below keep the story and the data in step.
import { staticFile } from 'remotion';
import { ACT, CUE } from './timeline';

export type Site = {
  slug: string;
  name: string;
  domain: string; // exactly what the address bar shows: the live site's real host
  clip: string; // public/clips/<slug>.mp4: 1440x900, 60 fps, scrolling capture of the live site
  at: number; // absolute frame the page starts to load in the window (its wipe begins)
  frames: number; // clip length in film frames (measured from public/clips)
  rate?: number; // playback rate (1 by default; a short page can instead be captured with a shorter scroll)
};

const clip = (slug: string) => staticFile(`clips/${slug}.mp4`);

/** In navigation order. The wall shows all of them; the window shows them one after another. */
export const SITES: Site[] = [
  { slug: 'blue-diamond-jewellery', name: 'Blue Diamond', domain: 'bluediamondjewellery.com', clip: clip('blue-diamond-jewellery'), frames: 540, at: CUE.accept },
  { slug: 'hi-life-furniture-rentals', name: 'Hi-Life', domain: 'hilife-website.minhaj-a2a.workers.dev', clip: clip('hi-life-furniture-rentals'), frames: 540, at: CUE.navHiLife },
  { slug: 'aurify-technology', name: 'Aurify', domain: 'aurify.global', clip: clip('aurify-technology'), frames: 540, at: CUE.navAurify },
  { slug: 'promise-gold-refinery', name: 'Promise Gold Refinery', domain: 'promisegoldrefinery.com', clip: clip('promise-gold-refinery'), frames: 540, at: CUE.navPromise },
  { slug: 'blackmamba-real-estate', name: 'BlackMamba', domain: 'blackmamba.realestate', clip: clip('blackmamba-real-estate'), frames: 540, at: CUE.navBlackMamba },
  { slug: '3r-creative', name: '3R Creative', domain: 'creative3r.com', clip: clip('3r-creative'), frames: 540, at: CUE.nav3R },
  { slug: 'insight-edge-global', name: 'Insight Edge', domain: 'insightedge.global', clip: clip('insight-edge-global'), frames: 540, at: CUE.navInsight },
];

/** What the user types before the browser suggests the rest (a prefix of the first domain). */
export const TYPED = 'bluedia';

/** The site in the window at absolute frame f (the last one whose load has begun). */
export const siteAt = (f: number) => [...SITES].reverse().find((s) => f >= s.at) ?? null;

// ---- asserts: data and story agree ----
const assert = (ok: boolean, msg: string) => {
  if (!ok) throw new Error(`data: ${msg}`);
};
assert(SITES[0].domain.startsWith(TYPED), 'the typed prefix must begin the first domain');
SITES.forEach((s, i) => {
  if (i > 0) assert(s.at > SITES[i - 1].at, `${s.slug} must load after ${SITES[i - 1].slug}`);
});
// Each site stays in the window until the next loads; that span must fit inside its clip.
SITES.forEach((s, i) => {
  const until = SITES[i + 1]?.at ?? ACT.wall.from;
  assert((until - s.at) * (s.rate ?? 1) <= s.frames, `${s.slug} is on screen ${until - s.at} f, longer than its ${s.frames} f clip`);
});
// The copy lands on the right sites: "refineries" over Promise, "real estate" over BlackMamba.
assert(siteAt(CUE.slotA)?.slug === 'promise-gold-refinery', '"refineries" must land over Promise Gold Refinery');
assert(siteAt(CUE.slotB)?.slug === 'blackmamba-real-estate', '"real estate" must land over BlackMamba');
