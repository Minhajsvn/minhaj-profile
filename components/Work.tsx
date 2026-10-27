import Link from "next/link";
import { getProject, projects } from "@/lib/projects";
import { ArrowUpRight } from "./Icons";
import { Magnetic } from "./motion/Magnetic";
import { SplitReveal } from "./motion/SplitReveal";
import { SectionLabel } from "./Services";
import { WorkGrid } from "./WorkGrid";

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
    <section id="work" aria-labelledby="work-title" className="scroll-mt-6 px-4 pb-20 sm:px-8 sm:pb-28">
      <SectionLabel>Selected work</SectionLabel>
      <SplitReveal
        id="work-title"
        parts={[{ text: "Stores and sites" }, { text: "that earn their keep.", soft: true }]}
        className="mx-auto mt-10 max-w-2xl text-balance text-center text-3xl font-semibold leading-tight sm:text-[2.6rem]"
      />

      <WorkGrid items={picks} filters={false} />

      <div className="mt-10 flex justify-center">
        <Magnetic>
          <Link href="/work" data-transition-label="All work" className="btn-ghost px-6">
            See all {projects.length} projects <ArrowUpRight />
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
