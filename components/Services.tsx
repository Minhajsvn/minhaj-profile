import { services } from "@/lib/data";
import { indexNumber } from "@/lib/format";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./motion/SplitReveal";
import { Section } from "./Section";

/** Numbered service rows: title left, detail right. */
export function Services() {
  return (
    <Section tone="paper" labelledBy="services-title" className="pb-20 md:pb-28">
      <div className="gutter grid-12 rule gap-y-6 border-t pt-20 md:pt-28">
        <SplitReveal id="services-title" parts={[{ text: "Services" }]} className="text-title col-span-12 md:col-span-7" />
        <p className="label muted col-span-12 self-end md:col-span-4 md:col-start-9">
          Partnering with brands and agencies to ship work that performs
        </p>
      </div>

      <ol className="rule mt-12 border-b md:mt-16">
        {services.map((s, i) => (
          <Reveal as="li" key={s.title} className="rule gutter grid-12 gap-y-2 border-t py-6 md:py-8">
            <span className="label col-span-2 md:col-span-1">{indexNumber(i)}</span>
            <h3 className="col-span-10 text-2xl font-medium tracking-[-0.03em] md:col-span-4 md:text-3xl">{s.title}</h3>
            <p className="col-span-10 col-start-3 max-w-[60ch] text-pretty leading-relaxed md:col-span-5 md:col-start-7">
              {s.body}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
