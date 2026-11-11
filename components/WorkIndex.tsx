"use client";

import Link from "next/link";
import { useState } from "react";
import { indexNumber, projectYearLabel } from "@/lib/format";
import type { Project } from "@/lib/projects";
import { CursorPreview } from "./CursorPreview";
import type { Tone } from "./Section";

const hover: Record<Tone, string> = {
  ink: "hover:text-lime focus-visible:text-lime",
  paper: "hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper",
};

/** Numbered project rows. Each row links to its case page; hovering shows a media preview by the cursor. */
export function WorkIndex({ items, tone }: { items: Project[]; tone: Tone }) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <ol className="rule border-b" onPointerLeave={() => setActive(null)}>
        {items.map((p, i) => (
          <li key={p.slug} className="rule border-t">
            <Link
              href={`/work/${p.slug}`}
              data-transition-label={p.title}
              // Pointer only: the preview follows the mouse, so keyboard focus would park it in a corner.
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(p)}
              className={`gutter grid-12 items-baseline gap-y-1 py-5 transition-colors duration-200 md:py-7 ${hover[tone]}`}
            >
              <span className="label col-span-2 md:col-span-1">{indexNumber(i)}</span>
              <span className="col-span-10 text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.04em] md:col-span-6">
                {p.title}
              </span>
              <span className="muted col-span-10 col-start-3 text-sm md:col-span-3 md:col-start-auto">{p.type}</span>
              <span className="label col-span-12 col-start-3 hidden md:col-span-1 md:col-start-auto md:block">
                {projectYearLabel(p)}
              </span>
              <span aria-hidden className="col-span-1 hidden justify-self-end text-2xl md:block">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <CursorPreview project={active} />
    </>
  );
}
