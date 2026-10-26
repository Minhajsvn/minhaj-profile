import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Download } from "@/components/Icons";
import { Experience } from "@/components/Experience";
import { PageHeader } from "@/components/PageHeader";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: `About — ${profile.name}`,
  description: `Experience, education and toolkit of ${profile.name}, ${profile.role} in ${profile.location}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] p-2 sm:p-4 lg:p-6">
      <main id="main" className="flex flex-col gap-2 sm:gap-3">
        <PageHeader
          eyebrow={`${profile.role} · ${profile.location}`}
          title={[{ text: "The full" }, { text: "picture.", soft: true }]}
          intro="Where I've worked, what I studied and the tools I reach for. The short version is on my CV."
        />
        <div className="flex justify-center px-4 pt-10">
          <a href={profile.cv} download className="btn-primary px-6">
            <Download /> Download CV (PDF)
          </a>
        </div>
        <div className="pt-12 sm:pt-16">
          <Experience />
        </div>
        <Contact />
      </main>
    </div>
  );
}
