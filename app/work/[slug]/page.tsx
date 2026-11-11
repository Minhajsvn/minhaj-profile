import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { ScrollScale } from "@/components/motion/ScrollScale";
import { ProjectCover } from "@/components/ProjectCover";
import { ProjectVideo } from "@/components/ProjectVideo";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { profile } from "@/lib/data";
import { indexNumber } from "@/lib/format";
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

/** Numbered block heading on the 12-col grid. */
function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal className="rule gutter grid-12 gap-y-6 border-t py-12 md:py-16">
      <div className="col-span-12 md:col-span-4">
        <p className="label muted">{n}</p>
        <h2 className="mt-2 text-3xl font-medium tracking-[-0.03em] md:text-4xl">{title}</h2>
      </div>
      <div className="col-span-12 md:col-span-7 md:col-start-6">{children}</div>
    </Reveal>
  );
}

function HighlightList({ items }: { items: Highlight[] }) {
  return (
    <ol className="rule border-b">
      {items.map((h, i) => {
        const text = typeof h === "string" ? h : h.text;
        return (
          <li key={text} className="rule grid grid-cols-[2.5rem_1fr] border-t py-4 leading-relaxed">
            <span className="label muted pt-1">{indexNumber(i)}</span>
            <div>
              {text}
              {typeof h !== "string" && (
                <ul className="label muted mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {h.sub.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function CaseStudyBody({ cs }: { cs: CaseStudy }) {
  return (
    <>
      <Reveal className="rule gutter grid-12 gap-y-10 border-t py-12 md:py-16">
        <div className="col-span-12 md:col-span-5">
          <p className="label muted">01 · The problem</p>
          <h2 className="mt-2 text-3xl font-medium tracking-[-0.03em]">{cs.titles.problem}</h2>
          <p className="mt-4 max-w-[60ch] leading-relaxed">{cs.problem}</p>
        </div>
        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <p className="label muted">02 · The solution</p>
          <h2 className="mt-2 text-3xl font-medium tracking-[-0.03em]">{cs.titles.solution}</h2>
          <p className="mt-4 max-w-[60ch] leading-relaxed">{cs.solution}</p>
        </div>
      </Reveal>

      <Block n="03 · Architecture" title={cs.titles.architecture}>
        <table className="w-full text-left text-sm">
          <thead className="label muted">
            <tr>
              <th className="pb-3 pr-4 font-normal">Part</th>
              <th className="pb-3 pr-4 font-normal">Stack</th>
              <th className="hidden pb-3 font-normal md:table-cell">Does</th>
            </tr>
          </thead>
          <tbody>
            {cs.architecture.map((a) => (
              <tr key={a.part} className="rule border-t align-top">
                <td className="py-4 pr-4 font-medium">{a.part}</td>
                <td className="label py-4 pr-4">{a.stack}</td>
                <td className="hidden py-4 leading-relaxed md:table-cell">{a.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="mt-2 space-y-3 text-sm leading-relaxed md:hidden">
          {cs.architecture.map((a) => (
            <li key={a.part}>
              <span className="font-medium">{a.part}:</span> {a.does}
            </li>
          ))}
        </ul>
      </Block>

      <Block n="04 · Key engineering" title={cs.titles.engineering}>
        <ol className="rule border-b">
          {cs.engineering.map((e, i) => (
            <li key={e.title} className="rule grid grid-cols-[2.5rem_1fr] border-t py-4">
              <span className="label muted pt-1">{indexNumber(i)}</span>
              <div>
                <h3 className="font-medium">{e.title}</h3>
                <p className="mt-1 text-sm leading-relaxed">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Block>

      <Section tone="ink" className="py-14 md:py-20">
        <p className="label muted gutter">05 · By the numbers — from the repository</p>
        <dl className="gutter grid-12 mt-8 gap-y-10">
          {cs.numbers.map((n) => (
            <div key={n.label} className="col-span-6 flex flex-col-reverse items-start md:col-span-3">
              <dt className="label muted mt-3">{n.label}</dt>
              <dd className="inline-block border-b-2 border-lime pb-1 text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em]">
                {n.value}
              </dd>
            </div>
          ))}
        </dl>
        <ol aria-label="Delivery phases" className="label gutter mt-12 flex flex-wrap gap-x-6 gap-y-2">
          {cs.phases.map((ph, i) => (
            <li key={ph}>
              <span className="muted">{indexNumber(i)}</span> {ph}
            </li>
          ))}
        </ol>
      </Section>
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
    <main id="main" className="flex flex-col">
      <article>
        <Section tone="ink" labelledBy="project-title" className="pb-10 pt-28 md:pt-36">
          <div className="gutter">
            <Link href="/work" data-transition-label="All work" className="label muted hover:underline">
              ← All work
            </Link>
            <h1 id="project-title" className="text-title mt-6 text-balance">
              {project.title}
            </h1>
          </div>
          <dl className="label gutter mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Type", project.type],
              ["Category", category],
              ...(project.year ? [["Year", project.year]] : []),
              ["Stack", project.tags.slice(0, 4).join(" · ")],
            ].map(([k, v]) => (
              <div key={k} className="rule border-t pt-2">
                <dt className="muted">{k}</dt>
                <dd className="mt-1 normal-case">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section tone="ink">
          <ScrollScale as="div" from={0.94} className="overflow-hidden">
            {project.video && project.cover ? (
              <div className="aspect-[16/10]">
                <ProjectVideo src={project.video} poster={project.cover} label={`screen recording of ${project.title}`} />
              </div>
            ) : (
              <ProjectCover project={project} size="lg" priority />
            )}
          </ScrollScale>
        </Section>

        <Section tone="paper" className="pt-12 md:pt-16">
          <div className="gutter grid-12 gap-y-6 pb-12 md:pb-16">
            <p className="col-span-12 text-pretty text-xl leading-snug md:col-span-7 md:text-2xl">{project.summary}</p>
            <div className="col-span-12 md:col-span-4 md:col-start-9">
              {project.meta && <p className="muted text-sm">{project.meta}</p>}
              <ul aria-label="Technologies" className="label mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {project.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {project.caseStudy ? (
            <CaseStudyBody cs={project.caseStudy} />
          ) : (
            <Block n="What I built" title="Scope and highlights">
              <HighlightList items={project.highlights} />
            </Block>
          )}
        </Section>
      </article>

      <Section tone="paper">
        <nav aria-label="Next project" className="rule border-t">
          <Link href={`/work/${next.slug}`} data-transition-label={next.title} className="group gutter block py-14 transition-colors hover:bg-ink hover:text-paper md:py-20">
            <p className="label muted">Next project</p>
            <p className="text-title mt-4 text-balance">
              {next.title} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-4">→</span>
            </p>
          </Link>
        </nav>
      </Section>

      <Contact />
    </main>
  );
}
