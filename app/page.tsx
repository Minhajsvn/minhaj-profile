import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";
import { profile, socials } from "@/lib/data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  sameAs: socials.map((s) => s.href),
};

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1280px] p-2 sm:p-4 lg:p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main" className="flex flex-col gap-2 sm:gap-3">
        <Hero />
        <Clients />
        <Services />
        <Work />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
