import type { Metadata } from "next";
import Image from "next/image";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: `About — ${profile.name}`,
  description: `Experience, education and toolkit of ${profile.name}, ${profile.role} in ${profile.location}.`,
};

export default function AboutPage() {
  return (
    <main id="main" className="flex flex-col">
      <PageHeader
        eyebrow={`${profile.role} · ${profile.location}`}
        title="The full picture."
        intro="Where I've worked, what I studied and the tools I reach for. The short version is on my CV."
      />
      <Section tone="paper" className="pb-16 md:pb-20">
        <div className="gutter grid-12 gap-y-8">
          <div className="group relative col-span-8 aspect-[4/5] overflow-hidden md:col-span-4">
            <Image
              src={profile.avatar}
              alt={profile.avatarAlt}
              fill
              sizes="(min-width: 768px) 33vw, 66vw"
              className="object-cover object-[50%_35%] grayscale transition-[filter] duration-500 group-hover:grayscale-0"
            />
          </div>
          <div className="col-span-12 self-end md:col-span-6 md:col-start-7">
            <p className="max-w-[60ch] text-pretty text-xl leading-snug md:text-2xl">{profile.summary}</p>
            <a
              href={profile.cv}
              download
              className="label mt-8 inline-flex min-h-11 items-center gap-3 bg-ink px-5 py-4 text-paper transition-colors hover:bg-lime hover:text-ink"
            >
              Download CV (PDF) ↓
            </a>
          </div>
        </div>
      </Section>
      <Experience />
      <Contact />
    </main>
  );
}
