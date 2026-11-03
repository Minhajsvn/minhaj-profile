import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, U } from '../brand/tokens';
import { SITES, TYPED } from '../data';
import { Chain } from '../fx/Chain';
import { TypeOn, typeOn } from '../fx/TypeOn';
import { clamp, E, fd, lmix, prog, spr, SPR } from '../lib/anim';
import { breath, camera, lc, type Shot } from '../lib/camera';
import { mixColor } from '../lib/color';
import { ACT, CUE, f60, H, W } from '../timeline';
import { BrowserWindow, dotColor, Page, PILL, pillX, URL_SIZE, URL_X, urlStyle, WIN, wipeAt, wipeStyle, pageH } from '../world/BrowserWindow';

// ACT 1 - the address bar. Frame 0 is tight on an empty browser's address bar, the camera already
// creeping in, and "bluedia" is being typed at once. "A website" rises above it and is read while
// the cursor waits. Then the picture takes its turn: the browser suggests the rest of the domain in
// mute with an Enter key chip, Enter is pressed, the suggestion inks in, the live dot lights and the page wipes up from
// the window's bottom edge (the film's signature move). "is a shopfront." completes the line over
// the loaded page. Once the line has left, the camera pulls back to the whole window: Act 2 opens
// on exactly that pose.

const L = (abs: number) => abs - ACT.address.from;
const SITE = SITES[0];
const GHOST = SITE.domain.slice(TYPED.length);

/** The full shot every later act starts from: world = screen. */
export const FULL: Shot = { ax: W / 2, ay: H / 2, sx: W / 2, sy: H / 2, k: 1 };
/** Tight on the address pill: the typed URL is the hero (about 60 px on screen), framed below the copy band. */
const TIGHT: Shot = { ax: W / 2, ay: WIN.y + PILL.y + PILL.h / 2, sx: W / 2, sy: 620, k: 2.8 };

const TYPE_T = { start: L(CUE.type), cps: 14 };
const LOADED = L(CUE.accept) + f60(36); // the wipe's end: the page is live

export const Address: React.FC = () => {
  const f = useCurrentFrame();
  const F = f + ACT.address.from;

  // Camera: frame 0 already moves - the act opens very tight and eases back toward the tight shot
  // (one continuous pull-back that the CUE.pull move later carries on), so the hook is alive at once.
  const tight = { ...TIGHT, k: lmix(TIGHT.k * 1.18, TIGHT.k, prog(f, -1, L(CUE.pull), E.outSoft)) };
  const cam = lc(tight, FULL, prog(f, L(CUE.pull), L(CUE.pullEnd), E.cam));
  // A 2% breath while the suggestion waits for its key.
  const wait = prog(f, L(CUE.ghost), L(CUE.accept), E.smooth) * (1 - prog(f, L(CUE.accept), L(CUE.accept) + f60(20), E.smooth));
  cam.k *= breath(wait, 0.02);

  // Address bar: the typed prefix, then the ghost suggestion and its key chip.
  const typed = typeOn(TYPED, f, { ...TYPE_T, role: 'ui', size: URL_SIZE });
  const ghostOn = f >= L(CUE.ghost);
  const accepted = f >= L(CUE.accept);
  const front = clamp(fd(prog(f, L(CUE.accept) - 1, L(CUE.accept) + f60(10), E.linear) * GHOST.length), 0, GHOST.length);
  const chipIn = spr(f, L(CUE.ghost), SPR.micro);
  const chipOut = prog(f, L(CUE.accept) + f60(4), L(CUE.accept) + f60(12), E.smooth);
  const press = prog(f, L(CUE.accept) - 1, L(CUE.accept) + f60(3), E.ui) * (1 - prog(f, L(CUE.accept) + f60(3), L(CUE.accept) + f60(11), E.out));

  const address = (
    <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center' }}>
      <TypeOn text={TYPED} frame={f} {...TYPE_T} role="ui" size={URL_SIZE} id="url-typed" caretOut={L(CUE.ghost)} style={urlStyle()} />
      {ghostOn && (
        <span data-ui="url-ghost" style={urlStyle(C.mute)}>
          {[...GHOST].map((ch, i) => (
            <span key={i} style={{ color: accepted && i < front ? mixColor(C.ink2, C.ink, prog(f, L(CUE.accept) + i, L(CUE.accept) + i + f60(12), E.smooth)) : C.mute }}>
              {ch}
            </span>
          ))}
        </span>
      )}
    </div>
  );

  // The Enter chip sits just past the suggestion, outside the pill's clip, so it is drawn in world
  // space beside the window's pill.
  const ghostEnd = WIN.x + pillX(WIN.w) + URL_X + typed.caretX + measureGhost();
  const loading = prog(f, L(CUE.accept), LOADED, E.ui);
  const live = prog(f, LOADED, LOADED + f60(10), E.smooth);

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <div style={camera(cam)}>
        <BrowserWindow
          x={WIN.x}
          y={WIN.y}
          w={WIN.w}
          address={address}
          dot={dotColor(accepted ? 1 : 0, live)}
          loading={accepted ? loading : -1}
          loadingFade={1 - live}
        >
          {f >= L(CUE.accept) - 1 && (
            <div style={wipeStyle(wipeAt(F, CUE.accept), pageH(WIN.w))}>
              <Page site={SITE} from={SITE.at} act={ACT.address.from} />
            </div>
          )}
        </BrowserWindow>
        {ghostOn && chipOut < 1 && (
          <div
            data-ui="key-enter"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: 30,
              padding: '0 12px',
              borderRadius: 7,
              background: C.white,
              boxShadow: `0 0 0 1.5px ${C.line}, 0 ${3 - 2 * press}px 0 ${C.line}`,
              display: 'flex',
              alignItems: 'center',
              ...urlStyle(C.mute),
              fontSize: 15,
              lineHeight: '30px',
              opacity: Math.min(1, chipIn * 1.4) * (1 - chipOut),
              transformOrigin: '0 50%',
              transform: `translate(${ghostEnd + 14}px, ${WIN.y + PILL.y + 3 + 2 * press}px) scale(${0.8 + 0.2 * chipIn})`,
            }}
          >
            Enter
          </div>
        )}
      </div>
      <Chain chain="web" frame={f} from={ACT.address.from} role="line" size={64 * U} top={88 * U} accent="none" />
    </AbsoluteFill>
  );
};

/** Width of the suggestion text at the URL size (measured once from the real font). */
const measureGhost = (() => {
  let w: number | null = null;
  return () => {
    if (w === null) w = typeOn(TYPED + GHOST, 1e6, { start: 0, cps: 1000, role: 'ui', size: URL_SIZE }).caretX - typeOn(TYPED, 1e6, { start: 0, cps: 1000, role: 'ui', size: URL_SIZE }).caretX;
    return w;
  };
})();
