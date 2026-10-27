import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/PageHeader";
import { WorkGrid } from "@/components/WorkGrid";
import { profile } from "@/lib/data";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: `Work — ${profile.name}`,
  description: `All ${projects.length} projects: Shopify stores and apps, websites and platforms for jewellery, bullion, real estate and events brands.`,
};

export default function WorkPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] p-2 sm:p-4 lg:p-6">
      <main id="main" className="flex flex-col gap-2 sm:gap-3">
        <PageHeader
          eyebrow={`${projects.length} projects`}
          title={[{ text: "Everything" }, { text: "I've shipped.", soft: true }]}
          intro="Shopify stores and apps, corporate websites and full-stack platforms for jewellers, refineries, real estate and events brands across the UAE and GCC."
        />
        <section aria-label="All projects" className="px-4 pb-20 pt-6 sm:px-8 sm:pb-28">
          {/* Projects with live-site recordings first; order is otherwise kept. */}
          <WorkGrid items={[...projects].sort((a, b) => Number(!!b.video) - Number(!!a.video))} />
        </section>
        <Contact />
      </main>
    </div>
  );
}
