import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, U } from '../brand/tokens';
import { SITES } from '../data';
import { Chain } from '../fx/Chain';
import { E, mix, prog } from '../lib/anim';
import { breath, camera, lc, type Shot } from '../lib/camera';
import { ACT, CUE, f60 } from '../timeline';
import { BrowserWindow, dotColor, Page, urlStyle, WIN, winH } from '../world/BrowserWindow';
import { FULL } from './Address';

// ACT 3 - the wall. The window the film has lived in pulls back (log space, E.cam) and becomes one
// tile of a 4 + 3 wall of every live site, each still scrolling. "Shopfronts" is read over the
// wall; then each tile's gold live badge lights in turn, left to right; then "that earn their
// keep." completes the refrain. The wall breathes through the read, and once it has been read it
// accelerates left on E.exit into the cut: Act 4 opens moving the same way (velocity handoff).

const L = (abs: number) => abs - ACT.wall.from;
const G = 260; // world gap between tiles: wide enough that no neighbour is in frame before the pull-back
const TH = winH(WIN.w); // tile height (world)

// Rows in world px. The window from Act 2 (Insight, the last site) is the middle of row 2, in
// place, so the pull-back is a pure camera move: nothing jumps.
const ROW2 = ['blackmamba-real-estate', 'insight-edge-global', '3r-creative'];
const ROW1 = ['blue-diamond-jewellery', 'hi-life-furniture-rentals', 'aurify-technology', 'promise-gold-refinery'];
const rowX0 = (n: number) => WIN.x + WIN.w / 2 - (n * WIN.w + (n - 1) * G) / 2;
export const TILES = [
  ...ROW1.map((slug, j) => ({ slug, x: rowX0(4) + j * (WIN.w + G), y: WIN.y - TH - G })),
  ...ROW2.map((slug, j) => ({ slug, x: rowX0(3) + j * (WIN.w + G), y: WIN.y })),
];
const CENTER = { x: WIN.x + WIN.w / 2, y: (WIN.y - TH - G + WIN.y + TH) / 2 };

/** Act 2 ends on the full shot pushed to 1.05; the pull-back starts there. */
const FROM: Shot = { ...FULL, k: 1.05 };
/** The wall framed under the copy band. */
const WALL: Shot = { ax: CENTER.x, ay: CENTER.y, sx: 960, sy: 610, k: 0.28 };

/** The handoff: over the act's last 18 f the wall accelerates left on E.exit to ~40 px/f. */
export const HANDOFF_V = 40; // px/f at the cut (Act 4's entry speed)
const RAMP_D = (HANDOFF_V * (ACT.wall.from + ACT.wall.dur - CUE.ramp)) / 3; // cubic-in: v_end ≈ 3D/T

export const Wall: React.FC = () => {
  const f = useCurrentFrame();
  const F = f + ACT.wall.from;

  const pull = prog(F, CUE.wallPull - 1, CUE.wallRest, E.cam);
  const cam = lc(FROM, WALL, pull);
  cam.k *= breath(prog(F, CUE.wallRest, CUE.ramp, E.linear), 0.04);
  cam.sx -= mix(0, RAMP_D, prog(F, CUE.ramp, ACT.wall.from + ACT.wall.dur, E.exit));

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <div style={camera(cam)}>
        {TILES.map((t, i) => {
          const site = SITES.find((s) => s.slug === t.slug)!;
          const main = t.slug === 'insight-edge-global';
          const lit = prog(F, CUE.liveDots + i * f60(5), CUE.liveDots + i * f60(5) + f60(14), E.out);
          return (
            <BrowserWindow
              key={t.slug}
              x={t.x}
              y={t.y}
              w={WIN.w}
              dot={dotColor(1, main ? 1 : lit)}
              badge={lit}
              shadow={main ? 1 : pull}
              address={
                <span data-ui="url" style={{ ...urlStyle(), position: 'absolute', left: 0, top: 0 }}>
                  {site.domain}
                </span>
              }
            >
              {/* The window keeps playing its page; the other tiles loop theirs from a little way in. */}
              {main ? <Page site={site} from={site.at} act={ACT.wall.from} /> : <Page site={site} from={ACT.wall.from} act={ACT.wall.from} loop trim={30} />}
            </BrowserWindow>
          );
        })}
      </div>
      <Chain chain="keep" frame={f} from={ACT.wall.from} role="line" size={64 * U} top={88 * U} accent="none" />
    </AbsoluteFill>
  );
};

if (L(CUE.ramp) <= 0) throw new Error('Wall: the ramp must start inside the act');
