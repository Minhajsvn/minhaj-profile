import React from 'react';
import { Composition, Folder, Still } from 'remotion';
import { Address } from './acts/Address';
import { Lockup } from './acts/Lockup';
import { Sites } from './acts/Sites';
import { Wall } from './acts/Wall';
import { C } from './brand/tokens';
import { Film, FilmProps } from './Film';
import { FilmSub, subMetadata } from './FilmSub';
import { Audit } from './lib/Audit';
import { FontGate } from './lib/FontGate';
import { MarkSizes } from './Stills';
import { ACT, FPS, H, TOTAL, W } from './timeline';

// An act on its own, font-gated like the film, so it can be iterated without scrubbing the film.
// Composition ActN is the Nth entry of ACT (scripts/layout-audit.sh relies on that order).
const solo = (Act: React.FC) => {
  const Solo: React.FC<FilmProps> = ({ audit = false, safe }) => (
    <FontGate>
      <div style={{ position: 'absolute', inset: 0, background: C.paper }}>
        <Act />
        {audit && <Audit safe={safe} />}
      </div>
    </FontGate>
  );
  return Solo;
};

const ACTS = [
  { id: 'Act1', c: solo(Address), a: ACT.address },
  { id: 'Act2', c: solo(Sites), a: ACT.sites },
  { id: 'Act3', c: solo(Wall), a: ACT.wall },
  { id: 'Act4', c: solo(Lockup), a: ACT.lockup },
];

export const RemotionRoot: React.FC = () => (
  <>
    {/* The film. Render with scripts/render.sh (silent master: --no-audio). */}
    <Composition id="Film" component={Film} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{ audit: false } as FilmProps} />
    {/* The film as sub-frames for the motion-blurred master (render.sh --blur passes out/samples.json). */}
    <Composition
      id="FilmSub"
      component={FilmSub}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ groups: [] as number[] }}
      calculateMetadata={subMetadata}
    />

    <Folder name="Acts">
      {ACTS.map(({ id, c, a }) => (
        <Composition key={id} id={id} component={c} durationInFrames={a.dur} fps={FPS} width={W} height={H} defaultProps={{ audit: false } as FilmProps} />
      ))}
    </Folder>

    <Folder name="Stills">
      <Still id="MarkSizes" component={MarkSizes} width={W} height={H} />
    </Folder>
  </>
);
