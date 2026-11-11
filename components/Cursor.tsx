"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { Tone } from "./Section";
import { toneAt } from "./tone";

/** Dot cursor for fine pointers: lime on ink, ink on paper, grows over links. Absent on touch and reduced motion. */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [tone, setTone] = useState<Tone>("paper");
  const [big, setBig] = useState(false);
  const spring = { stiffness: 500, damping: 40, mass: 0.3 };
  const x = useSpring(-100, spring);
  const y = useSpring(-100, spring);

  useEffect(() => {
    setEnabled(!reduce && window.matchMedia("(pointer: fine)").matches);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setTone(toneAt(e.clientX, e.clientY));
      setBig(!!(e.target as Element | null)?.closest?.("a, button"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      data-cursor
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[60]"
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color] duration-200 ${
          tone === "ink" ? "bg-lime" : "bg-ink"
        } ${big ? "h-10 w-10 opacity-60" : "h-2.5 w-2.5"}`}
      />
    </motion.div>
  );
}
