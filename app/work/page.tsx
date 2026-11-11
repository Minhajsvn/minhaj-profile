import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { WorkGrid } from "@/components/WorkGrid";
import { profile } from "@/lib/data";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: `Work — ${profile.name}`,
  description: `All ${projects.length} projects: Shopify stores and apps, websites and platforms for jewellery, bullion, real estate and events brands.`,
};

export default function WorkPage() {
  return (
    <main id="main" className="flex flex-col">
      <PageHeader
        eyebrow={`${projects.length} projects`}
        title="Work"
        intro="Shopify stores and apps, corporate websites and full-stack platforms for jewellers, refineries, real estate and events brands across the UAE and GCC."
      />
      <Section tone="paper" className="pb-20 md:pb-28">
        <h2 className="sr-only">All projects</h2>
        {/* Projects with live-site recordings first; order is otherwise kept. */}
        <WorkGrid items={[...projects].sort((a, b) => Number(!!b.video) - Number(!!a.video))} />
      </Section>
      <Contact />
    </main>
  );
}
