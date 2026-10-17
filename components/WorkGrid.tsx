"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories, type Category, type Project } from "@/lib/projects";
import { ArrowUpRight } from "./Icons";
import { Tags } from "./Tags";

export function WorkGrid({ items }: { items: Project[] }) {
  const [active, setActive] = useState<Category | "all">("all");
  const visible = active === "all" ? items : items.filter((p) => p.category === active);

  return (
    <div className="mx-auto mt-6 max-w-5xl">
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
                className="panel group flex h-full flex-col rounded-[1.75rem] p-6 transition-colors duration-300 hover:border-sage"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-medium leading-snug">{p.title}</h3>
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
