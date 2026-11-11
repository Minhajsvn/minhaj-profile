import { ScrollScale } from "./motion/ScrollScale";
import { ProjectVideo } from "./ProjectVideo";
import { Section } from "./Section";

/** 34-second film of live client sites (the Remotion project in films/showreel). Full bleed on ink. */
export function Showreel() {
  return (
    <Section tone="ink" className="py-16 md:py-24">
      <h2 className="label gutter mb-6 flex justify-between">
        <span>Showreel — 2026</span>
        <span className="muted">34s</span>
      </h2>
      <ScrollScale as="div" from={0.7} className="relative aspect-video w-full overflow-hidden bg-ink">
        <ProjectVideo
          src="/media/showreel.mp4"
          poster="/media/showreel.webp"
          label="showreel of selected client websites"
        />
      </ScrollScale>
    </Section>
  );
}
