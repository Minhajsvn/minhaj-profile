import React from 'react';
import { Img, staticFile } from 'remotion';
import { C } from './tokens';

// The mark is brand-supplied: Minhaj's 3D illustrated avatar (aviators, a small gold crown) in a
// circle, as on his portfolio. `reveal` 0..1 is the film's signature move at the close: the
// picture rises into the circle from its bottom edge, the way every page wipes up in the window.

export const AVATAR = staticFile('avatar.webp');

export const Mark: React.FC<{
  size: number; // circle diameter, px
  reveal?: number; // 0..1, the picture's rise into the circle
  style?: React.CSSProperties;
}> = ({ size, reveal = 1, style }) => {
  const r = Math.max(0, Math.min(1, reveal));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: C.surface,
        boxShadow: `0 0 0 ${Math.max(1, size * 0.018)}px ${C.white}, 0 ${size * 0.08}px ${size * 0.24}px rgba(0, 46, 35, 0.16)`,
        ...style,
      }}
    >
      <Img
        src={AVATAR}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: size,
          height: size,
          objectFit: 'cover',
          objectPosition: '50% 38%',
          transform: `translateY(${(1 - r) * size}px)`,
        }}
      />
    </div>
  );
};
