import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { ArrowUpRight } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { Tags } from "@/components/Tags";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SocialLinks } from "@/components/TopBar";
import { profile } from "@/lib/data";
import { categories, getProject, projects, type CaseStudy, type Highlight } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${profile.name}`,
    description: p.summary,
    openGraph: { title: `${p.title} — ${profile.name}`, description: p.summary, type: "article" },
  };
}

function Bullet() {
  return <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-sage" />;
}

function HighlightList({ items }: { items: Highlight[] }) {
  return (
    <ul className="space-y-4">
      {items.map((h) => {
        const text = typeof h === "string" ? h : h.text;
        return (
          <li key={text} className="flex gap-3 leading-relaxed">
            <Bullet />
            <div>
              {text}
              {typeof h !== "string" && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {h.sub.map((s) => (
                    <li key={s} className="rounded-full border border-border px-3 py-1 text-sm text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-medium sm:text-3xl">{title}</h2>
    </>
  );
}

function CaseStudyBody({ cs }: { cs: CaseStudy }) {
  return (
    <>
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow="01 · The problem" title="Prices that drift from the market" />
          <p className="mt-5 leading-relaxed text-muted">{cs.problem}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionHeading eyebrow="02 · The solution" title="The catalog follows the market" />
          <p className="mt-5 leading-relaxed text-muted">{cs.solution}</p>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <SectionHeading eyebrow="03 · Architecture" title="A monorepo in four parts" />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {cs.architecture.map((a, i) => (
            <li key={a.part} className="panel rounded-[1.75rem] p-6">
              <span className="font-display text-sm text-muted">0{i + 1}</span>
              <h3 className="mt-2 font-sans text-lg font-semibold tracking-normal">{a.part}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{a.stack}</p>
              <p className="mt-4 text-sm leading-relaxed">{a.does}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-20">
        <SectionHeading eyebrow="04 · Key engineering" title="Built to be safe in production" />
        <dl className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {cs.engineering.map((e) => (
            <div key={e.title} className="border-t border-border pt-5">
              <dt className="font-sans font-semibold">{e.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{e.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-20">
        <SectionHeading eyebrow="05 · By the numbers" title="From the repository" />
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4">
          {cs.numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse gap-1 bg-surface p-5 sm:p-6">
              <dt className="text-xs uppercase tracking-wider text-muted">{n.label}</dt>
              <dd className="font-display text-3xl font-medium sm:text-4xl">{n.value}</dd>
            </div>
          ))}
        </dl>
        <ol className="mt-8 flex flex-wrap items-center gap-2 text-sm" aria-label="Delivery phases">
          {cs.phases.map((ph, i) => (
            <li key={ph} className="flex items-center gap-2">
              <span className="rounded-full bg-tag px-3 py-1.5 font-medium text-tag-foreground">
                {i + 1}. {ph}
              </span>
              {i < cs.phases.length - 1 && (
                <span aria-hidden className="text-sage">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </Reveal>
    </>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const category = categories.find((c) => c.id === project.category)?.label;

  return (
    <div className="mx-auto w-full max-w-[1280px] p-2 sm:p-4 lg:p-6">
      <main id="main" className="flex flex-col gap-2 sm:gap-3">
        <article>
          <header className="panel bg-background px-4 pb-14 sm:px-8 sm:pb-20">
            <div className="flex items-center justify-between gap-4 px-1 py-5 sm:px-4">
              <Link href="/#work" className="btn-ghost px-4">
                <span aria-hidden>←</span> All work
              </Link>
              <nav aria-label="Social" className="flex items-center gap-2">
                <SocialLinks className="hidden sm:flex" />
                <ThemeToggle />
              </nav>
            </div>

            <Reveal className="mx-auto max-w-3xl pt-10 text-center sm:pt-16">
              <p className="eyebrow justify-center">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                {category}
              </p>
              <h1 className="mt-5 text-balance text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-3 font-display text-lg italic text-muted sm:text-xl">{project.type}</p>
              <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed sm:text-lg">{project.summary}</p>
              {project.meta && <p className="mt-6 text-sm text-muted">{project.meta}</p>}
              <div className="mt-8 flex justify-center">
                <div className="max-w-2xl [&_ul]:justify-center">
                  <Tags items={project.tags} />
                </div>
              </div>
            </Reveal>
          </header>

          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-8 sm:py-28">
            {project.caseStudy ? (
              <CaseStudyBody cs={project.caseStudy} />
            ) : (
              <Reveal>
                <SectionHeading eyebrow="What I built" title="Scope & highlights" />
                <div className="mt-8">
                  <HighlightList items={project.highlights} />
                </div>
              </Reveal>
            )}
          </div>
        </article>

        <nav aria-label="Next project" className="px-4 pb-20 sm:px-8">
          <Link
            href={`/work/${next.slug}`}
            className="panel group mx-auto flex max-w-4xl items-center justify-between gap-6 p-6 transition-colors hover:border-sage sm:p-10"
          >
            <div>
              <p className="eyebrow">Next project</p>
              <p className="mt-2 font-display text-2xl font-medium sm:text-4xl">{next.title}</p>
              <p className="mt-1 text-sm text-muted">{next.type}</p>
            </div>
            <span
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-45"
            >
              <ArrowUpRight />
            </span>
          </Link>
        </nav>

        <Contact />
      </main>
    </div>
  );
}
