"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories, type Category, type Project } from "@/lib/projects";
import { ArrowUpRight } from "./Icons";
import { ProjectCover } from "./ProjectCover";
import { ProjectVideo } from "./ProjectVideo";
import { Tags } from "./Tags";

export function WorkGrid({ items, filters = true }: { items: Project[]; filters?: boolean }) {
  const [active, setActive] = useState<Category | "all">("all");
  const [live, setLive] = useState<string | null>(null); // card whose recording is playing
  const visible = active === "all" ? items : items.filter((p) => p.category === active);

  return (
    <div className="mx-auto mt-6 max-w-5xl">
      {filters && (
        <>
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
          <p className="sr-only" role="status" aria-live="polite">
            Showing {visible.length} projects
          </p>
        </>
      )}

      <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                href={`/work/${p.slug}`}
                data-transition-label={p.title}
                onPointerEnter={(e) => e.pointerType === "mouse" && setLive(p.slug)}
                onPointerLeave={() => setLive((s) => (s === p.slug ? null : s))}
                onFocus={() => setLive(p.slug)}
                onBlur={() => setLive((s) => (s === p.slug ? null : s))}
                className="panel group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-[border-color,transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-sage hover:shadow-[0_18px_40px_-24px_rgb(var(--foreground)/0.35)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border/70 bg-background">
                  {p.video && p.cover ? (
                    <ProjectVideo
                      src={p.video}
                      poster={p.cover}
                      label={p.title}
                      playing={live === p.slug}
                      decorative
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="transition-transform duration-700 group-hover:scale-[1.03]">
                      <ProjectCover project={p} decorative />
                    </div>
                  )}
                  {p.video && (
                    <span aria-hidden className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#002E23]/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[#F2EEE9] backdrop-blur">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#D4A24C]" />
                      Live site
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
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
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
