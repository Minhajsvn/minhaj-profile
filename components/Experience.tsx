import { education, experience, skills } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section aria-labelledby="experience-title" className="px-4 pb-20 sm:px-8 sm:pb-28">
      <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title" className="mt-4 text-3xl font-medium leading-tight sm:text-4xl">
            Where I&rsquo;ve been <span className="italic text-muted">building.</span>
          </h2>

          <h3 className="mt-12 font-sans text-sm font-semibold tracking-normal">Education</h3>
          <ul className="mt-4 space-y-4">
            {education.map((e) => (
              <li key={e.title} className="text-sm">
                <p className="font-medium">{e.title}</p>
                <p className="text-muted">
                  {e.org}
                  {e.period && ` · ${e.period}`}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <ol className="relative border-l border-border">
          {experience.map((job, i) => (
            <Reveal as="li" key={job.company} delay={i * 0.08} className="relative pb-12 pl-8 last:pb-0">
              <span aria-hidden className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{job.period}</p>
              <h3 className="mt-2 text-xl font-medium sm:text-2xl">{job.company}</h3>
              <p className="mt-1 text-sm text-muted">
                {job.role} · {job.place}
              </p>
              <ul className="mt-4 space-y-2.5">
                {job.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm leading-relaxed">
                    <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-sage" />
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal className="mx-auto mt-20 max-w-5xl">
        <h3 className="font-sans text-sm font-semibold tracking-normal">Toolkit</h3>
        <dl className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {skills.map((s) => (
            <div key={s.group} className="border-t border-border pt-5">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">{s.group}</dt>
              <dd className="mt-3 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span key={it} className="chip">
                    {it}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
