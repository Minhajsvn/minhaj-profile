import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Mark } from '../brand/Mark';
import { C, TYPE, typeStyle, U } from '../brand/tokens';
import { Words } from '../fx/Words';
import { E, lmix, prog } from '../lib/anim';
import { camera } from '../lib/camera';
import { baselineOf, measureTracked } from '../lib/measure';
import { ACT, copy, f60, H, TOTAL, W } from '../timeline';
import { HANDOFF_V } from './Wall';

// ACT 4 - the lockup. The cut lands at the wall's top speed: the avatar's circle enters already
// moving left at the same ~40 px/f and brakes to rest on E.out, its picture rising into the
// circle as it comes (the signature wipe, one last time). The name rises once the circle has all
// but landed; the descriptor follows once the name has been read. Then the whole card keeps
// building: a slow 12% push on E.dolly to the last frame, which is the poster.

const L = (abs: number) => abs - ACT.lockup.from;

const NAME = copy('wordmark');
const ROLE = copy('role');
const D = 280 * U; // avatar diameter
const GAP = 64 * U;
const ENTRY = f60(60); // the brake, frames
const ENTRY_D = (HANDOFF_V * ENTRY) / 4.6; // E.out starts ~4.6x its mean speed: this matches the wall's 40 px/f

export const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const disp = TYPE.display;
  const sec = TYPE.secondary;
  const nameSize = disp.size * U;
  const roleSize = sec.size * U;

  // Layout from the real font: avatar | gap | text block, centred as one object on the eye line.
  const nameW = measureTracked(NAME.text, nameSize, disp.weight, disp.track) - disp.track * nameSize;
  const roleW = measureTracked(ROLE.text, roleSize, sec.weight, sec.track) - sec.track * roleSize;
  const blockW = Math.max(nameW, roleW);
  const total = D + GAP + blockW;
  const x0 = (W - total) / 2;
  const cy = H / 2;
  const textX = x0 + D + GAP;
  const nameTop = cy - nameSize * disp.lead * 0.92;
  const roleTop = cy + 0.16 * nameSize;

  // Entry: already moving left, braking to rest; the picture rises into the circle.
  const brake = prog(f, -1, ENTRY, E.out);
  const dx = (1 - brake) * ENTRY_D;
  const reveal = prog(f, 0, f60(42), E.out);

  // The living hold: from the name's arrival, the card pushes in 12% about its centre to the end.
  const push = lmix(1, 1.12, prog(f, L(NAME.in), L(TOTAL), E.dolly));
  const cam = { ax: W / 2, ay: H / 2, sx: W / 2, sy: H / 2, k: push };

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <div style={camera(cam)}>
        <Mark size={D} reveal={reveal} style={{ transform: `translate(${x0 + dx}px, ${cy - D / 2}px)` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${textX}px, ${nameTop}px)` }}>
          <Words text={NAME.text} id={NAME.id} frame={f} start={L(NAME.in)} size={nameSize} style={{ ...typeStyle('display', nameSize), color: C.ink }} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${textX}px, ${roleTop}px)` }}>
          <Words text={ROLE.text} id={ROLE.id} frame={f} start={L(ROLE.in)} size={roleSize} style={{ ...typeStyle('secondary', roleSize), color: C.mute }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The name must sit on its own line box: keep the measured baseline helper honest for audits.
export const LOCKUP_BASELINE = (size: number) => baselineOf(size, TYPE.display.weight, TYPE.display.lead);
