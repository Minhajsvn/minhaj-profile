"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Muted, looping screen recording of a live site.
 * - `playing` given: the parent controls it (e.g. card hover).
 * - `playing` omitted: plays while on screen, pauses off screen.
 * Reduced-motion users get the poster and native controls instead of autoplay.
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
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const controlled = playing !== undefined;

  useEffect(() => {
    if (controlled || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [controlled]);

  const shouldPlay = !reduce && (controlled ? playing : inView);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={controlled ? "none" : "metadata"}
      controls={!decorative && (reduce ?? false)}
      aria-label={decorative ? undefined : `Screen recording of ${label}`}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
