import Link from "next/link";
import { getProject, projects } from "@/lib/projects";
import { ArrowUpRight } from "./Icons";
import { Magnetic } from "./motion/Magnetic";
import { ScrollScale } from "./motion/ScrollScale";
import { SplitReveal } from "./motion/SplitReveal";
import { SectionLabel } from "./Services";
import { Tags } from "./Tags";
import { WorkGrid } from "./WorkGrid";

// The homepage shows a curated few; everything lives on /work.
const HOME_PICKS = [
  "faqeesh-jewelry",
  "kiora-gold-diamonds",
  "mac-ro-capital",
  "blackmamba-real-estate",
  "hi-life-furniture-rentals",
  "aura-shopify-theme",
];

// What the Live Rate App changes for a store owner — the engineering detail stays in the case study.
const outcomes = [
  { value: "Live", label: "Prices follow gold & silver markets" },
  { value: "1:1", label: "Storefront, cart & checkout always match" },
  { value: "Dry run", label: "Every change previewed first" },
  { value: ">10%", label: "Big moves held for approval" },
];

export function Work() {
  const featured = projects.find((p) => p.featured)!;
  const picks = HOME_PICKS.map((s) => getProject(s)!).filter(Boolean);

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-6 px-4 pb-20 sm:px-8 sm:pb-28">
      <SectionLabel>Selected work</SectionLabel>
      <SplitReveal
        id="work-title"
        parts={[{ text: "Stores and sites" }, { text: "that earn their keep.", soft: true }]}
        className="mx-auto mt-10 max-w-2xl text-balance text-center text-3xl font-semibold leading-tight sm:text-[2.6rem]"
      />

      {/* Featured project */}
      <ScrollScale className="panel relative mx-auto mt-12 max-w-5xl overflow-hidden p-6 sm:p-10 lg:p-12">
        <span aria-hidden className="absolute left-0 top-10 h-12 w-1 rounded-r-full bg-accent sm:top-12" />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow">Featured · Shopify app</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{featured.title}</h3>
            <p className="mt-2 text-lg font-light text-muted">No more repricing a jewellery catalog by hand.</p>
            <p className="mt-6 leading-relaxed">
              Gold moves every day, and on standard Shopify plans checkout charges whatever the catalog says. I built an
              app that prices every piece from its weight, karat, making charge and stones — so the price a customer
              sees is the price they pay.
            </p>
            <Magnetic>
              <Link href={`/work/${featured.slug}`} data-transition-label={featured.title} className="btn-primary mt-8 px-6">
                Read the case study <ArrowUpRight />
              </Link>
            </Magnetic>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border">
              {outcomes.map((o) => (
                <div key={o.label} className="flex flex-col-reverse gap-1.5 bg-background p-5 sm:p-6">
                  <dt className="text-sm leading-snug text-muted">{o.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">{o.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="mb-3 text-xs text-muted">{featured.meta}</p>
              <Tags items={featured.tags} max={5} />
            </div>
          </div>
        </div>
      </ScrollScale>

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
