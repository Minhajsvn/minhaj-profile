import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Address } from './acts/Address';
import { Lockup } from './acts/Lockup';
import { Sites } from './acts/Sites';
import { Wall } from './acts/Wall';
import { C } from './brand/tokens';
import { Audit } from './lib/Audit';
import { FontGate } from './lib/FontGate';
import type { SafeSpec } from './lib/safe';
import { ACT } from './timeline';

/** audit: draw and log the layout audit; safe: its safe zone (a lib/safe.ts preset or insets; default by aspect). */
export type FilmProps = { audit?: boolean; safe?: SafeSpec };

// The film: one Sequence per act, handing off on exact frames (each seam is designed inside the
// acts). The master is silent: it plays muted on the portfolio's homepage (BRIEF.md).
export const Film: React.FC<FilmProps> = ({ audit = false, safe }) => (
  <FontGate>
    <AbsoluteFill style={{ background: C.paper }}>
      <Sequence from={ACT.address.from} durationInFrames={ACT.address.dur} name="1 Address">
        <Address />
      </Sequence>
      <Sequence from={ACT.sites.from} durationInFrames={ACT.sites.dur} name="2 Sites">
        <Sites />
      </Sequence>
      <Sequence from={ACT.wall.from} durationInFrames={ACT.wall.dur} name="3 Wall">
        <Wall />
      </Sequence>
      <Sequence from={ACT.lockup.from} durationInFrames={ACT.lockup.dur} name="4 Lockup">
        <Lockup />
      </Sequence>
      {audit && <Audit safe={safe} />}
    </AbsoluteFill>
  </FontGate>
);
