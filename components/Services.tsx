import { services } from "@/lib/data";
import { ServiceGlyph } from "./Icons";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./motion/SplitReveal";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-center" aria-hidden>
      <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
      <span className="relative -rotate-3 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-foreground shadow-sm">
        {children}
      </span>
    </div>
  );
}

export function Services() {
  return (
    <section aria-labelledby="services-title" className="px-4 py-20 sm:px-8 sm:py-28">
      <SplitReveal
        id="services-title"
        parts={[{ text: "Partnering with brands and agencies" }, { text: "to ship work that performs.", soft: true }]}
        className="mx-auto max-w-2xl text-balance text-center text-3xl font-semibold leading-tight sm:text-[2.6rem]"
      />

      <div className="mx-auto mt-14 max-w-5xl">
        <SectionLabel>Services</SectionLabel>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08}>
              <ServiceGlyph name={s.icon} className="text-sage" />
              <h3 className="mt-5 font-sans text-base font-semibold tracking-normal">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
