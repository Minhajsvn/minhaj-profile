import React from 'react';
import { Loop, OffthreadVideo, Sequence } from 'remotion';
import { C, FONT, TYPE } from '../brand/tokens';
import type { Site } from '../data';
import { E, prog } from '../lib/anim';
import { mixColor } from '../lib/color';

// The film's device: one browser window, laid out in world px (the act's camera moves the world).
// Chrome bar with three quiet dots and an address pill (live dot + URL), a loading line along the
// chrome's bottom edge, and the page below it.

/** The window's rest place in the full shot (world px = screen px at k = 1). 16:10 page, like the captures. */
export const WIN = { x: 280, y: 184, w: 1360, chrome: 54 };
export const pageH = (w: number) => (w * 900) / 1440;
export const winH = (w: number) => WIN.chrome + pageH(w);
/** The address pill, relative to the window's top-left. */
export const PILL = { w: 640, h: 36, y: (WIN.chrome - 36) / 2 };
export const pillX = (w: number) => (w - PILL.w) / 2;
/** Where URL text starts inside the pill (after the live dot). */
export const URL_X = 40;
export const URL_SIZE = 22;

/** The live dot: neutral before a page, pine while loading, gold once live (the accent's meaning). */
export const dotColor = (loading: number, live: number) => mixColor(mixColor(C.line, C.ink2, loading), C.accent, live);

export const BrowserWindow: React.FC<{
  x: number;
  y: number;
  w: number;
  address?: React.ReactNode; // the pill's text area (URL, typed text, suggestion)
  dot?: string; // live dot colour
  loading?: number; // 0..1 progress of the loading line; <0 or >1 hides it
  loadingFade?: number; // 0..1 opacity of the loading line
  children?: React.ReactNode; // the page
  shadow?: number; // 0..1 strength of the drop shadow
  badge?: number; // 0..1: the wall's gold live badge on the corner
}> = ({ x, y, w, address, dot = C.line, loading = -1, loadingFade = 1, children, shadow = 1, badge = 0 }) => {
  const ph = pageH(w);
  const px = pillX(w);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: WIN.chrome + ph,
        transform: `translate(${x}px, ${y}px)`,
        borderRadius: 18,
        overflow: 'hidden',
        background: C.surface,
        boxShadow: `0 0 0 1px ${C.line}, 0 32px 96px rgba(0, 46, 35, ${(0.16 * shadow).toFixed(3)})`,
      }}
    >
      {/* chrome */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: WIN.chrome, background: C.chrome }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 13, height: 13, borderRadius: '50%', background: C.sage, opacity: 0.55, transform: `translate(${24 + i * 22}px, ${(WIN.chrome - 13) / 2}px)` }} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PILL.w,
            height: PILL.h,
            borderRadius: PILL.h / 2,
            background: C.surface,
            boxShadow: `0 0 0 1px ${C.line}`,
            overflow: 'hidden',
            transform: `translate(${px}px, ${PILL.y}px)`,
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, width: 10, height: 10, borderRadius: '50%', background: dot, transform: `translate(18px, ${(PILL.h - 10) / 2}px)` }} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: PILL.w - URL_X - 16, height: PILL.h, overflow: 'hidden', transform: `translate(${URL_X}px, 0px)` }}>{address}</div>
        </div>
        {loading >= 0 && loading <= 1 && (
          <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: 3, background: C.ink2, opacity: loadingFade, transformOrigin: '0 0', transform: `translate(0px, ${WIN.chrome - 3}px) scaleX(${loading})` }} />
        )}
      </div>
      {/* page */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: ph, overflow: 'hidden', transform: `translate(0px, ${WIN.chrome}px)` }}>{children}</div>
      {badge > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: C.accent,
            boxShadow: `0 0 0 10px ${C.white}`,
            opacity: Math.min(1, badge * 1.5),
            transformOrigin: '50% 50%',
            transform: `translate(${w - 64 - 40}px, ${WIN.chrome + 40}px) scale(${0.6 + 0.4 * badge})`,
          }}
        />
      )}
    </div>
  );
};

/** The URL text, set like a browser's: the ui role, at the pill's size. */
export const urlStyle = (color: string = C.ink): React.CSSProperties => ({
  fontFamily: FONT.text,
  fontSize: URL_SIZE,
  fontWeight: TYPE.ui.weight,
  letterSpacing: `${TYPE.ui.track}em`,
  lineHeight: `${PILL.h}px`,
  whiteSpace: 'pre',
  color,
});

/**
 * A site's page: its live-site recording, cover-fitted. `from` is the absolute frame the page's
 * clip starts (frame 0 of the recording); `act` the act's first absolute frame. `loop` repeats a
 * short clip (the wall's tiles) instead of holding its last frame.
 */
export const Page: React.FC<{ site: Site; from: number; act: number; loop?: boolean; trim?: number }> = ({ site, from, act, loop = false, trim = 0 }) => {
  const video = <OffthreadVideo src={site.clip} muted trimBefore={trim} playbackRate={site.rate ?? 1} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />;
  return (
    <Sequence from={from - act} layout="none" name={site.slug}>
      {loop ? (
        <Loop durationInFrames={Math.floor((site.frames - trim) / (site.rate ?? 1))} layout="none">
          {video}
        </Loop>
      ) : (
        video
      )}
    </Sequence>
  );
};

/** The signature wipe: a new page rising inside the window from its bottom edge (0..1). */
export const wipeStyle = (p: number, h: number): React.CSSProperties => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: h,
  clipPath: `inset(${((1 - p) * 100).toFixed(3)}% 0% 0% 0%)`,
  transform: `translateY(${((1 - p) * 0.08 * h).toFixed(3)}px)`,
});

/** The wipe's progress for a load beginning at absolute frame `at` (36 f on E.out, from at - 1). */
export const wipeAt = (F: number, at: number) => prog(F, at - 1, at + 35, E.out);
