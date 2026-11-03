import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Mark } from './brand/Mark';
import { C, U } from './brand/tokens';

// Style frames: rendered with `npx remotion still <Id>` and looked at before animation is built.
// The mark is brand-supplied (the avatar); this checks it holds up from favicon size to the lockup.

const SIZES = [16, 24, 32, 48, 64, 128, 280];

export const MarkSizes: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 64 * U }}>
    {SIZES.map((s) => (
      <div key={s} style={{ position: 'relative', width: s * U, height: s * U }}>
        <Mark size={s * U} />
      </div>
    ))}
  </AbsoluteFill>
);
