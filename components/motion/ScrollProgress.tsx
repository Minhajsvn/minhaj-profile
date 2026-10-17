"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline gold progress bar pinned to the top of the viewport. Decorative only. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
    />
  );
}
