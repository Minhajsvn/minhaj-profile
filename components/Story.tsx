import { stats, story } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./motion/SplitReveal";
import { Section } from "./Section";

/** Timeline on the Swiss grid: huge year left, place and story right. */
export function Story() {
  return (
    <Section tone="paper" id="story" labelledBy="story-title" className="scroll-mt-14 pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="gutter grid-12 gap-y-6">
        <SplitReveal id="story-title" parts={[{ text: "Story" }]} className="text-title col-span-12 md:col-span-6" />
        <p className="col-span-12 self-end text-pretty text-lg leading-snug md:col-span-5 md:col-start-8 md:text-xl">
          {story.intro}
        </p>
      </div>

      <dl className="gutter grid-12 mt-14 gap-y-8 md:mt-20">
        {stats.map((s) => (
          <div key={s.label} className="rule col-span-12 flex flex-col-reverse border-t pt-3 sm:col-span-4">
            <dt className="label muted mt-2">{s.label}</dt>
            <dd className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em]">{s.value}</dd>
          </div>
        ))}
      </dl>

      <ol className="rule mt-16 border-b md:mt-24">
        {story.chapters.map((c) => (
          <Reveal as="li" key={c.year} className="rule gutter grid-12 items-end gap-y-3 border-t py-8 md:py-10">
            <span className="text-year col-span-12 md:col-span-6">{c.year}</span>
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <p className="label muted">{c.place}</p>
              <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em] md:text-3xl">{c.title}</h3>
              <p className="mt-2 max-w-[60ch] text-pretty leading-relaxed">{c.body}</p>
              {"cta" in c && c.cta && (
                <a
                  href="#contact"
                  className="label mt-5 inline-flex items-center gap-3 bg-ink px-5 py-4 text-paper transition-colors hover:bg-lime hover:text-ink"
                >
                  Start a project →
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
