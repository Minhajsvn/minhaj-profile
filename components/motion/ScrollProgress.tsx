"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline progress bar pinned above the top bar; difference blend keeps it visible on ink and paper. Decorative only. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-paper mix-blend-difference"
    />
  );
}
