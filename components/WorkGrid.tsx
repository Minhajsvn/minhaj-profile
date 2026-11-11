"use client";

import Link from "next/link";
import { useState } from "react";
import { projectYearLabel } from "@/lib/format";
import { categories, type Category, type Project } from "@/lib/projects";
import { ProjectCover } from "./ProjectCover";
import { WorkIndex } from "./WorkIndex";

type View = "list" | "grid";

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`label min-h-11 px-3 transition-colors ${on ? "bg-ink text-paper" : "hover:underline"}`}
    >
      {children}
    </button>
  );
}

/** All projects on paper: category filter, list (numbered index) or grid (covers). */
export function WorkGrid({ items }: { items: Project[] }) {
  const [active, setActive] = useState<Category | "all">("all");
  const [view, setView] = useState<View>("list");
  const visible = active === "all" ? items : items.filter((p) => p.category === active);

  return (
    <>
      <div className="gutter mb-8 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-1">
          {categories.map((c) => {
            const count = c.id === "all" ? items.length : items.filter((p) => p.category === c.id).length;
            return (
              <Toggle key={c.id} on={active === c.id} onClick={() => setActive(c.id)}>
                {c.label} <span className="muted">{count}</span>
              </Toggle>
            );
          })}
        </div>
        <div role="group" aria-label="Layout" className="flex gap-1">
          <Toggle on={view === "list"} onClick={() => setView("list")}>
            List
          </Toggle>
          <Toggle on={view === "grid"} onClick={() => setView("grid")}>
            Grid
          </Toggle>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Showing {visible.length} projects
      </p>

      {view === "list" ? (
        <WorkIndex items={visible} tone="paper" />
      ) : (
        <ul className="gutter grid gap-x-4 gap-y-10 md:grid-cols-2 md:gap-x-6">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} data-transition-label={p.title} className="group block">
                <div className="overflow-hidden">
                  <div className="transition-transform duration-700 group-hover:scale-[1.03]">
                    <ProjectCover project={p} size="lg" decorative />
                  </div>
                </div>
                <div className="rule mt-3 flex items-baseline justify-between gap-4 border-t pt-3">
                  <h2 className="text-2xl font-medium tracking-[-0.03em] group-hover:underline">{p.title}</h2>
                  <span className="label muted shrink-0">{projectYearLabel(p)}</span>
                </div>
                <p className="muted mt-1 text-sm">{p.type}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
