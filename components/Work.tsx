import Link from "next/link";
import { getProject, projects } from "@/lib/projects";
import { SplitReveal } from "./motion/SplitReveal";
import { Section } from "./Section";
import { WorkIndex } from "./WorkIndex";

// The homepage shows a curated few; everything lives on /work.
const HOME_PICKS = [
  "blue-diamond-jewellery",
  "hi-life-furniture-rentals",
  "blackmamba-real-estate",
  "promise-gold-refinery",
  "3r-creative",
  "aurify-technology",
];

export function Work() {
  const picks = HOME_PICKS.map((s) => getProject(s)!).filter(Boolean);

  return (
    <Section tone="ink" id="work" labelledBy="work-title" className="scroll-mt-14 pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="gutter mb-10 flex items-end justify-between gap-6 md:mb-14">
        <SplitReveal id="work-title" parts={[{ text: "Work" }]} className="text-title" />
        <p className="label muted max-w-[22ch] text-right">Selected stores, sites and apps — 2023 to now</p>
      </div>

      <WorkIndex items={picks} tone="ink" />

      <div className="gutter mt-10 flex justify-end">
        <Link
          href="/work"
          data-transition-label="All work"
          className="label inline-flex items-center gap-3 border border-current px-5 py-4 transition-colors hover:bg-lime hover:text-ink"
        >
          All {projects.length} projects →
        </Link>
      </div>
    </Section>
  );
}
