import Link from "next/link";
import { projects } from "@/lib/projects";
import { ArrowUpRight } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Services";
import { Tags } from "./Tags";
import { WorkGrid } from "./WorkGrid";

export function Work() {
  const featured = projects.find((p) => p.featured)!;
  const cs = featured.caseStudy!;

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-6 px-4 pb-20 sm:px-8 sm:pb-28">
      <SectionLabel>Selected work</SectionLabel>
      <h2 id="work-title" className="sr-only">
        Selected work
      </h2>

      {/* Featured project */}
      <Reveal as="article" className="panel relative mx-auto mt-12 max-w-5xl overflow-hidden p-6 sm:p-10 lg:p-12">
        <span aria-hidden className="absolute left-0 top-10 h-12 w-1 rounded-r-full bg-accent sm:top-12" />
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow">Featured project</p>
            <h3 className="mt-4 text-3xl font-medium sm:text-4xl">{featured.title}</h3>
            <p className="mt-2 font-display text-lg italic text-muted">{featured.type}</p>
            <p className="mt-6 leading-relaxed">{featured.summary}</p>
            <ul className="mt-6 space-y-3">
              {featured.highlights.slice(2, 5).map((h) => (
                <li key={String(h)} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-sage" />
                  {String(h)}
                </li>
              ))}
            </ul>
            <Link href={`/work/${featured.slug}`} className="btn-primary mt-8 px-6">
              Read the case study <ArrowUpRight />
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border">
              {cs.numbers.map((m) => (
                <div key={m.label} className="flex flex-col-reverse gap-1 bg-background p-5 sm:p-6">
                  <dt className="text-xs uppercase tracking-wider text-muted">{m.label}</dt>
                  <dd className="font-display text-3xl font-medium sm:text-4xl">{m.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="mb-3 text-xs text-muted">{featured.meta}</p>
              <Tags items={featured.tags} max={8} />
            </div>
          </div>
        </div>
      </Reveal>

      <WorkGrid items={projects.filter((p) => !p.featured)} />
    </section>
  );
}
