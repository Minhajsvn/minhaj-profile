"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import type { Project } from "@/lib/projects";
import { ProjectCover } from "./ProjectCover";
import { ProjectVideo } from "./ProjectVideo";
import { useFinePointer } from "./motion/useFinePointer";

/**
 * 320×200 media box that trails the pointer while a work row is hovered.
 * Fine pointers only; nothing mounts on touch or with reduced motion.
 */
export function CursorPreview({ project }: { project: Project | null }) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduce;
  const spring = { stiffness: 300, damping: 30, mass: 0.5 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX + 24);
      y.set(e.clientY - 100);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      data-cursor-preview
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-40 h-[200px] w-[320px]"
    >
      <AnimatePresence>
        {project && (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-hidden bg-ink"
          >
            {project.video && project.cover ? (
              <ProjectVideo src={project.video} poster={project.cover} label={project.title} playing decorative />
            ) : (
              <ProjectCover project={project} decorative />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
