import { education, experience, skills } from "@/lib/data";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

/** Experience as ruled rows, then education and toolkit as mono lists. */
export function Experience() {
  return (
    <Section tone="paper" labelledBy="experience-title" className="pb-20 md:pb-28">
      <div className="rule gutter border-t pt-16 md:pt-20">
        <h2 id="experience-title" className="text-title">
          Experience
        </h2>
      </div>

      <ol className="rule mt-10 border-b md:mt-14">
        {experience.map((job) => (
          <Reveal as="li" key={job.company} className="rule gutter grid-12 gap-y-3 border-t py-8 md:py-10">
            <p className="label muted col-span-12 md:col-span-3">{job.period}</p>
            <div className="col-span-12 md:col-span-4">
              <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">{job.company}</h3>
              <p className="muted mt-1 text-sm">
                {job.role} · {job.place}
              </p>
            </div>
            <ul className="col-span-12 space-y-2 md:col-span-5">
              {job.points.map((pt) => (
                <li key={pt} className="max-w-[60ch] text-pretty leading-relaxed">
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>

      <div className="gutter grid-12 mt-16 gap-y-12 md:mt-24">
        <Reveal className="col-span-12 md:col-span-4">
          <h3 className="label muted">Education</h3>
          <ul className="mt-4 space-y-4">
            {education.map((e) => (
              <li key={e.title} className="rule border-t pt-3">
                <p className="font-medium">{e.title}</p>
                <p className="muted text-sm">
                  {e.org}
                  {e.period && ` · ${e.period}`}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="col-span-12 md:col-span-7 md:col-start-6">
          <h3 className="label muted">Toolkit</h3>
          <dl className="mt-4 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {skills.map((s) => (
              <div key={s.group} className="rule border-t pt-3">
                <dt className="font-medium">{s.group}</dt>
                <dd className="label mt-2 leading-relaxed">{s.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
