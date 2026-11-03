import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, U } from '../brand/tokens';
import { SITES, type Site } from '../data';
import { Chain } from '../fx/Chain';
import { arrive, depart, E, lmix, prog } from '../lib/anim';
import { camera } from '../lib/camera';
import { ACT, CUE, f60 } from '../timeline';
import { BrowserWindow, dotColor, Page, pageH, urlStyle, WIN, wipeAt, wipeStyle } from '../world/BrowserWindow';
import { FULL } from './Address';

// ACT 2 - the window navigates. It holds the full shot under a slow push; each new site loads in
// place: the old URL rolls up and away while the new one rises (the anchor, the live dot, never
// moves), the loading line runs along the chrome, and the new page wipes up from the window's
// bottom edge over the old one. Half a bar later the line completes and the dot turns gold: live.
// The copy takes its turns above the window, each half landing after its site's page has.


/** The live cue that follows each navigation (the first site went live in Act 1). */
const LIVE: Record<string, number> = {
  'blue-diamond-jewellery': CUE.accept + f60(36),
  'hi-life-furniture-rentals': CUE.liveHiLife,
  'aurify-technology': CUE.liveAurify,
  'promise-gold-refinery': CUE.livePromise,
  'blackmamba-real-estate': CUE.liveBlackMamba,
  '3r-creative': CUE.live3R,
  'insight-edge-global': CUE.liveInsight,
};

/** Index of the site in the window at absolute frame F. */
const indexAt = (F: number) => SITES.reduce((k, s, i) => (F >= s.at ? i : k), 0);

/** The URL roll: the outgoing domain lifts away on E.in, the incoming one rises in 4 f later on E.out. */
const UrlRoll: React.FC<{ F: number; prev: Site | null; cur: Site }> = ({ F, prev, cur }) => {
  const q = prog(F, cur.at - 1, cur.at - 1 + f60(12), E.in);
  const p = prog(F, cur.at + f60(3), cur.at + f60(27), E.out);
  return (
    <>
      {prev && q < 1 && (
        <span data-ui="url" style={{ ...urlStyle(), position: 'absolute', left: 0, top: 0, opacity: 1 - prog(F, cur.at - 1, cur.at + f60(11), E.smooth), transform: `translateY(${(-depart(q) * 0.5).toFixed(3)}em)` }}>
          {prev.domain}
        </span>
      )}
      <span data-ui="url" style={{ ...urlStyle(), position: 'absolute', left: 0, top: 0, opacity: prog(F, cur.at + f60(3), cur.at + f60(13), E.smooth), transform: `translateY(${((1 - arrive(p)) * 0.6).toFixed(3)}em)` }}>
        {cur.domain}
      </span>
    </>
  );
};

export const Sites: React.FC = () => {
  const f = useCurrentFrame();
  const F = f + ACT.sites.from;
  const i = indexAt(F);
  const cur = SITES[i];
  const prev = i > 0 ? SITES[i - 1] : null;

  // Camera: the full shot, then a slow 5% push from mid-bar 4 that runs into the wall's pull-back.
  const cam = { ...FULL, k: lmix(1, 1.05, prog(F, CUE.push, ACT.wall.from, E.dolly)) };

  const live = LIVE[cur.slug];
  const loading = cur.at === CUE.accept ? 1 : prog(F, cur.at, live, E.ui);
  const lit = prog(F, live, live + f60(10), E.smooth);
  const ph = pageH(WIN.w);

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <div style={camera(cam)}>
        <BrowserWindow
          x={WIN.x}
          y={WIN.y}
          w={WIN.w}
          address={<UrlRoll F={F} prev={F < cur.at + f60(14) ? prev : null} cur={cur} />}
          dot={dotColor(1, lit)}
          loading={F < live + f60(10) ? loading : -1}
          loadingFade={1 - lit}
        >
          {/* The previous page stays under the wipe until the new one covers it; then only one plays. */}
          {SITES.map((s, j) => {
            const covering = j === i || (j === i - 1 && wipeAt(F, cur.at) < 1);
            if (!covering) return null;
            return (
              <div key={s.slug} style={j === i ? wipeStyle(wipeAt(F, s.at), ph) : { position: 'absolute', inset: 0 }}>
                <Page site={s} from={s.at} act={ACT.sites.from} />
              </div>
            );
          })}
        </BrowserWindow>
      </div>
      <Chain chain="for" frame={f} from={ACT.sites.from} role="line" size={64 * U} top={88 * U} accent="none" />
    </AbsoluteFill>
  );
};
