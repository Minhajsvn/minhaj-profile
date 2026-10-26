"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { categories, type Category, type Project } from "@/lib/projects";
import { ArrowUpRight } from "./Icons";
import { ProjectCover } from "./ProjectCover";
import { Tags } from "./Tags";

const PREVIEW_W = 320;
const PREVIEW_H = 200;
const GAP = 28;

/** A cover preview that trails a mouse pointer over project cards, tilting with its speed. */
function useHoverPreview() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const spring = { stiffness: 260, damping: 28, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const rotate = useTransform(useVelocity(sx), [-1500, 0, 1500], [-7, 0, 7], { clamp: true });

  useEffect(() => {
    setEnabled(!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, [reduce]);

  const area = enabled
    ? {
        onPointerMove: (e: React.PointerEvent) => {
          // Sit to the right of the pointer, flipping left near the edge, and stay on screen vertically.
          const flip = e.clientX + GAP + PREVIEW_W > window.innerWidth - 16;
          x.set(flip ? e.clientX - GAP - PREVIEW_W : e.clientX + GAP);
          y.set(Math.min(Math.max(e.clientY - PREVIEW_H / 2, 16), window.innerHeight - PREVIEW_H - 16));
        },
        onPointerLeave: () => setHovered(null),
      }
    : {};
  const card = (p: Project) =>
    enabled ? { onPointerEnter: () => setHovered(p), onPointerLeave: () => setHovered(null) } : {};

  const preview = enabled ? (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy, rotate, width: PREVIEW_W }}
      className="pointer-events-none fixed left-0 top-0 z-40"
    >
      <motion.div
        initial={false}
        animate={
          hovered
            ? { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", scale: 1, opacity: 1 }
            : { clipPath: "inset(50% 0% 50% 0% round 1.25rem)", scale: 0.92, opacity: 0 }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[1.25rem] shadow-[0_30px_60px_-20px_rgb(0_46_35/0.45)]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {hovered && (
            <motion.div
              key={hovered.slug}
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCover project={hovered} />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-[#F2EEE9] px-3 py-1.5 text-xs font-semibold text-[#002E23]">
          View <ArrowUpRight width={14} height={14} />
        </span>
      </motion.div>
    </motion.div>
  ) : null;

  return { area, card, preview };
}

export function WorkGrid({ items, filters = true }: { items: Project[]; filters?: boolean }) {
  const [active, setActive] = useState<Category | "all">("all");
  const visible = active === "all" ? items : items.filter((p) => p.category === active);
  const cursor = useHoverPreview();

  return (
    <div className="mx-auto mt-6 max-w-5xl">
      {cursor.preview}
      {filters && (
      <div role="group" aria-label="Filter projects" className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => {
          const count = c.id === "all" ? items.length : items.filter((p) => p.category === c.id).length;
          const on = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c.id)}
              className={`btn min-h-10 px-4 ${
                on ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground hover:border-sage"
              }`}
            >
              {c.label}
              <span className={`text-xs ${on ? "opacity-80" : "text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>
      )}
      {filters && (
        <p className="sr-only" role="status" aria-live="polite">
          Showing {visible.length} projects
        </p>
      )}

      <motion.ul layout {...cursor.area} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p) => (
            <motion.li
              layout
              key={p.slug}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                {...cursor.card(p)}
                data-transition-label={p.title}
                href={`/work/${p.slug}`}
                className={`panel group flex h-full flex-col rounded-[1.75rem] p-6 transition-[border-color,transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-sage hover:shadow-[0_18px_40px_-24px_rgb(var(--foreground)/0.35)]`}
              >
                {/* Touch screens can't hover, so they get the cover inline. */}
                <div className="-mx-6 -mt-6 mb-5 hidden overflow-hidden rounded-t-[1.75rem] [@media(hover:none)]:block">
                  <ProjectCover project={p} decorative />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold leading-snug">{p.title}</h3>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <ArrowUpRight />
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{p.type}</p>
                <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed">{p.summary}</p>
                <div className="mt-5">
                  <Tags items={p.tags} max={3} />
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
