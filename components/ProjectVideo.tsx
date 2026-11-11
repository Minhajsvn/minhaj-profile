"use client";

import { useEffect, useRef, useState } from "react";
import { useSafeReducedMotion } from "./motion/useSafeReducedMotion";
import { Pause, Play } from "./Icons";

/**
 * Muted, looping screen recording.
 * - `playing` given: the parent controls it (e.g. card hover); no controls are shown.
 * - `playing` omitted: plays while on screen, with a pause/play button (WCAG 2.2.2).
 * Reduced-motion users start paused on the poster and can press play.
 */
export function ProjectVideo({
  src,
  poster,
  label,
  playing,
  decorative = false,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  playing?: boolean;
  /** Hide from assistive tech when a surrounding link already names the project. */
  decorative?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useSafeReducedMotion();
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const controlled = playing !== undefined;

  useEffect(() => {
    if (controlled || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [controlled]);

  // A user's choice wins; otherwise reduced motion starts paused.
  const paused = userPaused ?? !!reduce;
  const shouldPlay = controlled ? !reduce && playing : inView && !paused;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay]);

  const video = (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={controlled ? "none" : "metadata"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      tabIndex={-1}
      className={`h-full w-full object-cover ${className}`}
    />
  );

  if (controlled) return video;

  return (
    <div className="relative h-full w-full">
      {video}
      <button
        type="button"
        onClick={() => setUserPaused(!paused)}
        aria-label={paused ? `Play ${label}` : `Pause ${label}`}
        className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center bg-ink/80 text-paper backdrop-blur transition-colors hover:bg-ink"
      >
        {paused ? <Play /> : <Pause />}
      </button>
    </div>
  );
}
