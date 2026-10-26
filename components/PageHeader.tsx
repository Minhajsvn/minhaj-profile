import Link from "next/link";
import { ArrowLeft } from "./Icons";
import { SplitReveal, type Part } from "./motion/SplitReveal";
import { Reveal } from "./Reveal";
import { ThemeToggle } from "./ThemeToggle";
import { SocialLinks } from "./TopBar";

/** Header panel for subpages (/work, /about): back link, socials, theme toggle and a big title. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: Part[]; intro: string }) {
  return (
    <header className="panel bg-background px-4 pb-14 sm:px-8 sm:pb-20">
      <div className="flex items-center justify-between gap-4 px-1 py-5 sm:px-4">
        <Link href="/" data-transition-label="Home" className="btn-ghost px-4">
          <ArrowLeft /> Home
        </Link>
        <nav aria-label="Social" className="flex items-center gap-2">
          <SocialLinks className="hidden sm:flex" />
          <ThemeToggle />
        </nav>
      </div>

      <div className="mx-auto max-w-3xl pt-10 text-center sm:pt-16">
        <p className="eyebrow justify-center">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <SplitReveal
          as="h1"
          immediate
          delay={0.1}
          parts={title}
          className="mt-5 text-balance text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl"
        />
        <Reveal delay={0.4}>
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-muted sm:text-lg">{intro}</p>
        </Reveal>
      </div>
    </header>
  );
}
