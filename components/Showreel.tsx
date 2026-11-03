import { ScrollScale } from "./motion/ScrollScale";
import { ProjectVideo } from "./ProjectVideo";

/** 34-second film of live client sites (the Remotion project in films/showreel). */
export function Showreel() {
  return (
    <section aria-label="Showreel" className="px-2 sm:px-0">
      <ScrollScale
        as="div"
        className="relative mx-auto aspect-video w-full overflow-hidden rounded-panel border border-border/70 bg-[#002E23] shadow-[0_50px_100px_-50px_rgb(0_46_35/0.55)]"
      >
        <ProjectVideo
          src="/media/showreel.mp4"
          poster="/media/showreel.webp"
          label="showreel of selected client websites"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#002E23]/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F2EEE9] backdrop-blur sm:left-6 sm:top-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4A24C]" />
          Showreel · 34s
        </span>
      </ScrollScale>
    </section>
  );
}
