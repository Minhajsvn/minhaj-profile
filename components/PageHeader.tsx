import { SplitReveal } from "./motion/SplitReveal";
import { Reveal } from "./Reveal";
import { Section, type Tone } from "./Section";

/** Subpage header: small eyebrow, giant title, optional intro on the right. */
export function PageHeader({
  title,
  eyebrow,
  intro,
  tone = "paper",
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  tone?: Tone;
}) {
  return (
    <Section tone={tone} className="pb-12 pt-28 md:pb-16 md:pt-36">
      <div className="gutter grid-12 gap-y-6">
        {eyebrow && <p className="label muted col-span-12">{eyebrow}</p>}
        <SplitReveal as="h1" immediate delay={0.1} parts={[{ text: title }]} className="text-title col-span-12 md:col-span-8" />
        {intro && (
          <Reveal delay={0.3} className="col-span-12 self-end md:col-span-4">
            <p className="max-w-[60ch] text-pretty leading-relaxed">{intro}</p>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
